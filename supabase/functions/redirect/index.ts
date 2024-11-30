import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const jobId = url.searchParams.get('id')
    const source = url.searchParams.get('source')

    if (!jobId || !source) {
      console.error('Missing required parameters:', { jobId, source })
      return new Response(
        JSON.stringify({ error: 'Missing job ID or source' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      )
    }

    console.log('Fetching job from source:', source, 'with ID:', jobId)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the job URL from the appropriate table
    const { data: job, error: jobError } = await supabase
      .from(source)
      .select('url')
      .eq('id', jobId)
      .single()

    if (jobError || !job?.url) {
      console.error('Error fetching job:', jobError)
      return new Response(
        JSON.stringify({ error: 'Job not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 404 
        }
      )
    }

    console.log('Found job URL:', job.url)

    // Log the click
    const { error: clickError } = await supabase
      .from('job_clicks')
      .insert({
        job_id: jobId,
        job_source: source,
        original_url: job.url,
        user_agent: req.headers.get('user-agent'),
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip')
      })

    if (clickError) {
      console.error('Error logging click:', clickError)
    }

    // Perform the redirect using Response.redirect()
    return Response.redirect(job.url, 302)
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})