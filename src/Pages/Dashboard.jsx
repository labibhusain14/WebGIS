// src/Pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Components/Navbar';
import DashboardFilter from '../Components/DashboardFilter';
import { useDashboardData } from '../hooks/useDashboardData';
import { PriceDistribution, PriceCategories, FacilitiesHistogram, FacilitiesDistribution, PriceAreaScatter, FacilityPriceTrends, LocationMap } from '../Components/DashboardCharts';
import dashboardData from '../data/dashboard_data.json';
import KeyMetrics from '../Components/DashboardCharts/KeyMetrics';

const Dashboard = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    filteredData,
    metrics,
    chartData,
    mapCenter,
    availableKecamatans,
    availableGenders,
    selectedKecamatans,
    selectedGenders,
    priceRange,
    fullPriceRange,
    handleKecamatanChange,
    handleSelectAllKecamatans,
    handleClearKecamatans,
    handleGenderChange,
    handlePriceRangeChange,
  } = useDashboardData(dashboardData);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Loading screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-white z-50" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <motion.div
              className="flex flex-col items-center"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
              }}
            >
              <div className="w-24 h-24 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading dashboard data...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile filter toggle button */}
      <div className="md:hidden fixed bottom-4 right-4 z-30">
        <motion.button whileTap={{ scale: 0.95 }} onClick={toggleMobileFilter} className="bg-blue-600 text-white rounded-full p-4 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </motion.button>
      </div>

      <div className="pt-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row">
          {/* Filter sidebar for desktop */}
          <div className="hidden md:block">
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="sticky top-20">
              <DashboardFilter
                availableKecamatans={availableKecamatans}
                selectedKecamatans={selectedKecamatans}
                handleKecamatanChange={handleKecamatanChange}
                handleSelectAllKecamatans={handleSelectAllKecamatans}
                handleClearKecamatans={handleClearKecamatans}
                availableGenders={availableGenders}
                selectedGenders={selectedGenders}
                handleGenderChange={handleGenderChange}
                priceRange={priceRange}
                fullPriceRange={fullPriceRange}
                handlePriceRangeChange={handlePriceRangeChange}
                isMobile={false}
              />
            </motion.div>
          </div>

          {/* Mobile filter sidebar */}
          <AnimatePresence>
            {isMobileFilterOpen && (
              <motion.div initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }} transition={{ type: 'spring', damping: 25 }} className="fixed inset-0 z-40 md:hidden">
                <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleMobileFilter}></div>
                <motion.div className="absolute right-0 top-0 h-full w-3/4 bg-white shadow-lg overflow-y-auto">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Filter</h2>
                      <button onClick={toggleMobileFilter} className="text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <DashboardFilter
                      availableKecamatans={availableKecamatans}
                      selectedKecamatans={selectedKecamatans}
                      handleKecamatanChange={handleKecamatanChange}
                      handleSelectAllKecamatans={handleSelectAllKecamatans}
                      handleClearKecamatans={handleClearKecamatans}
                      availableGenders={availableGenders}
                      selectedGenders={selectedGenders}
                      handleGenderChange={handleGenderChange}
                      priceRange={priceRange}
                      fullPriceRange={fullPriceRange}
                      handlePriceRangeChange={handlePriceRangeChange}
                      isMobile={true}
                      closeFilter={toggleMobileFilter}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <motion.div className="flex-1 py-4 md:pl-6" initial="hidden" animate="visible" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">📊 Dashboard Market Analysis Kost</h1>
                  <p className="text-gray-600">Visualisasi interaktif data kost berdasarkan harga, luas, fasilitas, dan lokasi.</p>
                </div>
                <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-medium">{filteredData.length} Kost</div>
              </div>
            </motion.div>

            {/* Filter summary tags */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-4">
              {selectedKecamatans.length !== availableKecamatans.length && <div className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">{selectedKecamatans.length} kecamatan dipilih</div>}
              {selectedGenders.length !== availableGenders.length && <div className="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full">{selectedGenders.map((g) => g).join(', ')}</div>}
              <div className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full">
                Rp {new Intl.NumberFormat('id-ID').format(priceRange[0])} - Rp {new Intl.NumberFormat('id-ID').format(priceRange[1])}
              </div>
            </motion.div>

            {/* Key Metrics */}
            <motion.div variants={itemVariants}>
              <KeyMetrics metrics={metrics} />
            </motion.div>

            {/* Row 1: Price Distribution and Categories */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <PriceDistribution priceCategories={chartData.priceCategories} />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <PriceCategories priceCategories={chartData.priceCategories} />
              </div>
            </motion.div>

            {/* Row 2: Facilities Histogram & Distribution */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <FacilitiesHistogram facilitiesHistogram={chartData.facilitiesHistogram} />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <FacilitiesDistribution facilityPriceTrends={chartData.facilityPriceTrends} />
              </div>
            </motion.div>

            {/* Scatter Chart: Price vs Area */}
            <motion.div variants={itemVariants} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-6">
              <PriceAreaScatter filteredData={filteredData} />
            </motion.div>

            {/* Trend Charts */}
            <motion.div variants={itemVariants} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-6">
              <FacilityPriceTrends facilityPriceTrends={chartData.facilityPriceTrends} />
            </motion.div>

            {/* Map */}
            <motion.div variants={itemVariants} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-6">
              <LocationMap filteredData={filteredData} mapCenter={mapCenter} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
