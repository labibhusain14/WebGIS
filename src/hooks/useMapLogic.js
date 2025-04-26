import { useEffect, useRef, useState } from 'react';
import MapService from '../service/MapService';

export default function useMapLogic(MAP_SERVICE_KEY, initialDataCallback) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const markerList = useRef([]);
  const mapInitialized = useRef(false);
  const mapLoaded = useRef(false);

  // State variables
  const [fullAddress, setFullAddress] = useState('');

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapInitialized.current) return;

    const initializeMap = async () => {
      console.log('Initializing map in background...');
      mapInitialized.current = true;

      // Use Bandung coordinates (default center)
      const latitude = -6.883316515;
      const longitude = 107.616888;

      // Initialize map using the service
      map.current = MapService.initializeMap(mapContainer.current, MAP_SERVICE_KEY, { latitude, longitude });

      // Map click handler
      map.current.on('click', async (e) => {
        const coordinates = e.lngLat;
        const latitude = coordinates.lat;
        const longitude = coordinates.lng;

        // Add or update marker
        if (markerRef.current) {
          markerRef.current.setLngLat(coordinates);
        } else {
          markerRef.current = MapService.addMarker(map.current, [longitude, latitude], { color: 'red' });
        }

        // Fetch address
        try {
          const address = await fetchAddressFromCoordinates(latitude, longitude);
          return { latitude, longitude, address };
        } catch (err) {
          console.error('Failed to fetch address:', err);
          return { latitude, longitude };
        }
      });

      // Map load handler
      map.current.on('load', () => {
        console.log('Map loaded, adding initial marker');
        markerRef.current = MapService.addMarker(map.current, [longitude, latitude], { color: 'red' });
        mapLoaded.current = true;

        // Get initial address
        fetchAddressFromCoordinates(latitude, longitude);

        // Trigger initial data fetch callback when map is ready
        initialDataCallback();
      });
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [MAP_SERVICE_KEY]);

  // Fetch address function
  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const address = await MapService.fetchAddressFromCoordinates(latitude, longitude);
      setFullAddress(address);
      return address;
    } catch (err) {
      console.error('Failed to fetch address:', err);
      return '';
    }
  };

  // Update marker position
  const updateMarkerPosition = (latitude, longitude) => {
    if (map.current && markerRef.current && latitude && longitude) {
      markerRef.current.setLngLat([longitude, latitude]);

      // Adjust zoom and fly to location
      const zoomLevel = map.current.getZoom() < 10 ? 15 : undefined;
      MapService.flyTo(map.current, [longitude, latitude], { zoom: zoomLevel });

      // Update address
      fetchAddressFromCoordinates(latitude, longitude);
    }
  };

  // Clear map markers
  const clearMarkers = () => {
    markerList.current.forEach((marker) => marker.remove());
    markerList.current = [];
  };

  // Add kost markers to map
  const addMarkersToMap = (kostData, navigate) => {
    if (!map.current) return;

    console.log('Adding markers to map:', kostData.length);
    clearMarkers();

    kostData.forEach((kost) => {
      if (kost.longitude && kost.latitude) {
        const popup = MapService.createPopup();

        popup.setHTML(`
          <div class="p-4 bg-white rounded-xl shadow-lg min-w-[240px] font-sans">
            <h3 class="text-base font-semibold text-gray-900 mb-2">${kost.nama_kost}</h3>
            <p class="text-sm text-gray-600 mb-3 leading-relaxed">${kost.alamat}</p>
            <div class="flex items-center justify-between">
              <div class="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">
                Rp${Number(kost.harga_sewa).toLocaleString()}
              </div>
              <button 
                class="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                id="detail-btn-${kost.id_kost}"
              >
                Lihat Detail
              </button>
            </div>
          </div>
        `);

        const marker = MapService.addMarker(map.current, [kost.longitude, kost.latitude], { color: '#2563eb', scale: 0.9 });

        marker.setPopup(popup);

        // Get the marker element
        const markerElement = marker.getElement();
        let hoverTimeout;
        let isPopupOpen = false;
        let isHovering = false;

        // Add hover intent behavior
        markerElement.addEventListener('mouseenter', () => {
          isHovering = true;
          clearTimeout(hoverTimeout);

          // Show popup with delay
          hoverTimeout = setTimeout(() => {
            if (isHovering && !isPopupOpen) {
              marker.togglePopup();
              isPopupOpen = true;
            }
          }, 300);
        });

        markerElement.addEventListener('mouseleave', () => {
          isHovering = false;
          clearTimeout(hoverTimeout);

          // Give time to move mouse to popup
          hoverTimeout = setTimeout(() => {
            if (!isHovering && isPopupOpen) {
              marker.togglePopup();
              isPopupOpen = false;
            }
          }, 400);
        });

        markerElement.addEventListener('click', () => {
          // Toggle popup on click
          if (isPopupOpen) {
            marker.togglePopup();
            isPopupOpen = false;
          } else {
            marker.togglePopup();
            isPopupOpen = true;
          }
        });

        // Popup event handlers
        popup.on('open', () => {
          isPopupOpen = true;
          const popupElement = popup.getElement();

          if (popupElement) {
            popupElement.addEventListener('mouseenter', () => {
              isHovering = true;
              clearTimeout(hoverTimeout);
            });

            popupElement.addEventListener('mouseleave', () => {
              isHovering = false;
              clearTimeout(hoverTimeout);

              hoverTimeout = setTimeout(() => {
                if (!isHovering && isPopupOpen) {
                  marker.togglePopup();
                  isPopupOpen = false;
                }
              }, 400);
            });

            // Set up detail button click handler
            const detailButton = document.getElementById(`detail-btn-${kost.id_kost}`);
            if (detailButton) {
              detailButton.addEventListener('click', (e) => {
                e.stopPropagation();
                navigate(`/detail/${kost.id_kost}`);
              });
            }
          }
        });

        popup.on('close', () => {
          isPopupOpen = false;
        });

        markerList.current.push(marker);
      }
    });
  };

  return {
    mapContainer,
    map,
    mapLoaded: mapLoaded.current,
    fullAddress,
    updateMarkerPosition,
    addMarkersToMap,
    fetchAddressFromCoordinates,
  };
}
