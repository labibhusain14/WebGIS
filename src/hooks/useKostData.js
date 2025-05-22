import { useEffect, useRef, useState } from 'react';
import KostDataService from '../service/KostDataService';

export default function useKostData(addMarkersToMap, navigate) {
  const initialDataFetched = useRef(false);
  const cacheChecked = useRef(false);

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

  const fetchDataKost = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);
    
    initialDataFetched.current = true;
    
    try {
      console.log(`Fetching kost data... ${reset ? '(reset)' : ''} skip=${reset ? 0 : skip}`);
      
      if (reset) {
        KostDataService.clearCache();
        cacheChecked.current = false;
      }
      
      const useCache = !cacheChecked.current && (reset || skip === 0);
      cacheChecked.current = true;
      
      const data = await KostDataService.fetchKostData(
        reset ? 0 : skip,
        1473,
        useCache
      );
      
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
    }
  }, [searchTerm, priceRange, selectedFacilities, selectedType, sortOrder]);

  // Force refresh data from API
  const refreshData = async () => {
    KostDataService.clearCache();
    cacheChecked.current = false;
    
    setSkip(0);
    setHasMore(true);
    
    return fetchDataKost(true);
  };

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
    refreshData,
    setFilteredKost,
  };
}