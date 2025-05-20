import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BedDouble, FanIcon, MapPin, Heart } from "lucide-react";
import {
  FiGrid,
  FiList,
  FiSearch,
  FiMapPin,
  FiMap,
  FiMaximize2,
  FiHome,
  FiChevronDown,
} from "react-icons/fi";
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
import Empty from "../assets/Empty.png";
const kostImage =
  "https://media.coveliving.io/36232/conversions/IMG_3246-small.jpg";

const kosts = [
  {
    id: 1,
    name: "Kost Mewah A Kost Mewah A Kost Mewah A Kost Mewah A",
    price: 1200000,
    luas: "4x5 m",
    tipe: "Putri",
    lokasi: "Bandung",
    fasilitas: ["WiFi", "AC", "K. Mandi Dalam"],
  },
  {
    id: 2,
    name: "Kost Nyaman B",
    price: 950000,
    luas: "3x4 m",
    tipe: "Campur",
    lokasi: "Jakarta",
    fasilitas: ["WiFi", "Parkir Motor"],
  },
  {
    id: 3,
    name: "Kost Nyaman B",
    price: 950000,
    luas: "3x4 m",
    tipe: "Campur",
    lokasi: "Jakarta",
    fasilitas: ["WiFi", "Parkir Motor", "Parkir Mobil"],
  },
  {
    id: 4,
    name: "Kost Nyaman B",
    price: 950000,
    luas: "3x4 m",
    tipe: "Campur",
    lokasi: "Jakarta",
    fasilitas: ["WiFi", "Parkir Motor"],
  },
];
const cities = [
  { label: "Semua Wilayah", value: "semua" },
  { label: "Andir", value: "Andir" },
  { label: "Antapani", value: "Antapani" },
  { label: "Baleendah", value: "Baleendah" },
  { label: "Bandung", value: "Bandung" },
  { label: "Bandung Kidul", value: "Bandung Kidul" },
  { label: "Bandung Wetan", value: "Bandung Wetan" },
  { label: "Batununggal", value: "Batununggal" },
  { label: "Bojongloa Kaler", value: "Bojongloa Kaler" },
  { label: "Bojongsoang", value: "Bojongsoang" },
  { label: "Buahbatu", value: "Buahbatu" },
  { label: "Cibeunying Kaler", value: "Cibeunying Kaler" },
  { label: "Cibeunying Kidul", value: "Cibeunying Kidul" },
  { label: "Cibiru", value: "Cibiru" },
  { label: "Cicendo", value: "Cicendo" },
  { label: "Cidadap", value: "Cidadap" },
  { label: "Cilengkrang", value: "Cilengkrang" },
  { label: "Cileunyi", value: "Cileunyi" },
  { label: "Cimahi Selatan", value: "Cimahi Selatan" },
  { label: "Cimahi Tengah", value: "Cimahi Tengah" },
  { label: "Cimahi Utara", value: "Cimahi Utara" },
  { label: "Cimenyan", value: "Cimenyan" },
  { label: "Cinambo", value: "Cinambo" },
  { label: "Coblong", value: "Coblong" },
  { label: "Dayeuhkolot", value: "Dayeuhkolot" },
  { label: "Gedebage", value: "Gedebage" },
  { label: "Kiaracondong", value: "Kiaracondong" },
  { label: "Lembang", value: "Lembang" },
  { label: "Lengkong", value: "Lengkong" },
  { label: "Mandalajati", value: "Mandalajati" },
  { label: "Ngamprah", value: "Ngamprah" },
  { label: "Padalarang", value: "Padalarang" },
  { label: "Panyileukan", value: "Panyileukan" },
  { label: "Parongpong", value: "Parongpong" },
  { label: "Sukajadi", value: "Sukajadi" },
  { label: "Sukasari", value: "Sukasari" },
  { label: "Sumur Bandung", value: "Sumur Bandung" },
  { label: "Ujung Berung", value: "Ujung Berung" },
];

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
const FavoriteKosts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCity, setSelectedCity] = useState("semua");
  const [isOpen, setIsOpen] = useState(false);
  const [favoritIds, setFavoritIds] = useState([]);

  const selectedLabel = cities.find((c) => c.value === selectedCity)?.label;
  const goBack = () => navigate(-1);

  const filteredKosts = kosts.filter((kost) =>
    kost.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const toggleFavorit = (kostId) => {
    setFavoritIds((prev) =>
      prev.includes(kostId)
        ? prev.filter((id) => id !== kostId)
        : [...prev, kostId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-100 py-10">
      <div className="container mx-auto max-w-7xl px-4">
        <button
          onClick={goBack}
          className="flex items-center text-gray-600 hover:text-blue-600 transition duration-200 mb-6 bg-white px-4 py-2 rounded-lg shadow-sm"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </button>
        <div className="bg-white rounded-lg overflow-hidden shadow-lg px-6 py-8">
          <div className="flex flex-col gap-4 mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Kost Favoritmu</h2>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-3 md:gap-x-4">
              {/* Box Lokasi */}
              <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-3 border border-gray-200 w-full md:w-[30%]">
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    Bandung
                  </div>
                  <div className="text-xs text-gray-500">
                    Jawa Barat, Indonesia
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-xs text-blue-600 font-medium px-3 py-1 rounded-full">
                    {filteredKosts.length} Kost
                  </span>
                </div>
              </div>

              {/* Filter + Search + View Mode */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:justify-end">
                {/* Search */}
                <div className="flex items-center w-full md:w-64 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
                  <FiSearch className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Cari kost favorit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full outline-none text-sm text-gray-700"
                  />
                </div>

                {/* Dropdown Wilayah */}
                <div className="relative w-full md:w-48">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm text-sm text-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-gray-500" />
                      <span>{selectedLabel}</span>
                    </div>
                    <FiChevronDown
                      className={`text-gray-500 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <ul className="absolute z-10 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
                      {cities.map((city) => (
                        <li
                          key={city.value}
                          onClick={() => {
                            setSelectedCity(city.value);
                            setIsOpen(false);
                          }}
                          className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 ${
                            city.value === selectedCity
                              ? "bg-blue-100 font-semibold text-blue-600"
                              : ""
                          }`}
                        >
                          {city.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Tombol View Mode */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    className={`p-2 rounded-md ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 border"
                    }`}
                    onClick={() => setViewMode("grid")}
                  >
                    <FiGrid size={18} />
                  </button>
                  <button
                    className={`p-2 rounded-md ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 border"
                    }`}
                    onClick={() => setViewMode("list")}
                  >
                    <FiList size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`${
              viewMode === "grid"
                ? "grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                : "space-y-6"
            }`}
          >
            {filteredKosts.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center text-center py-16">
                <img
                  src={Empty}
                  alt="Empty"
                  className="w-40 h-40 mb-4 opacity-80"
                />
                <h2 className="text-lg text-gray-600 font-medium">
                  Kost tidak ditemukan
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Coba ubah kata kunci atau filter pencarian.
                </p>
              </div>
            ) : (
              filteredKosts.map((kost) => (
                <div
                  key={kost.id}
                  className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden ${
                    viewMode === "list" ? "flex flex-col sm:flex-row" : ""
                  }`}
                >
                  <div
                    className={`relative ${
                      viewMode === "list" ? "sm:w-1/3" : ""
                    }`}
                  >
                    <img
                      src={kostImage}
                      alt={kost.name}
                      className={`object-cover w-full ${
                        viewMode === "list" ? "h-full max-h-48" : "h-48"
                      }`}
                    />
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => toggleFavorit(kost.id)}
                        className="bg-white rounded-full p-2 shadow-md hover:bg-blue-50 transition"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favoritIds.includes(kost.id)
                              ? "text-blue-500 fill-blue-500"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  <div
                    className={`relative p-4 flex flex-col gap-2 justify-between ${
                      viewMode === "list" ? "sm:w-2/3" : "h-auto"
                    }`}
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {kost.name}
                      </h3>

                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <MapPin className="text-blue-500 h-4 w-4" />
                        {kost.lokasi}
                      </div>
                      {viewMode === "list" ? (
                        <>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-2">
                            <span className="flex items-center gap-1">
                              <FiMaximize2 className="text-blue-500" />{" "}
                              {kost.luas}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiHome className="text-blue-500" /> {kost.tipe}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="text-blue-500 h-4 w-4 " />{" "}
                              {kost.lokasi}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs mt-2">
                            {Object.entries(iconKategori).map(
                              ([kategori, listFasilitas]) => {
                                const fasilitasTerpakai = listFasilitas.find(
                                  (nama) => kost.fasilitas.includes(nama)
                                );

                                if (!fasilitasTerpakai) return null;

                                const Icon = fasilitasIcons[fasilitasTerpakai];

                                return (
                                  <span
                                    key={kategori}
                                    className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200"
                                  >
                                    {Icon && (
                                      <Icon className="text-blue-500 text-sm" />
                                    )}{" "}
                                    {fasilitasTerpakai}
                                  </span>
                                );
                              }
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {Object.entries(iconKategori).map(
                            ([kategori, listFasilitas]) => {
                              const fasilitasTerpakai = listFasilitas.find(
                                (nama) => kost.fasilitas.includes(nama)
                              );

                              if (!fasilitasTerpakai) return null;

                              const Icon = fasilitasIcons[fasilitasTerpakai];

                              return (
                                <span
                                  key={kategori}
                                  className="p-2 bg-blue-50 rounded-full border border-blue-100"
                                >
                                  {Icon && (
                                    <Icon className="text-blue-500 text-sm" />
                                  )}
                                </span>
                              );
                            }
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-blue-500 text-xl font-bold">
                      Rp{kost.price.toLocaleString("id-ID")}
                      <span className="text-sm text-gray-500 font-semibold">
                        {" "}
                        / bulan
                      </span>
                    </p>
                    <button
                      className={`${
                        viewMode === "list"
                          ? "sm:absolute sm:bottom-4 sm:right-4 mt-4 sm:mt-0"
                          : "mt-auto"
                      } text-sm font-medium text-blue-600 border border-blue-600 rounded-xl px-4 py-2 hover:bg-blue-50 transition`}
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteKosts;
