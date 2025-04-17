import { useEffect, useState } from "react";
import { Wifi, ShowerHead, Bike, BedDouble, Heart, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

// mapping nama fasilitas → icon lucide (sesuai yang kamu punya)
const fasilitasIcons = {
  WiFi: Wifi,
  Shower: ShowerHead,
  "Parkir Sepeda": Bike,
  Kasur: BedDouble,
  // tambahkan sesuai kebutuhan
};

function CardKost() {
  const [kostList, setKostList] = useState([]);
  const [likedItems, setLikedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://108.137.152.236/kost/")
      .then((res) => res.json())
      .then((data) => {
        setKostList(data.data);
        setLikedItems(Array(data.data.length).fill(false));
      })
      .catch((err) => console.error("Error fetching kost data:", err));
  }, []);

  const toggleLike = (index) => {
    setLikedItems((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleCardClick = (index) => {
    navigate(`/detail/${kostList[index].id_kost}`);
    console.log(`Card ${index} clicked!`);
  };

  return (
    <div className="w-[98%] my-5 flex flex-wrap gap-4 justify-center">
      {kostList.map((kost, index) => (
        <div
          key={kost.id_kost}
          onClick={() => handleCardClick(index)}
          className="bg-white rounded-2xl shadow-md cursor-pointer w-[45%] overflow-hidden"
        >
          <img
            src={
              kost.gambar_kost.length > 0
                ? kost.gambar_kost[0]
                : "src/assets/preview-2.jpg"
            }
            alt={kost.nama_kost}
            className="w-full h-[150px] object-cover"
          />
          <div className="p-3">
            <div className="flex justify-between items-start">
              <div className="font-semibold text-sm line-clamp-2">
                {kost.nama_kost}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(index);
                }}
                className="mt-[2px] ml-1" // geser dikit ke atas
              >
                <Heart
                  className={`w-5 h-5 transition-all ${
                    likedItems[index]
                      ? "text-red-500 fill-red-500"
                      : "text-gray-400"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="w-3 h-3 text-gray-500 mr-1" />
              {kost.alamat}
            </div>
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              {kost.fasilitas
                .filter((f) => fasilitasIcons[f.nama_fasilitas])
                .map((f, idx) => {
                  const Icon = fasilitasIcons[f.nama_fasilitas];
                  return (
                    <Icon
                      key={idx}
                      className="w-4 h-4"
                      title={f.nama_fasilitas}
                    />
                  );
                })}
            </div>
            <div className="text-xs mt-1 flex">
              <div className="font-semibold">
                Rp{parseInt(kost.harga_sewa).toLocaleString("id-ID")}
              </div>
              <span className="ml-1"> /bulan</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CardKost;
