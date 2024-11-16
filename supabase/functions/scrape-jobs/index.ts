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
  const response = await fetch('https://veganjobs.com', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch jobs: ${response.status} ${response.statusText}`)
  }
  
  const html = await response.text()
  const $ = cheerio.load(html)
  const jobs: Job[] = []

  // Select all job listings
  $('article.job_listing').each((_, element) => {
    try {
      const $el = $(element)
      
      // Get job URL and ID
      const jobUrl = $el.find('h3 a').attr('href')
      if (!jobUrl) {
        console.log('Skipping job - no URL found')
        return
      }
      
      const external_id = jobUrl.split('/').filter(Boolean).pop() || ''
      
      // Extract job details
      const title = $el.find('h3 a').text().trim()
      const companyName = $el.find('.company-title').text().trim()
      const companyTagline = $el.find('.company-tagline').text().trim()
      const company = companyName || companyTagline
      
      const location = $el.find('.location').text().trim() || null
      const type = $el.find('.full-time, .part-time, .freelance, .temporary').first().text().trim() || null
      
      // Get posted date
      const postedText = $el.find('time').text().trim()
      const posted_at = new Date().toISOString() // Default to now since we can't reliably parse the date
      
      // Get logo
      const logo_url = $el.find('.company_logo').attr('src') || null
      
      // Extract tags from job type checkboxes
      const tags = []
      if ($el.find('.full-time').length) tags.push('Full Time')
      if ($el.find('.part-time').length) tags.push('Part Time')
      if ($el.find('.freelance').length) tags.push('Freelance')
      if ($el.find('.temporary').length) tags.push('Temporary')
      if ($el.find('.volunteer').length) tags.push('Volunteer')
      if ($el.find('.internship').length) tags.push('Internship')
      
      // Create job object if we have the minimum required fields
      if (title && company) {
        const job: Job = {
          external_id,
          title,
          company,
          location,
          type,
          salary: null, // Salary not displayed on the site
          description: null, // Full description would require visiting each job page
          tags,
          url: jobUrl,
          logo_url,
          posted_at
        }
        jobs.push(job)
        console.log(`Scraped job: ${title} at ${company}`)
      }
    } catch (error) {
      console.error('Error processing job listing:', error)
    }
  })

  console.log(`Found ${jobs.length} jobs`)
  if (jobs.length === 0) {
    throw new Error('No jobs found - check if selectors are still valid')
  }
  
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
    console.log(`Successfully scraped ${jobs.length} jobs`)

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