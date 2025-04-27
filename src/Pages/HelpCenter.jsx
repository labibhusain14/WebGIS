import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Book, MessageCircle, HelpCircle, ChevronDown, ChevronUp, ArrowRight, MapPin, DollarSign, Send } from 'lucide-react';
import Navbar from '../Components/Navbar';

const HelpCenterPage = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Reset suggestions when search query changes
  useEffect(() => {
    if (searchQuery.length > 1) {
      setShowSearchSuggestions(true);
    } else {
      setShowSearchSuggestions(false);
    }
  }, [searchQuery]);

  const toggleCategory = (index) => {
    setActiveCategory(activeCategory === index ? null : index);
  };

  const categories = [
    {
      title: 'Memulai dengan KostHub',
      icon: <Book size={20} />,
      articles: ['Cara membuat akun pencari kos', 'Mengatur preferensi pencarian kos Anda', 'Mengatur filter lokasi dan budget', 'Membuat profil pencari kos yang menarik'],
    },
    {
      title: 'Pencarian Berbasis Peta',
      icon: <MapPin size={20} />,
      articles: ['Cara menggunakan fitur pencarian peta interaktif', 'Memahami informasi lokasi dan lingkungan sekitar', 'Mencari kos berdasarkan jarak ke kampus/kantor', 'Melihat fasilitas umum di sekitar lokasi kos'],
    },
    {
      title: 'Smart Budgeting',
      icon: <DollarSign size={20} />,
      articles: ['Menggunakan fitur Smart Budgeting untuk perencanaan keuangan', 'Menyesuaikan anggaran hunian dengan pendapatan', 'Memahami prediksi pengeluaran bulanan', 'Tips mengoptimalkan budget hunian dengan AI'],
    },
    {
      title: 'Chatbot Asisten KostHub',
      icon: <MessageCircle size={20} />,
      articles: ['Memaksimalkan bantuan Chatbot Asisten', 'Perintah khusus yang bisa digunakan ke Asisten', 'Mendapatkan rekomendasi kos personal dari Asisten', 'Menanyakan informasi detail kos ke Asisten'],
    },
    {
      title: 'Booking dan Pembayaran',
      icon: <HelpCircle size={20} />,
      articles: ['Cara memesan kos secara online', 'Metode pembayaran yang tersedia', 'Memahami kebijakan pembatalan', 'Pengembalian deposit dan jaminan'],
    },
  ];

  const popularArticles = [
    'Cara menemukan kos sesuai budget',
    'Menggunakan filter Smart Map untuk mencari kos ideal',
    'Tips berkomunikasi dengan pemilik kos',
    'Bagaimana fitur Smart Budgeting membantu menghemat',
    'Memanfaatkan Chatbot Asisten untuk riset kos',
  ];

  // Get search suggestions based on all articles
  const getSearchSuggestions = () => {
    if (!searchQuery) return [];

    const allArticles = categories.flatMap((category) => category.articles.map((article) => ({ article, category: category.title })));

    return allArticles.filter((item) => item.article.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
  };

  const searchSuggestions = getSearchSuggestions();

  const filteredCategories = categories.filter((category) => category.title.toLowerCase().includes(searchQuery.toLowerCase()) || category.articles.some((article) => article.toLowerCase().includes(searchQuery.toLowerCase())));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const expandVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        height: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header with curved bottom */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 pb-16 relative">
        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-gray-50"
          style={{
            borderTopLeftRadius: '50% 100%',
            borderTopRightRadius: '50% 100%',
            transform: 'scale(1.5)',
          }}
        ></div>

        <motion.div className="max-w-5xl mx-auto mt-16 relative z-10" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold mb-2">Pusat Bantuan KostHub</h1>
          <p className="text-blue-100 text-lg mb-8">Temukan jawaban untuk perjalanan mencari kos impian Anda</p>

          {/* Search Bar with animation */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className={`${isSearchFocused ? 'text-blue-600' : 'text-blue-300'} transition-colors duration-200`} size={20} />
            </div>
            <motion.input
              type="text"
              className="block w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
              placeholder="Cari bantuan seputar pencarian kos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              initial={{ scale: 0.98 }}
              whileFocus={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />

            {/* Search suggestions dropdown */}
            {/* <AnimatePresence>
              {showSearchSuggestions && searchSuggestions.length > 0 && (
                <motion.div
                  className="absolute left-0 right-0 bg-white mt-2 rounded-lg shadow-xl z-50 overflow-hidden border border-gray-100"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ul>
                    {searchSuggestions.map((item, idx) => (
                      <li key={idx} className="border-b border-gray-100 last:border-b-0">
                        <button
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-start transition-colors duration-150"
                          onClick={() => {
                            setSearchQuery(item.article);
                            setShowSearchSuggestions(false);
                          }}
                        >
                          <Search size={16} className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-gray-800">{item.article}</p>
                            <p className="text-xs text-gray-500">Kategori: {item.category}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence> */}
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Categories */}
          <motion.div className="md:col-span-2" variants={containerVariants} initial="hidden" animate="visible">
            <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center">
              <span className="bg-blue-100 p-2 rounded-lg mr-3">
                <HelpCircle size={20} className="text-blue-600" />
              </span>
              Kategori Bantuan
            </h2>

            {filteredCategories.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                {filteredCategories.map((category, index) => (
                  <motion.div key={index} className="border-b border-gray-100 last:border-b-0" variants={itemVariants}>
                    <motion.button
                      onClick={() => toggleCategory(index)}
                      className="flex items-center justify-between w-full p-5 text-left hover:bg-blue-50 transition-colors duration-200"
                      whileHover={{ backgroundColor: 'rgba(239, 246, 255, 0.7)' }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center">
                        <span className="bg-blue-100 p-2 rounded-lg text-blue-600 mr-4">{category.icon}</span>
                        <span className="font-medium text-gray-800">{category.title}</span>
                      </div>
                      <motion.div animate={{ rotate: activeCategory === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronDown size={20} className="text-gray-500" />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {activeCategory === index && (
                        <motion.div className="px-5 pb-5 bg-blue-50 bg-opacity-30" variants={expandVariants} initial="hidden" animate="visible" exit="exit">
                          <ul className="space-y-3 pl-12">
                            {category.articles
                              .filter((article) => article.toLowerCase().includes(searchQuery.toLowerCase()))
                              .map((article, idx) => (
                                <motion.li key={idx} className="flex items-start group" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                                  <ArrowRight size={16} className="mt-1 mr-3 text-blue-500 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-200" />
                                  <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                                    {article}
                                  </a>
                                </motion.li>
                              ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-4 text-gray-400">
                  <Search size={48} className="mx-auto" />
                </div>
                <p className="text-gray-600 mb-3">Tidak ada hasil yang ditemukan untuk "{searchQuery}"</p>
                <button className="px-5 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200" onClick={() => setSearchQuery('')}>
                  Reset pencarian
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Popular Articles */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
            <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center">
              <span className="bg-blue-100 p-2 rounded-lg mr-3">
                <Book size={20} className="text-blue-600" />
              </span>
              Artikel Populer
            </h2>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <ul className="space-y-4">
                {popularArticles.map((article, index) => (
                  <motion.li key={index} className="flex items-start group" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + index * 0.1 }} whileHover={{ x: 5 }}>
                    <ArrowRight size={16} className="mt-1 mr-3 text-blue-600 flex-shrink-0 group-hover:text-blue-500" />
                    <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                      {article}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div className="mt-8 pt-5 border-t border-gray-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                <div className="bg-blue-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <MessageCircle size={18} className="text-blue-600 mr-2" />
                    Masih bingung mencari kos?
                  </h3>
                  <motion.button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center font-medium transition duration-200" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    Chat dengan Asisten KostHub
                    <Send size={16} className="ml-2" />
                  </motion.button>
                  <div className="mt-4 text-center">
                    <a href="#" className="text-blue-600 hover:text-blue-800 text-sm underline underline-offset-2">
                      atau hubungi tim dukungan kami
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 py-8 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div className="mb-4 md:mb-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              <p className="text-gray-600">&copy; 2025 KostHub. All rights reserved.</p>
            </motion.div>
            <motion.div className="flex space-x-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                Syarat Penggunaan
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                Kebijakan Privasi
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                FAQ
              </a>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HelpCenterPage;
