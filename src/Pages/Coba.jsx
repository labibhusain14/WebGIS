import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Crosshair,
  MapPin,
  Wifi,
  ShowerHead,
  Bike,
  Heart,
  Menu,
  ChevronDown,
  Search,
  Bot,
  X,
  BedDouble,
  History,
  Wallet,
  MessageCircle,
  Send,
  Mic,
} from "lucide-react";

function Maps() {
  const MAP_SERVICE_KEY = import.meta.env.VITE_MAP_SERVICE_KEY;
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Beranda");
  const [userLocation, setUserLocation] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const filters = ["Price", "Facilities", "Type"];
  const [openDropdown, setOpenDropdown] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedType, setSelectedType] = useState([]);

  const facilitiesOptions = ["Lemari", "Kasur", "Parkir", "Kamar Mandi Dalam"];
  const typeOptions = ["Laki-laki", "Perempuan", "Campur"];
  const [isOpen, setIsOpen] = useState(false);
  const [activeAssistant, setActiveAssistant] = useState("assistant");

  const [messages, setMessages] = useState([
    { text: "Halo, apakah ada yang bisa saya bantu?", sender: "bot" },
    {
      text: "Hai, aku lagi cari kos di dekat Universitas Pendidikan Indonesia. Ada rekomendasi?",
      sender: "user",
    },
    {
      text: "Baik! Preferensi fasilitas? (AC, Wi-Fi, kamar mandi dalam)",
      sender: "bot",
    },
    { text: "Wi-Fi cepat, kamar mandi dalam.", sender: "user" },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const tabs = [
    "Beranda",
    "Market Intelligence",
    "Pusat Bantuan",
    "Syarat & Ketentuan",
  ];

  const kosList = [
    {
      name: "Kos Harmoni",
      location: "Sukasari",
      price: "Rp1,8 juta",
      image: "src/assets/image-1.jpg",
      facilities: [Wifi, ShowerHead, Bike, BedDouble], // Tambahkan fasilitas
    },
    {
      name: "Kos Jaya",
      location: "Sukasari",
      price: "Rp1,8 juta",
      image: "src/assets/preview-1.jpg",
      facilities: [Wifi, ShowerHead, Bike], // Tambahkan fasilitas
    },
    {
      name: "Kos Ade",
      location: "Sukajadi",
      price: "Rp2,8 juta",
      image: "src/assets/preview-2.jpg",
      facilities: [Wifi, ShowerHead, Bike], // Tambahkan fasilitas
    },
    {
      name: "Kos Ade",
      location: "Sukajadi",
      price: "Rp2,8 juta",
      image: "src/assets/preview-2.jpg",
      facilities: [Wifi, ShowerHead, Bike], // Tambahkan fasilitas
    },
    {
      name: "Kos Ade",
      location: "Sukajadi",
      price: "Rp2,8 juta",
      image: "src/assets/preview-2.jpg",
      facilities: [Wifi, ShowerHead, Bike], // Tambahkan fasilitas
    },
  ];
  const [likedItems, setLikedItems] = useState(
    Array(kosList.length).fill(false)
  );

  useEffect(() => {
    if (!mapContainer.current) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });

        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: `https://basemap.mapid.io/styles/street-new-generation/style.json?key=${MAP_SERVICE_KEY}`,
          center: [longitude, latitude],
          zoom: 15.5,
          pitch: 60,
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
  }, []);

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

      setTimeout(() => {
        const botReply = {
          text: "Saya sedang memproses permintaan Anda...",
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, botReply]);
      }, 1000);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleLike = (index) => {
    setLikedItems((prev) => {
      const newLiked = [...prev];
      newLiked[index] = !newLiked[index];
      return newLiked;
    });
  };
  return (
    <div className="relative h-screen">
      <nav className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between bg-white shadow-md p-3 font-poppins">
        <div className="flex items-center font-bold text-gray-500">
          <img
            src="src\assets\Logo.png"
            alt="Logo"
            className="w-10 h-10 mr-2"
          />
          <span className="text-lg">KOSTHUB</span>
        </div>
        <div className="flex gap-6">
          {tabs.map((name) => (
            <button
              key={name}
              onClick={() => setActiveTab(name)}
              className={`text-base font-bold pb-1 border-b-2 ${
                activeTab === name
                  ? "text-blue-500 border-blue-500"
                  : "text-black border-transparent"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="flex items-center font-bold">
          <div className="text-base text-gray-600">Ihsan Ghozi</div>
          <img
            src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
            alt="Logo"
            className="ml-3 mr-4 w-8 h-8 rounded-full object-cover aspect-square"
          />
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed top-[64px] h-[calc(100vh-61px)] w-[350px] bg-gray-200 shadow-md transition-all duration-700 ${
          isSidebarOpen ? "left-0" : "-translate-x-full"
        } flex flex-col items-center z-40 border-t border-gray-300 overflow-y-auto`}
      >
        <div className="flex items-center bg-white ml-2 m-5 rounded-lg p-2 shadow-md w-72">
          <input
            type="text"
            placeholder="Search"
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
          />
          <Search className="w-4 h-4 text-gray-500 mx-2" />
        </div>

        <div className="w-[90%] ml-2 flex flex-wrap justify-start">
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
          </div>
        </div>

        {/* Card Button Section */}
        <div className="w-[90%] my-5 ml-2 flex flex-wrap gap-4 justify-start">
          {kosList.map((kos, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md cursor-pointer w-[45%] overflow-hidden"
            >
              <img
                src={kos.image}
                alt={kos.name}
                className="w-full h-[100px] object-cover"
              />
              <div className="p-3">
                <div className="flex justify-between">
                  <div className="font-semibold text-sm">{kos.name}</div>
                  <button onClick={() => toggleLike(index)}>
                    <Heart
                      className={`w-4 h-4 mt-1 transition-all ${
                        likedItems[index]
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="w-3 h-3 text-gray-500 mr-1" />
                  {kos.location}
                </div>
                <div className="flex items-center gap-1 mt-1 ">
                  {kos.facilities.map((Icon, idx) => (
                    <Icon key={idx} className="w-4 h-4" />
                  ))}
                </div>
                <div className="text-xs mt-1 flex">
                  <div className="font-semibold"> {kos.price}</div>
                  <span className="ml-1"> /bulan</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={toggleSidebar}
        className={`fixed top-[75px] transition-all duration-700 ${
          isSidebarOpen ? "left-[350px]" : "left-0"
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
                <div className="flex flex-col">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-3 p-3 rounded-lg max-w-sm ${
                        msg.sender === "bot"
                          ? "bg-gray-200 self-start"
                          : "bg-[#2C3E50] text-white self-end"
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              ) : (
                <div>
                  <div className=" bg-white shadow-md rounded-xl flex items-center w-[70%]">
                    <div className="shadow-md py-12 px-1 bg-green-400 rounded-l-md"></div>
                    <div className="ml-3 mb-2">
                      <p className="text-[#999696] text-sm font-bold mb-4">
                        Estimated Budget
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        Rp1,5 - 1,8 juta{" "}
                        <span className="text-gray-500 text-2xl font-normal">
                          /bulan
                        </span>
                      </p>
                    </div>
                  </div>
                  <h4 className="my-4 font-semibold">Recommendation</h4>
                  <div className="flex overflow-x-auto space-x-4">
                    {kosList.map((kos, index) => (
                      <div
                        key={index}
                        className="min-w-[160px] bg-white shadow-md rounded-lg p-2"
                      >
                        <img
                          src={kos.image}
                          alt={kos.name}
                          className="h-20 w-full object-cover rounded-md"
                        />
                        <p className="mt-2 text-sm font-semibold">{kos.name}</p>
                        <p className="text-sm text-gray-500">
                          {kos.price}/bulan
                        </p>
                      </div>
                    ))}
                  </div>
                  <textarea
                    className="w-full mt-4 border rounded-md p-4 text-sm focus:outline-none"
                    placeholder="Describe your budget criteria..."
                  ></textarea>
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

export default Maps;
