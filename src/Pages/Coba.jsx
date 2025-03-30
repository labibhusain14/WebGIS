import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/detail`);
  };

  const facilitiesOptions = ["Lemari", "Kasur", "Parkir", "Kamar Mandi Dalam"];
  const typeOptions = ["Laki-laki", "Perempuan", "Campur"];

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
      facilities: [Wifi, ShowerHead, Bike], // Tambahkan fasilitas
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
              className={`text-base font-bold pb-1 border-b-2 ${activeTab === name
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
        className={`fixed top-[64px] h-[calc(100vh-61px)] w-[350px] bg-gray-200 shadow-md transition-all duration-700 ${isSidebarOpen ? "left-0" : "-translate-x-full"
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
                    className={`w-4 h-4 ml-2 transition-transform ${openDropdown === label ? "rotate-180" : "rotate-0"
                      }`}
                  />
                </button>
                {openDropdown === label && (
                  <div
                    className={`absolute left-0 mt-2 ${label === "Price" ? "w-80" : "w-40"
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
              onClick={() => handleCardClick(index)}
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
                      className={`w-4 h-4 mt-1 transition-all ${likedItems[index]
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
        className={`fixed top-[75px] transition-all duration-700 ${isSidebarOpen ? "left-[350px]" : "left-0"
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

      {/* Container Peta */}
      <div ref={mapContainer} className="flex-1 h-screen" />
    </div>
  );
}

export default Maps;
