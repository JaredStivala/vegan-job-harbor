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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Update payment record
        const { data: payment, error: paymentError } = await supabase
          .from('jobPayments')
          .update({
            status: 'completed',
            stripe_payment_id: session.payment_intent as string,
          })
          .eq('stripe_session_id', session.id)
          .select()
          .single();

        if (paymentError) throw paymentError;

        // Get the pending job data from metadata
        const pendingJobData = session.metadata?.jobData ? 
          JSON.parse(session.metadata.jobData) : null;

        if (!pendingJobData) {
          throw new Error('No job data found in session metadata');
        }

        // Calculate verification end date if applicable
        let verification_end_date = null;
        if (pendingJobData.isVerified && pendingJobData.verificationPeriod) {
          const now = new Date();
          switch(pendingJobData.verificationPeriod) {
            case '24h':
              verification_end_date = new Date(now.getTime() + 24 * 60 * 60 * 1000);
              break;
            case '1w':
              verification_end_date = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
              break;
            case '1m':
              verification_end_date = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
              break;
          }
        }

        // Create the job submission
        const { data: jobSubmission, error: jobError } = await supabase
          .from('userSubmissions')
          .insert({
            page_title: pendingJobData.page_title,
            company_name: pendingJobData.company_name,
            location: pendingJobData.location,
            salary: pendingJobData.salary,
            description: pendingJobData.description,
            url: pendingJobData.url,
            logo: pendingJobData.logo,
            tags: pendingJobData.tags,
            date_posted: new Date().toISOString(),
            Verified: pendingJobData.isVerified,
            verification_end_date: verification_end_date?.toISOString(),
          })
          .select()
          .single();

        if (jobError) throw jobError;

        // Update payment record with job_id
        const { error: updateError } = await supabase
          .from('jobPayments')
          .update({ job_id: jobSubmission.id })
          .eq('id', payment.id);

        if (updateError) throw updateError;

        break;
      }
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response(err.message, { status: 400 })
  }
})