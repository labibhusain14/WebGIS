// SmartBudgeting/RecommendationsList.jsx
import PropTypes from 'prop-types';

function RecommendationsList({ kostList }) {
  return (
    <div className="pl-4">
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
    </div>
  );
}

RecommendationsList.propTypes = {
  kostList: PropTypes.array.isRequired,
};

export default RecommendationsList;
