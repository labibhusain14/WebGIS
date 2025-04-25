import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Crosshair, Menu, Bot, X, History, Wallet, MessageCircle, MapPin } from 'lucide-react';
import Navbar from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import SideBar from '../Components/SideBar';
import SmartBudgeting from '../Components/SmartBudgeting';
import VirtualAssistant from '../Components/VirtualAssistant';
import LoadingAnimation from '../Components/LoadingAnimation';

function Home() {
  const MAP_SERVICE_KEY = import.meta.env.VITE_MAP_SERVICE_KEY;
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const [userLocation, setUserLocation] = useState({
    latitude: -6.9175,
    longitude: 107.6191,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeAssistant, setActiveAssistant] = useState('assistant');
  const [fullAddress, setFullAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [originalKostList, setOriginalKostList] = useState([]);
  const [skip, setSkip] = useState(0);
  const [filteredKost, setFilteredKost] = useState([]);
  const markerList = useRef([]);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [budgetParams, setBudgetParams] = useState({
    panjang: 4,
    lebar: 4,
    fasilitas: ['meja'],
    latitude: -6.9175,
    longitude: 107.6191,
  });
  const [isLoading, setIsLoading] = useState(true);
  const mapInitialized = useRef(false);
  const initialDataFetched = useRef(false);

  // Handle loading animation timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // Initialize map immediately, regardless of loading state
  useEffect(() => {
    if (!mapContainer.current || mapInitialized.current) return;

    const initializeMap = async () => {
      console.log('Initializing map in background...');
      mapInitialized.current = true;

      // Use Bandung coordinates
      const latitude = -6.883316515;
      const longitude = 107.616888;

      // Set user location to Bandung
      setUserLocation({ latitude, longitude });

      // Update budget parameters with Bandung location
      setBudgetParams((prev) => ({
        ...prev,
        latitude,
        longitude,
      }));

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://basemap.mapid.io/styles/street-new-generation/style.json?key=${MAP_SERVICE_KEY}`,
        center: [longitude, latitude],
        zoom: 15.5,
        pitch: 60,
      });

      map.current.on('click', async (e) => {
        const coordinates = e.lngLat;
        const latitude = coordinates.lat;
        const longitude = coordinates.lng;

        // Add marker
        if (markerRef.current) {
          markerRef.current.setLngLat(coordinates);
        } else {
          markerRef.current = new maplibregl.Marker({
            color: 'red',
            draggable: false,
          })
            .setLngLat(coordinates)
            .addTo(map.current);
        }

        setBudgetParams((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));

        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          const address = data.address;

          const fullAddressText = [address.road, address.suburb || address.village || address.town || address.city_district || address.county, address.city || address.regency, address.state, address.postcode, address.country]
            .filter(Boolean)
            .join(', ');

          setFullAddress(fullAddressText);
        } catch (err) {
          console.error('Gagal ambil alamat lengkap:', err);
        }
      });

      // Wait for map to load, then fetch data
      map.current.on('load', () => {
        console.log('Map loaded, adding initial marker');
        markerRef.current = new maplibregl.Marker({
          color: 'red',
          draggable: false,
        })
          .setLngLat([longitude, latitude])
          .addTo(map.current);

        const nav = new maplibregl.NavigationControl({
          showCompass: true,
          showZoom: true,
          visualizePitch: true,
          visualizeRoll: true,
        });
        map.current.addControl(nav, 'bottom-right');

        // Fetch initial data if not already fetched
        if (!initialDataFetched.current) {
          fetchDataKost();
        }

        // Get initial full address
        fetchAddressFromCoordinates(latitude, longitude);
      });
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [MAP_SERVICE_KEY]); // Removed isLoading dependency to start immediately

  // Function to fetch address from coordinates
  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      const address = data.address;

      const fullAddressText = [address.road, address.suburb || address.village || address.town || address.city_district || address.county, address.city || address.regency, address.state, address.postcode, address.country]
        .filter(Boolean)
        .join(', ');

      setFullAddress(fullAddressText);
    } catch (err) {
      console.error('Gagal ambil alamat lengkap:', err);
    }
  };

  // Effect to sync marker position with budgetParams
  useEffect(() => {
    if (map.current && markerRef.current && budgetParams.latitude && budgetParams.longitude) {
      markerRef.current.setLngLat([budgetParams.longitude, budgetParams.latitude]);

      // If the map is zoomed out too far, zoom in a bit
      if (map.current.getZoom() < 10) {
        map.current.flyTo({
          center: [budgetParams.longitude, budgetParams.latitude],
          zoom: 15,
          speed: 1.5,
        });
      } else {
        map.current.flyTo({
          center: [budgetParams.longitude, budgetParams.latitude],
          speed: 1.5,
        });
      }

      // Update the address when coordinates change
      fetchAddressFromCoordinates(budgetParams.latitude, budgetParams.longitude);
    }
  }, [budgetParams.latitude, budgetParams.longitude]);

  const applyFiltersAndSearch = (list) => {
    const filtered = list.filter((kost) => {
      const matchSearch = kost.alamat.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPrice = (!priceRange.min || kost.harga_sewa >= priceRange.min) && (!priceRange.max || kost.harga_sewa <= priceRange.max);
      const matchFacilities = selectedFacilities.length === 0 || selectedFacilities.every((fac) => kost.fasilitas.some((f) => f.nama_fasilitas === fac));
      const matchType = selectedType.length === 0 || selectedType.includes(kost.tipe_kost);
      return matchSearch && matchPrice && matchFacilities && matchType;
    });

    return filtered.sort((a, b) => (sortOrder === 'asc' ? a.harga_sewa - b.harga_sewa : b.harga_sewa - a.harga_sewa));
  };

  const clearMarkers = () => {
    markerList.current.forEach((marker) => marker.remove());
    markerList.current = [];
  };

  const addMarkersToMap = (kostData) => {
    if (!map.current) return;

    // If we're still loading, just store the data but don't actually add markers yet
    if (isLoading) {
      console.log('Map ready but still loading, storing marker data for later');
      return;
    }

    console.log('Adding markers to map:', kostData.length);
    clearMarkers();

    kostData.forEach((kost) => {
      if (kost.longitude && kost.latitude) {
        const popup = new maplibregl.Popup({
          offset: 25,
          className: 'modern-popup',
          closeButton: false,
        }).setHTML(`
              <div class="p-4 bg-white rounded-xl shadow-lg min-w-[200px] font-sans">
                <h3 class="text-base font-semibold text-gray-900 mb-2">${kost.nama_kost}</h3>
                <p class="text-sm text-gray-600 mb-3 leading-relaxed">${kost.alamat}</p>
                <div class="text-sm font-medium text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg inline-block">
                  Rp${Number(kost.harga_sewa).toLocaleString()}
                </div>
                <button 
                  class="mt-2 text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
                  id="detail-btn-${kost.id_kost}"
                >
                  Lihat Detail
                </button>
              </div>`);

        const marker = new maplibregl.Marker({ color: '#8e44ad' }).setLngLat([kost.longitude, kost.latitude]).setPopup(popup).addTo(map.current);

        popup.on('open', () => {
          const detailButton = document.getElementById(`detail-btn-${kost.id_kost}`);
          if (detailButton) {
            detailButton.addEventListener('click', () => navigate(`/detail/${kost.id_kost}`));
          }
        });

        markerList.current.push(marker);
      }
    });
  };

  const fetchDataKost = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);
    console.log('Fetching kost data in background...');
    initialDataFetched.current = true;

    const queryParams = new URLSearchParams({
      skip: reset ? 0 : skip,
      limit: 1000,
      fetch_all: false,
    });

    try {
      const res = await fetch(`https://ggnt.mapid.co.id/api/kost/?${queryParams}`);
      const json = await res.json();
      const data = json.data;
      console.log('Data received:', data.length, 'items');

      const newData = reset ? data : [...originalKostList, ...data];
      const filtered = applyFiltersAndSearch(newData);

      setOriginalKostList(newData);
      setFilteredKost(filtered);
      setSkip(reset ? 20 : skip + 20);
      setHasMore(data.length === 20);

      // Only add markers if map is ready and we're not in loading state
      if (map.current && !isLoading) {
        addMarkersToMap(filtered);
      }
    } catch (err) {
      console.error('Gagal mengambil data kost:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when they change
  useEffect(() => {
    if (originalKostList.length > 0) {
      const filtered = applyFiltersAndSearch(originalKostList);
      setFilteredKost(filtered);

      if (map.current && !isLoading) {
        addMarkersToMap(filtered);
      }
    }
  }, [searchTerm, priceRange, selectedFacilities, selectedType, sortOrder, isLoading]);

  // When loading finishes, make sure we add markers that might have been waiting
  useEffect(() => {
    if (!isLoading && map.current && filteredKost.length > 0) {
      console.log('Loading finished, displaying markers');
      addMarkersToMap(filteredKost);
    }
  }, [isLoading]);

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

  const navigateToTarget = () => {
    if (!map.current || !userLocation) {
      console.warn('Map instance or user location is missing');
      return;
    }

    map.current.flyTo({
      center: [userLocation.longitude, userLocation.latitude],
      zoom: 16,
      speed: 1.5,
      curve: 1.2,
    });
  };

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
            <span className="font-medium text-gray-800">Alamat Lengkap:</span>
            <span className="ml-1 text-gray-600 truncate">{fullAddress}</span>
          </div>
        </div>
      )}

      <div className="fixed top-20 right-6 sm:top-40 sm:right-14 flex flex-col items-end z-10 sm:items-start sm:top-40 sm:right-14">
        {isOpen && (
          <div className="w-[90%] max-w-[450px] h-[90vh] max-h-[500px] bg-[#ECF0F1] shadow-lg rounded-lg flex flex-col fixed top-40 sm:right-14 z-50 border border-gray-300 sm:w-[450px] sm:h-[500px] sm:max-h-[500px] sm:max-w-[450px] sm:top-40 sm:right-14">
            <div className="flex justify-between items-center bg-[#2C3E50] text-white p-2 rounded-t-lg">
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-700">
                  <History size={18} />
                </button>
              </div>
              <div className="flex space-x-4 bg-gray-100 p-1 rounded-full mx-auto">
                <button onClick={() => setActiveAssistant('budgeting')} className={`px-4 py-2 text-xs font-bold rounded-full ${activeAssistant === 'budgeting' ? 'bg-[#2C3E50] text-white shadow-md' : 'text-gray-500'}`}>
                  <Wallet size={16} className="inline-block mr-1" /> Smart Budgeting
                </button>
                <button onClick={() => setActiveAssistant('assistant')} className={`px-4 py-2 text-xs font-bold rounded-full ${activeAssistant === 'assistant' ? 'bg-[#2C3E50] text-white shadow-md' : 'text-gray-500'}`}>
                  <MessageCircle size={16} className="inline-block mr-1" /> Virtual Assistant
                </button>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-700">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto">{activeAssistant === 'assistant' ? <VirtualAssistant /> : <SmartBudgeting budgetParams={budgetParams} setBudgetParams={setBudgetParams} fullAddress={fullAddress} />}</div>
          </div>
        )}
      </div>

      <div className="fixed top-24 right-2 z-50 flex items-center space-x-2">
        <div className="relative bg-gray-800 text-white text-xs p-2 rounded-md max-w-xs hidden sm:block">
          Try AI Features
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-t-8 border-b-8 border-transparent border-l-gray-800"></div>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 bg-[#2C3E50] text-white px-3 py-3 rounded-full shadow-md hover:bg-[#1F2A36]">
          <Bot size={18} />
        </button>
      </div>

      <div ref={mapContainer} className="flex-1 h-screen" />
    </div>
  );
}

export default Home;
