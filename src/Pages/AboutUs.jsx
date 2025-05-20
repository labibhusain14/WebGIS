import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Users, Award, Map, Compass, Code, ChevronRight, MapPin, Mail, Phone, Heart, Star, Check, Coffee, ArrowRight, Square } from 'lucide-react';
import Navbar from '../Components/Navbar';
import ProfileImg1 from '../assets/about/profile-1.jpg';
import ProfileImg2 from '../assets/about/profile-2.jpg';
import ProfileImg3 from '../assets/about/profile-3.jpg';
import ProfileImg4 from '../assets/about/profile-4.jpg';
import ProfileImg5 from '../assets/about/profile-5.jpg';
import ProfileImg6 from '../assets/about/profile-6.jpg';
// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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

const Solutions = () => {
  const solutions = [
    {
      title: 'Pencarian Kos Berbasis Peta',
      description: 'Platform WebGIS interaktif yang memungkinkan pencarian kos berdasarkan lokasi, akses ke transportasi, fasilitas sekitar, dan preferensi pribadi.',
      icon: <Globe className="w-12 h-12 text-blue-600" />,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Smart Budgeting',
      description: 'Fitur AI yang membantu merencanakan dan mengelola budget hunian, memprediksi pengeluaran, dan memberikan rekomendasi keuangan personal.',
      icon: <Code className="w-12 h-12 text-green-600" />,
      color: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Asisten Kos Chatbot',
      description: 'Asisten virtual berbasis AI yang siap membantu menjawab pertanyaan, memberikan rekomendasi, dan memandu proses pencarian kos 24/7.',
      icon: <Users className="w-12 h-12 text-purple-600" />,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <motion.div className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-50" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeInUp}>
      <div className="max-w-7xl mx-auto">
        <motion.div className="text-center mb-16" variants={fadeInUp}>
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Solusi Kami</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">KostHub menyediakan berbagai solusi cerdas untuk memudahkan pencarian dan pengelolaan kos Anda</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={staggerContainer}>
        {solutions.map((solution, index) => (
          <motion.div
            key={index}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            variants={fadeInUp}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          >
            <div>
              <div className={`${solution.color} p-5 rounded-full inline-block mb-6`}>
                {solution.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-blue-900">{solution.title}</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">{solution.description}</p>
            </div>

            <motion.a
              href="#"
              className={`inline-flex items-center font-medium ${solution.iconColor} hover:underline mt-auto`}
              whileHover={{ x: 5 }}
            >
              <span className="mr-2">Pelajari lebih lanjut</span>
              <ChevronRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        ))}
      </motion.div>

      </div>
    </motion.div>
  );
};

const Team = () => {
  const team = [
    {
      name: 'Muhammad Rizki',
      position: 'Project Leader',
      bio: 'Mahasiswa Ilmu Komputer UPI 2021, Memiliki minat di software development & Artificial intelligence',
      image: ProfileImg1,
    },
    {
      name: 'Ihsan Ghozi Zulfikar',
      position: 'Backend Developer',
      bio: 'Mahasiswa Ilmu Komputer UPI 2021, fokus di pengembangan API dan backend.',
      image: ProfileImg2,
    },
    {
      name: 'Ade Mulyana',
      position: 'Frontend Developer',
      bio: 'Mahasiswa Ilmu Komputer UPI 2021, fokus dalam UI/UX dan pengembangan antarmuka pengguna.',
      image: ProfileImg3,
    },
    {
      name: 'Bayu Wicaksono',
      position: 'ML Engineer',
      bio: 'Mahasiswa Ilmu Komputer UPI 2021, mendalami machine learning untuk pengembangan fitur rekomendasi.',
      image: ProfileImg4,
    },
    {
      name: 'Mohammad Labib Husain',
      position: 'UI/UX Designer',
      bio: 'Mahasiswa Ilmu Komputer UPI 2021, fokus pada desain berbasis user experience.',
      image: ProfileImg5,
    },
    {
      name: 'Siti Milatu Diniah',
      position: 'Geospatial Data Analyst',
      bio: 'Mahasiswa Pendidikan Geografi UPI 2022, berfokus pada analisis data spasial dan pemetaan.',
      image: ProfileImg6,
    },
  ];

  return (
    <motion.div className="py-10 px-4 sm:px-6 lg:px-8 bg-white" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeInUp}>
      <div className="max-w-7xl mx-auto">
        <motion.div className="text-center mb-16" variants={fadeInUp}>
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Tim Hebat Kami</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Perkenalkan para ahli di balik KostHub yang berdedikasi untuk memberikan solusi terbaik</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" variants={staggerContainer}>
          {team.map((member, index) => (
            <motion.div key={index} className="group" variants={fadeInUp} whileHover={{ y: -10, transition: { duration: 0.2 } }}>
              <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl">
                <div className="h-64 overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <motion.div className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-50" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeInUp}>
      <div className="max-w-7xl mx-auto">
        <motion.div className="text-center mb-16" variants={fadeInUp}>
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Hubungi Kami</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Ada pertanyaan atau ingin berkolaborasi? Jangan ragu untuk menghubungi tim KostHub</p>
        </motion.div>

        <motion.div className="bg-white rounded-2xl shadow-lg overflow-hidden" variants={fadeInUp}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12 bg-gradient-to-br from-blue-900 to-blue-700 text-white">
              <h3 className="text-2xl font-bold mb-8">Informasi Kontak</h3>

              <div className="space-y-6">
                <motion.div className="flex items-start" whileHover={{ x: 5 }}>
                  <div className="bg-blue-800/40 p-3 rounded-full mr-4">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-lg mb-1">Alamat</p>
                    <p className="text-blue-100">
                      Jl. Dr. Setiabudhi No. 229,
                      <br />
                      Bandung 40154 Jawa Barat,
                      <br />
                      Indonesia
                    </p>
                  </div>
                </motion.div>

                <motion.div className="flex items-start" whileHover={{ x: 5 }}>
                  <div className="bg-blue-800/40 p-3 rounded-full mr-4">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-lg mb-1">Email</p>
                    <p className="text-blue-100">info@kosthub.com</p>
                  </div>
                </motion.div>

                <motion.div className="flex items-start" whileHover={{ x: 5 }}>
                  <div className="bg-blue-800/40 p-3 rounded-full mr-4">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-lg mb-1">Telepon</p>
                    <p className="text-blue-100">+62 21 5555 8888</p>
                  </div>
                </motion.div>
              </div>

              <div className="mt-12">
                <h4 className="text-xl font-bold mb-4">Ikuti Kami</h4>
                <div className="flex space-x-4">
                  {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                    <motion.a key={social} href="#" className="bg-blue-800/40 p-3 rounded-full hover:bg-blue-600 transition-colors" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                      <span className="sr-only">{social}</span>
                      {/* Icon placeholder - replace with actual social icons */}
                      <div className="w-5 h-5 bg-white rounded-full"></div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 lg:p-12">
              <h3 className="text-2xl font-bold mb-6 text-blue-900">Kirim Pesan</h3>

              {submitted ? (
                <motion.div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="font-medium">Terima kasih!</p>
                  <p>Pesan Anda telah terkirim. Kami akan menghubungi Anda segera.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">
                        Nama
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-gray-700 mb-2 font-medium">
                      Subjek
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 mb-2 font-medium">
                      Pesan
                    </label>
                    <textarea
                      id="message"
                      rows="5"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    ></textarea>
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mengirim...
                      </>
                    ) : (
                      'Kirim Pesan'
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
const AboutUsPage = () => {
  const [activeTab, setActiveTab] = useState('vision');
  const [isVisible, setIsVisible] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // Function to handle scroll animation visibility
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero-section', 'about-section', 'tabs-section', 'solutions-section', 'team-section', 'contact-section'];

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isCurrentlyVisible = rect.top <= window.innerHeight * 0.75 && rect.bottom >= 0;
          setIsVisible((prev) => ({
            ...prev,
            [section]: isCurrentlyVisible,
          }));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    alert('Form submitted! Thank you for your message.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  // Framer motion variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
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

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <Navbar />

      {/* Hero Section with Map Background */}
      <motion.div id="hero-section" className="relative bg-gradient-to-r from-blue-900 to-indigo-800 text-white mt-16 overflow-hidden" initial="hidden" animate={isVisible['hero-section'] ? 'visible' : 'hidden'} variants={fadeIn}>
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white opacity-20"
              style={{
                width: Math.random() * 10 + 2,
                height: Math.random() * 10 + 2,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * -100 - 50],
                x: [0, (Math.random() - 0.5) * 50],
                opacity: [0.2, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                repeatType: 'loop',
              }}
            />
          ))}
        </div>

        {/* Map SVG Background Overlay with reduced opacity */}
        <div className="absolute inset-0 opacity-10">
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

        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32 lg:py-40">
          <motion.div className="md:w-2/3" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
              KostHub Solutions
            </motion.h1>
            <motion.p className="text-xl md:text-2xl mb-8 text-blue-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}>
              Temukan kos ideal di Kota Bandung dengan teknologi pemetaan cerdas dan AI
            </motion.p>
            <motion.div className="flex items-center space-x-2 text-blue-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}>
              <Globe className="w-5 h-5" />
              <span>Solusi pencarian kos berbasis lokasi dengan smart budgeting</span>
            </motion.div>
            <motion.button
              className="mt-8 px-8 py-3 bg-white text-blue-900 rounded-full font-medium hover:bg-blue-100 transition-colors flex items-center space-x-2 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <span>Mulai Pencarian</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div className="bg-white py-6 shadow-md relative z-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '1000+', label: 'Kos Terdaftar', icon: <MapPin className="w-6 h-6 text-blue-500 mx-auto mb-2" /> },
              { value: '25+', label: 'Kecamatan', icon: <Map className="w-6 h-6 text-blue-500 mx-auto mb-2" /> },
              { value: '11.7 m²', label: 'Rata-rata Luas Kos', icon: <Square className="w-6 h-6 text-blue-500 mx-auto mb-2" /> },
              { value: 'Mulai Rp400rb', label: 'Harga Kos', icon: <Star className="w-6 h-6 text-blue-500 mx-auto mb-2" /> },
            ].map((stat, index) => (
              <motion.div key={index} className="p-4" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
                {stat.icon}
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* About Section */}
        <motion.div id="about-section" className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24" initial="hidden" animate={isVisible['about-section'] ? 'visible' : 'hidden'} variants={fadeIn}>
          <motion.div variants={fadeIn}>
            <h2 className="text-3xl font-bold mb-6 text-blue-900 relative">
              About Us
              <span className="absolute bottom-0 left-0 w-16 h-1 bg-blue-500"></span>
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              KostHub adalah proyek yang dikembangkan untuk MAPID WebGIS Competition 2025. Kami membuat platform pencarian kos berbasis WebGIS yang dilengkapi dengan fitur smart budgeting dan asisten AI untuk membantu pengguna menemukan kos
              sesuai kebutuhan.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Tim ini terdiri dari mahasiswa dengan latar belakang pengembangan perangkat lunak, GIS, dan kecerdasan buatan. Kami berusaha menggabungkan teknologi peta dan AI untuk memberikan solusi yang sederhana, efisien, dan tepat
              sasaran dalam mencari tempat kos.
            </p>
            <p className="text-gray-700 leading-relaxed">Melalui proyek ini, kami berharap dapat memberikan pengalaman pencarian kos yang lebih mudah, terarah, dan sesuai dengan preferensi pengguna.</p>

            <motion.div className="mt-6 flex space-x-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <motion.button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <span>Pelajari Selengkapnya</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </motion.div>
          <motion.div className="flex items-center justify-center" variants={fadeIn}>
            <motion.div
              className="bg-white p-1 rounded-lg shadow-xl"
              whileHover={{
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                y: -5,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <motion.div
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded overflow-hidden"
                animate={{
                  background: ['#f8fafc', '#f1f5f9', '#f8fafc'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                <svg viewBox="0 0 800 600" className="w-full h-80" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0,0 L800,0 L800,600 L0,600 Z" fill="#f8fafc" />
                  <motion.path fill="none" stroke="#3b82f6" strokeWidth="2" d="M0,150 Q200,100 400,200 T800,150" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 2, delay: 0.5 }} />
                  <motion.path fill="none" stroke="#10b981" strokeWidth="2" d="M0,300 Q200,250 400,350 T800,300" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 2, delay: 1 }} />
                  <motion.path fill="none" stroke="#f59e0b" strokeWidth="2" d="M0,450 Q200,400 400,500 T800,450" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 2, delay: 1.5 }} />

                  {[
                    { cx: 200, cy: 120, fill: '#3b82f6', delay: 2.0 },
                    { cx: 350, cy: 180, fill: '#3b82f6', delay: 2.1 },
                    { cx: 500, cy: 150, fill: '#3b82f6', delay: 2.2 },
                    { cx: 650, cy: 170, fill: '#3b82f6', delay: 2.3 },
                    { cx: 150, cy: 270, fill: '#10b981', delay: 2.4 },
                    { cx: 300, cy: 320, fill: '#10b981', delay: 2.5 },
                    { cx: 450, cy: 350, fill: '#10b981', delay: 2.6 },
                    { cx: 600, cy: 310, fill: '#10b981', delay: 2.7 },
                    { cx: 750, cy: 290, fill: '#10b981', delay: 2.8 },
                    { cx: 100, cy: 420, fill: '#f59e0b', delay: 2.9 },
                    { cx: 250, cy: 430, fill: '#f59e0b', delay: 3.0 },
                    { cx: 400, cy: 480, fill: '#f59e0b', delay: 3.1 },
                    { cx: 550, cy: 450, fill: '#f59e0b', delay: 3.2 },
                    { cx: 700, cy: 440, fill: '#f59e0b', delay: 3.3 },
                  ].map((circle, index) => (
                    <motion.circle key={index} cx={circle.cx} cy={circle.cy} r="6" fill={circle.fill} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: circle.delay }} />
                  ))}
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Vision-Mission-Values Tabs */}
        <motion.div id="tabs-section" className="mb-24" initial="hidden" animate={isVisible['tabs-section'] ? 'visible' : 'hidden'} variants={fadeIn}>
          <div className="flex flex-wrap justify-center border-b border-gray-200 mb-8">
            {['vision', 'mission', 'values'].map((tab) => (
              <motion.button
                key={tab}
                className={`py-3 px-8 font-medium text-lg transition-colors relative ${activeTab === tab ? 'text-blue-600 font-semibold' : 'text-gray-500 hover:text-blue-600'}`}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab === 'vision' ? 'Visi' : tab === 'mission' ? 'Misi' : 'Nilai-Nilai'}
                {activeTab === tab && <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" layoutId="tabIndicator" initial={false} />}
              </motion.button>
            ))}
          </div>

          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            key={activeTab} // This forces a re-render when the tab changes
          >
            {activeTab === 'vision' && (
              <motion.div className="flex flex-col md:flex-row items-center md:space-x-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                  <motion.div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full" whileHover={{ scale: 1.05, rotate: 5 }} transition={{ type: 'spring', stiffness: 300, damping: 10 }}>
                    <Map className="w-24 h-24 text-blue-600" />
                  </motion.div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">Visi Kami</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Menjadi pionir dalam transformasi ekosistem hunian kos di Indonesia melalui teknologi WebGIS dan AI yang menghubungkan pencari kos dengan hunian ideal mereka. Kami membayangkan dunia di mana pencarian tempat tinggal
                    menjadi proses yang menyenangkan, personal, dan mendukung kesehatan finansial jangka panjang.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Kami berkomitmen untuk terus mengembangkan platform yang memudahkan akses ke hunian berkualitas, mempermudah perencanaan keuangan hunian, dan menciptakan pengalaman pencarian kos yang lebih cerdas, efisien, dan sesuai
                    dengan kebutuhan individu.
                  </p>
                  <motion.div className="mt-6 flex space-x-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <motion.div className="flex items-center space-x-2 text-blue-600" whileHover={{ x: 5 }}>
                      <Check className="w-5 h-5" />
                      <span>Inovatif</span>
                    </motion.div>
                    <motion.div className="flex items-center space-x-2 text-blue-600" whileHover={{ x: 5 }}>
                      <Check className="w-5 h-5" />
                      <span>Terpercaya</span>
                    </motion.div>
                    <motion.div className="flex items-center space-x-2 text-blue-600" whileHover={{ x: 5 }}>
                      <Check className="w-5 h-5" />
                      <span>Berkualitas</span>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === 'mission' && (
              <motion.div className="flex flex-col md:flex-row items-center md:space-x-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                  <motion.div className="p-8 bg-gradient-to-br from-green-50 to-emerald-100 rounded-full" whileHover={{ scale: 1.05, rotate: -5 }} transition={{ type: 'spring', stiffness: 300, damping: 10 }}>
                    <Compass className="w-24 h-24 text-green-600" />
                  </motion.div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">Misi Kami</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">Misi kami adalah menyediakan platform pencarian kos berbasis WebGIS dengan AI yang komprehensif yang memungkinkan pengguna untuk:</p>
                  <motion.ul className="space-y-3 text-gray-700 mb-4" variants={staggerContainer} initial="hidden" animate="visible">
                    {[
                      'Menemukan kos ideal berdasarkan lokasi, harga, dan preferensi pribadi dengan mudah',
                      'Merencanakan dan mengelola budget hunian dengan cerdas melalui fitur smart budgeting',
                      'Mendapatkan bantuan dan saran personal melalui chatbot asisten kos 24/7',
                      'Mengakses informasi lengkap tentang lingkungan sekitar kos melalui analisis geospasial',
                      'Membuat keputusan hunian berbasis data yang mendukung gaya hidup dan kesehatan finansial',
                    ].map((item, index) => (
                      <motion.li key={index} className="flex items-start" variants={itemVariant}>
                        <span className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <Check className="w-4 h-4 text-green-600" />
                        </span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </motion.div>
            )}

            {activeTab === 'values' && (
              <motion.div className="flex flex-col md:flex-row items-center md:space-x-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                  <motion.div className="p-8 bg-gradient-to-br from-purple-50 to-violet-100 rounded-full" whileHover={{ scale: 1.05, rotate: 5 }} transition={{ type: 'spring', stiffness: 300, damping: 10 }}>
                    <Award className="w-24 h-24 text-purple-600" />
                  </motion.div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">Nilai-Nilai Kami</h3>
                  <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={staggerContainer} initial="hidden" animate="visible">
                    {[
                      {
                        title: 'Inovasi',
                        description: 'Kami terus mengintegrasikan teknologi terdepan seperti AI dan WebGIS untuk menciptakan solusi pencarian kos yang revolusioner.',
                        color: 'blue',
                      },
                      {
                        title: 'Akurasi',
                        description: 'Kami berkomitmen pada ketepatan data lokasi dan informasi kos untuk membantu pengguna membuat keputusan hunian yang tepat.',
                        color: 'green',
                      },
                      {
                        title: 'Personalisasi',
                        description: 'Kami menciptakan pengalaman pencarian kos yang sesuai dengan kebutuhan unik setiap individu melalui teknologi AI yang adaptif.',
                        color: 'purple',
                      },
                      {
                        title: 'Literasi Keuangan',
                        description: 'Kami membantu pengguna membuat keputusan hunian yang bertanggung jawab secara finansial melalui fitur smart budgeting dan perencanaan keuangan.',
                        color: 'yellow',
                      },
                    ].map((value, index) => (
                      <motion.div
                        key={index}
                        className={`p-6 bg-gradient-to-br from-${value.color}-50 to-white rounded-lg shadow-sm hover:shadow-md transition-shadow`}
                        variants={itemVariant}
                        whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      >
                        <h4 className={`font-semibold text-${value.color}-900 mb-2 text-lg`}>{value.title}</h4>
                        <p className="text-gray-700">{value.description}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        <Solutions />
        <Team />
        <Contact />
      </div>

       {/* Footer */}
      <footer className="bg-white mt-12 py-8 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-center">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-gray-600">&copy; 2025 KostHub. All rights reserved.</p>
            </motion.div>
          </div>
        </div>
      </footer>

      {/* Footer */}

      {/* <footer className="bg-gray-100 py-6 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">&copy; 2025 KostHub. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default AboutUsPage;
