// src/Components/DashboardCharts.jsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import { formatPrice } from '../hooks/useDashboardData';

// Enhanced animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      duration: 0.6,
    },
  },
  hover: {
    y: -8,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15,
    },
  },
};

const chartVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      delay: 0.3,
    },
  },
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const ChartContainer = ({ title, icon, children, className = '' }) => {
  const [isInView, setIsInView] = useState(false);

  return (
    <motion.div
      className={`bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 transition-all ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, amount: 0.2 }}
      onViewportEnter={() => setIsInView(true)}
    >
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center text-gray-800">
        <span className="mr-2 text-xl sm:text-2xl">{icon}</span>
        <span className="truncate">{title}</span>
      </h3>
      <motion.div variants={chartVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
        {children}
      </motion.div>
    </motion.div>
  );
};

export const PriceCategories = ({ priceCategories }) => {
  return (
    <ChartContainer title="Kategori Harga" icon="🏷️">
      {priceCategories.length > 0 ? (
        <ResponsiveContainer width="100%" height={280} minHeight={280}>
          <BarChart data={priceCategories} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={{ stroke: '#e0e0e0' }} height={60} angle={-45} textAnchor="end" />
            <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={{ stroke: '#e0e0e0' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                borderRadius: 12,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                border: 'none',
                padding: '10px',
              }}
              cursor={{ fill: 'rgba(130, 202, 157, 0.1)' }}
            />
            <Bar dataKey="count" fill="#82ca9d" animationDuration={1800} animationEasing="ease-in-out" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="text-4xl mb-3">
            📊
          </motion.div>
          <p>Tidak ada data untuk ditampilkan.</p>
        </div>
      )}
    </ChartContainer>
  );
};

export const FacilitiesHistogram = ({ facilitiesHistogram }) => {
  return (
    <ChartContainer title="Histogram Total Fasilitas" icon="🏗️">
      {facilitiesHistogram.length > 0 ? (
        <ResponsiveContainer width="100%" height={280} minHeight={280}>
          <BarChart data={facilitiesHistogram} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="facilities" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={{ stroke: '#e0e0e0' }} />
            <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={{ stroke: '#e0e0e0' }} />
            <Tooltip
              formatter={(value) => [`${value} properti`, 'Jumlah']}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                borderRadius: 12,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                border: 'none',
                padding: '10px',
              }}
              cursor={{ fill: 'rgba(136, 132, 216, 0.1)' }}
            />
            <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} animationDuration={1800} animationEasing="ease-in-out" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="text-4xl mb-3">
            📊
          </motion.div>
          <p>Tidak ada data untuk ditampilkan.</p>
        </div>
      )}
    </ChartContainer>
  );
};

export const FacilitiesDistribution = ({ facilityPriceTrends }) => {
  const [activeTab, setActiveTab] = useState('premium');

  return (
    <ChartContainer title="Distribusi Fasilitas per Tipe" icon="📦" className="lg:col-span-2">
      {facilityPriceTrends.premium.length > 0 ? (
        <>
          <div className="flex justify-center mb-4 overflow-x-auto pb-2">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              {['premium', 'nonPremium', 'neutral'].map((tab) => (
                <motion.button
                  key={tab}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${activeTab === tab ? 'bg-blue-500 text-white ring-2 ring-blue-300' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-200 ${
                    tab === 'premium' ? 'rounded-l-lg' : ''
                  } ${tab === 'neutral' ? 'rounded-r-lg' : ''} transition-all duration-200`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'premium' ? 'Premium' : tab === 'nonPremium' ? 'Non-Premium' : 'Netral'}
                </motion.button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <ResponsiveContainer width="100%" height={300} minHeight={280}>
                <BarChart data={facilityPriceTrends[activeTab]} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="facilities" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={{ stroke: '#e0e0e0' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={{ stroke: '#e0e0e0' }} tickFormatter={(value) => (value >= 1000000 ? `${(value / 1000000).toFixed(0)}jt` : value)} />
                  <Tooltip
                    formatter={(value) => [formatPrice(value), 'Rata-rata Harga']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      borderRadius: 12,
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                      padding: '10px',
                    }}
                    cursor={{ fill: 'rgba(136, 132, 216, 0.1)' }}
                  />
                  <Bar dataKey="avgPrice" fill={activeTab === 'premium' ? '#8884d8' : activeTab === 'nonPremium' ? '#82ca9d' : '#ffc658'} radius={[4, 4, 0, 0]} animationDuration={1000} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="text-4xl mb-3">
            📊
          </motion.div>
          <p>Tidak ada data untuk ditampilkan.</p>
        </div>
      )}
    </ChartContainer>
  );
};

export const PriceAreaScatter = ({ filteredData }) => {
  return (
    <ChartContainer title="Harga vs Luas (m²) & Jumlah Fasilitas" icon="📐" className="lg:col-span-3">
      {filteredData.length > 0 ? (
        <ResponsiveContainer width="100%" height={350} minHeight={320}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              dataKey="luas_m2"
              name="Luas (m²)"
              tick={{ fontSize: 10, fill: '#6B7280' }}
              axisLine={{ stroke: '#e0e0e0' }}
              label={{ value: 'Luas (m²)', position: 'insideBottom', offset: -5, fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis
              type="number"
              dataKey="harga"
              name="Harga (Rp)"
              tick={{ fontSize: 10, fill: '#6B7280' }}
              axisLine={{ stroke: '#e0e0e0' }}
              label={{ value: 'Harga (Rp)', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#6B7280' }}
              tickFormatter={(value) => (value >= 1000000 ? `${(value / 1000000).toFixed(0)}jt` : value)}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value, name) => {
                if (name === 'harga') return [formatPrice(value), 'Harga'];
                return [value, name === 'luas_m2' ? 'Luas (m²)' : name];
              }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                borderRadius: 12,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                border: 'none',
                padding: '10px',
              }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Scatter name="Kost" data={filteredData} fill="#8884d8" animationDuration={2000} animationEasing="ease-out">
              {filteredData.map((entry, index) => {
                const size = 5 + entry.total_facilities / 4;
                const opacity = 0.6 + entry.total_facilities / 20;

                return (
                  <motion.circle
                    key={`scatter-${index}`}
                    cx={0}
                    cy={0}
                    r={size}
                    fill={`rgba(108, 92, 231, ${opacity})`}
                    whileHover={{
                      r: size * 1.8,
                      fill: '#6C5CE7',
                      stroke: '#FFF',
                      strokeWidth: 2,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 15,
                    }}
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="text-4xl mb-3">
            📈
          </motion.div>
          <p>Tidak ada data untuk ditampilkan.</p>
        </div>
      )}
    </ChartContainer>
  );
};

export const FacilityPriceTrends = ({ facilityPriceTrends }) => {
  const [activeType, setActiveType] = useState('all');

  const chartData = activeType === 'all' ? { premium: facilityPriceTrends.premium, nonPremium: facilityPriceTrends.nonPremium, neutral: facilityPriceTrends.neutral } : { [activeType]: facilityPriceTrends[activeType] };

  return (
    <ChartContainer title="Trend Harga Berdasarkan Jumlah Fasilitas" icon="📊" className="lg:col-span-2">
      {facilityPriceTrends.premium.length > 0 ? (
        <>
          <div className="flex justify-center mb-4 overflow-x-auto pb-2">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <motion.button
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${
                  activeType === 'all' ? 'bg-blue-500 text-white ring-2 ring-blue-300' : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-200 rounded-l-lg transition-all duration-200`}
                onClick={() => setActiveType('all')}
                whileTap={{ scale: 0.95 }}
              >
                Semua
              </motion.button>
              <motion.button
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${
                  activeType === 'premium' ? 'bg-blue-500 text-white ring-2 ring-blue-300' : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-200 transition-all duration-200`}
                onClick={() => setActiveType('premium')}
                whileTap={{ scale: 0.95 }}
              >
                Premium
              </motion.button>
              <motion.button
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${
                  activeType === 'nonPremium' ? 'bg-blue-500 text-white ring-2 ring-blue-300' : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-200 transition-all duration-200`}
                onClick={() => setActiveType('nonPremium')}
                whileTap={{ scale: 0.95 }}
              >
                Non-Premium
              </motion.button>
              <motion.button
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${
                  activeType === 'neutral' ? 'bg-blue-500 text-white ring-2 ring-blue-300' : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-200 rounded-r-lg transition-all duration-200`}
                onClick={() => setActiveType('neutral')}
                whileTap={{ scale: 0.95 }}
              >
                Netral
              </motion.button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeType} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <ResponsiveContainer width="100%" height={350} minHeight={280}>
                <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="facilities"
                    tick={{ fontSize: 10, fill: '#6B7280' }}
                    axisLine={{ stroke: '#e0e0e0' }}
                    label={{ value: 'Jumlah Fasilitas', position: 'insideBottom', offset: -5, fontSize: 12, fill: '#6B7280' }}
                    allowDuplicatedCategory={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#6B7280' }}
                    axisLine={{ stroke: '#e0e0e0' }}
                    label={{ value: 'Rata-rata Harga (Rp)', angle: -90, position: 'insideLeft', offset: -5, fontSize: 12, fill: '#6B7280' }}
                    tickFormatter={(value) => (value >= 1000000 ? `${(value / 1000000).toFixed(0)}jt` : value)}
                  />
                  <Tooltip
                    formatter={(value) => [formatPrice(value), 'Rata-rata Harga']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      borderRadius: 12,
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                      padding: '10px',
                    }}
                    cursor={{ strokeDasharray: '3 3' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

                  {(activeType === 'all' || activeType === 'premium') && (
                    <Line
                      type="monotone"
                      data={facilityPriceTrends.premium}
                      dataKey="avgPrice"
                      name="Premium"
                      stroke="#8884d8"
                      strokeWidth={3}
                      dot={{ r: 5, strokeWidth: 1, fill: '#fff' }}
                      activeDot={{ r: 8, stroke: '#8884d8', strokeWidth: 2, fill: '#fff' }}
                      animationDuration={1800}
                      animationEasing="ease-in-out"
                    />
                  )}

                  {(activeType === 'all' || activeType === 'nonPremium') && (
                    <Line
                      type="monotone"
                      data={facilityPriceTrends.nonPremium}
                      dataKey="avgPrice"
                      name="Non-Premium"
                      stroke="#82ca9d"
                      strokeWidth={3}
                      dot={{ r: 5, strokeWidth: 1, fill: '#fff' }}
                      activeDot={{ r: 8, stroke: '#82ca9d', strokeWidth: 2, fill: '#fff' }}
                      animationDuration={1800}
                      animationEasing="ease-in-out"
                    />
                  )}

                  {(activeType === 'all' || activeType === 'neutral') && (
                    <Line
                      type="monotone"
                      data={facilityPriceTrends.neutral}
                      dataKey="avgPrice"
                      name="Netral"
                      stroke="#ffc658"
                      strokeWidth={3}
                      dot={{ r: 5, strokeWidth: 1, fill: '#fff' }}
                      activeDot={{ r: 8, stroke: '#ffc658', strokeWidth: 2, fill: '#fff' }}
                      animationDuration={1800}
                      animationEasing="ease-in-out"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="text-4xl mb-3">
            📈
          </motion.div>
          <p>Tidak ada data untuk ditampilkan.</p>
        </div>
      )}
    </ChartContainer>
  );
};

export const LocationMap = ({ filteredData, mapCenter }) => {
  return (
    <ChartContainer title="Peta Persebaran Kost" icon="🗺️" className="lg:col-span-3">
      {filteredData.length > 0 ? (
        <motion.div className="h-80 sm:h-96 rounded-lg overflow-hidden border border-gray-200 shadow-inner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ZoomControl position="bottomright" />

            {filteredData.map((item, index) => {
              // Calculate size based on price and facilities
              const radius = 5 + (Math.log(item.harga) / Math.log(10) - 5);
              // Color based on facility count
              const fillColor =
                item.total_facilities > 10
                  ? '#6C5CE7' // Purple for high facilities
                  : item.total_facilities > 5
                  ? '#FF6347' // Tomato for medium
                  : '#FFA500'; // Orange for low

              return (
                <CircleMarker key={index} center={[item.latitude, item.longitude]} radius={radius} fillColor={fillColor} color="#FFF" weight={2} opacity={0.9} fillOpacity={0.7}>
                  <Popup className="custom-popup">
                    <div className="p-2">
                      <h4 className="font-bold text-gray-800 mb-2 border-b pb-2 text-sm sm:text-base">Detail Kost</h4>
                      <div className="space-y-1.5 text-xs sm:text-sm">
                        <p className="flex justify-between">
                          <span className="font-medium">Harga:</span>
                          <span className="text-blue-600 font-semibold">Rp {formatPrice(item.harga)}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-medium">Luas:</span>
                          <span>{item.luas_m2} m²</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-medium">Fasilitas:</span>
                          <span>{item.total_facilities}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-medium">Kecamatan:</span>
                          <span>{item.kecamatan}</span>
                        </p>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="text-4xl mb-3">
            🗺️
          </motion.div>
          <p>Tidak ada data untuk peta.</p>
        </div>
      )}
    </ChartContainer>
  );
};

// Dashboard wrapper component with enhanced layout and staggered animations
export const DashboardWrapper = ({ children }) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isAnimating && (
        <motion.div className="fixed inset-0 bg-white z-50 flex items-center justify-center" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.8, delay: 1.5 }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: [0, 10, 0, -10, 0] }}
            transition={{
              scale: { duration: 0.5 },
              opacity: { duration: 0.5 },
              rotate: { duration: 1, repeat: Infinity, repeatType: 'loop' },
            }}
            className="text-6xl"
          >
            📊
          </motion.div>
        </motion.div>
      )}

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6 p-4 sm:p-6"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        transition={{
          staggerChildren: 0.15,
          delayChildren: 0.3,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};

// Add stylesheet for custom scrollbar and other global styles
export const GlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Custom Scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
      
      /* Prevent content jump when scrollbar appears */
      html {
        scrollbar-gutter: stable;
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
};
