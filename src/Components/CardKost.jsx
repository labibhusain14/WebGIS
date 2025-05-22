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
  const [toast, setToast] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedKost, setSelectedKost] = useState({
    index: null,
    kostId: null,
  });
  const navigate = useNavigate();

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    const fetchLikedItems = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser?.id_user;
      if (!userId) return;

      try {
        const res = await fetch(
          `https://ggnt.mapid.co.id/api/favorites/user/${userId}`
        );
        const data = await res.json();
        if (data && data.data) {
          const likedKostIds = data.data.map((fav) => fav.id_kost);
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

    const isLiked = likedItems[index];

    if (isLiked) {
      setSelectedKost({ index, kostId });
      setShowConfirmModal(true);
    } else {
      try {
        const response = await fetch(
          "https://ggnt.mapid.co.id/api/favorites/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_kost: kostId, id_user: userId }),
          }
        );

        if (!response.ok) throw new Error("Gagal menambahkan favorit");

        setLikedItems((prev) => {
          const updated = [...prev];
          updated[index] = true;
          return updated;
        });

        showToast("Berhasil ditambahkan ke favorit");
      } catch (error) {
        console.error("Error liking kost:", error);
        showToast("❌ Gagal menambahkan ke favorit");
      }
    }
  };

  const confirmDislike = async () => {
    const { index, kostId } = selectedKost;
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const parsedUser = JSON.parse(storedUser);
    const userId = parsedUser?.id_user;
    if (!userId) return;

    try {
      const response = await fetch("https://ggnt.mapid.co.id/api/favorites/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_kost: kostId,
          id_user: userId,
        }),
      });
      if (!response.ok) throw new Error("Gagal menghapus favorit");

      setLikedItems((prev) => {
        const updated = [...prev];
        updated[index] = false;
        return updated;
      });

      showToast("🗑️ Kost dihapus dari favorit");
    } catch (error) {
      console.error("Error disliking kost:", error);
      showToast("❌ Gagal menghapus dari favorit");
    } finally {
      setShowConfirmModal(false);
      setSelectedKost({ index: null, kostId: null });
    }
  };

  const handleCardClick = (index) => {
    const kost = filteredKost[index].id_kost;
    focusOnKostMarker(kost);
  };

  return (
    <>
      {toast && (
        <div className="fixed bottom-4 animate-toastSlide bg-green-600 text-white px-6 py-3 rounded-md shadow-lg z-50">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{toast}</span>
            <button
              onClick={() => navigate("/favorites")}
              className="text-sm underline font-semibold hover:text-white/90"
            >
              Lihat Koleksi
            </button>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-[300px] text-center shadow-lg">
            <p className="text-sm text-gray-700 mb-4">
              Yakin ingin menghapus dari favorit?
            </p>
            <div className="flex justify-center gap-3">
              <button
                className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
                onClick={() => setShowConfirmModal(false)}
              >
                Batal
              </button>
              <button
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                onClick={confirmDislike}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        id="kost"
        className="w-[98%] my-5 flex flex-wrap gap-4 justify-center"
      >
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
                  className="mt-[2px] ml-1"
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
                {Object.entries(iconKategori).map(
                  ([kategori, listFasilitas]) => {
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
                  }
                )}
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
    </>
  );
}

CardKost.propTypes = {
  filteredKost: PropTypes.array,
  focusOnKostMarker: PropTypes.func,
};

export default CardKost;
