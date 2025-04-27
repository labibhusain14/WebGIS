import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin, DollarSign, MessageCircle, ChevronRight } from 'lucide-react';
import Navbar from '../Components/Navbar';
import RegisterButton from '../Components/RegisterButton';

const LandingPage = () => {
  const heroRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePosition({ x: x * 20, y: y * 20 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const featureCard = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  const houseAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut', delay: 0.4 },
    },
    hover: {
      scale: 1.05,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* Hero Section */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white overflow-hidden" ref={heroRef}>
        {/* Background SVG Map */}
        <div className="absolute inset-0 opacity-10">
          <motion.svg viewBox="0 0 800 600" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5, ease: 'easeOut' }}>
            <path d="M0,0 L800,0 L800,600 L0,600 Z" fill="#001220" />
            <path d="M100,100 Q400,50 700,150 T100,300 T700,450 T100,600" fill="none" stroke="#4CAF50" strokeWidth="1" />
            <circle cx="300" cy="150" r="5" fill="#E91E63" />
            <circle cx="500" cy="250" r="5" fill="#E91E63" />
            <circle cx="200" cy="350" r="5" fill="#E91E63" />
            <circle cx="600" cy="400" r="5" fill="#E91E63" />
          </motion.svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="text-center md:text-left">
              <motion.h1 variants={fadeIn} initial="hidden" animate="visible" className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Temukan Kos Ideal Anda dengan <span className="text-blue-300">KostHub</span>
              </motion.h1>
              <motion.p variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="text-lg md:text-xl mb-8 max-w-lg mx-auto md:mx-0">
                Platform pencarian kos berbasis WebGIS dan AI yang membantu Anda menemukan hunian sesuai lokasi, budget, dan preferensi dengan cepat dan cerdas.
              </motion.p>
              <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.4 }} className="flex justify-center md:justify-start">
                <motion.a
                  href="/login"
                  whileHover={{ scale: 1.1, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-lg font-semibold"
                >
                  Mulai Sekarang <ChevronRight className="ml-2 w-5 h-5" />
                </motion.a>
              </motion.div>
            </div>

            {/* Animated House Image */}
            <motion.div
              variants={houseAnimation}
              initial="hidden"
              animate="visible"
              style={{
                translateX: mousePosition.x,
                translateY: mousePosition.y,
              }}
              className="relative flex justify-center md:justify-end"
            >
              <motion.img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" // Placeholder boarding house image
                alt="Boarding House"
                className="w-full max-w-md rounded-lg shadow-lg object-cover"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.95 }}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>
      {/* Features Section */}
      <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="max-w-6xl mx-auto px-4 py-16">
        <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-blue-900 text-center mb-12">
          Mengapa Memilih KostHub?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Globe className="w-12 h-12 text-blue-600" />,
              title: 'Pencarian Berbasis Peta',
              description: 'Temukan kos ideal dengan teknologi WebGIS yang menampilkan lokasi, fasilitas sekitar, dan akses transportasi secara real-time.',
            },
            {
              icon: <DollarSign className="w-12 h-12 text-green-600" />,
              title: 'Smart Budgeting',
              description: 'Atur anggaran hunian dengan fitur AI yang memberikan rekomendasi keuangan personal dan prediksi pengeluaran.',
            },
            {
              icon: <MessageCircle className="w-12 h-12 text-purple-600" />,
              title: 'Asisten Kos 24/7',
              description: 'Dapatkan bantuan kapan saja dengan chatbot AI kami yang siap menjawab pertanyaan dan merekomendasikan kos terbaik.',
            },
          ].map((feature, index) => (
            <motion.div key={index} variants={featureCard} whileHover="hover" className="bg-white p-6 rounded-lg shadow-md transition-transform">
              <motion.div className="flex justify-center mb-4" initial={{ rotate: 0 }} whileHover={{ rotate: 360 }} transition={{ duration: 0.8 }}>
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3 text-center">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-blue-900 text-center mb-12">
            Cara Kerja KostHub
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Cari Berdasarkan Lokasi',
                description: 'Masukkan lokasi yang Anda inginkan, dan teknologi WebGIS kami akan menampilkan kos terbaik di area tersebut.',
              },
              {
                step: '2',
                title: 'Sesuaikan Budget & Preferensi',
                description: 'Gunakan fitur smart budgeting dan filter untuk menemukan kos yang sesuai dengan anggaran dan kebutuhan Anda.',
              },
              {
                step: '3',
                title: 'Dapatkan Rekomendasi Cerdas',
                description: 'Chatbot AI kami akan memberikan rekomendasi personal dan membantu Anda hingga menemukan kos ideal.',
              },
            ].map((step, index) => (
              <motion.div key={index} variants={fadeIn} className="text-center">
                <motion.div className="flex justify-center mb-4" whileHover={{ scale: 1.2, rotate: 10 }} transition={{ duration: 0.3 }}>
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">{step.step}</div>
                </motion.div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-6xl mx-auto px-4 py-16 text-center">
        <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
          Siap Menemukan Kos Impian Anda?
        </motion.h2>
        <motion.p variants={fadeIn} transition={{ delay: 0.2 }} className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Bergabunglah dengan ribuan pengguna yang telah menemukan hunian ideal mereka dengan KostHub. Mulai pencarian Anda sekarang!
        </motion.p>
        <RegisterButton /> {/* Replaced email form with RegisterButton component */}
      </motion.section>

      {/* Footer */}
      <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="bg-blue-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={fadeIn}>
              <h3 className="text-xl font-bold mb-4">KostHub Solutions</h3>
              <p className="text-gray-300">Platform pencarian kos berbasis WebGIS dan AI untuk hunian ideal Anda.</p>
            </motion.div>
            <motion.div variants={fadeIn}>
              <h3 className="text-xl font-bold mb-4">Kontak Kami</h3>
              <div className="space-y-2">
                <p className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" /> Jl. Dr. Setiabudhi No. 229, Bandung
                </p>
                <p className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" /> info@kosthub.com
                </p>
              </div>
            </motion.div>
            <motion.div variants={fadeIn}>
              <h3 className="text-xl font-bold mb-4">Ikuti Kami</h3>
              <div className="flex space-x-4">
                <motion.a href="#" className="text-gray-300 hover:text-white" whileHover={{ y: -2 }}>
                  Twitter
                </motion.a>
                <motion.a href="#" className="text-gray-300 hover:text-white" whileHover={{ y: -2 }}>
                  Instagram
                </motion.a>
                <motion.a href="#" className="text-gray-300 hover:text-white" whileHover={{ y: -2 }}>
                  LinkedIn
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
          <motion.div variants={fadeIn} className="mt-8 text-center text-gray-300">
            © 2025 KostHub. All rights reserved.
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
