// src/Components/DashboardCharts.jsx
import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import { formatPrice } from '../hooks/useDashboardData';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const chartVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: 0.2 },
  },
};

const ChartContainer = ({ title, icon, children }) => {
  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
        <span className="mr-2">{icon}</span> {title}
      </h3>
      <motion.div variants={chartVariants}>{children}</motion.div>
    </motion.div>
  );
};

export const PriceDistribution = ({ priceCategories }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleMouseEnter = (data, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  const getBarFill = (index) => {
    return index === activeIndex ? '#6C5CE7' : '#8884d8';
  };

  return (
    <ChartContainer title="Distribusi Harga" icon="📈">
      {priceCategories.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={priceCategories}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} axisLine={{ stroke: '#e0e0e0' }} />
            <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: '#e0e0e0' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 8,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: 'none',
              }}
            />
            <Bar dataKey="count" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} animationDuration={1500}>
              {priceCategories.map((entry, index) => (
                <motion.rect
                  key={`cell-${index}`}
                  fill={getBarFill(index)}
                  animate={{
                    fill: getBarFill(index),
                    y: activeIndex === index ? -5 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-center py-8">Tidak ada data untuk ditampilkan.</p>
      )}
    </ChartContainer>
  );
};

export const PriceCategories = ({ priceCategories }) => {
  return (
    <ChartContainer title="Kategori Harga" icon="🏷️">
      {priceCategories.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={priceCategories}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} axisLine={{ stroke: '#e0e0e0' }} />
            <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: '#e0e0e0' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 8,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: 'none',
              }}
            />
            <Bar dataKey="count" fill="#82ca9d" animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-center py-8">Tidak ada data untuk ditampilkan.</p>
      )}
    </ChartContainer>
  );
};

export const FacilitiesHistogram = ({ facilitiesHistogram }) => {
  return (
    <ChartContainer title="Histogram Total Fasilitas" icon="🏗️">
      {facilitiesHistogram.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={facilitiesHistogram}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="facilities" tick={{ fontSize: 12 }} axisLine={{ stroke: '#e0e0e0' }} />
            <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: '#e0e0e0' }} />
            <Tooltip
              formatter={(value) => [`${value} properti`, 'Jumlah']}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 8,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: 'none',
              }}
            />
            <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-center py-8">Tidak ada data untuk ditampilkan.</p>
      )}
    </ChartContainer>
  );
};

export const FacilitiesDistribution = ({ facilityPriceTrends }) => {
  const [activeTab, setActiveTab] = useState('premium');

  return (
    <ChartContainer title="Distribusi Fasilitas per Tipe" icon="📦">
      {facilityPriceTrends.premium.length > 0 ? (
        <>
          <div className="flex justify-center mb-4">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              {['premium', 'nonPremium', 'neutral'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-200 ${tab === 'premium' ? 'rounded-l-lg' : ''} ${
                    tab === 'neutral' ? 'rounded-r-lg' : ''
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'premium' ? 'Premium' : tab === 'nonPremium' ? 'Non-Premium' : 'Netral'}
                </button>
              ))}
            </div>
          </div>

          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={facilityPriceTrends[activeTab]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="facilities" tick={{ fontSize: 12 }} axisLine={{ stroke: '#e0e0e0' }} />
                <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: '#e0e0e0' }} />
                <Tooltip
                  formatter={(value) => [formatPrice(value), 'Rata-rata Harga']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: 8,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                  }}
                />
                <Bar dataKey="avgPrice" fill={activeTab === 'premium' ? '#8884d8' : activeTab === 'nonPremium' ? '#82ca9d' : '#ffc658'} radius={[4, 4, 0, 0]} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </>
      ) : (
        <p className="text-gray-500 text-center py-8">Tidak ada data untuk ditampilkan.</p>
      )}
    </ChartContainer>
  );
};

export const PriceAreaScatter = ({ filteredData }) => {
  return (
    <ChartContainer title="Harga vs Luas (m²) & Jumlah Fasilitas" icon="📐">
      {filteredData.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" dataKey="luas_m2" name="Luas (m²)" tick={{ fontSize: 12 }} axisLine={{ stroke: '#e0e0e0' }} label={{ value: 'Luas (m²)', position: 'insideBottom', offset: -5 }} />
            <YAxis type="number" dataKey="harga" name="Harga (Rp)" tick={{ fontSize: 12 }} axisLine={{ stroke: '#e0e0e0' }} label={{ value: 'Harga (Rp)', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value, name) => {
                if (name === 'harga') return [formatPrice(value), 'Harga'];
                return [value, name === 'luas_m2' ? 'Luas (m²)' : name];
              }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 8,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: 'none',
              }}
            />
            <Scatter name="Kost" data={filteredData} fill="#8884d8" animationDuration={1500}>
              {filteredData.map((entry, index) => (
                <motion.circle key={`scatter-${index}`} fill={`rgba(136, 132, 216, ${0.6 + entry.total_facilities / 20})`} r={5 + entry.total_facilities / 5} whileHover={{ r: 10, fill: '#6C5CE7' }} transition={{ duration: 0.3 }} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-center py-8">Tidak ada data untuk ditampilkan.</p>
      )}
    </ChartContainer>
  );
};

export const FacilityPriceTrends = ({ facilityPriceTrends }) => {
  const [activeType, setActiveType] = useState('all');

  const chartData = activeType === 'all' ? { premium: facilityPriceTrends.premium, nonPremium: facilityPriceTrends.nonPremium, neutral: facilityPriceTrends.neutral } : { [activeType]: facilityPriceTrends[activeType] };

  return (
    <ChartContainer title="Trend Harga Berdasarkan Jumlah Fasilitas" icon="📊">
      {facilityPriceTrends.premium.length > 0 ? (
        <>
          <div className="flex justify-center mb-4">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button className={`px-4 py-2 text-sm font-medium ${activeType === 'all' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-200 rounded-l-lg`} onClick={() => setActiveType('all')}>
                Semua
              </button>
              <button className={`px-4 py-2 text-sm font-medium ${activeType === 'premium' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-200`} onClick={() => setActiveType('premium')}>
                Premium
              </button>
              <button className={`px-4 py-2 text-sm font-medium ${activeType === 'nonPremium' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-200`} onClick={() => setActiveType('nonPremium')}>
                Non-Premium
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${activeType === 'neutral' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-200 rounded-r-lg`}
                onClick={() => setActiveType('neutral')}
              >
                Netral
              </button>
            </div>
          </div>

          <motion.div key={activeType} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="facilities" tick={{ fontSize: 12 }} axisLine={{ stroke: '#e0e0e0' }} label={{ value: 'Jumlah Fasilitas', position: 'insideBottom', offset: -5 }} allowDuplicatedCategory={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: '#e0e0e0' }} label={{ value: 'Rata-rata Harga (Rp)', angle: -90, position: 'insideLeft', offset: -5 }} />
                <Tooltip
                  formatter={(value) => [formatPrice(value), 'Rata-rata Harga']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: 8,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                  }}
                />
                <Legend />

                {activeType === 'all' || activeType === 'premium' ? (
                  <Line
                    type="monotone"
                    data={facilityPriceTrends.premium}
                    dataKey="avgPrice"
                    name="Premium"
                    stroke="#8884d8"
                    strokeWidth={3}
                    dot={{ r: 5, strokeWidth: 1 }}
                    activeDot={{ r: 8, stroke: '#8884d8', strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                ) : null}

                {activeType === 'all' || activeType === 'nonPremium' ? (
                  <Line
                    type="monotone"
                    data={facilityPriceTrends.nonPremium}
                    dataKey="avgPrice"
                    name="Non-Premium"
                    stroke="#82ca9d"
                    strokeWidth={3}
                    dot={{ r: 5, strokeWidth: 1 }}
                    activeDot={{ r: 8, stroke: '#82ca9d', strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                ) : null}

                {activeType === 'all' || activeType === 'neutral' ? (
                  <Line
                    type="monotone"
                    data={facilityPriceTrends.neutral}
                    dataKey="avgPrice"
                    name="Netral"
                    stroke="#ffc658"
                    strokeWidth={3}
                    dot={{ r: 5, strokeWidth: 1 }}
                    activeDot={{ r: 8, stroke: '#ffc658', strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                ) : null}
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </>
      ) : (
        <p className="text-gray-500 text-center py-8">Tidak ada data untuk ditampilkan.</p>
      )}
    </ChartContainer>
  );
};

export const LocationMap = ({ filteredData, mapCenter }) => {
  return (
    <ChartContainer title="Peta Persebaran Kost" icon="🗺️">
      {filteredData.length > 0 ? (
        <motion.div className="h-96 rounded-lg overflow-hidden border border-gray-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filteredData.map((item, index) => (
              <CircleMarker
                key={index}
                center={[item.latitude, item.longitude]}
                radius={5 + (Math.log(item.harga) / Math.log(10) - 5)}
                fillColor={item.total_facilities > 10 ? '#6C5CE7' : item.total_facilities > 5 ? '#FF6347' : '#FFA500'}
                color="#FFF"
                weight={2}
                opacity={0.9}
                fillOpacity={0.7}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-bold text-gray-800 mb-2 border-b pb-1">Detail Kost</h4>
                    <div className="space-y-1">
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
            ))}
          </MapContainer>
        </motion.div>
      ) : (
        <p className="text-gray-500 text-center py-8">Tidak ada data untuk peta.</p>
      )}
    </ChartContainer>
  );
};

// Dashboard wrapper component to animate the entire page
export const DashboardWrapper = ({ children }) => {
  return (
    <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, staggerChildren: 0.1 }}>
      {children}
    </motion.div>
  );
};
