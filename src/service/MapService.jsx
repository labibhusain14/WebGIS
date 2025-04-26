import maplibregl from 'maplibre-gl';

/**
 * Service for handling map-related operations
 */
class MapService {
  /**
   * Initialize map instance
   * @param {Object} container - Map container reference
   * @param {string} apiKey - Map service API key
   * @param {Object} initialCoordinates - Initial coordinates for map center
   * @param {Object} options - Additional map options
   * @returns {Object} - Map instance
   */
  initializeMap(container, apiKey, initialCoordinates, options = {}) {
    if (!container) return null;

    const { latitude, longitude } = initialCoordinates;
    const defaultOptions = {
      zoom: 15.5,
      pitch: 60,
    };

    const mapOptions = { ...defaultOptions, ...options };

    const map = new maplibregl.Map({
      container,
      style: `https://basemap.mapid.io/styles/street-new-generation/style.json?key=${apiKey}`,
      center: [longitude, latitude],
      zoom: mapOptions.zoom,
      pitch: mapOptions.pitch,
    });

    // Add navigation control
    const nav = new maplibregl.NavigationControl({
      showCompass: true,
      showZoom: true,
      visualizePitch: true,
      visualizeRoll: true,
    });
    map.addControl(nav, 'bottom-right');

    return map;
  }

  /**
   * Create a marker on the map
   * @param {Object} map - Map instance
   * @param {Array} coordinates - [longitude, latitude]
   * @param {Object} options - Marker options
   * @returns {Object} - Marker instance
   */
  addMarker(map, coordinates, options = {}) {
    if (!map) return null;

    const defaultOptions = {
      color: 'red',
      draggable: false,
      scale: 1,
    };

    const markerOptions = { ...defaultOptions, ...options };

    const marker = new maplibregl.Marker(markerOptions).setLngLat(coordinates).addTo(map);

    return marker;
  }

  /**
   * Create a popup for a marker
   * @param {Object} options - Popup options
   * @returns {Object} - Popup instance
   */
  createPopup(options = {}) {
    const defaultOptions = {
      offset: 25,
      className: 'modern-popup',
      closeButton: false,
      closeOnClick: false,
      maxWidth: '300px',
    };

    const popupOptions = { ...defaultOptions, ...options };
    return new maplibregl.Popup(popupOptions);
  }

  /**
   * Move map view to given coordinates
   * @param {Object} map - Map instance
   * @param {Array} coordinates - [longitude, latitude]
   * @param {Object} options - Fly to options
   */
  flyTo(map, coordinates, options = {}) {
    if (!map) return;

    const defaultOptions = {
      zoom: 16,
      speed: 1.5,
      curve: 1.2,
    };

    const flyOptions = { ...defaultOptions, ...options };
    map.flyTo({
      center: coordinates,
      ...flyOptions,
    });
  }

  /**
   * Fetch full address from coordinates using Nominatim
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @returns {Promise<string>} - Full address string
   */
  async fetchAddressFromCoordinates(latitude, longitude) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      const address = data.address;

      const fullAddressText = [address.road, address.suburb || address.village || address.town || address.city_district || address.county, address.city || address.regency, address.state, address.postcode, address.country]
        .filter(Boolean)
        .join(', ');

      return fullAddressText;
    } catch (err) {
      console.error('Failed to fetch address:', err);
      throw err;
    }
  }
}

export default new MapService();
