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
  location: string | null
  type: string | null
  salary: string | null
  description: string | null
  tags: string[]
  url: string
  logo_url: string | null
  posted_at: string
}

async function scrapeJobs(): Promise<Job[]> {
  console.log('Starting job scraping...')
  const response = await fetch('https://veganjobs.com/jobs/')
  const html = await response.text()
  const $ = cheerio.load(html)
  const jobs: Job[] = []

  $('.job-listing').each((_, element) => {
    const $el = $(element)
    
    // Get job URL and ID
    const jobUrl = $el.find('h2.job-title a').attr('href')
    if (!jobUrl) return // Skip if no URL found
    const external_id = jobUrl.split('/').pop() || ''
    
    // Extract job details
    const title = $el.find('h2.job-title').text().trim()
    const company = $el.find('.company-name').text().trim()
    const location = $el.find('.job-location').text().trim() || null
    const type = $el.find('.job-type').text().trim() || null
    const salary = $el.find('.job-salary').text().trim() || null
    const description = $el.find('.job-description').text().trim() || null
    
    // Extract logo URL if present
    const logo_url = $el.find('.company-logo img').attr('src') || null
    
    // Extract tags
    const tags = $el.find('.job-tags .tag')
      .map((_, tag) => $(tag).text().trim())
      .get()
      .filter(tag => tag.length > 0)
    
    // Parse posted date
    const postedText = $el.find('.job-date').text().trim()
    const posted_at = new Date().toISOString() // Default to now
    
    // Create job object
    const job: Job = {
      external_id,
      title,
      company,
      location,
      type,
      salary,
      description,
      tags,
      url: `https://veganjobs.com${jobUrl}`,
      logo_url,
      posted_at
    }
    
    if (title && company) { // Only add if we have at least title and company
      jobs.push(job)
    }
  })

  console.log(`Found ${jobs.length} jobs`)
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

    if (jobs.length === 0) {
      throw new Error('No jobs found during scraping')
    }

    // Upsert jobs to database
    const { error } = await supabaseClient
      .from('jobs')
      .upsert(
        jobs.map(job => ({
          ...job,
          updated_at: new Date().toISOString()
        })),
        { 
          onConflict: 'external_id',
          ignoreDuplicates: false 
        }
      )

    if (error) {
      console.error('Error upserting jobs:', error)
      throw error
    }

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