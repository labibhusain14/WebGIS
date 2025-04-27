import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { FiLogOut, FiMenu, FiX, FiUser, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/Logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const tabRoutes = {
    Beranda: '/home',
    'Market Intelligence': '/dashboard',
    'Pusat Bantuan': '/pusat-bantuan',
    'About Us': '/about',
  };

  const [activeTab, setActiveTab] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.id_user) {
        setUserName(parsedUser.nama);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Set active tab based on current route
  useEffect(() => {
    const currentPath = Object.entries(tabRoutes).find(([, path]) => path === location.pathname);
    if (currentPath) {
      setActiveTab(currentPath[0]);
    } else if (location.pathname === '/landing') {
      setActiveTab('');
    }
  }, [location.pathname]);

  const handleNavigation = (name) => {
    const targetRoute = tabRoutes[name];
    const restrictedRoutes = ['/home', '/dashboard'];

    if (location.pathname === '/landing' && !isAuthenticated && restrictedRoutes.includes(targetRoute)) {
      navigate('/login');
    } else {
      setActiveTab(name);
      navigate(targetRoute);
    }
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavigation = (name) => {
    setActiveTab(name);
    navigate(tabRoutes[name]);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem('user');
      setLoading(false);
      navigate('/login');
    }, 1500);
  };

  const handleLogin = () => {
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const handleRegister = () => {
    navigate('/register');
    setMobileMenuOpen(false);
  };

  const buttonAnimation = {
    hover: { scale: 1.05, boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', transition: { duration: 0.3 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.03,
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.97,
      transition: { duration: 0.1 },
    },
  };

  return (
    <motion.nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm font-poppins transition-all duration-300`} variants={navbarVariants} initial="initial" animate={scrolled ? 'scrolled' : 'initial'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div className="flex items-center font-bold" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <img src={Logo} alt="Logo" className="w-10 h-10 mr-2" />
            <span className="text-lg text-gray-800 tracking-tight">KOSTHUB</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {Object.keys(tabRoutes).map((name, index) => (
              <motion.button
                key={name}
                onClick={() => handleNavigation(name)}
                className={`relative text-sm font-medium py-1 transition-colors focus:outline-none ${activeTab === name ? 'text-blue-600' : 'text-gray-700 hover:text-blue-500'}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {name}
                {activeTab === name && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" layoutId="activeTabIndicator" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
              </motion.button>
            ))}
          </div>

        {/* User Profile or Login/Daftar */}
        <div className="relative flex items-center" ref={dropdownRef}>
          {isAuthenticated ? (
            <>
              <div
                className="hidden md:block text-base text-gray-600 cursor-pointer font-bold"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {userName}
              </div>
              <img
                src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                alt="Profile"
                className="hidden md:block ml-3 mr-2 w-8 h-8 rounded-full object-cover aspect-square cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              />
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
                    {loading ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {isLandingPage ? (
                <div className="hidden md:flex items-center gap-3">
                  <motion.button
                    onClick={handleLogin}
                    variants={buttonAnimation}
                    whileHover="hover"
                    whileTap="tap"
                    className="px-4 py-2 text-blue-600 font-semibold rounded-full border border-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Login
                  </motion.button>
                  <motion.button
                    onClick={handleRegister}
                    variants={buttonAnimation}
                    whileHover="hover"
                    whileTap="tap"
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Daftar
                  </motion.button>
                </div>
              ) : (
                <div className="relative flex items-center font-bold">
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
                        {loading ? 'Logging out...' : 'Logout'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Hamburger Menu */}
          <button
            className="md:hidden text-2xl text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-3">
          {Object.keys(tabRoutes).map((name) => (
            <button
              key={name}
              onClick={() => handleNavigation(name)}
              className={`text-left font-semibold text-base ${
                activeTab === name ? 'text-blue-500' : 'text-gray-700'
              }`}
            >
              {name}
            </button>
          ))}
          <div className="flex flex-col gap-2 mt-4">
            {isAuthenticated ? (
              <motion.button
                onClick={handleLogout}
                variants={buttonAnimation}
                whileHover="hover"
                whileTap="tap"
                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-500" />
                ) : (
                  <FiLogOut className="text-lg" />
                )}
                {loading ? 'Logging out...' : 'Logout'}
              </motion.button>
            ) : (
              <>
                <motion.button
                  onClick={handleLogin}
                  variants={buttonAnimation}
                  whileHover="hover"
                  whileTap="tap"
                  className="px-4 py-2 text-blue-600 font-semibold rounded-full border border-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Login
                </motion.button>
                <motion.button
                  onClick={handleRegister}
                  variants={buttonAnimation}
                  whileHover="hover"
                  whileTap="tap"
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
                >
                  Daftar
                </motion.button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
