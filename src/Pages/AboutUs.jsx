import { useState } from 'react';
import {
  Globe,
  Users,
  Award,
  Map,
  Compass,
  Code,
  // ChevronRight,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import Navbar from '../Components/Navbar';

const AboutUsPage = () => {
  const [activeTab, setActiveTab] = useState('vision');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section with Map Background */}
      <div className="relative bg-blue-900 text-white mt-10">
        {/* Map SVG Background Overlay with reduced opacity */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 800 600" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 L800,0 L800,600 L0,600 Z" fill="#001220" />
            <path d="M100,100 Q400,50 700,150 T100,300 T700,450 T100,600" fill="none" stroke="#4CAF50" strokeWidth="1" />
            <path d="M200,50 Q500,100 800,200" fill="none" stroke="#2196F3" strokeWidth="1" />
            <circle cx="300" cy="150" r="5" fill="#E91E63" />
            <circle cx="500" cy="250" r="5" fill="#E91E63" />
            <circle cx="200" cy="350" r="5" fill="#E91E63" />
            <circle cx="600" cy="400" r="5" fill="#E91E63" />
            <path d="M50,200 L250,220 L350,180 L450,300 L650,250 L750,350" fill="none" stroke="#FFC107" strokeWidth="1" />
            <path d="M150,400 L350,380 L550,450 L750,420" fill="none" stroke="#FF5722" strokeWidth="1" />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">KostHub Solutions</h1>
            <p className="text-xl md:text-2xl mb-8">Temukan kos ideal dengan teknologi pemetaan cerdas dan AI</p>
            <div className="flex items-center space-x-2 text-blue-300">
              <Globe className="w-5 h-5" />
              <span>Solusi pencarian kos berbasis lokasi dengan smart budgeting</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* About Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-blue-900">About Us</h2>
            <p className="text-gray-700 mb-4">
              KostHub didirikan pada tahun 2025 dengan visi untuk merevolusi cara pencarian dan pengelolaan tempat kos di Indonesia. Kami merupakan platform teknologi inovatif yang mengintegrasikan Sistem Informasi Geografis berbasis web
              (WebGIS) dengan kecerdasan buatan untuk memberikan pengalaman pencarian kos yang komprehensif dan personal.
            </p>
            <p className="text-gray-700 mb-4">
              Tim kami terdiri dari ahli GIS, pengembang perangkat lunak, pakar AI, dan analis data yang berdedikasi untuk menciptakan solusi pencarian kos yang tidak hanya akurat secara lokasi tetapi juga memahami kebutuhan dan anggaran
              spesifik setiap pengguna melalui teknologi smart budgeting dan chatbot asisten kos.
            </p>
            <p className="text-gray-700">
              Dengan perpaduan teknologi WebGIS dan AI canggih, kami membantu pencari kos menemukan hunian ideal yang sesuai lokasi, budget, dan preferensi, serta memberikan wawasan keuangan cerdas untuk perencanaan jangka panjang dan
              keputusan hunian yang lebih baik.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-white p-1 rounded-lg shadow-lg">
              <div className="bg-gray-100 rounded overflow-hidden">
                <svg viewBox="0 0 800 600" className="w-full h-80" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0,0 L800,0 L800,600 L0,600 Z" fill="#f8fafc" />
                  <path fill="none" stroke="#3b82f6" strokeWidth="2" d="M0,150 Q200,100 400,200 T800,150" />
                  <path fill="none" stroke="#10b981" strokeWidth="2" d="M0,300 Q200,250 400,350 T800,300" />
                  <path fill="none" stroke="#f59e0b" strokeWidth="2" d="M0,450 Q200,400 400,500 T800,450" />
                  <circle cx="200" cy="120" r="6" fill="#3b82f6" />
                  <circle cx="350" cy="180" r="6" fill="#3b82f6" />
                  <circle cx="500" cy="150" r="6" fill="#3b82f6" />
                  <circle cx="650" cy="170" r="6" fill="#3b82f6" />
                  <circle cx="150" cy="270" r="6" fill="#10b981" />
                  <circle cx="300" cy="320" r="6" fill="#10b981" />
                  <circle cx="450" cy="350" r="6" fill="#10b981" />
                  <circle cx="600" cy="310" r="6" fill="#10b981" />
                  <circle cx="750" cy="290" r="6" fill="#10b981" />
                  <circle cx="100" cy="420" r="6" fill="#f59e0b" />
                  <circle cx="250" cy="430" r="6" fill="#f59e0b" />
                  <circle cx="400" cy="480" r="6" fill="#f59e0b" />
                  <circle cx="550" cy="450" r="6" fill="#f59e0b" />
                  <circle cx="700" cy="440" r="6" fill="#f59e0b" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Vision-Mission-Values Tabs */}
        <div className="mb-20">
          <div className="flex flex-wrap border-b border-gray-200 mb-8">
            {['vision', 'mission', 'values'].map((tab) => (
              <button key={tab} className={`py-3 px-6 font-medium text-lg transition-colors ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`} onClick={() => setActiveTab(tab)}>
                {tab === 'vision' ? 'Visi' : tab === 'mission' ? 'Misi' : 'Nilai-Nilai'}
              </button>
            ))}
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            {activeTab === 'vision' && (
              <div className="flex flex-col md:flex-row items-center md:space-x-8">
                <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                  <div className="p-4 bg-blue-50 rounded-full">
                    <Map className="w-24 h-24 text-blue-600" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">Visi Kami</h3>
                  <p className="text-gray-700 mb-4">
                    Menjadi pionir dalam transformasi ekosistem hunian kos di Indonesia melalui teknologi WebGIS dan AI yang menghubungkan pencari kos dengan hunian ideal mereka. Kami membayangkan dunia di mana pencarian tempat tinggal
                    menjadi proses yang menyenangkan, personal, dan mendukung kesehatan finansial jangka panjang.
                  </p>
                  <p className="text-gray-700">
                    Kami berkomitmen untuk terus mengembangkan platform yang memudahkan akses ke hunian berkualitas, mempermudah perencanaan keuangan hunian, dan menciptakan pengalaman pencarian kos yang lebih cerdas, efisien, dan sesuai
                    dengan kebutuhan individu.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'mission' && (
              <div className="flex flex-col md:flex-row items-center md:space-x-8">
                <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                  <div className="p-4 bg-green-50 rounded-full">
                    <Compass className="w-24 h-24 text-green-600" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">Misi Kami</h3>
                  <p className="text-gray-700 mb-4">Misi kami adalah menyediakan platform pencarian kos berbasis WebGIS dengan AI yang komprehensif yang memungkinkan pengguna untuk:</p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                    <li>Menemukan kos ideal berdasarkan lokasi, harga, dan preferensi pribadi dengan mudah</li>
                    <li>Merencanakan dan mengelola budget hunian dengan cerdas melalui fitur smart budgeting</li>
                    <li>Mendapatkan bantuan dan saran personal melalui chatbot asisten kos 24/7</li>
                    <li>Mengakses informasi lengkap tentang lingkungan sekitar kos melalui analisis geospasial</li>
                    <li>Membuat keputusan hunian berbasis data yang mendukung gaya hidup dan kesehatan finansial</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'values' && (
              <div className="flex flex-col md:flex-row items-center md:space-x-8">
                <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                  <div className="p-4 bg-purple-50 rounded-full">
                    <Award className="w-24 h-24 text-purple-600" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">Nilai-Nilai Kami</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Inovasi</h4>
                      <p className="text-gray-700">Kami terus mengintegrasikan teknologi terdepan seperti AI dan WebGIS untuk menciptakan solusi pencarian kos yang revolusioner.</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Akurasi</h4>
                      <p className="text-gray-700">Kami berkomitmen pada ketepatan data lokasi dan informasi kos untuk membantu pengguna membuat keputusan hunian yang tepat.</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Personalisasi</h4>
                      <p className="text-gray-700">Kami menciptakan pengalaman pencarian kos yang sesuai dengan kebutuhan unik setiap individu melalui teknologi AI yang adaptif.</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Literasi Keuangan</h4>
                      <p className="text-gray-700">Kami membantu pengguna membuat keputusan hunian yang bertanggung jawab secara finansial melalui fitur smart budgeting dan perencanaan keuangan.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Our Solutions */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-blue-900 text-center">Our Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Pencarian Kos Berbasis Peta',
                description: 'Platform WebGIS yang memungkinkan pencarian kos berdasarkan lokasi, akses ke transportasi, fasilitas sekitar, dan preferensi pribadi.',
                icon: <Globe className="w-10 h-10 text-blue-600" />,
              },
              {
                title: 'Smart Budgeting',
                description: 'Fitur AI yang membantu merencanakan dan mengelola budget hunian, memprediksi pengeluaran, dan memberikan rekomendasi keuangan personal.',
                icon: <Code className="w-10 h-10 text-green-600" />,
              },
              {
                title: 'Asisten Kos Chatbot',
                description: 'Asisten virtual berbasis AI yang siap membantu menjawab pertanyaan, memberikan rekomendasi, dan memandu proses pencarian kos 24/7.',
                icon: <Users className="w-10 h-10 text-purple-600" />,
              },
            ].map((solution, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md transition-transform hover:transform hover:-translate-y-1">
                <div className="bg-gray-50 p-4 rounded-full inline-block mb-4">{solution.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-blue-900">{solution.title}</h3>
                <p className="text-gray-700 mb-4">{solution.description}</p>
                {/* <a
                  href="#"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <span className="mr-1">Pelajari lebih lanjut</span>
                  <ChevronRight className="w-4 h-4" />
                </a> */}
              </div>
            ))}
          </div>
        </div>

        {/* Our Team */}
        <div className="mb-20 px-4 sm:px-8">
          <h2 className="text-3xl font-bold mb-8 text-blue-900 text-center">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Muhammad Rizki',
                position: 'Project Leader',
                image: 'https://media.licdn.com/dms/image/v2/D5603AQEZQH6sOG5naw/profile-displayphoto-shrink_800_800/B56ZV0lGyGGoAc-/0/1741417639885?e=1750896000&v=beta&t=7nVYM5a9qd48iJmBwe1YlVxc1-FS5ciZ6WUtBZuNdLc',
              },
              {
                name: 'Ihsan Ghozi Zulfikar',
                position: 'Backend Developer',
                image: 'https://media.licdn.com/dms/image/v2/D5603AQGf91A1H7mDKA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1700967413391?e=1750896000&v=beta&t=9QwSmEUmFkIxbt59Uu9AQyAVv15aHQGbChTxlSELTbE',
              },
              {
                name: 'Ade Mulyana',
                position: 'Frontend Developer',
                image: 'https://media.licdn.com/dms/image/v2/D5603AQGeLk6cp3dcdg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1725885567904?e=1750896000&v=beta&t=EW8USzkVzWqXcw9ypq7e3r1g83xlWpUK_JWpatOgWdw',
              },
              {
                name: 'Bayu Wicaksono',
                position: 'ML Engineer',
                image: 'https://media.licdn.com/dms/image/v2/D5603AQEtlobG5x8QBg/profile-displayphoto-shrink_800_800/B56ZQ6fie7HoAc-/0/1736148134351?e=1750896000&v=beta&t=g_T0usPEmxnvSkK3YfY8-G900FjfSXCt454WEVXBwQM',
              },
              {
                name: 'Mohammad Labib Husain',
                position: 'UI/UX Designer',
                image: 'https://avatars.githubusercontent.com/u/119772365?v=4',
              },
              {
                name: 'Siti Milatu Diniah',
                position: 'Geospatial Data Analyst',
                image: 'https://media.licdn.com/dms/image/v2/D4E03AQFvOXDPjIHkcw/profile-displayphoto-shrink_800_800/B4EZTK9EoWHUAk-/0/1738571795591?e=1750896000&v=beta&t=VHg3bSzDKBnRi0ZD-_Xr-I2-p4eUaEMPpDLLDHVIoyo',
              },
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-transform hover:-translate-y-1">
                <img src={member.image} alt={member.name} className="w-full h-48 object-cover" />
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-blue-900">{member.name}</h3>
                  <p className="text-gray-600 text-sm">{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-blue-900 text-center">Connect With Us</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 bg-blue-900 text-white">
                <h3 className="text-2xl font-bold mb-6">Informasi Kontak</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-6 h-6 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Alamat</p>
                      <p>
                        Jl. Dr. Setiabudhi No. 229,
                        <br />
                        Bandung 40154 Jawa Barat,
                        <br />
                        Indonesia
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="w-6 h-6 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p>info@kosthub.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="w-6 h-6 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Telepon</p>
                      <p>+62 21 5555 8888</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-blue-900">Kirim Pesan</h3>
                <form>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 mb-1">
                        Nama
                      </label>
                      <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-700 mb-1">
                        Email
                      </label>
                      <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-gray-700 mb-1">
                      Subjek
                    </label>
                    <input type="text" id="subject" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 mb-1">
                      Pesan
                    </label>
                    <textarea id="message" rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Kirim Pesan
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default AboutUsPage;
