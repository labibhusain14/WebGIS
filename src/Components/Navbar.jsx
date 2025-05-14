import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { FiLogOut, FiMenu, FiX, FiUser, FiHome, FiHelpCircle, FiInfo, FiBarChart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/Logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const tabRoutes = {
    Beranda: { path: '/home', icon: <FiHome /> },
    'Market Intelligence': { path: '/dashboard', icon: <FiBarChart /> },
    'Pusat Bantuan': { path: '/pusat-bantuan', icon: <FiHelpCircle /> },
    'About Us': { path: '/about', icon: <FiInfo /> },
  };

  const [activeTab, setActiveTab] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  useEffect(() => {
    const currentPath = Object.entries(tabRoutes).find(([, route]) => route.path === location.pathname);
    if (currentPath) {
      setActiveTab(currentPath[0]);
    } else if (location.pathname === '/') {
      setActiveTab('');
    }
  }, [location.pathname]);

  const handleNavigation = (name) => {
    const targetRoute = tabRoutes[name].path;
    const restrictedRoutes = ['/home', '/dashboard'];

    if (location.pathname === '/' && !isAuthenticated && restrictedRoutes.includes(targetRoute)) {
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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.classList.contains('menu-toggle')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const isLandingPage = location.pathname === '/';

  // Animation variants
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        when: 'beforeChildren',
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: 'afterChildren',
      },
    },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <motion.nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md font-poppins" initial="hidden" animate="visible" variants={navbarVariants}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div className="flex items-center font-bold text-gray-700 cursor-pointer" onClick={() => navigate('/')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <img src={Logo} alt="Logo" className="w-10 h-10 mr-2" />
            <span className="text-lg bg-blue-600 bg-clip-text text-transparent">KOSTHUB</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8">
            {Object.entries(tabRoutes).map(([name, { icon }]) => (
              <motion.button
                key={name}
                onClick={() => handleNavigation(name)}
                className={`text-base font-semibold flex items-center gap-2 pb-1 px-2 relative ${activeTab === name ? 'text-blue-600' : 'text-gray-700 hover:text-blue-500'}`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <span className="text-lg">{icon}</span>
                <span>{name}</span>
                {activeTab === name && (
                  <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" layoutId="activeTabIndicator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} />
                )}
              </motion.button>
            ))}
          </div>

          {/* User Profile or Login/Daftar */}
          <div className="relative flex items-center" ref={dropdownRef}>
            {isAuthenticated ? (
              <>
                <motion.div
                  className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowDropdown(!showDropdown)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <img
                    src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover aspect-square border-2 border-blue-500"
                  />
                  <div className="text-base text-gray-800 font-semibold">{userName}</div>
                </motion.div>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div className="absolute right-0 mt-2 top-full w-48 bg-white border rounded-lg shadow-lg z-50 overflow-hidden" variants={dropdownVariants} initial="hidden" animate="visible" exit="exit">
                      <div className="p-3 border-b border-gray-100 flex items-center gap-3">
                        <img
                          src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover aspect-square border-2 border-blue-500"
                        />
                        <div>
                          <div className="font-semibold text-gray-800">{userName}</div>
                          <div className="text-xs text-gray-500">Member</div>
                        </div>
                      </div>
                      <motion.button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700"
                        disabled={loading}
                        whileHover={{ backgroundColor: '#f3f4f6' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-blue-500 border-r-blue-500 border-b-blue-500 border-l-transparent" />
                            <span>Logging out...</span>
                          </div>
                        ) : (
                          <>
                            <FiLogOut className="text-lg text-red-500" />
                            <span>Logout</span>
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <>
                {isLandingPage ? (
                  <div className="hidden md:flex items-center gap-3">
                    <motion.button
                      onClick={handleLogin}
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      className="px-5 py-2 text-blue-600 font-semibold rounded-full border border-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      Login
                    </motion.button>
                    <motion.button
                      onClick={handleRegister}
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full hover:from-blue-700 hover:to-blue-800 transition-colors"
                    >
                      Daftar
                    </motion.button>
                  </div>
                ) : (
                  <motion.div
                    className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/login')}
                  >
                    <FiUser className="text-xl text-blue-600" />
                    <span className="font-semibold text-gray-700">Login</span>
                  </motion.div>
                )}
              </>
            )}

            {/* Hamburger Menu */}
            <motion.button className="md:hidden text-2xl text-gray-700 menu-toggle p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} whileTap={{ scale: 0.9 }} aria-label="Toggle menu">
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div className="md:hidden mt-3 flex flex-col gap-3 overflow-hidden bg-white rounded-lg shadow-lg p-4" ref={mobileMenuRef} variants={mobileMenuVariants} initial="hidden" animate="visible" exit="exit">
              {Object.entries(tabRoutes).map(([name, { icon }]) => (
                <motion.button
                  key={name}
                  onClick={() => handleNavigation(name)}
                  className={`text-left font-semibold text-base p-3 rounded-lg flex items-center gap-3 ${activeTab === name ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
                  variants={mobileItemVariants}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-xl">{icon}</span>
                  <span>{name}</span>
                </motion.button>
              ))}

              <div className="h-px bg-gray-200 my-2"></div>

              <div className="flex flex-col gap-2 mt-2">
                {isAuthenticated ? (
                  <motion.div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <img
                      src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover aspect-square border-2 border-blue-500"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">{userName}</div>
                      <div className="text-xs text-gray-500">Member</div>
                    </div>
                  </motion.div>
                ) : null}

                {isAuthenticated ? (
                  <motion.button
                    onClick={handleLogout}
                    variants={mobileItemVariants}
                    whileHover={{ backgroundColor: '#fee2e2' }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-red-600 bg-red-50 hover:bg-red-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2 mx-auto">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-red-500 border-r-red-500 border-b-red-500 border-l-transparent" />
                        <span>Logging out...</span>
                      </div>
                    ) : (
                      <>
                        <FiLogOut className="text-xl" />
                        <span className="font-semibold">Logout</span>
                      </>
                    )}
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      onClick={handleLogin}
                      variants={mobileItemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-3 text-blue-600 font-semibold rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiUser />
                      <span>Login</span>
                    </motion.button>
                    <motion.button
                      onClick={handleRegister}
                      variants={mobileItemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors"
                    >
                      Daftar
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
