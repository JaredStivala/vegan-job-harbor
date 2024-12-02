import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')
  const body = await req.text()
  
  try {
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
      undefined,
      cryptoProvider
    )

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Update payment record
        const { data: payment, error: paymentError } = await supabase
          .from('jobPayments')
          .update({
            status: 'completed',
            stripe_payment_id: session.payment_intent as string,
          })
          .eq('stripe_session_id', session.id)
          .select()
          .single()

        if (paymentError) throw paymentError

        // Activate the job posting
        const { error: jobError } = await supabase
          .from('userSubmissions')
          .update({ 
            Verified: true,
            verification_end_date: payment.payment_type === 'verified_post' 
              ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
              : null
          })
          .eq('id', payment.job_id)

        if (jobError) throw jobError
        break
      }
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (err) {
    return new Response(err.message, { status: 400 })
  }
})