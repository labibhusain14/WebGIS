import { useEffect, useRef, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Menu, MapPin, Layers, Eye, EyeOff, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import SideBar from '../Components/SideBar';
import LoadingAnimation from '../Components/LoadingAnimation';
import AIFeatures from '../Components/AIFeatures';
import useMapLogic from '../hooks/useMapLogic';
import useKostData from '../hooks/useKostData';
import publicPlaces from '../data/public_places.json';

function Home() {
  const MAP_SERVICE_KEY = import.meta.env.VITE_MAP_SERVICE_KEY;
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const mapReadyRef = useRef(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(false);

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

    // Add public places when map is ready
    if (publicPlaces && publicPlaces.length > 0) {
      console.log('Adding public places to map');
      mapLogic.addPublicPlacesToMap(publicPlaces);
    }
  });

  const kostData = useKostData((data) => mapLogic.addMarkersToMap(data, navigate), navigate);

  // Loading animation timer
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);

      // Try adding markers now that loading is done
      if (mapReadyRef.current) {
        if (kostData.filteredKost.length > 0) {
          console.log('Loading finished, displaying kost markers');
          mapLogic.addMarkersToMap(kostData.filteredKost, navigate);
        }

        if (publicPlaces && publicPlaces.length > 0) {
          console.log('Loading finished, displaying public places');
          mapLogic.addPublicPlacesToMap(publicPlaces);
        }
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
    if (!isLoading && mapReadyRef.current) {
      if (kostData.filteredKost.length > 0) {
        console.log('Both map and kost data are ready, displaying markers');
        mapLogic.addMarkersToMap(kostData.filteredKost, navigate);
      }

      if (publicPlaces && publicPlaces.length > 0) {
        console.log('Both map and public places data are ready, displaying public places');
        mapLogic.addPublicPlacesToMap(publicPlaces);
      }
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

  // Toggle legend
  const toggleLegend = () => {
    setIsLegendOpen((prev) => !prev);
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

      {/* Sidebar Toggle */}
      <button onClick={toggleSidebar} className={`fixed top-[75px] transition-all duration-700 ${isSidebarOpen ? 'left-[450px]' : 'left-0'} bg-gray-800 text-white p-2 rounded-r-md z-10`}>
        <Menu className="w-5 h-5" />
      </button>

      {/* Map Controls Group */}
      <div className="fixed top-[75px] right-2 z-10 flex flex-col gap-2">
        {/* Map Legend Toggle Button */}
        <button onClick={toggleLegend} className="bg-gray-800 text-white p-2 rounded-md flex items-center gap-1 hover:bg-gray-700" title="Toggle Map Legend">
          <Layers className="w-5 h-5" />
        </button>
      </div>

      {/* Map Legend Panel - Positioned with improved styling */}
      {isLegendOpen && (
        <div className="fixed top-[120px] right-2 bg-white rounded-lg shadow-lg p-4 z-20 w-64 border border-gray-200 transition-all duration-300">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">Map Legend</h3>
            <button onClick={toggleLegend} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Toggle all markers */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">All Kost Markers</span>
              <button onClick={() => mapLogic.toggleMarkersVisibility()} className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors" title={mapLogic.markersVisible ? 'Hide All Markers' : 'Show All Markers'}>
                {mapLogic.markersVisible ? <Eye className="w-5 h-5 text-blue-600" /> : <EyeOff className="w-5 h-5 text-gray-500" />}
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Public place type markers */}
            {Object.entries(mapLogic.markerGroups).map(([type, config]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: config.color }}></div>
                  <span className="text-sm font-medium text-gray-700">{config.label}</span>
                </div>
                <button onClick={() => mapLogic.toggleMarkerGroupVisibility(type)} className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors" title={config.visible ? `Hide ${config.label}` : `Show ${config.label}`}>
                  {config.visible ? <Eye className="w-5 h-5 text-blue-600" /> : <EyeOff className="w-5 h-5 text-gray-500" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
