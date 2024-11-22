import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Job } from '@/types/job';

// Replace with your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiamFyZWRwYWxtZXIiLCJhIjoiY2xzcnhvYzFqMGJ1ZjJqbW84YXB2OGx4ZCJ9.i5zrFJZ1EYQwzKgZVh3rKg';

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
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

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

                // Create a popup
                const popup = new mapboxgl.Popup({ offset: 25 })
                  .setHTML(`
                    <div class="p-2">
                      <h3 class="font-bold">${job.page_title || 'Untitled Position'}</h3>
                      <p class="text-sm text-gray-600">${job.company_name || 'Company'}</p>
                      ${job.salary ? `<p class="text-sm text-gray-600">${job.salary}</p>` : ''}
                    </div>
                  `);

                // Create a marker
                const marker = new mapboxgl.Marker({
                  color: '#86A789'
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
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-sage/10">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};