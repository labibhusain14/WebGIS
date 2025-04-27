// SmartBudgeting/PredictionResult.jsx
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

function PredictionResult({ resultRef, prediksi_harga }) {
  return (
    <motion.div
      ref={resultRef}
      className="bg-gradient-to-br from-blue-300 to-blue-400 shadow-lg rounded-2xl flex items-center w-full p-5 mb-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="w-2 rounded-l-2xl bg-gradient-to-b from-green-400 to-green-500 h-full" />

      <div className="ml-4 flex flex-col">
        <p className="text-blue-800 text-sm font-semibold mb-2 uppercase tracking-wide">Estimated Budget</p>
        <p className="text-3xl font-extrabold text-blue-900 leading-tight">
          Rp {prediksi_harga.toLocaleString('id-ID')}
          <span className="text-lg font-medium text-blue-700 ml-1">/bulan</span>
        </p>
      </div>
    </motion.div>
  );
}

PredictionResult.propTypes = {
  resultRef: PropTypes.object.isRequired,
  prediksi_harga: PropTypes.number.isRequired,
};

export default PredictionResult;
