// SmartBudgeting.jsx
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import AddressInput from './SmartBudgeting/AddressInput';
import RoomDimensionsInput from './SmartBudgeting/RoomDimensionsInput';
import FacilitiesSelector from './SmartBudgeting/FacilitiesSelector';
import PredictionResult from './SmartBudgeting/PredictionResult';
import RecommendationsList from './SmartBudgeting/RecommendationsList';
import { facilityGroups } from './SmartBudgeting/data/facilityGroups';
import { MapPin, AlertCircle } from 'lucide-react';

function SmartBudgeting({ budgetParams, setBudgetParams, fullAddress }) {
  const [predictionResult, setPredictionResult] = useState(null);
  const [kostList, setKostList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const resultRef = useRef(null);

  const handleBudgetParamChange = (field, value) => {
    if (field === 'fasilitas') {
      setBudgetParams((prev) => {
        const newFasilitas = prev.fasilitas.includes(value) ? prev.fasilitas.filter((item) => item !== value) : [...prev.fasilitas, value];

        return {
          ...prev,
          fasilitas: newFasilitas,
        };
      });
    } else if (field === 'panjang' || field === 'lebar') {
      // Allow empty string when input is cleared
      if (value === '') {
        setBudgetParams((prev) => ({
          ...prev,
          [field]: '',
        }));
      } else {
        // Convert to number and ensure non-negative
        const numValue = Math.max(0, Number(value));
        setBudgetParams((prev) => ({
          ...prev,
          [field]: numValue,
        }));
      }
    } else {
      setBudgetParams((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const updateCoordinates = (lat, lon) => {
    setBudgetParams((prev) => ({
      ...prev,
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
    }));
  };

  const handleFacilityPreset = (presetName) => {
    switch (presetName) {
      case 'premium':
        setBudgetParams((prev) => ({
          ...prev,
          fasilitas: facilityGroups.Premium.slice(0, 7),
        }));
        break;
      case 'basic':
        setBudgetParams((prev) => ({
          ...prev,
          fasilitas: facilityGroups['Non-Premium'].slice(0, 7),
        }));
        break;
      case 'clear':
        setBudgetParams((prev) => ({
          ...prev,
          fasilitas: [],
        }));
        break;
      default:
        break;
    }
  };

  const predictPrice = async () => {
    try {
      setIsLoading(true);
      setErrorMsg('');

      const response = await fetch('https://ggnt.mapid.co.id/api/predict/price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budgetParams),
      });

      const result = await response.json();
      console.log('Prediction result:', result);
      setPredictionResult(result);

      if (result.id && result.id.length > 0) {
        fetchRecommendedKosts(result.id);
      }
    } catch (error) {
      console.error('Failed to predict price:', error);
      setErrorMsg('Prediction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendedKosts = async (ids) => {
    try {
      const kostDetails = [];

      for (const id of ids) {
        const response = await fetch(`https://ggnt.mapid.co.id/api/kost/${id}`);
        const data = await response.json();
        if (data) {
          kostDetails.push(data);
        }
      }

      setKostList(kostDetails);
    } catch (error) {
      console.error('Failed to fetch kost details:', error);
    }
  };

  useEffect(() => {
    if (predictionResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [predictionResult]);

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial="hidden" animate="visible" variants={formVariants} className="bg-white rounded-lg p-6 shadow-lg mb-6">
        <motion.h4 variants={itemVariants} className="mb-4 font-bold text-lg text-[#2C3E50]">
          Input Parameters
        </motion.h4>

        <motion.div variants={itemVariants} className="bg-blue-50 text-blue-700 text-sm rounded-md p-3 mb-4 flex items-center w-full border-l-4 border-blue-500">
          <span className="mr-2">📍</span>
          <span>Click a point on the map to change location or enter an address below</span>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AddressInput updateCoordinates={updateCoordinates} setErrorMsg={setErrorMsg} />
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">Latitude</label>
            <input type="number" step="0.000001" className="border rounded-md p-3 w-full text-sm bg-gray-50 cursor-not-allowed" value={budgetParams.latitude} readOnly />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">Longitude</label>
            <input type="number" step="0.000001" className="border rounded-md p-3 w-full text-sm bg-gray-50 cursor-not-allowed" value={budgetParams.longitude} readOnly />
          </div>
        </motion.div>

        {fullAddress && (
          <motion.div variants={itemVariants} className="flex items-center mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <MapPin size={18} className="inline-block mr-2 text-[#2C3E50]" />
            <p className="text-gray-700 text-sm">{fullAddress}</p>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="mb-4">
          <RoomDimensionsInput panjang={budgetParams.panjang} lebar={budgetParams.lebar} onChange={handleBudgetParamChange} />
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6">
          <FacilitiesSelector selectedFacilities={budgetParams.fasilitas} onFacilityChange={handleBudgetParamChange} onFacilityPreset={handleFacilityPreset} />
        </motion.div>

        <motion.button
          onClick={predictPrice}
          disabled={isLoading}
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
          className="w-full bg-[#2C3E50] text-white py-3 rounded-md hover:bg-[#1F2A36] transition text-sm font-medium flex justify-center items-center shadow-md"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : null}
          {isLoading ? 'Processing...' : 'Predict Price'}
        </motion.button>

        {errorMsg && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-600 rounded-md p-3 mt-4 flex items-start">
            <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{errorMsg}</span>
          </motion.div>
        )}
      </motion.div>

      {predictionResult && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} ref={resultRef}>
          <PredictionResult prediksi_harga={predictionResult.prediksi_harga} />
        </motion.div>
      )}

      <AnimatePresence>
        {kostList.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <RecommendationsList kostList={kostList} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SmartBudgeting;

SmartBudgeting.propTypes = {
  budgetParams: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    panjang: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    lebar: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    fasilitas: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  setBudgetParams: PropTypes.func.isRequired,
  fullAddress: PropTypes.string,
};
