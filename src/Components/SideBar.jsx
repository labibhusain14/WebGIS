import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, SortAsc, SortDesc, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CardKost from './CardKost';
import PropTypes from 'prop-types';

function SideBar({
  isSidebarOpen,
  toggleSidebar,
  originalKostList,
  setFilteredKost,
  filteredKost,
  fetchDataKost,
  skip,
  loading,
  hasMore,
  addMarkersToMap,
  // Received props
  searchTerm,
  setSearchTerm,
  priceRange,
  setPriceRange,
  selectedFacilities,
  setSelectedFacilities,
  selectedType,
  sortOrder,
  setSortOrder,
}) {
  const sidebarRef = useRef(null);
  const filters = ['Price', 'Facilities'];
  const [openDropdown, setOpenDropdown] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Price range state for the slider
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);
  const maxPriceValue = 10000000; // Max price set to 10 million IDR

  const facilitiesOptions = [
    'Termasuk listrik',
    'Kasur',
    'Meja',
    'Lemari Baju',
    'K. Mandi Luar',
    'K. Mandi Dalam',
    'WiFi',
    'R. Jemur',
    'Dapur',
    'Parkir Motor',
    'Parkir Mobil',
    'Bantal',
    'Penjaga Kos',
    'CCTV',
    'Kulkas',
    'AC',
    'Jemuran',
    'Balcon',
    'TV',
  ];

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const handleCheckboxChange = (category, value) => {
    if (category === 'Facilities') {
      setSelectedFacilities((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
    }
  };

  // Apply slider changes to main price range
  const applyPriceRange = () => {
    setPriceRange(localPriceRange);
  };

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

  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  useEffect(() => {
    const filtered = applyFiltersAndSearch(originalKostList);
    setFilteredKost(filtered);
    addMarkersToMap(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, priceRange, selectedFacilities, selectedType, sortOrder, originalKostList]);

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
  }, [skip, loading, hasMore, fetchDataKost]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredKost.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredKost.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Scroll to top of sidebar when changing pages
      if (sidebarRef.current) {
        sidebarRef.current.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }
  };

  const handleClickOutside = (e) => {
    if (openDropdown && !e.target.closest('.dropdown-container')) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  // Format price for display
  const formatPrice = (value) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  const sidebarVariants = {
    open: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', opacity: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 500 } },
  };

  return (
    <motion.div
      ref={sidebarRef}
      initial="closed"
      animate={isSidebarOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
      className="fixed top-[64px] h-[calc(100vh-61px)] w-full max-w-[450px] bg-gray-50 z-40 border-r border-gray-200 overflow-y-auto shadow-lg"
    >
      {/* Close button for mobile */}
      <div className="w-full flex justify-end p-3 md:hidden">
        <motion.button onClick={toggleSidebar} className="text-gray-700 hover:text-red-600 bg-white rounded-full p-1 shadow-md" whileTap={{ scale: 0.9 }} aria-label="Close sidebar">
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Search bar */}
      <motion.div className="mt-2 flex justify-center w-[90%] mx-auto mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 px-4 pl-10 rounded-lg bg-white border border-gray-300 shadow-sm outline-none text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </motion.div>

      {/* Filter section */}
      <motion.div className="w-[90%] mx-auto bg-white rounded-lg shadow-md p-4 mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex flex-wrap justify-center gap-2">
          {filters.map((label) => (
            <div key={label} className="relative dropdown-container">
              <motion.button
                onClick={() => toggleDropdown(label)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  openDropdown === label ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {label}
                <motion.div animate={{ rotate: openDropdown === label ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {openDropdown === label && (
                  <motion.div
                    className={`absolute left-0 mt-2 ${label === 'Price' ? 'w-80' : 'w-56'} bg-white shadow-lg rounded-lg p-4 text-sm z-50 border border-gray-200`}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                  >
                    {label === 'Price' && (
                      <div className="space-y-5">
                        <h4 className="font-medium text-gray-700 mb-2">Price Range</h4>

                        {/* Price range slider */}
                        <div className="px-1">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600">{formatPrice(localPriceRange.min)}</span>
                            <span className="text-sm text-gray-600">{formatPrice(localPriceRange.max)}</span>
                          </div>

                          <div className="relative mb-6 pt-5">
                            {/* Min slider */}
                            <input
                              type="range"
                              min={0}
                              max={maxPriceValue}
                              value={localPriceRange.min}
                              onChange={(e) => {
                                const value = Number(e.target.value);
                                setLocalPriceRange((prev) => ({
                                  ...prev,
                                  min: value > prev.max ? prev.max : value,
                                }));
                              }}
                              onMouseUp={applyPriceRange}
                              onTouchEnd={applyPriceRange}
                              className="absolute pointer-events-none appearance-none w-full h-1 rounded-full bg-gray-300 outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                            />

                            {/* Max slider */}
                            <input
                              type="range"
                              min={0}
                              max={maxPriceValue}
                              value={localPriceRange.max}
                              onChange={(e) => {
                                const value = Number(e.target.value);
                                setLocalPriceRange((prev) => ({
                                  ...prev,
                                  max: value < prev.min ? prev.min : value,
                                }));
                              }}
                              onMouseUp={applyPriceRange}
                              onTouchEnd={applyPriceRange}
                              className="absolute pointer-events-none appearance-none w-full h-1 rounded-full bg-gray-300 outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                            />
                          </div>

                          {/* Input fields for min/max */}
                          <div className="flex gap-4">
                            <div className="flex flex-col w-1/2">
                              <label className="text-gray-600 text-xs mb-1">Minimum</label>
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-700 font-medium">Rp</span>
                                <input
                                  type="text"
                                  className="border rounded-md p-2 w-full pl-7 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                  placeholder="Min"
                                  value={localPriceRange.min.toLocaleString('id-ID')}
                                  onChange={(e) => {
                                    const rawValue = e.target.value.replace(/\D/g, '');
                                    const value = rawValue ? Number(rawValue) : 0;
                                    setLocalPriceRange((prev) => ({
                                      ...prev,
                                      min: value > prev.max ? prev.max : value,
                                    }));
                                  }}
                                  onBlur={applyPriceRange}
                                />
                              </div>
                            </div>

                            <div className="flex flex-col w-1/2">
                              <label className="text-gray-600 text-xs mb-1">Maximum</label>
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-700 font-medium">Rp</span>
                                <input
                                  type="text"
                                  className="border rounded-md p-2 w-full pl-7 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                  placeholder="Max"
                                  value={localPriceRange.max.toLocaleString('id-ID')}
                                  onChange={(e) => {
                                    const rawValue = e.target.value.replace(/\D/g, '');
                                    const value = rawValue ? Number(rawValue) : 0;
                                    setLocalPriceRange((prev) => ({
                                      ...prev,
                                      max: value < prev.min ? prev.min : value,
                                    }));
                                  }}
                                  onBlur={applyPriceRange}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Apply button */}
                          <motion.button
                            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md font-medium"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              applyPriceRange();
                              setOpenDropdown(null);
                            }}
                          >
                            Apply Price Range
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {label === 'Facilities' && (
                      <div className="max-h-60 overflow-y-auto pr-1">
                        <h4 className="font-medium text-gray-700 mb-2">Available Facilities</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {facilitiesOptions.map((item) => (
                            <motion.label key={item} className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded cursor-pointer" whileHover={{ backgroundColor: '#f3f4f6' }} whileTap={{ scale: 0.98 }}>
                              <input type="checkbox" checked={selectedFacilities.includes(item)} onChange={() => handleCheckboxChange('Facilities', item)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                              <span className="text-gray-700">{item}</span>
                            </motion.label>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <motion.button
            onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
            className="flex items-center gap-1 py-1 px-3 bg-gray-100 rounded-md hover:bg-gray-200 transition-all text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={sortOrder === 'asc' ? 'Lowest to Highest Price' : 'Highest to Lowest Price'}
          >
            {sortOrder === 'asc' ? (
              <>
                <SortAsc className="w-4 h-4" /> Price
              </>
            ) : (
              <>
                <SortDesc className="w-4 h-4" /> Price
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Active filters display */}
      <AnimatePresence>
        {(selectedFacilities.length > 0 || priceRange.min > 0 || priceRange.max > 0) && (
          <motion.div className="w-[90%] mx-auto bg-white rounded-lg shadow-sm p-3 mb-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex flex-wrap gap-2">
              {priceRange.min > 0 && (
                <motion.div className="bg-blue-50 text-blue-700 text-xs py-1 px-2 rounded-full flex items-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} layout>
                  <span>Min: Rp{priceRange.min.toLocaleString('id-ID')}</span>
                  <motion.button onClick={() => setPriceRange({ ...priceRange, min: 0 })} className="ml-1 text-blue-500 hover:text-blue-700" whileTap={{ scale: 0.9 }}>
                    ✕
                  </motion.button>
                </motion.div>
              )}
              {priceRange.max > 0 && (
                <motion.div className="bg-blue-50 text-blue-700 text-xs py-1 px-2 rounded-full flex items-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} layout>
                  <span>Max: Rp{priceRange.max.toLocaleString('id-ID')}</span>
                  <motion.button onClick={() => setPriceRange({ ...priceRange, max: 0 })} className="ml-1 text-blue-500 hover:text-blue-700" whileTap={{ scale: 0.9 }}>
                    ✕
                  </motion.button>
                </motion.div>
              )}
              {selectedFacilities.map((facility) => (
                <motion.div
                  key={facility}
                  className="bg-purple-50 text-purple-700 text-xs py-1 px-2 rounded-full flex items-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  layout
                >
                  <span>{facility}</span>
                  <motion.button onClick={() => setSelectedFacilities((prev) => prev.filter((f) => f !== facility))} className="ml-1 text-purple-500 hover:text-purple-700" whileTap={{ scale: 0.9 }}>
                    ✕
                  </motion.button>
                </motion.div>
              ))}

              {(selectedFacilities.length > 0 || priceRange.min > 0 || priceRange.max > 0) && (
                <motion.button
                  onClick={() => {
                    setSelectedFacilities([]);
                    setPriceRange({ min: 0, max: 0 });
                  }}
                  className="text-xs text-red-600 hover:text-red-800 underline ml-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear all
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <motion.div className="w-[90%] mx-auto mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <p className="text-sm text-gray-600">
          {filteredKost.length} {filteredKost.length === 1 ? 'property' : 'properties'} found
        </p>
      </motion.div>

      {/* Card listing */}
      <motion.div className="w-[90%] mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <CardKost filteredKost={currentItems} />
      </motion.div>

      {/* Loading indicator */}
      <AnimatePresence>
        {loading && (
          <motion.div className="flex justify-center items-center py-4 w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="h-8 w-8 border-t-4 border-blue-600 border-solid rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
            <p className="ml-3 text-gray-700 text-sm">Loading data...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination controls */}
      <AnimatePresence>
        {filteredKost.length > 0 && (
          <motion.div className="w-[90%] mx-auto flex justify-center items-center py-4 mt-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
              <motion.button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 border-r border-gray-200 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                whileHover={currentPage !== 1 ? { backgroundColor: '#f3f4f6' } : {}}
                whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              <div className="px-4 py-2 text-sm font-medium text-gray-700">
                {currentPage} of {totalPages}
              </div>

              <motion.button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 border-l border-gray-200 ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                whileHover={currentPage !== totalPages ? { backgroundColor: '#f3f4f6' } : {}}
                whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No results message */}
      <AnimatePresence>
        {filteredKost.length === 0 && !loading && (
          <motion.div className="w-[90%] mx-auto py-8 flex flex-col items-center justify-center text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <motion.div className="bg-gray-100 rounded-full p-4 mb-3" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
              <Search className="w-6 h-6 text-gray-400" />
            </motion.div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">No properties found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer spacing */}
      <div className="h-4"></div>
    </motion.div>
  );
}

export default SideBar;

SideBar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  originalKostList: PropTypes.array.isRequired,
  setFilteredKost: PropTypes.func.isRequired,
  filteredKost: PropTypes.array.isRequired,
  fetchDataKost: PropTypes.func.isRequired,
  skip: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  hasMore: PropTypes.bool.isRequired,
  addMarkersToMap: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  priceRange: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
  }).isRequired,
  setPriceRange: PropTypes.func.isRequired,
  selectedFacilities: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSelectedFacilities: PropTypes.func.isRequired,
  selectedType: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSelectedType: PropTypes.func.isRequired,
  sortOrder: PropTypes.oneOf(['asc', 'desc']).isRequired,
  setSortOrder: PropTypes.func.isRequired,
};
