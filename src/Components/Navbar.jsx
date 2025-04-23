import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabRoutes = {
    Beranda: "/home",
    "Market Intelligence": "/dashboard",
    "Pusat Bantuan": "/pusat-bantuan",
    "About Us": "/about",
  };

  const [activeTab, setActiveTab] = useState("Beranda");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const currentPath = Object.entries(tabRoutes).find(
      ([, path]) => path === location.pathname
    );
    if (currentPath) {
      setActiveTab(currentPath[0]);
    }
  }, [location.pathname]);

  const handleNavigation = (name) => {
    setActiveTab(name);
    navigate(tabRoutes[name]);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between bg-white shadow-md p-3 font-poppins">
      {/* Logo Section */}
      <div className="flex items-center font-bold text-gray-500">
        <img src="src/assets/Logo.png" alt="Logo" className="w-10 h-10 mr-2" />
        <span className="text-lg">KOSTHUB</span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-6">
        {Object.keys(tabRoutes).map((name) => (
          <button
            key={name}
            onClick={() => handleNavigation(name)}
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

      {/* Mobile Burger Button */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Profile Section */}
      <div className="hidden md:flex items-center font-bold">
        <div className="text-base text-gray-600">Ihsan Ghozi</div>
        <img
          src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000"
          alt="Profile"
          className="ml-3 mr-4 w-8 h-8 rounded-full object-cover aspect-square"
        />
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-md px-6 py-4 flex flex-col items-start md:hidden">
          {Object.keys(tabRoutes).map((name) => (
            <button
              key={name}
              onClick={() => handleNavigation(name)}
              className={`text-base font-bold py-2 w-full text-left ${
                activeTab === name ? "text-blue-500" : "text-black"
              }`}
            >
              {name}
            </button>
          ))}
          <div className="mt-4 flex items-center w-full border-t pt-4">
            <div className="text-base text-gray-600 mr-3">Ihsan Ghozi</div>
            <img
              src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000"
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover aspect-square"
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
