// SmartBudgeting/RecommendationsList.jsx
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

function RecommendationsList({ kostList }) {
  return (
    <div className="pl-4">
      <h4 className="my-4 font-bold text-lg text-gray-700">Recommendations</h4>

      <div className="flex overflow-x-auto space-x-4 pb-2">
        {kostList.map((kost, index) => (
          <motion.div
            key={index}
            className="min-w-[180px] bg-white shadow-lg rounded-xl p-3 flex flex-col min-h-[240px] hover:scale-105 transition-transform"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="h-24 w-full bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              {kost.data.gambar_kost && kost.data.gambar_kost.length > 0 ? (
                <img src={kost.data.gambar_kost[0].url_gambar} alt={kost.data.nama_kost} className="h-full w-full object-cover rounded-lg" />
              ) : (
                <span className="text-xs text-gray-500">No Image</span>
              )}
            </div>

            <p className="mt-3 text-sm font-semibold text-gray-800 line-clamp-2">{kost.data.nama_kost}</p>
            <p className="text-xs text-gray-600 mt-1">
              Rp{Number(kost.data.harga_sewa).toLocaleString('id-ID')} <span className="text-gray-400">/bulan</span>
            </p>

            <button onClick={() => (window.location.href = `/detail/${kost.data.id_kost}`)} className="mt-auto w-full text-xs bg-[#2C3E50] hover:bg-[#1F2A36] text-white px-3 py-2 rounded-md font-medium transition-all">
              Detail
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

RecommendationsList.propTypes = {
  kostList: PropTypes.array.isRequired,
};

export default RecommendationsList;
