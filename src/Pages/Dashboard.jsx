// src/Pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Components/Navbar';
import DashboardFilter from '../Components/DashboardFilter';
import { useDashboardData } from '../hooks/useDashboardData';
import { PriceCategories, FacilitiesHistogram, FacilitiesDistribution, PriceAreaScatter, FacilityPriceTrends, LocationMap } from '../Components/DashboardCharts';
import dashboardData from '../data/dashboard_data.json';
import KeyMetrics from '../Components/DashboardCharts/KeyMetrics';

const Dashboard = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
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
  const handleExportData = () => {
    setIsExporting(true);

    setTimeout(() => {
      try {
        // Convert the filteredData to CSV or JSON
        const dataStr = JSON.stringify(filteredData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        // Create a link and trigger download
        const exportLink = document.createElement('a');
        exportLink.setAttribute('href', dataUri);
        exportLink.setAttribute('download', 'kost_data_export.json');
        document.body.appendChild(exportLink);
        exportLink.click();
        document.body.removeChild(exportLink);
      } catch (error) {
        console.error('Export failed:', error);
      } finally {
        setIsExporting(false);
      }
    }, 1000);
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
            {/* Enhanced Dashboard Header */}
            <motion.div className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                    <span className="flex items-center justify-center bg-white text-blue-600 rounded-full w-10 h-10">📊</span>
                    <span>Market Analysis Kost</span>
                  </h1>
                  <p className="text-blue-100 mt-2">Visualisasi interaktif data kost berdasarkan harga, luas, fasilitas, dan lokasi.</p>
                </div>
                <div className="flex gap-3 self-end md:self-auto">
                  {/* Mobile filter toggle button - Now at top */}
                  <motion.button whileTap={{ scale: 0.95 }} onClick={toggleMobileFilter} className="md:hidden flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <span>Filter</span>
                  </motion.button>

                  {/* Export Data Button */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExportData}
                    disabled={isExporting}
                    className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium shadow-sm disabled:opacity-70"
                  >
                    {isExporting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Exporting</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Export Data</span>
                      </>
                    )}
                  </motion.button>
                </div>
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
            {/* Trend Charts */}
            <motion.div variants={itemVariants} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-6">
              <FacilityPriceTrends facilityPriceTrends={chartData.facilityPriceTrends} />
            </motion.div>

            {/* Map */}
            <motion.div variants={itemVariants} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-6">
              <LocationMap filteredData={filteredData} mapCenter={mapCenter} />
            </motion.div>
            {/* Price Distribution and Categories */}
            <motion.div variants={itemVariants} className=" gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <PriceCategories priceCategories={chartData.priceCategories} />
              </div>
            </motion.div>

            {/*Facilities Histogram & Distribution */}
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
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
