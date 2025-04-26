import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import PropTypes from 'prop-types';

function AddressInput({ updateCoordinates, setErrorMsg }) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const geocode = async () => {
    if (!address.trim()) return setErrorMsg('Please enter an address');

    try {
      setLoading(true);
      setErrorMsg('');

      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
      const data = await res.json();

      if (data?.length) {
        const { lat, lon } = data[0];
        updateCoordinates(parseFloat(lat), parseFloat(lon));
        setAddress('');
      } else {
        setErrorMsg('Address not found. Please try a different address.');
      }
    } catch {
      setErrorMsg('Failed to convert address to coordinates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-5">
      <label className="block mb-2 text-sm font-medium text-gray-700">Alamat</label>
      <div className="flex gap-2">
        <motion.input
          type="text"
          className="flex-1 rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && geocode()}
          placeholder="Contoh: Jalan Dipatiukur No. 35, Bandung"
          whileFocus={{ scale: 1.02 }}
        />
        <motion.button onClick={geocode} disabled={loading} className="flex items-center justify-center rounded-lg bg-blue-600 px-4 text-sm text-white transition-colors hover:bg-blue-700" whileTap={{ scale: 0.9 }}>
          {loading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </motion.div>
          ) : (
            <Search size={18} />
          )}
        </motion.button>
      </div>
    </div>
  );
}

AddressInput.propTypes = {
  updateCoordinates: PropTypes.func.isRequired,
  setErrorMsg: PropTypes.func.isRequired,
};

export default AddressInput;
