import { useEffect, useRef, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Menu, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import SideBar from '../Components/SideBar';
import LoadingAnimation from '../Components/LoadingAnimation';
import AIFeatures from '../Components/AIFeatures';
import useMapLogic from '../hooks/useMapLogic';
import useKostData from '../hooks/useKostData';

function Home() {
  const MAP_SERVICE_KEY = import.meta.env.VITE_MAP_SERVICE_KEY;
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const mapReadyRef = useRef(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Budget parameters
  const [budgetParams, setBudgetParams] = useState({
    panjang: 4,
    lebar: 4,
    fasilitas: ['meja', 'parkir motor', 'kasur', 'lemari baju'],
    latitude: -6.9175,
    longitude: 107.6191,
  });

  // Initialize custom hooks
  const mapLogic = useMapLogic(MAP_SERVICE_KEY, () => {
    console.log('Map is ready, fetching initial data');
    mapReadyRef.current = true;
    kostData.fetchDataKost();
  });

  const kostData = useKostData((data) => mapLogic.addMarkersToMap(data, navigate), navigate);

  // Loading animation timer
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);

      // Try adding markers now that loading is done
      if (mapReadyRef.current && kostData.filteredKost.length > 0) {
        console.log('Loading finished, displaying markers');
        mapLogic.addMarkersToMap(kostData.filteredKost, navigate);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Sync marker with budget params
  useEffect(() => {
    if (budgetParams.latitude && budgetParams.longitude) {
      mapLogic.updateMarkerPosition(budgetParams.latitude, budgetParams.longitude);
    }
  }, [budgetParams.latitude, budgetParams.longitude]);

  // Add markers when both map and data are ready
  useEffect(() => {
    if (!isLoading && mapReadyRef.current && kostData.filteredKost.length > 0) {
      console.log('Both map and data are ready, displaying markers');
      mapLogic.addMarkersToMap(kostData.filteredKost, navigate);
    }
  }, [isLoading, kostData.filteredKost, mapReadyRef.current]);

  // Infinite scroll for sidebar
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleScroll = () => {
      if (sidebar.scrollTop + sidebar.clientHeight >= sidebar.scrollHeight - 100) {
        kostData.fetchDataKost();
      }
    };

    sidebar.addEventListener('scroll', handleScroll);
    return () => sidebar.removeEventListener('scroll', handleScroll);
  }, [kostData.skip, kostData.loading, kostData.hasMore]);

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
        originalKostList={kostData.originalKostList}
        setFilteredKost={kostData.setFilteredKost}
        filteredKost={kostData.filteredKost}
        fetchDataKost={kostData.fetchDataKost}
        skip={kostData.skip}
        loading={kostData.loading}
        hasMore={kostData.hasMore}
        addMarkersToMap={(data) => mapLogic.addMarkersToMap(data, navigate)}
        searchTerm={kostData.searchTerm}
        setSearchTerm={kostData.setSearchTerm}
        priceRange={kostData.priceRange}
        setPriceRange={kostData.setPriceRange}
        selectedFacilities={kostData.selectedFacilities}
        setSelectedFacilities={kostData.setSelectedFacilities}
        selectedType={kostData.selectedType}
        setSelectedType={kostData.setSelectedType}
        sortOrder={kostData.sortOrder}
        setSortOrder={kostData.setSortOrder}
        ref={sidebarRef}
      />

      <button onClick={toggleSidebar} className={`fixed top-[75px] transition-all duration-700 ${isSidebarOpen ? 'left-[450px]' : 'left-0'} bg-gray-800 text-white p-2 rounded-r-md z-10`}>
        <Menu className="w-5 h-5" />
      </button>

      {/* Full Address Display */}
      {mapLogic.fullAddress && (
        <div className="absolute bottom-[90px] left-2 right-2 z-10 bg-white bg-opacity-90 rounded-lg shadow-md px-3 py-2 w-[90%] max-w-md mx-auto sm:left-4 sm:right-4 sm:w-auto">
          <div className="flex items-center text-xs sm:text-sm">
            <MapPin size={16} className="mr-1 text-gray-700" />
            <span className="font-medium text-gray-800">Point:</span>
            <span className="ml-1 text-gray-600 truncate">{mapLogic.fullAddress}</span>
          </div>
        </div>
      )}

      {/* AI Features Component */}
      <AIFeatures budgetParams={budgetParams} setBudgetParams={setBudgetParams} fullAddress={mapLogic.fullAddress} />

      <div ref={mapLogic.mapContainer} className="flex-1 h-screen" />
    </div>
  );
}

export default Home;
