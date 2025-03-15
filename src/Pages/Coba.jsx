import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

function Maps() {
  const MAP_SERVICE_KEY = import.meta.env.VITE_MAP_SERVICE_KEY;
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [activeTab, setActiveTab] = useState("Beranda");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  return (
    <div>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          backgroundColor: "white",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: "16px",
            color: "#7F8C8D",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src="https://png.pngtree.com/png-clipart/20221006/original/pngtree-real-estate-house-logo-design-png-image_8660861.png"
            alt="Logo"
            style={{ width: "40px", height: "40px", marginRight: "10px" }}
          />
          <div
            style={{ fontWeight: "bold", fontSize: "16px", color: "#7F8C8D" }}
          >
            KOSTHUB
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          {[
            "Beranda",
            "Market Intelligence",
            "Pusat Bantuan",
            "Syarat & Ketentuan",
          ].map((tab) => (
            <a
              key={tab}
              href="#"
              onClick={() => setActiveTab(tab)}
              style={{
                textDecoration: "none",
                color: activeTab === tab ? "#3498DB" : "black",
                fontSize: "15px",
                fontWeight: "bolder",
                borderBottom: activeTab === tab ? "2px solid #3498DB" : "none",
                paddingBottom: "5px",
              }}
            >
              {tab}
            </a>
          ))}
        </div>
        <div style={{ fontWeight: "bold" }}>Ihsan Ghozi</div>
      </nav>

      {/* Sidebar */}
      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: isSidebarOpen ? "0" : "-360px",
          width: "350px",
          height: "100vh",
          backgroundColor: "#ECF0F1",
          boxShadow: "-2px 0px 10px rgba(0, 0, 0, 0.1)",
          paddingTop: "60px",
          transition: "left 0.5s ease-in-out",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "10px",
            margin: "20px",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
            width: "80%",
            justifyContent: "space-between",
          }}
        >
          <input
            type="text"
            placeholder="Search"
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              flex: 1,
              fontSize: "14px",
              color: "#2C3E50",
            }}
          />
          <img
            src="https://static-00.iconduck.com/assets.00/search-icon-2048x2048-cmujl7en.png"
            alt="Search Icon"
            style={{
              width: "15px",
              height: "15px",
              marginRight: "8px",
              marginLeft: "8px",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "85%",
          }}
        >
          {["Price", "Facilities", "Type"].map((label) => (
            <button
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 15px",
                borderRadius: "10px",
                background: "white",
                color: "#2C3E50",
                border: "0px solid #BDC3C7",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                fontSize: "14px",
                cursor: "pointer",
                width: "40%",
                textAlign: "center",
                margin: "5px",
              }}
            >
              {label}
              <img
                src="https://www.iconpacks.net/icons/2/free-arrow-down-icon-3101-thumb.png"
                alt="Dropdown Icon"
                style={{
                  width: "12px",
                  height: "15px",
                  marginLeft: "8px",
                }}
              />
            </button>
          ))}
        </div>
        {/* Card Button Section */}
        {/* Card Button Section */}
        <div
          style={{
            width: "90%",
            marginTop: "20px",
            marginLeft: "10px",
            display: "flex",
            justifyContent: "left",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          {[
            {
              name: "Kos Harmoni",
              location: "Sukasari",
              price: "Rp1,8 juta /bulan",
              image:
                "https://www.tokocatlancar.com/upload/img_Mon-240226092040.webp",
            },
            {
              name: "Kos Jaya",
              location: "Sukasari",
              price: "Rp1,8 juta /bulan",
              image:
                "https://www.tokocatlancar.com/upload/img_Mon-240226092040.webp",
            },
            {
              name: "Kos Ade",
              location: "Sukajadi",
              price: "Rp2,8 juta /bulan",
              image:
                "https://www.tokocatlancar.com/upload/img_Mon-240226092040.webp",
            },
          ].map((kos, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                cursor: "pointer",
                width: "45%",
                textAlign: "left",
                overflow: "hidden", // Agar border radius terlihat rapi
              }}
            >
              <img
                src={kos.image}
                alt={kos.name}
                style={{
                  borderRadius: "10px 10px 0 0", // Hanya atas supaya menyatu dengan card
                  width: "100%",
                  height: "120px",
                  objectFit: "cover",
                  padding: "none",
                }}
              />
              <div style={{ padding: "10px" }}>
                {" "}
                {/* Tambahkan padding hanya pada teks */}
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    marginTop: "5px",
                  }}
                >
                  {kos.name}
                </div>
                <div style={{ fontSize: "12px", color: "#7F8C8D" }}>
                  {kos.location}
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    marginTop: "5px",
                  }}
                >
                  {kos.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: "75px",
          left: isSidebarOpen ? "350px" : "0px",
          background: "#2C3E50",
          border: "none",
          color: "white",
          fontSize: "15px",
          cursor: "pointer",
          padding: "5px 10px",
          borderRadius: "0px 5px 5px 0px",
          zIndex: 6,
          transition: "left 0.5s ease-in-out",
        }}
      >
        ☰
      </button>

      <button
        onClick={navigateToTarget}
        style={{
          position: "absolute",
          bottom: 150,
          right: 10,
          zIndex: 7,
          backgroundColor: "white",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="https://icons.veryicon.com/png/o/leisure/maps-and-travel/crosshair-5.png"
          alt="Target Icon"
          style={{ width: "18px", height: "18px" }}
        />
      </button>
      <div ref={mapContainer} style={{ flex: 1, height: "100vh" }} />
    </div>
  );
}

export default Maps;
