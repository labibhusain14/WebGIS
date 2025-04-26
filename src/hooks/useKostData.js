import { useEffect, useRef, useState } from 'react';
import KostDataService from '../service/KostDataService';

export default function useKostData(addMarkersToMap, navigate) {
  const initialDataFetched = useRef(false);

  // State variables
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [originalKostList, setOriginalKostList] = useState([]);
  const [skip, setSkip] = useState(0);
  const [filteredKost, setFilteredKost] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch kost data
  const fetchDataKost = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);
    console.log('Fetching kost data...');
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
      setIsDataReady(true);

      // The map display is now handled in the Home component
      // when both isDataReady and isMapReady are true
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

      // The map display is now handled in the Home component
      // We don't call addMarkersToMap here directly
    }
  }, [searchTerm, priceRange, selectedFacilities, selectedType, sortOrder]);

  return {
    loading,
    hasMore,
    originalKostList,
    filteredKost,
    skip,
    isDataReady,
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
    fetchDataKost,
    setFilteredKost,
  };
}
