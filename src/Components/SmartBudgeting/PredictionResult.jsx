// SmartBudgeting/PredictionResult.jsx
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { BadgePercent } from "lucide-react";

function PredictionResult({ resultRef, prediksi_harga }) {
  return (
    <motion.div
      ref={resultRef}
      className="bg-[#0F172A] text-white shadow-md rounded-xl flex items-center px-4 py-3 mx-4 mb-4 max-w-full w-auto"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Icon */}
      <div className="flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 rounded-full p-2 shrink-0">
        <BadgePercent className="w-5 h-5" />
      </div>

      {/* Text */}
      <div className="ml-3 flex flex-col overflow-hidden">
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-300 uppercase tracking-wide">
          Estimated Budget
        </p>
        <p className="text-3xl font-bold text-blue-900 dark:text-white leading-snug truncate">
          Rp {prediksi_harga.toLocaleString("id-ID")}
          <span className="text-base font-medium text-blue-700 dark:text-blue-300 ml-1">
            /bulan
          </span>
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
