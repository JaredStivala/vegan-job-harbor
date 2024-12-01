import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LocationData {
  location: string;
}

function standardizeLocation(location: string): string {
  if (!location) return '';
  
  // Remove any array notation and quotes
  location = location.replace(/[\[\]"]/g, '').trim();
  
  // Split the location into parts
  const parts = location.split(',').map(part => part.trim());
  
  // Common variations of country names to standardize
  const countryVariations: { [key: string]: string } = {
    'USA': 'USA',
    'United States': 'USA',
    'United States of America': 'USA',
    'UK': 'UK',
    'United Kingdom': 'UK',
    'Great Britain': 'UK',
  };

  // Find the city (first part) and country (last valid part)
  let city = parts[0];
  let country = '';

  // Look for a country in the parts
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];
    for (const [variation, standardName] of Object.entries(countryVariations)) {
      if (part.includes(variation)) {
        country = standardName;
        break;
      }
    }
    if (country) break;
  }

  // If no country was found but we have state abbreviations like "MA", assume USA
  if (!country && parts.some(part => 
    /^[A-Z]{2}$/.test(part.trim()) || 
    part.includes('Remote') ||
    part.includes('Hybrid'))) {
    country = 'USA';
  }

  // Handle remote/hybrid locations
  if (location.toLowerCase().includes('remote')) {
    return 'Remote';
  }
  if (location.toLowerCase().includes('hybrid')) {
    return `Hybrid - ${city}${country ? `, ${country}` : ''}`;
  }

  // Return standardized format
  return country ? `${city}, ${country}` : city;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Process each jobs table
    const tables = ['veganjobs', 'ea', 'animaladvocacy', 'vevolution'];
    
    for (const table of tables) {
      const { data: jobs, error: fetchError } = await supabaseClient
        .from(table)
        .select('id, location');

      if (fetchError) {
        console.error(`Error fetching from ${table}:`, fetchError);
        continue;
      }

      // Update each job with standardized location
      for (const job of jobs) {
        if (!job.location) continue;

        const standardizedLocation = standardizeLocation(job.location);
        
        const { error: updateError } = await supabaseClient
          .from(table)
          .update({ location: standardizedLocation })
          .eq('id', job.id);

        if (updateError) {
          console.error(`Error updating ${table} job ${job.id}:`, updateError);
        }
      }
    }

    return new Response(
      JSON.stringify({ message: 'Locations standardized successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
})