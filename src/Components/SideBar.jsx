import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, SortAsc, SortDesc } from 'lucide-react';
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
  // Receive these props
  searchTerm,
  setSearchTerm,
  priceRange,
  setPriceRange,
  selectedFacilities,
  setSelectedFacilities,
  selectedType,
  setSelectedType,
  sortOrder,
  setSortOrder,
}) {
  const sidebarRef = useRef(null);
  const filters = ['Price', 'Facilities'];
  const [openDropdown, setOpenDropdown] = useState(null);

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
    'Penjaga Kos',
    'TV',
  ];

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const handleCheckboxChange = (category, value) => {
    if (category === 'Facilities') {
      setSelectedFacilities((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
    } else if (category === 'Type') {
      setSelectedType((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
    }
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
    const filtered = applyFiltersAndSearch(originalKostList);
    setFilteredKost(filtered);
    addMarkersToMap(filtered);
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

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-[64px] h-[calc(100vh-61px)] w-full max-w-[450px] bg-gray-200 transition-all duration-700 ${
        isSidebarOpen ? 'left-0' : '-translate-x-full'
      } flex flex-col items-center z-40 border-t border-gray-300 overflow-y-auto`}
    >
      <div className="w-full flex justify-start p-2 md:hidden">
        <button onClick={toggleSidebar} className="text-gray-700 hover:text-red-600 text-xl font-bold px-2">
          ✕
        </button>
      </div>

      <div className="flex justify-center bg-white m-5 rounded-lg p-2 shadow-md w-[80%]">
        <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400" />
        <Search className="w-4 h-4 text-gray-500 mx-2" />
      </div>

      <div className="w-[98%] flex flex-wrap justify-center">
        <div className="flex justify-between gap-2">
          {filters.map((label) => (
            <div key={label} className="relative">
              <button onClick={() => toggleDropdown(label)} className="flex items-center px-4 py-2 rounded-lg bg-white text-gray-800 shadow-md text-sm font-medium">
                {label}
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${openDropdown === label ? 'rotate-180' : 'rotate-0'}`} />
              </button>
              {openDropdown === label && (
                <div className={`absolute left-0 mt-2 ${label === 'Price' ? 'w-80' : 'w-40'} bg-white shadow-lg rounded-lg p-3 text-sm z-10`}>
                  {label === 'Price' && (
                    <div className="space-y-2">
                      <div className="flex gap-6 w-72">
                        <div className="flex flex-col w-1/2">
                          <label className="text-gray-600 mb-1">From</label>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-700 font-medium">Rp</span>
                            <input
                              type="text"
                              className="border rounded-md p-2 mt-1 w-full pl-7"
                              placeholder="Min"
                              value={priceRange.min.toLocaleString('id-ID')}
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(/\D/g, '');
                                setPriceRange({
                                  ...priceRange,
                                  min: Number(rawValue),
                                });
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col w-1/2">
                          <label className="text-gray-600 mb-1">To</label>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-700 font-medium">Rp</span>
                            <input
                              type="text"
                              className="border rounded-md p-2 mt-1 w-full pl-7"
                              placeholder="Max"
                              value={priceRange.max.toLocaleString('id-ID')}
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(/\D/g, '');
                                setPriceRange({
                                  ...priceRange,
                                  max: Number(rawValue),
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {label === 'Facilities' && (
                    <div className="space-y-2">
                      {facilitiesOptions.map((item) => (
                        <label key={item} className="flex items-center space-x-2">
                          <input type="checkbox" checked={selectedFacilities.includes(item)} onChange={() => handleCheckboxChange('Facilities', item)} className="w-4 h-4" />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div className="w-[90%] flex justify-end items-center">
            <button
              onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              className="p-2 bg-white rounded-md shadow hover:bg-gray-100 transition"
              title={sortOrder === 'asc' ? 'Urutkan berdasarkan harga tertinggi' : 'Urutkan berdasarkan harga terendah'}
            >
              {sortOrder === 'asc' ? <SortDesc className="w-5 h-5 text-gray-700" /> : <SortAsc className="w-5 h-5 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>
      <CardKost filteredKost={filteredKost} />
      {/* Menampilkan animasi loading jika loading true */}
      {loading ? (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-900 border-solid"></div>
          <p className="ml-4 text-gray-700">Memuat data, mohon tunggu...</p>
        </div>
      ) : (
        <CardKost filteredKost={filteredKost} />
      )}
    </div>
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
