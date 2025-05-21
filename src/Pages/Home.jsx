import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "maplibre-gl/dist/maplibre-gl.css";
import { Menu, MapPin, Layers, Eye, EyeOff, X, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import SideBar from "../Components/SideBar";
import LoadingAnimation from "../Components/LoadingAnimation";
import AIFeatures from "../Components/AIFeatures";
import AddressInput from "../Components/SmartBudgeting/AddressInput";
import useMapLogic from "../hooks/useMapLogic";
import useKostData from "../hooks/useKostData";
import publicPlaces from "../data/public_places.json";
import UserGuide from "../Components/UserGuide";

function Home() {
  const MAP_SERVICE_KEY = import.meta.env.VITE_MAP_SERVICE_KEY;
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const mapReadyRef = useRef(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showToTop, setShowToTop] = useState(false);

  // Budget parameters
  const [budgetParams, setBudgetParams] = useState({
    panjang: 4,
    lebar: 4,
    fasilitas: ["meja", "parkir motor", "kasur", "lemari baju"],
    latitude: -6.9175,
    longitude: 107.6191,
  });

  // Initialize custom hooks
  const mapLogic = useMapLogic(MAP_SERVICE_KEY, () => {
    console.log("Map is ready, fetching initial data");
    mapReadyRef.current = true;
    kostData.fetchDataKost();

    // Add public places when map is ready
    if (publicPlaces && publicPlaces.length > 0) {
      console.log("Adding public places to map");
      mapLogic.addPublicPlacesToMap(publicPlaces);
    }
  });
  const { focusOnKostMarker } = mapLogic;

  const kostData = useKostData(
    (data) => mapLogic.addMarkersToMap(data, navigate),
    navigate
  );

  // Loading animation timer
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);

      // Try adding markers now that loading is done
      if (mapReadyRef.current) {
        if (kostData.filteredKost.length > 0) {
          console.log("Loading finished, displaying kost markers");
          mapLogic.addMarkersToMap(kostData.filteredKost, navigate);
        }

        if (publicPlaces && publicPlaces.length > 0) {
          console.log("Loading finished, displaying public places");
          mapLogic.addPublicPlacesToMap(publicPlaces);
        }
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Sync marker with budget params
  useEffect(() => {
    if (budgetParams.latitude && budgetParams.longitude) {
      mapLogic.updateMarkerPosition(
        budgetParams.latitude,
        budgetParams.longitude
      );
    }
  }, [budgetParams.latitude, budgetParams.longitude]);

  // Add markers when both map and data are ready
  useEffect(() => {
    if (!isLoading && mapReadyRef.current) {
      if (kostData.filteredKost.length > 0) {
        console.log("Both map and kost data are ready, displaying markers");
        mapLogic.addMarkersToMap(kostData.filteredKost, navigate);
      }

      if (publicPlaces && publicPlaces.length > 0) {
        console.log(
          "Both map and public places data are ready, displaying public places"
        );
        mapLogic.addPublicPlacesToMap(publicPlaces);
      }
    }
  }, [isLoading, kostData.filteredKost, mapReadyRef.current]);

  // Infinite scroll for sidebar
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleScroll = () => {
      if (
        sidebar.scrollTop + sidebar.clientHeight >=
        sidebar.scrollHeight - 100
      ) {
        kostData.fetchDataKost();
      }

      setShowToTop(sidebar.scrollTop > 300);
    };

    sidebar.addEventListener("scroll", handleScroll);
    return () => sidebar.removeEventListener("scroll", handleScroll);
  }, [kostData.skip, kostData.loading, kostData.hasMore]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Toggle legend
  const toggleLegend = () => {
    setIsLegendOpen((prev) => !prev);
  };

  // Update coordinates from AddressInput component
  const updateCoordinates = (lat, lon) => {
    console.log(`Updating coordinates in Home: ${lat}, ${lon}`);

    // Make sure we have valid coordinates
    if (isNaN(lat) || isNaN(lon)) {
      console.error("Invalid coordinates received:", lat, lon);
      setErrorMsg("Invalid coordinates received. Please try again.");
      return;
    }

    // Update budget params with new coordinates
    setBudgetParams((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lon,
    }));

    // Clear any existing error message
    setErrorMsg("");

    // Fly to the new location on the map
    if (mapLogic && mapLogic.flyToLocation) {
      mapLogic.flyToLocation(lat, lon);
    } else {
      console.error("Map logic or flyToLocation function not available");
    }
  };

  // Scroll to top function for sidebar
  const scrollToTop = () => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="body relative h-screen">
      <UserGuide isLoading={isLoading} /> {/* Close button for mobile */}
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
        focusOnKostMarker={mapLogic.focusOnKostMarker}
        isLoading={isLoading}
      />
      {/* Sidebar Toggle */}
      <motion.button
        id="sidebar"
        onClick={toggleSidebar}
        className={`fixed top-[75px] transition-all duration-[600ms] ${
          isSidebarOpen ? "left-[450px]" : "left-0"
        } bg-gray-800 text-white p-2 rounded-r-md z-10`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Menu className="w-5 h-5" />
      </motion.button>
      {/* Map Controls Group */}
      <div
        id="layer"
        className="fixed top-[90px] right-2 z-10 flex flex-col gap-2"
      >
        {/* Map Legend Toggle Button */}
        <motion.button
          onClick={toggleLegend}
          className="bg-gray-800 text-white p-2 rounded-md flex items-center gap-1 hover:bg-gray-700"
          title="Toggle Map Legend"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Layers className="w-5 h-5" />
        </motion.button>
      </div>
      {/* Map Legend Panel - Positioned with improved styling */}
      <AnimatePresence>
        {isLegendOpen && (
          <motion.div
            className="fixed top-[120px] right-2 bg-white rounded-lg shadow-lg p-4 z-20 w-64 border border-gray-200"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">Map Legend</h3>
              <motion.button
                onClick={toggleLegend}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="space-y-3">
              {/* Toggle all markers */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  All Kost Markers
                </span>
                <motion.button
                  onClick={() => mapLogic.toggleMarkersVisibility()}
                  className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  title={
                    mapLogic.markersVisible
                      ? "Hide All Markers"
                      : "Show All Markers"
                  }
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {mapLogic.markersVisible ? (
                    <Eye className="w-5 h-5 text-blue-600" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  )}
                </motion.button>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>

              {/* Public place type markers */}
              {Object.entries(mapLogic.markerGroups).map(([type, config]) => (
                <motion.div
                  key={type}
                  className="flex items-center justify-between"
                  whileHover={{
                    backgroundColor: "#f9fafb",
                    borderRadius: "0.375rem",
                    padding: "0.25rem",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: config.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {config.label}
                    </span>
                  </div>
                  <motion.button
                    onClick={() => mapLogic.toggleMarkerGroupVisibility(type)}
                    className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    title={
                      config.visible
                        ? `Hide ${config.label}`
                        : `Show ${config.label}`
                    }
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {config.visible ? (
                      <Eye className="w-5 h-5 text-blue-600" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-gray-500" />
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Address Input Panel */}
      <motion.div
        id="cariAlamat"
        className="absolute top-[75px] left-0 right-0 z-10 mx-auto hidden w-[95%] max-w-md rounded-lg bg-white bg-opacity-95 pt-2 px-4 shadow-lg md:block"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <AddressInput
          updateCoordinates={updateCoordinates}
          setErrorMsg={setErrorMsg}
        />
        {errorMsg && (
          <motion.div
            className="mt-1 text-sm text-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {errorMsg}
          </motion.div>
        )}
      </motion.div>
      {/* Full Address Display */}
      <AnimatePresence>
        {mapLogic.fullAddress && (
          <motion.div
            className="absolute bottom-[60px] left-2 right-2 z-10 bg-white bg-opacity-90 rounded-lg shadow-md px-3 py-2 w-[90%] max-w-md mx-auto sm:left-4 sm:right-4 sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="flex items-center text-xs sm:text-sm">
              <MapPin size={16} className="mr-1 text-gray-700" />
              <span className="font-medium text-gray-800">Point:</span>
              <span className="ml-1 text-gray-600 truncate">
                {mapLogic.fullAddress}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* AI Features Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", damping: 20 }}
      >
        <AIFeatures
          budgetParams={budgetParams}
          setBudgetParams={setBudgetParams}
          fullAddress={mapLogic.fullAddress}
        />
      </motion.div>
      {/* Scroll to top button for sidebar */}
      <AnimatePresence>
        {showToTop && isSidebarOpen && (
          <motion.button
            className="fixed bottom-24 left-[225px] transform -translate-x-1/2 bg-blue-600 text-white p-2 rounded-full shadow-lg z-20"
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
      <div ref={mapLogic.mapContainer} className="flex-1 h-screen" />
    </div>
  );
}

export default Home;
