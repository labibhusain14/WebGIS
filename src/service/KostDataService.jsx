/**
 * Service for handling kost data fetching and filtering operations
 */
class KostDataService {
  /**
   * Fetch kost data from API
   * @param {number} skip - Number of records to skip
   * @param {number} limit - Number of records to fetch
   * @param {boolean} fetchAll - Whether to fetch all data
   * @returns {Promise<Array>} - Kost data
   */
  async fetchKostData(skip = 0, limit = 800, fetchAll = false) {
    const queryParams = new URLSearchParams({
      skip,
      limit,
      fetch_all: fetchAll,
    });

    try {
      const res = await fetch(`https://ggnt.mapid.co.id/api/kost/?${queryParams}`);
      const json = await res.json();
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
      const matchSearch = kost.alamat.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPrice = (!priceRange.min || kost.harga_sewa >= priceRange.min) && (!priceRange.max || kost.harga_sewa <= priceRange.max);
      const matchFacilities = selectedFacilities.length === 0 || selectedFacilities.every((fac) => kost.fasilitas.some((f) => f.nama_fasilitas === fac));
      const matchType = selectedType.length === 0 || selectedType.includes(kost.tipe_kost);

      return matchSearch && matchPrice && matchFacilities && matchType;
    });

    return filtered.sort((a, b) => (sortOrder === 'asc' ? a.harga_sewa - b.harga_sewa : b.harga_sewa - a.harga_sewa));
  }
}

export default new KostDataService();
