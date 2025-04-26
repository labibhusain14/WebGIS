// SmartBudgeting/PredictionResult.jsx
import PropTypes from 'prop-types';

function PredictionResult({ resultRef, prediksi_harga }) {
  return (
    <div ref={resultRef} className="bg-white shadow-md rounded-xl flex items-center w-full mb-4">
      <div className="shadow-md py-12 px-1 bg-green-400 rounded-l-md"></div>
      <div className="ml-3 mb-2">
        <p className="text-[#999696] text-sm font-bold mb-4">Estimated Budget</p>
        <p className="text-2xl font-bold text-gray-900">
          Rp
          {prediksi_harga.toLocaleString('id-ID')} <span className="text-gray-500 text-2xl font-normal">/bulan</span>
        </p>
      </div>
    </div>
  );
}

PredictionResult.propTypes = {
  resultRef: PropTypes.object.isRequired,
  prediksi_harga: PropTypes.number.isRequired,
};

export default PredictionResult;
