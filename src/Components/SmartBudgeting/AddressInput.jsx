// SmartBudgeting/AddressInput.jsx
import { useState } from 'react';
import { Search } from 'lucide-react';
import PropTypes from 'prop-types';

function AddressInput({ updateCoordinates, setErrorMsg }) {
  const [addressInput, setAddressInput] = useState('');
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);

  const geocodeAddress = async () => {
    if (!addressInput.trim()) {
      setErrorMsg('Please enter an address');
      return;
    }

    try {
      setIsGeocodingLoading(true);
      setErrorMsg('');

      // Use Nominatim OpenStreetMap API to geocode the address
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressInput)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        updateCoordinates(lat, lon);
      } else {
        setErrorMsg('Address not found. Please try a different address.');
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
      setErrorMsg('Failed to convert address to coordinates. Please try again.');
    } finally {
      setIsGeocodingLoading(false);
    }
  };

  return (
    <div className="mb-3">
      <label className="block text-gray-600 mb-1 text-xs">Alamat (Manual)</label>
      <div className="flex gap-2">
        <input
          type="text"
          className="border rounded-md p-2 flex-1 text-xs"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          placeholder="Contoh: Jalan Dipatiukur No. 35, Bandung"
          onKeyPress={(e) => e.key === 'Enter' && geocodeAddress()}
        />
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md px-2 text-xs flex items-center" onClick={geocodeAddress} disabled={isGeocodingLoading}>
          {isGeocodingLoading ? (
            <svg className="animate-spin h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <Search size={14} />
          )}
        </button>
      </div>
    </div>
  );
}

AddressInput.propTypes = {
  updateCoordinates: PropTypes.func.isRequired,
  setErrorMsg: PropTypes.func.isRequired,
};

export default AddressInput;
