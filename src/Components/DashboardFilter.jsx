// src/Components/DashboardFilter.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DashboardFilter = ({
  availableKecamatans,
  selectedKecamatans,
  handleKecamatanChange,
  handleSelectAllKecamatans,
  handleClearKecamatans,
  availableGenders,
  selectedGenders,
  handleGenderChange,
  priceRange,
  fullPriceRange,
  handlePriceRangeChange,
  isMobile,
  closeFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showKecamatans, setShowKecamatans] = useState(true);
  const [showGenders, setShowGenders] = useState(true);
  const [showPriceRange, setShowPriceRange] = useState(true);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  // Filter kecamatans based on search
  const filteredKecamatans = availableKecamatans.filter((kec) => kec.toLowerCase().includes(searchTerm.toLowerCase()));

  // Function to apply price range
  const applyPriceRange = (e) => {
    const values = e.target.value.split(',').map(Number);
    handlePriceRangeChange({ target: { value: values.join(',') } });
  };

  // Create a controlled two-thumb range input
  const [minPrice, setMinPrice] = useState(priceRange[0]);
  const [maxPrice, setMaxPrice] = useState(priceRange[1]);

  const handleMinPriceChange = (e) => {
    const value = Math.min(Number(e.target.value), maxPrice - 100000);
    setMinPrice(value);
    handlePriceRangeChange({ target: { value: `${value},${maxPrice}` } });
  };

  const handleMaxPriceChange = (e) => {
    const value = Math.max(Number(e.target.value), minPrice + 100000);
    setMaxPrice(value);
    handlePriceRangeChange({ target: { value: `${minPrice},${value}` } });
  };

  return (
    <motion.div className={`bg-white rounded-lg shadow-md ${isMobile ? 'w-full' : 'w-72'} overflow-hidden`}>
      <div className="p-4 bg-blue-600 text-white">
        <h2 className="text-lg font-bold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filter Data
        </h2>
      </div>

      <div className="p-4">
        {/* Filter summary */}
        <div className="mb-4 p-3 bg-blue-50 rounded-md text-xs text-blue-700">
          <p className="font-medium">Total Filter Aktif:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            <span className="inline-block bg-blue-100 px-2 py-1 rounded-full">
              {selectedKecamatans.length} / {availableKecamatans.length} Kecamatan
            </span>
            <span className="inline-block bg-blue-100 px-2 py-1 rounded-full">
              {selectedGenders.length} / {availableGenders.length} Tipe
            </span>
          </div>
        </div>

        {/* Kecamatan Filter */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => setShowKecamatans(!showKecamatans)}>
            <h3 className="font-medium text-gray-800">Pilih Kecamatan</h3>
            <motion.div animate={{ rotate: showKecamatans ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>

          <motion.div animate={{ height: showKecamatans ? 'auto' : 0, opacity: showKecamatans ? 1 : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Cari kecamatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleSelectAllKecamatans} className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition">
                Semua
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleClearKecamatans} className="text-xs bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-full transition">
                Reset
              </motion.button>
            </div>

            <div className="max-h-40 overflow-y-auto pr-1 scrollbar-thin">
              {filteredKecamatans.length > 0 ? (
                filteredKecamatans.map((kec) => (
                  <div key={kec} className="flex items-center mb-2">
                    <input type="checkbox" id={`kec-${kec}`} checked={selectedKecamatans.includes(kec)} onChange={() => handleKecamatanChange(kec)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <label htmlFor={`kec-${kec}`} className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-blue-600">
                      {kec}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">Tidak ada kecamatan yang cocok</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Gender Filter */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => setShowGenders(!showGenders)}>
            <h3 className="font-medium text-gray-800">Tipe Kos</h3>
            <motion.div animate={{ rotate: showGenders ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>

          <motion.div animate={{ height: showGenders ? 'auto' : 0, opacity: showGenders ? 1 : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="flex flex-col space-y-2">
              {availableGenders.map((gender) => (
                <div key={gender} className="flex items-center">
                  <input type="checkbox" id={`gender-${gender}`} checked={selectedGenders.includes(gender)} onChange={() => handleGenderChange(gender)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <label htmlFor={`gender-${gender}`} className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-blue-600">
                    {gender === 'Kos Putra' ? '👨 Putra' : gender === 'Kos Putri' ? '👩 Putri' : '👫 Campur'}
                  </label>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => setShowPriceRange(!showPriceRange)}>
            <h3 className="font-medium text-gray-800">Rentang Harga</h3>
            <motion.div animate={{ rotate: showPriceRange ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>

          <motion.div animate={{ height: showPriceRange ? 'auto' : 0, opacity: showPriceRange ? 1 : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Min: Rp {formatPrice(minPrice)}</span>
                <span className="font-medium">Max: Rp {formatPrice(maxPrice)}</span>
              </div>

              {/* <div className="relative mt-5 mb-6">
                <div className="absolute top-1/2 transform -translate-y-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
                <input
                  type="range"
                  min={fullPriceRange[0]}
                  max={fullPriceRange[1]}
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  className="absolute top-1/2 transform -translate-y-1/2 w-full appearance-none bg-transparent pointer-events-none z-10"
                  style={{
                    zIndex: 20,
                    background: 'transparent',
                  }}
                />
                <input
                  type="range"
                  min={fullPriceRange[0]}
                  max={fullPriceRange[1]}
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  className="absolute top-1/2 transform -translate-y-1/2 w-full appearance-none bg-transparent pointer-events-none z-10"
                  style={{
                    zIndex: 20,
                    background: 'transparent',
                  }}
                />
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 h-1 bg-blue-500 rounded-full"
                  style={{
                    left: `${((minPrice - fullPriceRange[0]) / (fullPriceRange[1] - fullPriceRange[0])) * 100}%`,
                    right: `${100 - ((maxPrice - fullPriceRange[0]) / (fullPriceRange[1] - fullPriceRange[0])) * 100}%`,
                  }}
                ></div>
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-pointer"
                  style={{
                    left: `calc(${((minPrice - fullPriceRange[0]) / (fullPriceRange[1] - fullPriceRange[0])) * 100}% - 8px)`,
                    zIndex: 30,
                  }}
                ></div>
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-pointer"
                  style={{
                    left: `calc(${((maxPrice - fullPriceRange[0]) / (fullPriceRange[1] - fullPriceRange[0])) * 100}% - 8px)`,
                    zIndex: 30,
                  }}
                ></div>
              </div> */}

              <div className="grid grid-cols-2 gap-1 px-1 mt-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Minimum (Rp)</label>
                  <input type="number" value={minPrice} onChange={handleMinPriceChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Maximum (Rp)</label>
                  <input type="number" value={maxPrice} onChange={handleMaxPriceChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Apply Filters Button - for mobile only */}
        {isMobile && (
          <motion.button whileTap={{ scale: 0.95 }} onClick={closeFilter} className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
            Terapkan Filter
          </motion.button>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 text-center text-xs text-gray-500 border-t">
        <p>© KostHub Analysis 2025</p>
        <p className="mt-1">Data terakhir diperbarui: 25 Apr 2025</p>
      </div>
    </motion.div>
  );
};

export default DashboardFilter;
