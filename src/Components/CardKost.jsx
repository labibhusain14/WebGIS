import { useState, useEffect } from "react";
import { BedDouble, Heart, MapPin, FanIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  FaParking,
  FaTv,
  FaDoorOpen,
  FaDoorClosed,
  FaWifi,
} from "react-icons/fa";
import { TbAirConditioning } from "react-icons/tb";
import { BiCabinet } from "react-icons/bi";
import { GiElectric } from "react-icons/gi";
import PropTypes from "prop-types";
// mapping nama fasilitas → icon lucide (sesuai yang kamu punya)
const fasilitasIcons = {
  "K. Mandi Dalam": FaDoorClosed,
  "K. Mandi Luar": FaDoorOpen,
  "Parkir Motor": FaParking,
  "Parkir Mobil": FaParking,
  "Parkir Sepeda": FaParking,
  "Parkir Motor & Sepeda": FaParking,
  Kasur: BedDouble,
  "Lemari Baju": BiCabinet,
  "Kipas Angin": FanIcon,
  AC: TbAirConditioning,
  TV: FaTv,
  "TV Kabel": FaTv,
  WiFi: FaWifi,
  "Termasuk listrik": GiElectric,
};

const iconKategori = {
  mandi: ["K. Mandi Dalam", "K. Mandi Luar"],
  parkir: [
    "Parkir Motor",
    "Parkir Mobil",
    "Parkir Sepeda",
    "Parkir Motor & Sepeda",
  ],
  kasur: ["Kasur"],
  lemari: ["Lemari Baju"],
  kipas: ["Kipas Angin"],
  ac: ["AC"],
  tv: ["TV", "TV Kabel"],
  wifi: ["WiFi"],
  listrik: ["Termasuk listrik"],
};
function CardKost({ filteredKost, focusOnKostMarker }) {
  const [likedItems, setLikedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedItems = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser?.id_user;

      if (!userId) return;

      try {
        const res = await fetch(`https://ggnt.mapid.co.id/api/favorites/user/${userId}`);
        const data = await res.json();
        if(data && data.data){
          const likedKostIds = data.data.map((fav) => fav.id_kost);

          // Build a boolean array matching filteredKost
          const newLikedItems = filteredKost.map((kost) =>
            likedKostIds.includes(kost.id_kost)
          );

          setLikedItems(newLikedItems);
        }
      } catch (err) {
        console.error("Failed to fetch liked items:", err);
      }
    };

    if (filteredKost.length > 0) {
      fetchLikedItems();
    }
  }, [filteredKost]);

  const toggleLike = async (index, kostId) => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    const userId = parsedUser?.id_user;

    if (!userId) return;

    try {
      const response = await fetch("https://ggnt.mapid.co.id/api/favorites/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_kost: kostId,
          id_user: userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to like kost");
      }

      // Toggle UI like state
      setLikedItems((prev) => {
        const updated = [...prev];
        updated[index] = !updated[index];
        return updated;
      });
    } catch (error) {
      console.error("Error liking kost:", error);
      alert("Failed to like kost. Please try again.");
    }
  };


  const handleCardClick = (index) => {
    // navigate(`/detail/${filteredKost[index].id_kost}`);
    // console.log(`Card ${index} clicked!`);
    const kost = filteredKost[index].id_kost;
    focusOnKostMarker(kost); // panggil di sini
  };

  return (
    <div className="w-[98%] my-5 flex flex-wrap gap-4 justify-center">
      {filteredKost.map((kost, index) => (
        <div
          key={kost.id_kost}
          onClick={() => handleCardClick(index)}
          className="bg-white rounded-2xl shadow-md cursor-pointer w-[45%] overflow-hidden"
        >
          <img
            src={
              kost.gambar_kost.length > 0
                ? kost.gambar_kost[0].url_gambar
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
                  toggleLike(index, kost.id_kost);
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
              {Object.entries(iconKategori).map(([kategori, listFasilitas]) => {
                const fasilitasTerpakai = listFasilitas.find((nama) =>
                  kost.fasilitas.some((f) => f.nama_fasilitas === nama)
                );

                if (!fasilitasTerpakai) return null;

                const Icon = fasilitasIcons[fasilitasTerpakai];

                return (
                  <Icon
                    key={kategori}
                    className="w-4 h-4"
                    title={fasilitasTerpakai}
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
CardKost.propTypes = {
  filteredKost: PropTypes.array,
};

export default CardKost;
