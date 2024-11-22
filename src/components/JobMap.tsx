import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Job } from '@/types/job';

// Replace with your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiamFyZWRzZGZmZGEiLCJhIjoiY20zczA0MmsxMDNzMDJqcHB0Y2xrOWw2dCJ9.bq_52A0_h0S9aDBzk1VvVg';

interface JobMapProps {
  jobs: Job[];
  onJobSelect?: (job: Job) => void;
}

export const JobMap = ({ jobs, onJobSelect }: JobMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng] = useState(-40);
  const [lat] = useState(35);
  const [zoom] = useState(1.5);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false, // Hide attribution for cleaner look
    });

    // Add minimal navigation controls
    const nav = new mapboxgl.NavigationControl({
      showCompass: false, // Hide compass for cleaner look
      visualizePitch: false
    });
    map.current.addControl(nav, 'top-right');

    return () => {
      map.current?.remove();
    };
  }, [lng, lat, zoom]);

  useEffect(() => {
    if (!map.current) return;

    // Wait for map to load
    map.current.on('load', () => {
      if (!map.current) return;

      // Add markers for jobs with locations
      jobs.forEach(job => {
        if (!job.location) return;

        try {
          // Use a geocoding service to convert location to coordinates
          fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(job.location)}.json?access_token=${mapboxgl.accessToken}`)
            .then(response => response.json())
            .then(data => {
              if (data.features && data.features.length > 0) {
                const [lng, lat] = data.features[0].center;

                // Create a popup with improved styling
                const popup = new mapboxgl.Popup({ 
                  offset: 25,
                  closeButton: false, // Remove close button for cleaner look
                  className: 'custom-popup' // Add custom class for styling
                })
                  .setHTML(`
                    <div class="p-3 min-w-[200px]">
                      <h3 class="font-bold text-sage-dark mb-1">${job.page_title || 'Untitled Position'}</h3>
                      <p class="text-sm text-gray-600 mb-1">${job.company_name || 'Company'}</p>
                      ${job.salary ? `<p class="text-sm text-sage">${job.salary}</p>` : ''}
                    </div>
                  `);

                // Create a marker with custom styling
                const marker = new mapboxgl.Marker({
                  color: '#86A789',
                  scale: 0.8 // Slightly smaller markers
                })
                  .setLngLat([lng, lat])
                  .setPopup(popup)
                  .addTo(map.current!);

                // Add click handler
                marker.getElement().addEventListener('click', () => {
                  onJobSelect?.(job);
                });
              }
            })
            .catch(error => {
              console.error('Error geocoding location:', error);
            });
        } catch (error) {
          console.error('Error processing job location:', error);
        }
      });
    });
  }, [jobs, onJobSelect]);

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-sage/10 shadow-sm">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};