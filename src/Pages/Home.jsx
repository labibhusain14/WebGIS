import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Crosshair, Menu, Bot, X, History, Wallet, MessageCircle, Send, Mic } from 'lucide-react';
import Navbar from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import SideBar from '../Components/SideBar';
import SmartBudgeting from '../Components/SmartBudgeting';
function Maps() {
  const MAP_SERVICE_KEY = import.meta.env.VITE_MAP_SERVICE_KEY;
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  // const [activeTab, setActiveTab] = useState("Beranda");
  const [userLocation, setUserLocation] = useState({
    // Set default coordinates for Bandung
    latitude: -6.9175,
    longitude: 107.6191,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [activeAssistant, setActiveAssistant] = useState('assistant');

  const [kecamatan, setKecamatan] = useState('');

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [originalKostList, setOriginalKostList] = useState([]);

  const [skip, setSkip] = useState(0);
  const [filteredKost, setFilteredKost] = useState([]);
  const markerList = useRef([]);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  // Smart Budgeting state
  const [budgetParams, setBudgetParams] = useState({
    panjang: 4,
    lebar: 4,
    fasilitas: ['meja'],
    latitude: -6.9175,
    longitude: 107.6191,
  });

  useEffect(() => {
    if (!mapContainer.current) return;

    // Use Bandung coordinates instead of getting user position
    const latitude = -6.883316515;
    const longitude = 107.616888;

    // Set user location to Bandung
    setUserLocation({ latitude, longitude });

    // Update budget parameters with Bandung location
    setBudgetParams((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://basemap.mapid.io/styles/street-new-generation/style.json?key=${MAP_SERVICE_KEY}`,
      center: [longitude, latitude],
      zoom: 13.5,
      pitch: 60,
    });

    map.current.on('click', async (e) => {
      const coordinates = e.lngLat;
      const latitude = coordinates.lat;
      const longitude = coordinates.lng;

      // Tambahkan marker
      if (markerRef.current) {
        markerRef.current.setLngLat(coordinates);
      } else {
        markerRef.current = new maplibregl.Marker({
          color: 'red',
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
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        const address = data.address;

        const fullAddress = [address.road, address.suburb || address.village || address.town || address.city_district || address.county, address.city || address.regency, address.state, address.postcode, address.country]
          .filter(Boolean)
          .join(', ');

        setKecamatan(fullAddress);
      } catch (err) {
        console.error('Gagal ambil alamat lengkap:', err);
      }
    });

    map.current.on('load', () => {
      markerRef.current = new maplibregl.Marker({
        color: 'red',
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
      map.current.addControl(nav, 'bottom-right');

      fetchDataKost();
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [MAP_SERVICE_KEY]);

  const applyFiltersAndSearch = (list) => {
    const filtered = list.filter((kost) => {
      const matchSearch = kost.alamat.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPrice = (!priceRange.min || kost.harga_sewa >= priceRange.min) && (!priceRange.max || kost.harga_sewa <= priceRange.max);
      const matchFacilities = selectedFacilities.length === 0 || selectedFacilities.every((fac) => kost.fasilitas.some((f) => f.nama_fasilitas === fac));
      const matchType = selectedType.length === 0 || selectedType.includes(kost.tipe_kost);
      return matchSearch && matchPrice && matchFacilities && matchType;
    });

    return filtered.sort((a, b) => (sortOrder === 'asc' ? a.harga_sewa - b.harga_sewa : b.harga_sewa - a.harga_sewa));
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
          className: 'modern-popup',
          closeButton: false,
        }).setHTML(`
              <div class="p-4 bg-white rounded-xl shadow-lg min-w-[200px] font-sans">
                <h3 class="text-base font-semibold text-gray-900 mb-2">${kost.nama_kost}</h3>
                <p class="text-sm text-gray-600 mb-3 leading-relaxed">${kost.alamat}</p>
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

        const marker = new maplibregl.Marker({ color: '#8e44ad' }).setLngLat([kost.longitude, kost.latitude]).setPopup(popup).addTo(map.current);

        popup.on('open', () => {
          const detailButton = document.getElementById(`detail-btn-${kost.id_kost}`);
          if (detailButton) {
            detailButton.addEventListener('click', () => navigate(`/detail/${kost.id_kost}`));
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
      const res = await fetch(`https://ggnt.mapid.co.id/api/kost/?${queryParams}`);
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
      console.error('Gagal mengambil data kost:', err);
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
      if (sidebar.scrollTop + sidebar.clientHeight >= sidebar.scrollHeight - 100) {
        fetchDataKost();
      }
    };

    sidebar.addEventListener('scroll', handleScroll);
    return () => sidebar.removeEventListener('scroll', handleScroll);
  }, [skip, loading, hasMore]);
  function formatMessageText(text) {
    // Tambahkan newline di akhir agar paragraf terakhir tetap diproses
    text = text.trim() + '\n\n';

    // Bold (**text**)
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Bullet list (* text)
    formatted = formatted.replace(/^\* (.*)$/gm, '<li>$1</li>');

    // Bungkus semua <li> jadi satu <ul> (jika ada)
    if (formatted.includes('<li>')) {
      formatted = formatted.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
    }

    // Pisah paragraf dan beri jarak (mb-3)
    formatted = formatted
      .split(/\n{2,}/)
      .map((p) => `<p class="mb-3">${p.trim().replace(/\n/g, '<br/>')}</p>`)
      .join('');

    return formatted;
  }
  const navigateToTarget = () => {
    if (!map.current || !userLocation) {
      console.warn('Map instance or user location is missing');
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

  const sendMessage = () => {
    if (input.trim() !== '') {
      const userMessage = { text: input, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput('');

      query({ question: input }).then(async (response) => {
        console.log(response);
        if (response) {
          const botReply = {
            text: response.text,
            sender: 'bot',
          };
          setMessages((prevMessages) => [...prevMessages, botReply]);
        }
      });
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="relative h-screen">
      <Navbar />
      {/* Sidebar */}
      <SideBar
        isSidebarOpen={isSidebarOpen}
        originalKostList={originalKostList}
        setFilteredKost={setFilteredKost}
        filteredKost={filteredKost}
        fetchDataKost={fetchDataKost}
        skip={skip}
        loading={loading}
        hasMore={hasMore}
        addMarkersToMap={addMarkersToMap}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedFacilities={selectedFacilities}
        setSelectedFacilities={setSelectedFacilities}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <button onClick={toggleSidebar} className={`fixed top-[75px] transition-all duration-700 ${isSidebarOpen ? 'left-[450px]' : 'left-0'} bg-gray-800 text-white p-2 rounded-r-md z-10`}>
        <Menu className="w-5 h-5" />
      </button>
      {/* Tombol Navigate */}
      <button onClick={navigateToTarget} className="absolute bottom-[150px] right-2 z-10 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md border-none cursor-pointer">
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
                <button onClick={() => setActiveAssistant('budgeting')} className={`px-4 py-2 text-xs font-bold rounded-full ${activeAssistant === 'budgeting' ? 'bg-[#2C3E50] text-white shadow-md' : 'text-gray-500'}`}>
                  <Wallet size={16} className="inline-block mr-1" /> Smart Budgeting
                </button>
                <button onClick={() => setActiveAssistant('assistant')} className={`px-4 py-2 text-xs font-bold rounded-full ${activeAssistant === 'assistant' ? 'bg-[#2C3E50] text-white shadow-md' : 'text-gray-500'}`}>
                  <MessageCircle size={16} className="inline-block mr-1" /> Virtual Assistant
                </button>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-700">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-auto text-sm text-gray-700 flex flex-col space-y-2">
              {activeAssistant === 'assistant' ? (
                <div className="flex flex-col space-y-3">
                  {messages.map((msg, index) => (
                    <div key={index} className={`p-3 rounded-lg max-w-sm whitespace-pre-line ${msg.sender === 'bot' ? 'bg-gray-200 self-start text-gray-900' : 'bg-[#2C3E50] text-white self-end'}`}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatMessageText(msg.text),
                        }}
                      />{' '}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              ) : (
                <SmartBudgeting budgetParams={budgetParams} setBudgetParams={setBudgetParams} kecamatan={kecamatan} />
              )}
            </div>

            {/* Input Field */}
            {activeAssistant === 'assistant' && (
              <div className="flex items-center p-3 border-t bg-gray-800 rounded-b-lg">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded-full text-sm focus:outline-none bg-gray-700 text-white placeholder-gray-400"
                  placeholder="Ask anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="ml-2 p-2 bg-white text-gray-800 rounded-full hover:bg-gray-300">
                  <Mic size={18} />
                </button>
                <button onClick={sendMessage} className="ml-2 p-2 bg-white text-gray-800 rounded-full hover:bg-gray-300">
                  <Send size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="fixed top-24 right-2 z-50 flex items-center space-x-2">
        {/* Tooltip */}
        <div className="relative bg-gray-800 text-white text-xs p-2 rounded-md max-w-xs">
          {/* Tooltip Text */}
          Try AI Features
          {/* Runcing di sebelah kanan */}
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-t-8 border-b-8 border-transparent border-l-gray-800"></div>
        </div>

        {/* Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 bg-[#2C3E50] text-white px-3 py-3 rounded-full shadow-md hover:bg-[#1F2A36]">
          <Bot size={18} />
        </button>
      </div>

      {/* Container Peta */}
      <div ref={mapContainer} className="flex-1 h-screen" />
    </div>
  );
}

async function query(data) {
  const response = await fetch('http://localhost:3000/api/v1/prediction/c5ed765f-cd94-4587-850c-4a5719c0506a', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}
export default Maps;
