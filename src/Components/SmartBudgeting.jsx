// SmartBudgeting.jsx
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import AddressInput from './SmartBudgeting/AddressInput';
import RoomDimensionsInput from './SmartBudgeting/RoomDimensionsInput';
import FacilitiesSelector from './SmartBudgeting/FacilitiesSelector';
import PredictionResult from './SmartBudgeting/PredictionResult';
import RecommendationsList from './SmartBudgeting/RecommendationsList';
import { facilityGroups } from './SmartBudgeting/data/facilityGroups';
import { MapPin } from 'lucide-react';

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

  return (
    <div>
      {/* Parameter Input Form */}
      <div className="bg-white rounded-lg p-4 shadow-md mb-4">
        <h4 className="mb-3 font-semibold">Input Parameters</h4>

        <div className="bg-gray-100 text-gray-700 text-xs rounded-md p-2 mb-2 flex items-center w-full">
          <span className="mr-2">📍</span>
          <span>Klik titik di map untuk mengganti lokasi atau masukkan alamat di bawah</span>
        </div>

        <AddressInput updateCoordinates={updateCoordinates} setErrorMsg={setErrorMsg} />

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-gray-600 mb-1 text-xs">Latitude</label>
            <input type="number" step="0.000001" className="border rounded-md p-2 w-full text-xs bg-gray-100 cursor-not-allowed" value={budgetParams.latitude} readOnly />
          </div>
          <div>
            <label className="block text-gray-600 mb-1 text-xs">Longitude</label>
            <input type="number" step="0.000001" className="border rounded-md p-2 w-full text-xs bg-gray-100 cursor-not-allowed" value={budgetParams.longitude} readOnly />
          </div>
        </div>

        {fullAddress && (
          <div className="flex items-center mb-2">
            <MapPin size={18} className="inline-block mr-1" />
            <p className="block text-gray-600 mb-1 text-xs">{fullAddress}</p>
          </div>
        )}

        <RoomDimensionsInput panjang={budgetParams.panjang} lebar={budgetParams.lebar} onChange={handleBudgetParamChange} />

        <FacilitiesSelector selectedFacilities={budgetParams.fasilitas} onFacilityChange={handleBudgetParamChange} onFacilityPreset={handleFacilityPreset} />

        <button onClick={predictPrice} disabled={isLoading} className="w-full bg-[#2C3E50] text-white py-2 rounded-md hover:bg-[#1F2A36] transition text-sm flex justify-center items-center">
          {isLoading ? (
            <svg className="animate-spin h-4 w-4 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : null}
          {isLoading ? 'Processing...' : 'Predict Price'}
        </button>

        {errorMsg && <div className="text-red-500 text-xs mt-2 text-center">{errorMsg}</div>}
      </div>

      {predictionResult && <PredictionResult resultRef={resultRef} prediksi_harga={predictionResult.prediksi_harga} />}

      {kostList.length > 0 && <RecommendationsList kostList={kostList} />}
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
