/**
 * Service for handling kost data fetching and filtering operations with caching
 */
class KostDataService {
  constructor() {
    this.CACHE_KEY = 'KOST_DATA_CACHE';
    this.CACHE_TIMESTAMP_KEY = 'KOST_DATA_CACHE_TIMESTAMP';
    this.CACHE_EXPIRY = 1000 * 60 * 30; // 30 minutes in milliseconds
  }

  /**
   * Get cached data if available and valid
   * @returns {Array|null} - Cached kost data or null if no valid cache exists
   */
  getCachedData() {
    try {
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      const cacheTimestamp = localStorage.getItem(this.CACHE_TIMESTAMP_KEY);
      
      if (!cachedData || !cacheTimestamp) {
        return null;
      }

      const now = new Date().getTime();
      if (now - parseInt(cacheTimestamp) > this.CACHE_EXPIRY) {
        console.log('Cache expired, will fetch fresh data');
        return null;
      }

      console.log('Using cached kost data');
      return JSON.parse(cachedData);
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  }

  /**
   * Save data to cache
   * @param {Array} data - Kost data to cache
   */
  saveToCache(data) {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(this.CACHE_TIMESTAMP_KEY, new Date().getTime().toString());
      console.log('Kost data saved to cache');
    } catch (error) {
      console.error('Error saving to cache:', error);

      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded, clearing cache');
        localStorage.clear();
        try {
          localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
          localStorage.setItem(this.CACHE_TIMESTAMP_KEY, new Date().getTime().toString());
        } catch (retryError) {
          console.error('Failed to save to cache after clearing:', retryError);
        }
      }
    }
  }

  /**
   * Clear the cache
   */
  clearCache() {
    localStorage.removeItem(this.CACHE_KEY);
    localStorage.removeItem(this.CACHE_TIMESTAMP_KEY);
    console.log('Kost data cache cleared');
  }

  /**
   * Fetch kost data from API with caching
   * @param {number} skip - Number of records to skip
   * @param {number} limit - Number of records to fetch
   * @param {boolean} checkCache - Whether to check cache first
   * @returns {Promise<Array>} - Kost data
   */
  async fetchKostData(skip = 0, limit = 800, checkCache = true) {
    if (skip === 0 && checkCache) {
      const cachedData = this.getCachedData();
      if (cachedData) {
        return cachedData;
      }
    }

    const queryParams = new URLSearchParams({
      skip,
      limit,
    });

    try {
      console.log(`Fetching kost data from API: skip=${skip}, limit=${limit}`);
      const res = await fetch(`https://ggnt.mapid.co.id/api/kost/?${queryParams}`);
      const json = await res.json();
      
      if (skip === 0) {
        this.saveToCache(json.data);
      }
      
      return json.data;
    } catch (err) {
      console.error('Failed to fetch kost data:', err);
      throw err;
    }
  }

  /**
   * Apply filters and search to kost list
   * @param {Array} list - Original kost list
   * @param {Object} filters - Filter parameters
   * @returns {Array} - Filtered kost list
   */
  applyFiltersAndSearch(list, filters) {
    const { searchTerm, priceRange, selectedFacilities, selectedType, sortOrder } = filters;

    const filtered = list.filter((kost) => {
      const matchSearch = !searchTerm || kost.alamat.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPrice = (!priceRange.min || kost.harga_sewa >= priceRange.min) && (!priceRange.max || kost.harga_sewa <= priceRange.max);
      const matchFacilities = selectedFacilities.length === 0 || selectedFacilities.every((fac) => kost.fasilitas.some((f) => f.nama_fasilitas === fac));
      const matchType = selectedType.length === 0 || selectedType.includes(kost.tipe_kost);

      return matchSearch && matchPrice && matchFacilities && matchType;
    });

    return filtered.sort((a, b) => (sortOrder === 'asc' ? a.harga_sewa - b.harga_sewa : b.harga_sewa - a.harga_sewa));
  }
}

export default new KostDataService();