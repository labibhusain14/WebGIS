import { useEffect, useRef, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Crosshair, Menu, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import SideBar from '../Components/SideBar';
import LoadingAnimation from '../Components/LoadingAnimation';
import AIFeatures from '../Components/AIFeatures';
import KostDataService from '../service/KostDataService';
import MapService from '../service/MapService';

function Home() {
  const MAP_SERVICE_KEY = import.meta.env.VITE_MAP_SERVICE_KEY;
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const markerList = useRef([]);
  const sidebarRef = useRef(null);
  const mapInitialized = useRef(false);
  const initialDataFetched = useRef(false);

  const navigate = useNavigate();

  // State variables
  const [userLocation, setUserLocation] = useState({
    latitude: -6.9175,
    longitude: 107.6191,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fullAddress, setFullAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [originalKostList, setOriginalKostList] = useState([]);
  const [skip, setSkip] = useState(0);
  const [filteredKost, setFilteredKost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');

  // Budget parameters
  const [budgetParams, setBudgetParams] = useState({
    panjang: 4,
    lebar: 4,
    fasilitas: ['meja', 'parkir motor', 'kasur', 'lemari baju'],
    latitude: -6.9175,
    longitude: 107.6191,
  });

  // Loading animation timer
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapInitialized.current) return;

    const initializeMap = async () => {
      console.log('Initializing map in background...');
      mapInitialized.current = true;

      // Use Bandung coordinates
      const latitude = -6.883316515;
      const longitude = 107.616888;

      // Set user location
      setUserLocation({ latitude, longitude });

      // Update budget parameters
      setBudgetParams((prev) => ({
        ...prev,
        latitude,
        longitude,
      }));

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

        // Update budget params
        setBudgetParams((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));

        // Fetch address
        try {
          const address = await MapService.fetchAddressFromCoordinates(latitude, longitude);
          setFullAddress(address);
        } catch (err) {
          console.error('Failed to fetch address:', err);
        }
      });

      // Map load handler
      map.current.on('load', () => {
        console.log('Map loaded, adding initial marker');
        markerRef.current = MapService.addMarker(map.current, [longitude, latitude], { color: 'red' });

        // Fetch initial data if needed
        if (!initialDataFetched.current) {
          fetchDataKost();
        }

        // Get initial address
        fetchAddressFromCoordinates(latitude, longitude);
      });
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [MAP_SERVICE_KEY]);

  // Fetch address wrapper
  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const address = await MapService.fetchAddressFromCoordinates(latitude, longitude);
      setFullAddress(address);
    } catch (err) {
      console.error('Failed to fetch address:', err);
    }
  };

  // Sync marker with budget params
  useEffect(() => {
    if (map.current && markerRef.current && budgetParams.latitude && budgetParams.longitude) {
      markerRef.current.setLngLat([budgetParams.longitude, budgetParams.latitude]);

      // Adjust zoom and fly to location
      const zoomLevel = map.current.getZoom() < 10 ? 15 : undefined;
      MapService.flyTo(map.current, [budgetParams.longitude, budgetParams.latitude], { zoom: zoomLevel });

      // Update address
      fetchAddressFromCoordinates(budgetParams.latitude, budgetParams.longitude);
    }
  }, [budgetParams.latitude, budgetParams.longitude]);

  // Clear map markers
  const clearMarkers = () => {
    markerList.current.forEach((marker) => marker.remove());
    markerList.current = [];
  };

  // Add kost markers to map
  const addMarkersToMap = (kostData) => {
    if (!map.current) return;

    // Skip if still loading
    if (isLoading) {
      console.log('Map ready but still loading, storing marker data for later');
      return;
    }

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

  // Fetch kost data
  const fetchDataKost = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);
    console.log('Fetching kost data in background...');
    initialDataFetched.current = true;

    try {
      // Use the service to fetch data
      const data = await KostDataService.fetchKostData(reset ? 0 : skip, 800, false);
      console.log('Data received:', data.length, 'items');

      const newData = reset ? data : [...originalKostList, ...data];

      // Apply filters using the service
      const filtered = KostDataService.applyFiltersAndSearch(newData, {
        searchTerm,
        priceRange,
        selectedFacilities,
        selectedType,
        sortOrder,
      });

      setOriginalKostList(newData);
      setFilteredKost(filtered);
      setSkip(reset ? 20 : skip + 20);
      setHasMore(data.length === 20);

      // Add markers if ready
      if (map.current && !isLoading) {
        addMarkersToMap(filtered);
      }
    } catch (err) {
      console.error('Failed to fetch kost data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when they change
  useEffect(() => {
    if (originalKostList.length > 0) {
      const filtered = KostDataService.applyFiltersAndSearch(originalKostList, {
        searchTerm,
        priceRange,
        selectedFacilities,
        selectedType,
        sortOrder,
      });

      setFilteredKost(filtered);

      if (map.current && !isLoading) {
        addMarkersToMap(filtered);
      }
    }
  }, [searchTerm, priceRange, selectedFacilities, selectedType, sortOrder, isLoading]);

  // Add markers when loading finishes
  useEffect(() => {
    if (!isLoading && map.current && filteredKost.length > 0) {
      console.log('Loading finished, displaying markers');
      addMarkersToMap(filteredKost);
    }
  }, [isLoading]);

  // Infinite scroll for sidebar
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleScroll = () => {
      if (sidebar.scrollTop + sidebar.clientHeight >= sidebar.scrollHeight - 100) {
        fetchDataKost();
      }
    };

    sidebar.addEventListener('scroll', handleScroll);
    return () => sidebar.removeEventListener('scroll', handleScroll);
  }, [skip, loading, hasMore]);

  // Navigate to current location
  const navigateToTarget = () => {
    if (!map.current || !userLocation) {
      console.warn('Map instance or user location is missing');
      return;
    }

    MapService.flyTo(map.current, [userLocation.longitude, userLocation.latitude]);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="relative h-screen">
      {isLoading && <LoadingAnimation duration={4000} />}
      <Navbar />

      <SideBar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        originalKostList={originalKostList}
        setFilteredKost={setFilteredKost}
        filteredKost={filteredKost}
        fetchDataKost={fetchDataKost}
        skip={skip}
        loading={loading}
        hasMore={hasMore}
        addMarkersToMap={addMarkersToMap}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedFacilities={selectedFacilities}
        setSelectedFacilities={setSelectedFacilities}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        ref={sidebarRef}
      />

      <button onClick={toggleSidebar} className={`fixed top-[75px] transition-all duration-700 ${isSidebarOpen ? 'left-[450px]' : 'left-0'} bg-gray-800 text-white p-2 rounded-r-md z-10`}>
        <Menu className="w-5 h-5" />
      </button>

      <button onClick={navigateToTarget} className="absolute bottom-[150px] right-2 z-10 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md border-none cursor-pointer">
        <Crosshair className="w-4 h-4 text-gray-700" />
      </button>

      {/* Full Address Display */}
      {fullAddress && (
        <div className="absolute bottom-[90px] left-2 right-2 z-10 bg-white bg-opacity-90 rounded-lg shadow-md px-3 py-2 w-[90%] max-w-md mx-auto sm:left-4 sm:right-4 sm:w-auto">
          <div className="flex items-center text-xs sm:text-sm">
            <MapPin size={16} className="mr-1 text-gray-700" />
            <span className="font-medium text-gray-800">Point:</span>
            <span className="ml-1 text-gray-600 truncate">{fullAddress}</span>
          </div>
        </div>
      )}

      {/* AI Features Component */}
      <AIFeatures budgetParams={budgetParams} setBudgetParams={setBudgetParams} fullAddress={fullAddress} />

      <div ref={mapContainer} className="flex-1 h-screen" />
    </div>
  );
}

export default Home;
