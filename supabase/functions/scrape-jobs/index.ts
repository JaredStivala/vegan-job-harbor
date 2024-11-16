import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Job {
  external_id: string
  title: string
  company: string
  location: string
  type: string
  salary: string
  description: string
  tags: string[]
  url: string
  logo_url: string | null
  posted_at: Date
}

async function scrapeJobs(): Promise<Job[]> {
  const response = await fetch('https://veganjobs.com/jobs')
  const html = await response.text()
  const $ = cheerio.load(html)
  const jobs: Job[] = []

  $('.job-listing').each((_, element) => {
    const $el = $(element)
    const url = $el.find('a').attr('href') || ''
    const external_id = url.split('/').pop() || ''
    
    const posted = $el.find('.job-date').text().trim()
    const postedDate = new Date()
    // Adjust date based on text like "2 days ago", "1 week ago", etc.
    if (posted.includes('day')) {
      const days = parseInt(posted)
      postedDate.setDate(postedDate.getDate() - days)
    } else if (posted.includes('week')) {
      const weeks = parseInt(posted)
      postedDate.setDate(postedDate.getDate() - (weeks * 7))
    }

    const job: Job = {
      external_id,
      title: $el.find('.job-title').text().trim(),
      company: $el.find('.company-name').text().trim(),
      location: $el.find('.job-location').text().trim(),
      type: $el.find('.job-type').text().trim(),
      salary: $el.find('.job-salary').text().trim(),
      description: $el.find('.job-description').text().trim(),
      tags: $el.find('.job-tags .tag').map((_, tag) => $(tag).text().trim()).get(),
      url: `https://veganjobs.com${url}`,
      logo_url: $el.find('.company-logo img').attr('src') || null,
      posted_at: postedDate
    }
    
    jobs.push(job)
  })

  return jobs
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting job scraping...')
    const jobs = await scrapeJobs()
    console.log(`Found ${jobs.length} jobs`)

    // Upsert jobs to database
    const { error } = await supabaseClient
      .from('jobs')
      .upsert(
        jobs.map(job => ({
          ...job,
          updated_at: new Date()
        })),
        { 
          onConflict: 'external_id',
          ignoreDuplicates: false 
        }
      )

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, jobsProcessed: jobs.length }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})