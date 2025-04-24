import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Crosshair,
  Menu,
  ChevronDown,
  Search,
  Bot,
  X,
  History,
  Wallet,
  MessageCircle,
  Send,
  Mic,
  MapPin,
  SortAsc,
  SortDesc,
} from "lucide-react";
import Navbar from "../Components/Navbar";
import CardKost from "../Components/CardKost";
import { useNavigate } from "react-router-dom";
// import Chatbot from "https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js";
// Chatbot.init({
//   chatflowid: "c5ed765f-cd94-4587-850c-4a5719c0506a",
//   apiHost: "http://localhost:3000",
// });
function Maps() {
  const MAP_SERVICE_KEY = import.meta.env.VITE_MAP_SERVICE_KEY;
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  // const [activeTab, setActiveTab] = useState("Beranda");
  const [userLocation, setUserLocation] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const filters = ["Price", "Facilities", "Type"];
  const [openDropdown, setOpenDropdown] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" atau "desc"

  const facilitiesOptions = [
    "Termasuk listrik",
    "Kasur",
    "Meja",
    "Lemari Baju",
    "K. Mandi Luar",
    "K. Mandi Dalam",
    "WiFi",
    "R. Jemur",
    "Dapur",
    "Parkir Motor",
    "Parkir Mobil",
    "Bantal",
    "Penjaga Kos",
    "CCTV",
    "Kulkas",
    "AC",
    "Jemuran",
    "Balcon",
    "Penjaga Kos",
    "TV",
  ];
  const typeOptions = ["Laki-laki", "Perempuan", "Campur"];
  const [isOpen, setIsOpen] = useState(false);
  const [activeAssistant, setActiveAssistant] = useState("assistant");

  const [kecamatan, setKecamatan] = useState("");

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [originalKostList, setOriginalKostList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [skip, setSkip] = useState(0);
  const [filteredKost, setFilteredKost] = useState([]);
  const markerList = useRef([]);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Smart Budgeting state
  const [budgetParams, setBudgetParams] = useState({
    panjang: 4,
    lebar: 4,
    fasilitas: ["Meja"],
  });

  const facilityGroups = {
    Premium: [
      "ac",
      "air panas",
      "cermin",
      "kamar mandi dalam",
      "kloset duduk",
      "kulkas",
      "kursi",
      "meja",
      "parkir mobil",
      "shower",
      "tv",
    ],
    "Non-Premium": [
      "bak mandi",
      "ember mandi",
      "jemuran",
      "kamar mandi luar",
      "kloset jongkok",
      "locker",
      "microwave",
      "parkir motor",
      "rice cooker",
      "taman",
      "termasuk listrik",
    ],
    Netral: [
      "bantal",
      "bathtub",
      "cctv",
      "cleaning service",
      "dapur",
      "dispenser",
      "guling",
      "kartu akses",
      "kasur",
      "kipas angin",
      "laundry",
      "lemari baju",
      "meja makan",
      "mushola",
      "parkir sepeda",
      "penjaga kos",
      "ruang santai",
      "sofa",
      "wastafel",
      "wifi",
    ],
    "Kamar Mandi": [
      "shower",
      "kloset duduk",
      "bathtub",
      "wastafel",
      "bak mandi",
      "ember mandi",
      "kloset jongkok",
      "kamar mandi dalam",
      "kamar mandi luar",
    ],
    Keamanan: ["cctv", "kartu akses", "penjaga kos"],
    "Fasilitas Bersama": [
      "ruang santai",
      "dapur",
      "mushola",
      "taman",
      "jemuran",
      "laundry",
    ],
    Parkir: ["parkir mobil", "parkir motor", "parkir sepeda"],
    Elektronik: [
      "ac",
      "tv",
      "kulkas",
      "dispenser",
      "rice cooker",
      "microwave",
      "kipas angin",
    ],
    Utilitas: ["wifi", "termasuk listrik", "cleaning service"],
  };

  const [openFacilityGroup, setOpenFacilityGroup] = useState(null);

  const [predictionResult, setPredictionResult] = useState(null);
  const [kostList, setKostList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });

        // Update budget parameters with user location
        setBudgetParams((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));

        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: `https://basemap.mapid.io/styles/street-new-generation/style.json?key=${MAP_SERVICE_KEY}`,
          center: [longitude, latitude],
          zoom: 15.5,
          pitch: 60,
        });

        // map.current.on("click", (e) => {
        //   const coordinates = e.lngLat;
        //   if (markerRef.current) {
        //     markerRef.current.setLngLat(coordinates);
        //   } else {
        //     markerRef.current = new maplibregl.Marker({
        //       color: "red",
        //       draggable: false,
        //     })
        //       .setLngLat(coordinates)
        //       .addTo(map.current);
        //   }
        //   const latitude = coordinates.lat;
        //   const longitude = coordinates.lng;

        //   setBudgetParams((prev) => ({
        //     ...prev,
        //     latitude,
        //     longitude,
        //   }));

        //   });

        map.current.on("click", async (e) => {
          const coordinates = e.lngLat;
          const latitude = coordinates.lat;
          const longitude = coordinates.lng;

          // Tambahkan marker
          if (markerRef.current) {
            markerRef.current.setLngLat(coordinates);
          } else {
            markerRef.current = new maplibregl.Marker({
              color: "red",
              draggable: false,
            })
              .setLngLat(coordinates)
              .addTo(map.current);
          }

          setBudgetParams((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const kecamatan =
              data.address.suburb ||
              data.address.village ||
              data.address.town ||
              data.address.city_district ||
              data.address.county;
            setKecamatan(kecamatan);
          } catch (err) {
            console.error("Gagal ambil nama kota:", err);
          }
        });

        map.current.on("load", () => {
          markerRef.current = new maplibregl.Marker({
            color: "red",
            draggable: false,
          })
            .setLngLat([longitude, latitude])
            .addTo(map.current);

          const nav = new maplibregl.NavigationControl({
            showCompass: true,
            showZoom: true,
            visualizePitch: true,
            visualizeRoll: true,
          });
          map.current.addControl(nav, "bottom-right");

          fetchDataKost();
        });
      },
      (error) => {
        console.error("Gagal mendapatkan lokasi pengguna:", error);
      }
    );

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [MAP_SERVICE_KEY]);

  const applyFiltersAndSearch = (list) => {
    const filtered = list.filter((kost) => {
      const matchSearch = kost.alamat
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchPrice =
        (!priceRange.min || kost.harga_sewa >= priceRange.min) &&
        (!priceRange.max || kost.harga_sewa <= priceRange.max);
      const matchFacilities =
        selectedFacilities.length === 0 ||
        selectedFacilities.every((fac) =>
          kost.fasilitas.some((f) => f.nama_fasilitas === fac)
        );
      const matchType =
        selectedType.length === 0 || selectedType.includes(kost.tipe_kost);
      return matchSearch && matchPrice && matchFacilities && matchType;
    });

    return filtered.sort((a, b) =>
      sortOrder === "asc"
        ? a.harga_sewa - b.harga_sewa
        : b.harga_sewa - a.harga_sewa
    );
  };

  const clearMarkers = () => {
    markerList.current.forEach((marker) => marker.remove());
    markerList.current = [];
  };
  const addMarkersToMap = (kostData) => {
    if (!map.current) return;
    clearMarkers();

    kostData.forEach((kost) => {
      if (kost.longitude && kost.latitude) {
        const popup = new maplibregl.Popup({
          offset: 25,
          className: "modern-popup",
          closeButton: false,
        }).setHTML(`
              <div class="p-4 bg-white rounded-xl shadow-lg min-w-[200px] font-sans">
                <h3 class="text-base font-semibold text-gray-900 mb-2">${
                  kost.nama_kost
                }</h3>
                <p class="text-sm text-gray-600 mb-3 leading-relaxed">${
                  kost.alamat
                }</p>
                <div class="text-sm font-medium text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg inline-block">
                  Rp${Number(kost.harga_sewa).toLocaleString()}
                </div>
                <button 
                  class="mt-2 text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
                  id="detail-btn-${kost.id_kost}"
                >
                  Lihat Detail
                </button>
              </div>`);

        const marker = new maplibregl.Marker({ color: "#8e44ad" })
          .setLngLat([kost.longitude, kost.latitude])
          .setPopup(popup)
          .addTo(map.current);

        popup.on("open", () => {
          const detailButton = document.getElementById(
            `detail-btn-${kost.id_kost}`
          );
          if (detailButton) {
            detailButton.addEventListener("click", () =>
              navigate(`/detail/${kost.id_kost}`)
            );
          }
        });

        markerList.current.push(marker);
      }
    });
  };
  const fetchDataKost = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);

    const queryParams = new URLSearchParams({
      skip: reset ? 0 : skip,
      limit: 20,
      fetch_all: false,
    });

    try {
      const res = await fetch(`http://108.137.152.236/kost/?${queryParams}`);
      const json = await res.json();
      const data = json.data;

      const newData = reset ? data : [...originalKostList, ...data];
      const filtered = applyFiltersAndSearch(newData);

      setOriginalKostList(newData);
      setFilteredKost(filtered);
      setSkip(reset ? 20 : skip + 20);
      setHasMore(data.length === 20);
      addMarkersToMap(filtered);
    } catch (err) {
      console.error("Gagal mengambil data kost:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = applyFiltersAndSearch(originalKostList);
    setFilteredKost(filtered);
    addMarkersToMap(filtered);
  }, [searchTerm, priceRange, selectedFacilities, selectedType, sortOrder]); // ← tambahkan sortOrder di sini

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleScroll = () => {
      if (
        sidebar.scrollTop + sidebar.clientHeight >=
        sidebar.scrollHeight - 100
      ) {
        fetchDataKost();
      }
    };

    sidebar.addEventListener("scroll", handleScroll);
    return () => sidebar.removeEventListener("scroll", handleScroll);
  }, [skip, loading, hasMore]);
  function formatMessageText(text) {
    // Tambahkan newline di akhir agar paragraf terakhir tetap diproses
    text = text.trim() + "\n\n";

    // Bold (**text**)
    let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Bullet list (* text)
    formatted = formatted.replace(/^\* (.*)$/gm, "<li>$1</li>");

    // Bungkus semua <li> jadi satu <ul> (jika ada)
    if (formatted.includes("<li>")) {
      formatted = formatted.replace(/(<li>.*?<\/li>)/gs, "<ul>$1</ul>");
    }

    // Pisah paragraf dan beri jarak (mb-3)
    formatted = formatted
      .split(/\n{2,}/)
      .map((p) => `<p class="mb-3">${p.trim().replace(/\n/g, "<br/>")}</p>`)
      .join("");

    return formatted;
  }
  const navigateToTarget = () => {
    if (!map.current || !userLocation) {
      console.warn("Map instance or user location is missing");
      return;
    }

    map.current.flyTo({
      center: [userLocation.longitude, userLocation.latitude],
      zoom: 16,
      speed: 1.5,
      curve: 1.2,
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const handleCheckboxChange = (category, value) => {
    if (category === "Facilities") {
      setSelectedFacilities((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    } else if (category === "Type") {
      setSelectedType((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }
  };

  const sendMessage = () => {
    if (input.trim() !== "") {
      const userMessage = { text: input, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");

      query({ question: input }).then(async (response) => {
        console.log(response);
        if (response) {
          const botReply = {
            text: response.text,
            sender: "bot",
          };
          setMessages((prevMessages) => [...prevMessages, botReply]);
        }
      });
    }
  };

  // Handle changes in budgeting parameters
  const handleBudgetParamChange = (field, value) => {
    if (field === "fasilitas") {
      setBudgetParams((prev) => {
        const newFasilitas = prev.fasilitas.includes(value)
          ? prev.fasilitas.filter((item) => item !== value)
          : [...prev.fasilitas, value];

        return {
          ...prev,
          fasilitas: newFasilitas,
        };
      });
    } else if (field === "panjang" || field === "lebar") {
      // Allow empty string when input is cleared
      if (value === "") {
        setBudgetParams((prev) => ({
          ...prev,
          [field]: "", // or null, depending on your preference
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

      const response = await fetch("http://108.137.152.236/predict/price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(budgetParams),
      });

      const result = await response.json();
      console.log("Prediction result:", result);
      setPredictionResult(result);

      if (result.id && result.id.length > 0) {
        fetchRecommendedKosts(result.id);
      }
    } catch (error) {
      console.error("Failed to predict price:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendedKosts = async (ids) => {
    try {
      const kostDetails = [];

      for (const id of ids) {
        const response = await fetch(`http://108.137.152.236/kost/${id}`);
        const data = await response.json();
        if (data) {
          kostDetails.push(data);
        }
      }

      setKostList(kostDetails);
    } catch (error) {
      console.error("Failed to fetch kost details:", error);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative h-screen">
      <Navbar />
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-[64px] h-[calc(100vh-61px)] w-[450px] bg-gray-200 shadow-md transition-all duration-700 ${
          isSidebarOpen ? "left-0" : "-translate-x-full"
        } flex flex-col items-center z-40 border-t border-gray-300 overflow-y-auto`}
      >
        <div className="flex justify-center bg-white m-5 rounded-lg p-2 shadow-md w-[80%]">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
          />
          <Search className="w-4 h-4 text-gray-500 mx-2" />
        </div>

        <div className="w-[98%]  flex flex-wrap justify-center">
          <div className="flex justify-between gap-2 ">
            {filters.map((label) => (
              <div key={label} className="relative">
                <button
                  onClick={() => toggleDropdown(label)}
                  className="flex items-center px-4 py-2 rounded-lg bg-white text-gray-800 shadow-md text-sm font-medium"
                >
                  {label}
                  <ChevronDown
                    className={`w-4 h-4 ml-2 transition-transform ${
                      openDropdown === label ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
                {openDropdown === label && (
                  <div
                    className={`absolute left-0 mt-2 ${
                      label === "Price" ? "w-80" : "w-40"
                    } bg-white shadow-lg rounded-lg p-3 text-sm z-10`}
                  >
                    {label === "Price" && (
                      <div className="space-y-2">
                        {/* Container untuk From & To */}
                        <div className="flex gap-6 w-72">
                          {/* From */}
                          <div className="flex flex-col w-1/2">
                            <label className="text-gray-600 mb-1">From</label>
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-700 font-medium">
                                Rp
                              </span>
                              <input
                                type="text"
                                className="border rounded-md p-2 mt-1 w-full pl-7"
                                placeholder="Min"
                                value={priceRange.min.toLocaleString("id-ID")}
                                onChange={(e) => {
                                  const rawValue = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  ); // Hapus non-digit
                                  setPriceRange({
                                    ...priceRange,
                                    min: Number(rawValue),
                                  });
                                }}
                              />
                            </div>
                          </div>

                          {/* To */}
                          <div className="flex flex-col w-1/2">
                            <label className="text-gray-600 mb-1">To</label>
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-700 font-medium">
                                Rp
                              </span>
                              <input
                                type="text"
                                className="border rounded-md p-2 mt-1 w-full pl-7"
                                placeholder="Max"
                                value={priceRange.max.toLocaleString("id-ID")}
                                onChange={(e) => {
                                  const rawValue = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  ); // Hapus non-digit
                                  setPriceRange({
                                    ...priceRange,
                                    max: Number(rawValue),
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {label === "Facilities" && (
                      <div className="space-y-2">
                        {facilitiesOptions.map((item) => (
                          <label
                            key={item}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={selectedFacilities.includes(item)}
                              onChange={() =>
                                handleCheckboxChange("Facilities", item)
                              }
                              className="w-4 h-4"
                            />
                            <span>{item}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {label === "Type" && (
                      <div className="space-y-2">
                        {typeOptions.map((item) => (
                          <label
                            key={item}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={selectedType.includes(item)}
                              onChange={() =>
                                handleCheckboxChange("Type", item)
                              }
                              className="w-4 h-4"
                            />
                            <span>{item}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div className="w-[90%] flex justify-end items-center">
              <button
                onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
                className="p-2 bg-white rounded-md shadow hover:bg-gray-100 transition"
                title={
                  sortOrder === "asc"
                    ? "Urutkan berdasarkan harga tertinggi"
                    : "Urutkan berdasarkan harga terendah"
                }
              >
                {sortOrder === "asc" ? (
                  <SortDesc className="w-5 h-5 text-gray-700" />
                ) : (
                  <SortAsc className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
        <CardKost filteredKost={filteredKost} />
      </div>
      <button
        onClick={toggleSidebar}
        className={`fixed top-[75px] transition-all duration-700 ${
          isSidebarOpen ? "left-[450px]" : "left-0"
        } bg-gray-800 text-white p-2 rounded-r-md z-10`}
      >
        <Menu className="w-5 h-5" />
      </button>
      {/* Tombol Navigate */}
      <button
        onClick={navigateToTarget}
        className="absolute bottom-[150px] right-2 z-10 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md border-none cursor-pointer"
      >
        <Crosshair className="w-4 h-4 text-gray-700" />
      </button>
      <div className="fixed bottom-6 right-6 flex flex-col items-end z-10">
        {isOpen && (
          <div className="w-[450px] h-[500px] bg-[#ECF0F1] shadow-lg rounded-lg flex flex-col fixed bottom-10 right-14 z-50 border border-gray-300">
            {/* Header */}
            <div className="flex justify-between items-center bg-[#2C3E50] text-white p-2 rounded-t-lg">
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-700">
                  <History size={18} />
                </button>
              </div>
              <div className="flex space-x-4 bg-gray-100 p-1 rounded-full mx-auto">
                <button
                  onClick={() => setActiveAssistant("budgeting")}
                  className={`px-4 py-2 text-xs font-bold rounded-full ${
                    activeAssistant === "budgeting"
                      ? "bg-[#2C3E50] text-white shadow-md"
                      : "text-gray-500"
                  }`}
                >
                  <Wallet size={16} className="inline-block mr-1" /> Smart
                  Budgeting
                </button>
                <button
                  onClick={() => setActiveAssistant("assistant")}
                  className={`px-4 py-2 text-xs font-bold rounded-full ${
                    activeAssistant === "assistant"
                      ? "bg-[#2C3E50] text-white shadow-md"
                      : "text-gray-500"
                  }`}
                >
                  <MessageCircle size={16} className="inline-block mr-1" />{" "}
                  Virtual Assistant
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-700"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-auto text-sm text-gray-700 flex flex-col space-y-2">
              {activeAssistant === "assistant" ? (
                <div className="flex flex-col space-y-3">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg max-w-sm whitespace-pre-line ${
                        msg.sender === "bot"
                          ? "bg-gray-200 self-start text-gray-900"
                          : "bg-[#2C3E50] text-white self-end"
                      }`}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatMessageText(msg.text),
                        }}
                      />{" "}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              ) : (
                <div>
                  {/* Smart Budgeting Interface */}
                  {predictionResult && (
                    <div className="bg-white shadow-md rounded-xl flex items-center w-full mb-4">
                      <div className="shadow-md py-12 px-1 bg-green-400 rounded-l-md"></div>
                      <div className="ml-3 mb-2">
                        <p className="text-[#999696] text-sm font-bold mb-4">
                          Estimated Budget
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          Rp
                          {predictionResult.prediksi_harga.toLocaleString(
                            "id-ID"
                          )}{" "}
                          <span className="text-gray-500 text-2xl font-normal">
                            /bulan
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Parameter Input Form */}
                  <div className="bg-white rounded-lg p-4 shadow-md mb-4">
                    <h4 className="mb-3 font-semibold">Input Parameters</h4>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-gray-600 mb-1 text-xs">
                          Latitude
                        </label>
                        <input
                          type="number"
                          step="0.000001"
                          className="border rounded-md p-2 w-full text-xs"
                          value={budgetParams.latitude}
                          onChange={(e) =>
                            handleBudgetParamChange(
                              "latitude",
                              parseFloat(e.target.value)
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1 text-xs">
                          Longitude
                        </label>
                        <input
                          type="number"
                          step="0.000001"
                          className="border rounded-md p-2 w-full text-xs"
                          value={budgetParams.longitude}
                          onChange={(e) =>
                            handleBudgetParamChange(
                              "longitude",
                              parseFloat(e.target.value)
                            )
                          }
                        />
                      </div>
                    </div>
                    <div>
                      {/* Kecamatan Display */}
                      {kecamatan && (
                        <div className="flex items-center mb-2">
                          <MapPin size={18} className="inline-block mr-1" />
                          <p className="block text-gray-600 mb-1 text-xs">
                            {kecamatan}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-gray-600 mb-1 text-xs">
                          Panjang (m)
                        </label>
                        <input
                          type="number"
                          className="border rounded-md p-2 w-full text-xs"
                          value={budgetParams.panjang}
                          onChange={(e) =>
                            handleBudgetParamChange("panjang", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 mb-1 text-xs">
                          Lebar (m)
                        </label>
                        <input
                          type="number"
                          className="border rounded-md p-2 w-full text-xs"
                          value={budgetParams.lebar}
                          onChange={(e) =>
                            handleBudgetParamChange("lebar", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Facilities Selection */}
                    <div className="mb-3">
                      <label className="block text-gray-600 mb-1 text-xs font-semibold">
                        Fasilitas
                      </label>

                      <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                        {Object.entries(facilityGroups).map(
                          ([groupName, facilities]) => (
                            <div key={groupName} className="mb-2">
                              <div
                                className="flex items-center justify-between bg-gray-100 p-1 rounded cursor-pointer"
                                onClick={() =>
                                  setOpenFacilityGroup(
                                    openFacilityGroup === groupName
                                      ? null
                                      : groupName
                                  )
                                }
                              >
                                <span className="text-xs font-medium">
                                  {groupName}
                                </span>
                                <ChevronDown
                                  className={`w-3 h-3 transition-transform ${
                                    openFacilityGroup === groupName
                                      ? "rotate-180"
                                      : "rotate-0"
                                  }`}
                                />
                              </div>

                              {openFacilityGroup === groupName && (
                                <div className="pl-2 mt-1 grid grid-cols-2 gap-x-2 gap-y-1">
                                  {facilities.map((facility) => (
                                    <label
                                      key={facility}
                                      className="flex items-center text-xs"
                                    >
                                      <input
                                        type="checkbox"
                                        className="mr-1"
                                        checked={budgetParams.fasilitas.includes(
                                          facility
                                        )}
                                        onChange={() =>
                                          handleBudgetParamChange(
                                            "fasilitas",
                                            facility
                                          )
                                        }
                                      />
                                      {facility}
                                    </label>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>

                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">
                          Fasilitas terpilih:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {budgetParams.fasilitas.map((facility) => (
                            <span
                              key={facility}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                            >
                              {facility}
                              <X
                                size={12}
                                className="ml-1 cursor-pointer"
                                onClick={() => {
                                  setBudgetParams((prev) => ({
                                    ...prev,
                                    fasilitas: prev.fasilitas.filter(
                                      (f) => f !== facility
                                    ),
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
                            fasilitas: facilityGroups["Non-Premium"].slice(
                              0,
                              5
                            ),
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

                    <button
                      onClick={predictPrice}
                      disabled={isLoading}
                      className="w-full bg-[#2C3E50] text-white py-2 rounded-md hover:bg-[#1F2A36] transition text-sm"
                    >
                      {isLoading ? "Processing..." : "Predict Price"}
                    </button>
                  </div>

                  {/* Recommendations */}
                  {kostList.length > 0 && (
                    <>
                      <h4 className="my-4 font-semibold">Recommendations</h4>
                      <div className="flex overflow-x-auto space-x-4 pb-2">
                        {kostList.map((kost, index) => (
                          <div
                            key={index}
                            className="min-w-[160px] bg-white shadow-md rounded-lg p-2 flex flex-col min-h-[220px]"
                          >
                            <div className="h-20 w-full bg-gray-200 rounded-md flex items-center justify-center">
                              {kost.data.gambar_kost &&
                              kost.data.gambar_kost.length > 0 ? (
                                <img
                                  src={kost.data.gambar_kost[0].url_gambar}
                                  alt={kost.data.nama_kost}
                                  className="h-20 w-full object-cover rounded-md"
                                />
                              ) : (
                                <span className="text-xs text-gray-500">
                                  No Image
                                </span>
                              )}
                            </div>
                            <p className="mt-2 text-sm font-semibold">
                              {kost.data.nama_kost}
                            </p>
                            <p className="text-sm text-gray-500">
                              Rp
                              {Number(kost.data.harga_sewa).toLocaleString(
                                "id-ID"
                              )}
                              /bulan
                            </p>
                            <button
                              onClick={() =>
                                (window.location.href = `/detail/${kost.data.id_kost}`)
                              }
                              className="mt-auto w-full text-xs bg-[#2C3E50] hover:bg-[#1F2A36] text-white px-2 py-1 rounded-md"
                            >
                              Detail
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Input Field */}
            {activeAssistant === "assistant" && (
              <div className="flex items-center p-3 border-t bg-gray-800 rounded-b-lg">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded-full text-sm focus:outline-none bg-gray-700 text-white placeholder-gray-400"
                  placeholder="Ask anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button className="ml-2 p-2 bg-white text-gray-800 rounded-full hover:bg-gray-300">
                  <Mic size={18} />
                </button>
                <button
                  onClick={sendMessage}
                  className="ml-2 p-2 bg-white text-gray-800 rounded-full hover:bg-gray-300"
                >
                  <Send size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="fixed top-24 right-2 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-[#2C3E50] text-white px-3 py-3 rounded-full shadow-md hover:bg-[#1F2A36]"
        >
          <Bot size={18} />
        </button>
      </div>
      {/* Container Peta */}
      <div ref={mapContainer} className="flex-1 h-screen" />
    </div>
  );
}

async function query(data) {
  const response = await fetch(
    "http://localhost:3000/api/v1/prediction/c5ed765f-cd94-4587-850c-4a5719c0506a",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}
export default Maps;
