import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Job } from '@/types/job';

mapboxgl.accessToken = 'pk.eyJ1IjoiamFyZWRzZGZmZGEiLCJhIjoiY20zczA0MmsxMDNzMDJqcHB0Y2xrOWw2dCJ9.bq_52A0_h0S9aDBzk1VvVg';

interface JobMapProps {
  jobs: Job[];
  onJobSelect?: (job: Job) => void;
}

export const JobMap = ({ jobs, onJobSelect }: JobMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [lng] = useState(-40);
  const [lat] = useState(35);
  const [zoom] = useState(1.5);

  // Clean up markers when component unmounts or jobs change
  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false,
    });

    const nav = new mapboxgl.NavigationControl({
      showCompass: false,
      visualizePitch: false
    });
    map.current.addControl(nav, 'top-right');

    return () => {
      clearMarkers();
      map.current?.remove();
    };
  }, [lng, lat, zoom]);

  useEffect(() => {
    if (!map.current) return;

    const addMarkers = async () => {
      clearMarkers();

      for (const job of jobs) {
        if (!job.location) continue;

        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(job.location)}.json?access_token=${mapboxgl.accessToken}`
          );
          const data = await response.json();

          if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center;

            const popup = new mapboxgl.Popup({
              offset: 25,
              closeButton: false,
              closeOnClick: false,
              className: 'custom-popup'
            }).setHTML(`
              <div class="p-3 min-w-[200px] bg-white rounded-lg shadow-lg">
                <h3 class="font-bold text-sage-dark mb-1">${job.page_title || 'Untitled Position'}</h3>
                <p class="text-sm text-gray-600 mb-1">${job.company_name || 'Company'}</p>
                ${job.salary ? `<p class="text-sm text-sage">${job.salary}</p>` : ''}
                <p class="text-xs text-gray-500 mt-1">${job.location}</p>
              </div>
            `);

            const marker = new mapboxgl.Marker({
              color: '#86A789',
              scale: 0.8
            })
              .setLngLat([lng, lat])
              .setPopup(popup)
              .addTo(map.current!);

            marker.getElement().addEventListener('click', () => {
              if (onJobSelect) {
                onJobSelect(job);
                const jobCard = document.getElementById(`job-${job.id}`);
                if (jobCard) {
                  jobCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                  });
                }
              }
            });

            // Store marker reference for cleanup
            markersRef.current.push(marker);
          }
        } catch (error) {
          console.error('Error processing job location:', error);
        }
      }
    };

    // Wait for map to load before adding markers
    if (map.current.loaded()) {
      addMarkers();
    } else {
      map.current.on('load', addMarkers);
    }

    return () => {
      clearMarkers();
    };
  }, [jobs, onJobSelect]);

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-sage/10 shadow-sm">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};