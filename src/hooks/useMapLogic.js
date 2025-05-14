import { useEffect, useRef, useState } from "react";
import MapService from "../service/MapService";

export default function useMapLogic(MAP_SERVICE_KEY, initialDataCallback) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const markerList = useRef([]);
  const mapInitialized = useRef(false);
  const mapLoaded = useRef(false);

  // State variables
  const [fullAddress, setFullAddress] = useState("");
  const [markersVisible, setMarkersVisible] = useState(true);
  const [publicPlacesVisible, setPublicPlacesVisible] = useState(false);

  // Define marker groups - removed putra, putri, campur types
  const [markerGroups, setMarkerGroups] = useState({
    // Public places only
    Masjid: { visible: false, color: "#4CAF50", label: "Masjid" },
    Rumah_Sakit: { visible: false, color: "#F44336", label: "Rumah Sakit" },
    Toserba: { visible: false, color: "#FF9800", label: "Toserba" },
    Tempat_Makan: { visible: false, color: "#9C27B0", label: "Tempat Makan" },
    Terminal: { visible: false, color: "#03A9F4", label: "Terminal" },
    Stasiun: { visible: false, color: "#795548", label: "Stasiun" },
    Kampus: { visible: false, color: "#607D8B", label: "Kampus" },
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapInitialized.current) return;

    const initializeMap = async () => {
      console.log("Initializing map in background...");
      mapInitialized.current = true;

      // Use Bandung coordinates (default center)
      const latitude = -6.883316515;
      const longitude = 107.616888;

      // Initialize map using the service
      map.current = MapService.initializeMap(
        mapContainer.current,
        MAP_SERVICE_KEY,
        { latitude, longitude }
      );

      // Map click handler
      map.current.on("click", async (e) => {
        const coordinates = e.lngLat;
        const latitude = coordinates.lat;
        const longitude = coordinates.lng;

        // Add or update marker
        if (markerRef.current) {
          markerRef.current.setLngLat(coordinates);
        } else {
          markerRef.current = MapService.addMarker(
            map.current,
            [longitude, latitude],
            { color: "red" }
          );
        }

        // Fetch address
        try {
          const address = await fetchAddressFromCoordinates(
            latitude,
            longitude
          );
          return { latitude, longitude, address };
        } catch (err) {
          console.error("Failed to fetch address:", err);
          return { latitude, longitude };
        }
      });

      // Map load handler
      map.current.on("load", () => {
        console.log("Map loaded, adding initial marker");
        markerRef.current = MapService.addMarker(
          map.current,
          [longitude, latitude],
          { color: "red" }
        );
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
      const address = await MapService.fetchAddressFromCoordinates(
        latitude,
        longitude
      );
      setFullAddress(address);
      return address;
    } catch (err) {
      console.error("Failed to fetch address:", err);
      return "";
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

  // Toggle all markers visibility
  const toggleMarkersVisibility = () => {
    const newVisibility = !markersVisible;
    setMarkersVisible(newVisibility);

    markerList.current.forEach((marker) => {
      if (marker.isKost) {
        const markerElement = marker.getElement();
        if (markerElement) {
          markerElement.style.display = newVisibility ? "block" : "none";
        }
      }
    });
  };

  // Toggle all public places visibility
  const togglePublicPlacesVisibility = () => {
    const newVisibility = !publicPlacesVisible;
    setPublicPlacesVisible(newVisibility);

    // Update all public places markers
    const updatedGroups = { ...markerGroups };
    Object.keys(updatedGroups).forEach((key) => {
      updatedGroups[key].visible = newVisibility;
    });
    setMarkerGroups(updatedGroups);

    // Update visibility of markers
    markerList.current.forEach((marker) => {
      if (marker.isPublicPlace) {
        const markerElement = marker.getElement();
        if (markerElement) {
          markerElement.style.display = newVisibility ? "block" : "none";
        }
      }
    });
  };

  // Toggle specific marker group visibility
  const toggleMarkerGroupVisibility = (groupType) => {
    const updatedGroups = { ...markerGroups };
    updatedGroups[groupType].visible = !updatedGroups[groupType].visible;
    setMarkerGroups(updatedGroups);

    // Update visibility of markers with this type
    markerList.current.forEach((marker) => {
      if (marker.placeType === groupType) {
        const markerElement = marker.getElement();
        if (markerElement) {
          markerElement.style.display = updatedGroups[groupType].visible
            ? "block"
            : "none";
        }
      }
    });
  };

  // Get marker color based on type
  const getMarkerColor = (type) => {
    // Default color
    if (!type) return "#2563eb";

    // For public places
    if (markerGroups[type]) {
      return markerGroups[type].color;
    }

    return "#2563eb"; // Default
  };

  // Add kost markers to map
  const addMarkersToMap = (kostData, navigate) => {
    if (!map.current) return;

    console.log("Adding kost markers to map:", kostData.length);

    // Clear only kost markers, keep public places
    markerList.current = markerList.current.filter((marker) => {
      if (marker.isKost) {
        marker.remove();
        return false;
      }
      return true;
    });

    kostData.forEach((kost) => {
      if (kost.longitude && kost.latitude) {
        const popup = MapService.createPopup();
        // Use default marker color since we're not categorizing by types anymore
        const markerColor = "#2563eb"; // Default blue color

        // All kost markers visible based on global setting
        const isVisible = markersVisible;

        popup.setHTML(`
          <div class="p-4 bg-white rounded-xl shadow-lg min-w-[240px] font-sans">
            <div class="flex items-start gap-3 mb-3">
              <img 
                src="${
                  kost.gambar_kost?.[0]?.url_gambar ||
                  "src/assets/preview-2.jpg"
                }" 
                alt="Foto Kost" 
                class="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />
              <div>
                <h3 class="text-base font-semibold text-gray-900">${
                  kost.nama_kost
                }</h3>
                <p class="text-sm text-gray-600 leading-relaxed">${
                  kost.alamat
                }</p>
              </div>
            </div>
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

        const marker = MapService.addMarker(
          map.current,
          [kost.longitude, kost.latitude],
          { color: markerColor, scale: 0.9 }
        );

        // Mark as kost marker
        marker.isKost = true;

        marker.setPopup(popup);

        // Set initial visibility
        const markerElement = marker.getElement();
        if (markerElement) {
          markerElement.style.display = isVisible ? "block" : "none";
        }

        // Get the marker element
        let hoverTimeout;
        let isPopupOpen = false;
        let isHovering = false;

        // Add hover intent behavior
        markerElement.addEventListener("mouseenter", () => {
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

        markerElement.addEventListener("mouseleave", () => {
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

        markerElement.addEventListener("click", () => {
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
        popup.on("open", () => {
          isPopupOpen = true;
          const popupElement = popup.getElement();

          if (popupElement) {
            popupElement.addEventListener("mouseenter", () => {
              isHovering = true;
              clearTimeout(hoverTimeout);
            });

            popupElement.addEventListener("mouseleave", () => {
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
            const detailButton = document.getElementById(
              `detail-btn-${kost.id_kost}`
            );
            if (detailButton) {
              detailButton.addEventListener("click", (e) => {
                e.stopPropagation();
                navigate(`/detail/${kost.id_kost}`);
              });
            }
          }
        });

        popup.on("close", () => {
          isPopupOpen = false;
        });

        markerList.current.push(marker);
      }
    });
  };

  // Add public places markers to map
  const addPublicPlacesToMap = (publicPlaces) => {
    if (!map.current) return;

    console.log("Adding public places to map:", publicPlaces.length);

    // Clear only public place markers, keep kost markers
    markerList.current = markerList.current.filter((marker) => {
      if (marker.isPublicPlace) {
        marker.remove();
        return false;
      }
      return true;
    });

    publicPlaces.forEach((place) => {
      if (place.longitude && place.latitude) {
        const popup = MapService.createPopup();
        const placeType = place.Jenis;
        const markerColor = getMarkerColor(placeType);

        // Determine marker visibility based on its group
        let isVisible = publicPlacesVisible;
        if (placeType) {
          isVisible = isVisible && markerGroups[placeType]?.visible !== false;
        }

        popup.setHTML(`
          <div class="p-4 bg-white rounded-xl shadow-lg min-w-[200px] font-sans">
            <h3 class="text-base font-semibold text-gray-900 mb-2">${
              place.Nama
            }</h3>
            <div class="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">
              ${place.Jenis.replace("_", " ")}
            </div>
          </div>
        `);

        const marker = MapService.addMarker(
          map.current,
          [place.longitude, place.latitude],
          { color: markerColor, scale: 0.8 }
        );

        // Store place type with marker for filtering
        marker.placeType = placeType;
        marker.isPublicPlace = true;

        marker.setPopup(popup);

        // Set initial visibility
        const markerElement = marker.getElement();
        if (markerElement) {
          markerElement.style.display = isVisible ? "block" : "none";
        }

        // Get the marker element
        let hoverTimeout;
        let isPopupOpen = false;
        let isHovering = false;

        // Add hover intent behavior
        markerElement.addEventListener("mouseenter", () => {
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

        markerElement.addEventListener("mouseleave", () => {
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

        markerElement.addEventListener("click", () => {
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
        popup.on("open", () => {
          isPopupOpen = true;
          const popupElement = popup.getElement();

          if (popupElement) {
            popupElement.addEventListener("mouseenter", () => {
              isHovering = true;
              clearTimeout(hoverTimeout);
            });

            popupElement.addEventListener("mouseleave", () => {
              isHovering = false;
              clearTimeout(hoverTimeout);

              hoverTimeout = setTimeout(() => {
                if (!isHovering && isPopupOpen) {
                  marker.togglePopup();
                  isPopupOpen = false;
                }
              }, 400);
            });
          }
        });

        popup.on("close", () => {
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
    addPublicPlacesToMap,
    fetchAddressFromCoordinates,
    markerGroups,
    markersVisible,
    publicPlacesVisible,
    toggleMarkersVisibility,
    togglePublicPlacesVisibility,
    toggleMarkerGroupVisibility,
  };
}
