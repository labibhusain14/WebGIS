import { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, X } from 'lucide-react';
import PropTypes from 'prop-types';
function SmartBudgeting({ budgetParams, setBudgetParams, kecamatan }) {
  const [predictionResult, setPredictionResult] = useState(null);
  const [kostList, setKostList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openFacilityGroup, setOpenFacilityGroup] = useState(null);

  const facilityGroups = {
    Premium: ['ac', 'air panas', 'cermin', 'kamar mandi dalam', 'kloset duduk', 'kulkas', 'kursi', 'meja', 'parkir mobil', 'shower', 'tv'],
    'Non-Premium': ['bak mandi', 'ember mandi', 'jemuran', 'kamar mandi luar', 'kloset jongkok', 'locker', 'microwave', 'parkir motor', 'rice cooker', 'taman', 'termasuk listrik'],
    Netral: [
      'bantal',
      'bathtub',
      'cctv',
      'cleaning service',
      'dapur',
      'dispenser',
      'guling',
      'kartu akses',
      'kasur',
      'kipas angin',
      'laundry',
      'lemari baju',
      'meja makan',
      'mushola',
      'parkir sepeda',
      'penjaga kos',
      'ruang santai',
      'sofa',
      'wastafel',
      'wifi',
    ],
    'Kamar Mandi': ['shower', 'kloset duduk', 'bathtub', 'wastafel', 'bak mandi', 'ember mandi', 'kloset jongkok', 'kamar mandi dalam', 'kamar mandi luar'],
    Keamanan: ['cctv', 'kartu akses', 'penjaga kos'],
    'Fasilitas Bersama': ['ruang santai', 'dapur', 'mushola', 'taman', 'jemuran', 'laundry'],
    Parkir: ['parkir mobil', 'parkir motor', 'parkir sepeda'],
    Elektronik: ['ac', 'tv', 'kulkas', 'dispenser', 'rice cooker', 'microwave', 'kipas angin'],
    Utilitas: ['wifi', 'termasuk listrik', 'cleaning service'],
  };

  // Handle changes in budgeting parameters
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
          [field]: '', // or null, depending on your preference
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

  const predictPrice = async () => {
    try {
      setIsLoading(true);

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
  const resultRef = useRef(null);

  useEffect(() => {
    if (predictionResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [predictionResult]);
  const [errorMsg, setErrorMsg] = useState('');

  return (
    <div>
      {/* Parameter Input Form */}
      <div className="bg-white rounded-lg p-4 shadow-md mb-4">
        <h4 className="mb-3 font-semibold">Input Parameters</h4>

        <div className="bg-gray-100 text-gray-700 text-xs rounded-md p-2 mb-2 flex items-center w-full">
          <span className="mr-2">📍</span>
          <span>Klik titik di map untuk mengganti lokasi</span>
        </div>

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

        <div>
          {/* Kecamatan Display */}
          {kecamatan && (
            <div className="flex items-center mb-2">
              <MapPin size={18} className="inline-block mr-1" />
              <p className="block text-gray-600 mb-1 text-xs">{kecamatan}</p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-gray-600 mb-1 text-xs">Panjang (m)</label>
            <input type="number" className="border rounded-md p-2 w-full text-xs" value={budgetParams.panjang} onChange={(e) => handleBudgetParamChange('panjang', e.target.value)} />
          </div>
          <div>
            <label className="block text-gray-600 mb-1 text-xs">Lebar (m)</label>
            <input type="number" className="border rounded-md p-2 w-full text-xs" value={budgetParams.lebar} onChange={(e) => handleBudgetParamChange('lebar', e.target.value)} />
          </div>
        </div>

        {/* Facilities Selection */}
        <div className="mb-3">
          <label className="block text-gray-600 mb-1 text-xs font-semibold">Fasilitas</label>

          <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
            {Object.entries(facilityGroups).map(([groupName, facilities]) => (
              <div key={groupName} className="mb-2">
                <div className="flex items-center justify-between bg-gray-100 p-1 rounded cursor-pointer" onClick={() => setOpenFacilityGroup(openFacilityGroup === groupName ? null : groupName)}>
                  <span className="text-xs font-medium">{groupName}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${openFacilityGroup === groupName ? 'rotate-180' : 'rotate-0'}`} />
                </div>

                {openFacilityGroup === groupName && (
                  <div className="pl-2 mt-1 grid grid-cols-2 gap-x-2 gap-y-1">
                    {facilities.map((facility) => (
                      <label key={facility} className="flex items-center text-xs">
                        <input type="checkbox" className="mr-1" checked={budgetParams.fasilitas.includes(facility)} onChange={() => handleBudgetParamChange('fasilitas', facility)} />
                        {facility}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Fasilitas terpilih:</p>
            <div className="flex flex-wrap gap-1">
              {budgetParams.fasilitas.map((facility) => (
                <span key={facility} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                  {facility}
                  <X
                    size={12}
                    className="ml-1 cursor-pointer"
                    onClick={() => {
                      setBudgetParams((prev) => ({
                        ...prev,
                        fasilitas: prev.fasilitas.filter((f) => f !== facility),
                      }));
                    }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          <button
            onClick={() =>
              setBudgetParams((prev) => ({
                ...prev,
                fasilitas: facilityGroups.Premium.slice(0, 5),
              }))
            }
            className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-lg"
          >
            Set Premium
          </button>
          <button
            onClick={() =>
              setBudgetParams((prev) => ({
                ...prev,
                fasilitas: facilityGroups['Non-Premium'].slice(0, 5),
              }))
            }
            className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg"
          >
            Set Basic
          </button>
          <button
            onClick={() =>
              setBudgetParams((prev) => ({
                ...prev,
                fasilitas: [],
              }))
            }
            className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded-lg"
          >
            Clear All
          </button>
        </div>

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
      {/* Result */}
      {/* Smart Budgeting Interface */}
      {predictionResult && (
        <div ref={resultRef} className="bg-white shadow-md rounded-xl flex items-center w-full mb-4">
          <div className="shadow-md py-12 px-1 bg-green-400 rounded-l-md"></div>
          <div className="ml-3 mb-2">
            <p className="text-[#999696] text-sm font-bold mb-4">Estimated Budget</p>
            <p className="text-2xl font-bold text-gray-900">
              Rp
              {predictionResult.prediksi_harga.toLocaleString('id-ID')} <span className="text-gray-500 text-2xl font-normal">/bulan</span>
            </p>
          </div>
        </div>
      )}
      {/* Recommendations */}
      {kostList.length > 0 && (
        <>
          <h4 className="my-4 font-semibold">Recommendations</h4>
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {kostList.map((kost, index) => (
              <div key={index} className="min-w-[160px] bg-white shadow-md rounded-lg p-2 flex flex-col min-h-[220px]">
                <div className="h-20 w-full bg-gray-200 rounded-md flex items-center justify-center">
                  {kost.data.gambar_kost && kost.data.gambar_kost.length > 0 ? (
                    <img src={kost.data.gambar_kost[0].url_gambar} alt={kost.data.nama_kost} className="h-20 w-full object-cover rounded-md" />
                  ) : (
                    <span className="text-xs text-gray-500">No Image</span>
                  )}
                </div>
                <p className="mt-2 text-sm font-semibold">{kost.data.nama_kost}</p>
                <p className="text-sm text-gray-500">
                  Rp
                  {Number(kost.data.harga_sewa).toLocaleString('id-ID')}
                  /bulan
                </p>
                <button onClick={() => (window.location.href = `/detail/${kost.data.id_kost}`)} className="mt-auto w-full text-xs bg-[#2C3E50] hover:bg-[#1F2A36] text-white px-2 py-1 rounded-md">
                  Detail
                </button>
              </div>
            ))}
          </div>
        </>
      )}
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
  kecamatan: PropTypes.string,
};
