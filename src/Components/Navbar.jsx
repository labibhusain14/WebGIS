import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabRoutes = {
    "Beranda": "/coba",
    "Market Intelligence": "/dashboard",
    "Pusat Bantuan": "/pusat-bantuan",
    "About Us": "/about",
  };

  const [activeTab, setActiveTab] = useState("Beranda");

  useEffect(() => {
    const currentPath = Object.entries(tabRoutes).find(
      ([, path]) => path === location.pathname
    );
    if (currentPath) {
      setActiveTab(currentPath[0]);
    }
  }, [location.pathname, tabRoutes]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between bg-white shadow-md p-3 font-poppins">
      <div className="flex items-center font-bold text-gray-500">
        <img
          src="src/assets/Logo.png"
          alt="Logo"
          className="w-10 h-10 mr-2"
        />
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
      <div className="flex items-center font-bold">
        <div className="text-base text-gray-600">Ihsan Ghozi</div>
        <img
          src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
          alt="Profile"
          className="ml-3 mr-4 w-8 h-8 rounded-full object-cover aspect-square"
        />
      </div>
    </nav>
  );
};

export default Navbar;
