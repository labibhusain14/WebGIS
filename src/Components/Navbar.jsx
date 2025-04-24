import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { FiLogOut } from "react-icons/fi"; // Icon logout

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const tabRoutes = {
    Beranda: "/home",
    "Market Intelligence": "/dashboard",
    "Pusat Bantuan": "/pusat-bantuan",
    "About Us": "/about",
  };

  const [activeTab, setActiveTab] = useState("Beranda");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Deteksi tab aktif berdasarkan URL saat ini
    const currentPath = Object.entries(tabRoutes).find(
      ([, path]) => path === location.pathname
    );
    if (currentPath) {
      setActiveTab(currentPath[0]);
    }
  }, [location.pathname]);

  useEffect(() => {
    // Tutup dropdown jika klik di luar elemen
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const toTitleCase = (str) => {
      return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserName(toTitleCase(parsedUser.nama || "Pengguna"));
    }
  }, []);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setLoading(false);
      navigate("/login");
    }, 1500); // simulasi delay logout
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between bg-white shadow-md p-3 font-poppins">
      <div className="flex items-center font-bold text-gray-500">
        <img src="src/assets/Logo.png" alt="Logo" className="w-10 h-10 mr-2" />
        <span className="text-lg">KOSTHUB</span>
      </div>
      <div className="flex gap-6">
        {Object.keys(tabRoutes).map((name) => (
          <button
            key={name}
            onClick={() => {
              setActiveTab(name);
              navigate(tabRoutes[name]);
            }}
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
      <div className="relative flex items-center font-bold" ref={dropdownRef}>
        <div
          className="text-base text-gray-600 cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {userName}
        </div>
        <img
          src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
          alt="Profile"
          className="ml-3 mr-4 w-8 h-8 rounded-full object-cover aspect-square cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        />

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute right-0 mt-24 w-40 bg-white border rounded shadow-md z-20">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-500" />
              ) : (
                <FiLogOut className="text-lg" />
              )}
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
