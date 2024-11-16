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
  
  // Try multiple URLs in case one fails
  const urls = [
    'https://veganjobs.com/jobs/',
    'https://veganjobs.com'
  ]
  
  let html = ''
  let response = null
  
  // Try each URL until one works
  for (const url of urls) {
    try {
      console.log(`Attempting to fetch from ${url}`)
      response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      if (response.ok) {
        html = await response.text()
        console.log(`Successfully fetched HTML from ${url}`)
        break
      }
      
      console.log(`Failed to fetch from ${url}: ${response.status} ${response.statusText}`)
    } catch (error) {
      console.error(`Error fetching ${url}:`, error)
    }
  }
  
  if (!html) {
    throw new Error(`Failed to fetch jobs from any URL. Last status: ${response?.status}`)
  }
  
  const $ = cheerio.load(html)
  const jobs: Job[] = []
  
  // Try different selectors for job listings
  const jobSelectors = [
    'article.job_listing',
    '.job_listing',
    '.job-listing',
    '.job-post'
  ]
  
  let foundJobs = false
  
  for (const selector of jobSelectors) {
    console.log(`Trying selector: ${selector}`)
    const elements = $(selector)
    
    if (elements.length > 0) {
      console.log(`Found ${elements.length} jobs with selector ${selector}`)
      foundJobs = true
      
      elements.each((_, element) => {
        try {
          const $el = $(element)
          
          // Try different selectors for job URL
          const jobUrl = $el.find('h3 a, .job-title a, .title a').first().attr('href')
          if (!jobUrl) {
            console.log('Skipping job - no URL found')
            return
          }
          
          const external_id = jobUrl.split('/').filter(Boolean).pop() || ''
          
          // Try different selectors for job details
          const title = $el.find('h3 a, .job-title a, .title a').first().text().trim()
          const companyEl = $el.find('.company-title, .company strong, .company-name')
          const company = companyEl.text().trim()
          
          const location = $el.find('.location, .job-location').text().trim() || null
          const type = $el.find('.job-type, .full-time, .part-time').first().text().trim() || null
          
          // Get logo
          const logo_url = $el.find('.company_logo, .company-logo img').first().attr('src') || null
          
          // Extract tags
          const tags = []
          const typeClasses = ['full-time', 'part-time', 'freelance', 'temporary', 'volunteer', 'internship']
          typeClasses.forEach(className => {
            if ($el.find(`.${className}`).length) {
              tags.push(className.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))
            }
          })
          
          if (title && company) {
            const job: Job = {
              external_id,
              title,
              company,
              location,
              type,
              salary: null,
              description: null,
              tags,
              url: jobUrl.startsWith('http') ? jobUrl : `https://veganjobs.com${jobUrl}`,
              logo_url,
              posted_at: new Date().toISOString()
            }
            jobs.push(job)
            console.log(`Scraped job: ${title} at ${company}`)
          }
        } catch (error) {
          console.error('Error processing job listing:', error)
        }
      })
      
      break // Exit loop if we found jobs with this selector
    }
  }
  
  if (!foundJobs) {
    console.log('HTML content preview:', html.substring(0, 500))
    throw new Error('No job listings found with any selector')
  }
  
  console.log(`Found ${jobs.length} jobs`)
  return jobs
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting job scraping...')
    const jobs = await scrapeJobs()
    console.log(`Successfully scraped ${jobs.length} jobs`)

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