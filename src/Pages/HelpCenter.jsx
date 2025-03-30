import { useState } from 'react';
import { Search, Book, MessageCircle, HelpCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import Navbar from '../Components/Navbar';

const HelpCenterPage = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCategory = (index) => {
    setActiveCategory(activeCategory === index ? null : index);
  };

  const categories = [
    {
      title: 'Memulai',
      icon: <Book size={20} />,
      articles: [
        'Cara membuat akun baru',
        'Mengatur profil Anda',
        'Cara mendaftar newsletter',
        'Langkah-langkah verifikasi akun'
      ]
    },
    {
      title: 'Fitur Umum',
      icon: <HelpCircle size={20} />,
      articles: [
        'Cara menggunakan dashboard',
        'Mengatur notifikasi',
        'Mengubah pengaturan bahasa',
        'Melihat riwayat aktivitas'
      ]
    },
    {
      title: 'Pembayaran',
      icon: <MessageCircle size={20} />,
      articles: [
        'Metode pembayaran yang tersedia',
        'Cara mengubah informasi pembayaran',
        'Memahami tagihan bulanan',
        'Proses pengembalian dana'
      ]
    }
  ];

  const popularArticles = [
    'Cara mengatur ulang kata sandi',
    'Mengatasi masalah login',
    'Cara menghubungi tim dukungan',
    'Langkah-langkah memperbarui aplikasi'
  ];

  const filteredCategories = categories.filter(category => 
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    category.articles.some(article => article.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Header */}
      <header className="bg-blue-600 text-white p-6">
        <div className="max-w-5xl mx-auto mt-16">
          <h1 className="text-3xl font-bold mb-4">Pusat Bantuan</h1>
          <p className="mb-6">Temukan jawaban atas pertanyaan Anda</p>
          
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-blue-300" size={20} />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none"
              placeholder="Cari bantuan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Categories */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Kategori Bantuan</h2>
            {filteredCategories.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredCategories.map((category, index) => (
                  <div key={index} className="border-b border-gray-200 last:border-b-0">
                    <button
                      onClick={() => toggleCategory(index)}
                      className="flex items-center justify-between w-full p-4 text-left"
                    >
                      <div className="flex items-center">
                        <span className="text-blue-600 mr-3">{category.icon}</span>
                        <span className="font-medium">{category.title}</span>
                      </div>
                      {activeCategory === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    
                    {activeCategory === index && (
                      <div className="px-4 pb-4">
                        <ul className="space-y-2 pl-9">
                          {category.articles
                            .filter(article => article.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((article, idx) => (
                              <li key={idx} className="text-blue-600 hover:text-blue-800 cursor-pointer">
                                {article}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p>Tidak ada hasil yang ditemukan untuk `{searchQuery}`</p>
                <button 
                  className="mt-3 text-blue-600 hover:text-blue-800"
                  onClick={() => setSearchQuery('')}
                >
                  Reset pencarian
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Popular Articles */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Artikel Populer</h2>
            <div className="bg-white rounded-lg shadow p-4">
              <ul className="space-y-3">
                {popularArticles.map((article, index) => (
                  <li key={index} className="flex items-start">
                    <ArrowRight size={16} className="mt-1 mr-2 text-blue-600 flex-shrink-0" />
                    <a href="#" className="text-blue-600 hover:text-blue-800">{article}</a>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-medium mb-3">Butuh bantuan lainnya?</h3>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200">
                  Hubungi Kami
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 mt-12 py-6 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">&copy; 2025 KostHub. All rights reserved.</p>
            </div>
            {/* <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-600">Syarat Penggunaan</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">Kebijakan Privasi</a>
            </div> */}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HelpCenterPage;