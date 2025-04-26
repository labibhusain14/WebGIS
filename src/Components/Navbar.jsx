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

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Close dropdown when clicking outside
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

  const isLandingPage = location.pathname === '/landing';

  // Animation variants
  const navbarVariants = {
    initial: {
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
      background: 'rgba(255, 255, 255, 0.95)',
    },
    scrolled: {
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      background: 'rgba(255, 255, 255, 0.98)',
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -5, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      y: -5,
      scale: 0.95,
      transition: { duration: 0.15 },
    },
  };

  const mobileMenuVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: { duration: 0.3, type: 'spring', stiffness: 300, damping: 24 },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.2 },
    },
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

          {/* User Profile or Login/Register Buttons */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 bg-white rounded-full px-3 py-1.5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiUser className="text-blue-600" size={16} />
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">{userName}</span>
                  <FiChevronDown className={`text-gray-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} size={16} />
                </motion.button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border overflow-hidden z-50" variants={dropdownVariants} initial="hidden" animate="visible" exit="exit">
                      <div className="p-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                            <FiUser className="text-blue-600" size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{userName}</p>
                            <p className="text-xs text-gray-500">Member</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <button onClick={handleLogout} disabled={loading} className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-red-50 transition-colors">
                          {loading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500 mr-2" /> : <FiLogOut className="text-red-500 mr-2" size={16} />}
                          <span className={loading ? 'text-gray-400' : 'text-red-500'}>{loading ? 'Logging out...' : 'Logout'}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                {isLandingPage && (
                  <div className="hidden md:flex items-center space-x-3">
                    <motion.button
                      onClick={handleLogin}
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Login
                    </motion.button>
                    <motion.button
                      onClick={handleRegister}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Daftar
                    </motion.button>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <motion.button className="md:hidden text-gray-700 ml-4 p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 overflow-hidden" variants={mobileMenuVariants} initial="hidden" animate="visible" exit="exit">
            <div className="space-y-3 pb-3">
              {Object.keys(tabRoutes).map((name) => (
                <motion.button
                  key={name}
                  onClick={() => handleNavigation(name)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${activeTab === name ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {name}
                </motion.button>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{userName}</p>
                    <p className="text-xs text-gray-500">Member</p>
                  </div>
                  <motion.button onClick={handleLogout} disabled={loading} className="flex items-center px-3 py-1.5 text-sm text-red-500 border border-red-200 rounded-lg bg-red-50" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    {loading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500 mr-2" /> : <FiLogOut className="mr-1" size={14} />}
                    {loading ? 'Logging out...' : 'Logout'}
                  </motion.button>
                </div>
              ) : (
                <>
                  {isLandingPage && (
                    <div className="flex flex-col space-y-2">
                      <motion.button onClick={handleLogin} className="w-full py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg bg-blue-50" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        Login
                      </motion.button>
                      <motion.button onClick={handleRegister} className="w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-lg" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        Daftar
                      </motion.button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
