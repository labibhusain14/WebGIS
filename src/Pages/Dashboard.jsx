import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../Components/Navbar';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import dashboardData from '../data/dashboard_data.json';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Filter states
  const [selectedKecamatans, setSelectedKecamatans] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [selectedGenders, setSelectedGenders] = useState([]);

  useEffect(() => {
    // Process the imported JSON data
    const processedData = dashboardData.filter((item) => item.harga); // Filter out incomplete rows

    // Fix known incorrect values
    const fixedData = processedData.map((item) => {
      if (item.id === 563) {
        return { ...item, lebar: 3.5 };
      }
      if (item.id === 677) {
        return { ...item, lebar: 2.5, panjang: 2.8 };
      }
      if (item.id === 811) {
        return { ...item, lebar: 4.5 };
      }
      return item;
    });

    setData(fixedData);

    // Initialize filters with all values
    const kecamatans = [...new Set(fixedData.map((item) => item.kecamatan))].sort();
    setSelectedKecamatans(kecamatans);

    const genders = [...new Set(fixedData.map((item) => item.gender))];
    setSelectedGenders(genders);

    const minPrice = Math.min(...fixedData.map((item) => item.harga));
    const maxPrice = Math.max(...fixedData.map((item) => item.harga));
    setPriceRange([minPrice, maxPrice]);

    setFilteredData(fixedData);
  }, []);

  // Apply filters when they change
  useEffect(() => {
    if (data.length) {
      const filtered = data.filter((item) => selectedKecamatans.includes(item.kecamatan) && selectedGenders.includes(item.gender) && item.harga >= priceRange[0] && item.harga <= priceRange[1]);
      setFilteredData(filtered);
    }
  }, [selectedKecamatans, selectedGenders, priceRange, data]);

  // Compute metrics
  const metrics = useMemo(() => {
    if (!filteredData.length) return { count: 0, avgPrice: 0, avgArea: 0, kecCount: 0 };

    return {
      count: filteredData.length,
      avgPrice: filteredData.reduce((sum, item) => sum + item.harga, 0) / filteredData.length,
      avgArea: filteredData.reduce((sum, item) => sum + item.luas_m2, 0) / filteredData.length,
      kecCount: new Set(filteredData.map((item) => item.kecamatan)).size,
    };
  }, [filteredData]);

  // Prepare data for price category chart
  const priceCategories = useMemo(() => {
    if (!filteredData.length) return [];

    const categories = {};
    filteredData.forEach((item) => {
      categories[item.kategori_harga] = (categories[item.kategori_harga] || 0) + 1;
    });

    return Object.keys(categories)
      .map((key) => ({
        category: key,
        count: categories[key],
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredData]);

  // Prepare data for facilities histogram
  const facilitiesHistogram = useMemo(() => {
    if (!filteredData.length) return [];

    const histogram = {};
    filteredData.forEach((item) => {
      const bin = item.total_facilities;
      histogram[bin] = (histogram[bin] || 0) + 1;
    });

    return Object.keys(histogram)
      .map((key) => ({
        facilities: parseInt(key),
        count: histogram[key],
      }))
      .sort((a, b) => a.facilities - b.facilities);
  }, [filteredData]);

  // Prepare data for price vs facilities trends
  const facilityPriceTrends = useMemo(() => {
    if (!filteredData.length) return { premium: [], nonPremium: [], neutral: [] };

    const premiumGroups = {};
    const nonPremiumGroups = {};
    const neutralGroups = {};

    filteredData.forEach((item) => {
      // Premium
      if (!premiumGroups[item.jumlah_fasilitas_premium]) {
        premiumGroups[item.jumlah_fasilitas_premium] = {
          count: 0,
          sum: 0,
        };
      }
      premiumGroups[item.jumlah_fasilitas_premium].count++;
      premiumGroups[item.jumlah_fasilitas_premium].sum += item.harga;

      // Non-Premium
      if (!nonPremiumGroups[item.jumlah_fasilitas_non_premium]) {
        nonPremiumGroups[item.jumlah_fasilitas_non_premium] = {
          count: 0,
          sum: 0,
        };
      }
      nonPremiumGroups[item.jumlah_fasilitas_non_premium].count++;
      nonPremiumGroups[item.jumlah_fasilitas_non_premium].sum += item.harga;

      // Neutral
      if (!neutralGroups[item.jumlah_fasilitas_netral]) {
        neutralGroups[item.jumlah_fasilitas_netral] = {
          count: 0,
          sum: 0,
        };
      }
      neutralGroups[item.jumlah_fasilitas_netral].count++;
      neutralGroups[item.jumlah_fasilitas_netral].sum += item.harga;
    });

    return {
      premium: Object.keys(premiumGroups)
        .map((key) => ({
          facilities: parseInt(key),
          avgPrice: premiumGroups[key].sum / premiumGroups[key].count,
        }))
        .sort((a, b) => a.facilities - b.facilities),

      nonPremium: Object.keys(nonPremiumGroups)
        .map((key) => ({
          facilities: parseInt(key),
          avgPrice: nonPremiumGroups[key].sum / nonPremiumGroups[key].count,
        }))
        .sort((a, b) => a.facilities - b.facilities),

      neutral: Object.keys(neutralGroups)
        .map((key) => ({
          facilities: parseInt(key),
          avgPrice: neutralGroups[key].sum / neutralGroups[key].count,
        }))
        .sort((a, b) => a.facilities - b.facilities),
    };
  }, [filteredData]);

  // Get unique kecamatans and genders for filters
  const availableKecamatans = useMemo(() => {
    return [...new Set(data.map((item) => item.kecamatan))].sort();
  }, [data]);

  const availableGenders = useMemo(() => {
    return [...new Set(data.map((item) => item.gender))];
  }, [data]);

  // Calculate price range for slider
  const fullPriceRange = useMemo(() => {
    if (!data.length) return [0, 10000000];
    return [Math.min(...data.map((item) => item.harga)), Math.max(...data.map((item) => item.harga))];
  }, [data]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  // Handle filter changes
  const handleKecamatanChange = (kec) => {
    if (selectedKecamatans.includes(kec)) {
      setSelectedKecamatans(selectedKecamatans.filter((k) => k !== kec));
    } else {
      setSelectedKecamatans([...selectedKecamatans, kec]);
    }
  };

  const handleSelectAllKecamatans = () => {
    setSelectedKecamatans([...availableKecamatans]);
  };

  const handleClearKecamatans = () => {
    setSelectedKecamatans([]);
  };

  const handleGenderChange = (gender) => {
    if (selectedGenders.includes(gender)) {
      setSelectedGenders(selectedGenders.filter((g) => g !== gender));
    } else {
      setSelectedGenders([...selectedGenders, gender]);
    }
  };

  const handlePriceRangeChange = (event) => {
    const [min, max] = event.target.value.split(',').map(Number);
    setPriceRange([min, max]);
  };

  // Calculate map center
  const mapCenter = useMemo(() => {
    if (!filteredData.length) return [-6.9, 107.6]; // Default to Bandung area

    const latSum = filteredData.reduce((sum, item) => sum + item.latitude, 0);
    const lngSum = filteredData.reduce((sum, item) => sum + item.longitude, 0);

    return [latSum / filteredData.length, lngSum / filteredData.length];
  }, [filteredData]);

  return (
    <div className="mt-12 relative min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-col md:flex-row">
        {/* Sidebar Filter */}
        <div className="w-full md:w-64 bg-white p-4 shadow-md">
          <h2 className="text-xl font-bold mb-4">🎛️ Filter Data</h2>
          {/* Kecamatan Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Kecamatan</label>
            <div className="flex gap-2 mb-2">
              <button onClick={handleSelectAllKecamatans} className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                Semua
              </button>
              <button onClick={handleClearKecamatans} className="text-xs bg-gray-500 text-white px-2 py-1 rounded">
                Reset
              </button>
            </div>
            <div className="max-h-40 overflow-y-auto">
              {availableKecamatans.map((kec) => (
                <div key={kec} className="flex items-center mb-1">
                  <input type="checkbox" id={`kec-${kec}`} checked={selectedKecamatans.includes(kec)} onChange={() => handleKecamatanChange(kec)} className="mr-2" />
                  <label htmlFor={`kec-${kec}`} className="text-sm">
                    {kec}
                  </label>
                </div>
              ))}
            </div>
          </div>
          {/* Price Range
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rentang Harga (Rp)</label>
            <div className="flex justify-between text-xs mb-1">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
            <input type="range" min={fullPriceRange[0]} max={fullPriceRange[1]} value={`${priceRange[0]},${priceRange[1]}`} onChange={handlePriceRangeChange} className="w-full" multiple />
          </div> */}
          {/* Gender Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Kos</label>
            {availableGenders.map((gender) => (
              <div key={gender} className="flex items-center mb-1">
                <input type="checkbox" id={`gender-${gender}`} checked={selectedGenders.includes(gender)} onChange={() => handleGenderChange(gender)} className="mr-2" />
                <label htmlFor={`gender-${gender}`} className="text-sm">
                  {gender}
                </label>
              </div>
            ))}
          </div>
          {/* Footer */}
          <div className="mt-8 pt-4 border-t text-xs text-gray-500">KostHub 2025</div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-2">📊 Dashboard Market Analysis Kost</h1>
          <p className="text-gray-600 mb-4">Visualisasi interaktif data kost berdasarkan harga, luas, fasilitas, dan lokasi.</p>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">Total Listings</h3>
              <p className="text-2xl font-bold">{metrics.count}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">Harga Rata-rata (Rp)</h3>
              <p className="text-2xl font-bold">{formatPrice(Math.round(metrics.avgPrice))}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">Luas Rata-rata (m²)</h3>
              <p className="text-2xl font-bold">{metrics.avgArea.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm text-gray-500">Kecamatan Terpilih</h3>
              <p className="text-2xl font-bold">{metrics.kecCount}</p>
            </div>
          </div>

          {/* Row 1: KDE and Price Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">📈 Distribusi Harga</h3>
              {filteredData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={priceCategories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500">Tidak ada data untuk ditampilkan.</p>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">🏷️ Kategori Harga</h3>
              {filteredData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={priceCategories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500">Tidak ada data untuk ditampilkan.</p>
              )}
            </div>
          </div>

          {/* Row 2: Facilities Histogram & Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">🏗️ Histogram Total Fasilitas</h3>
              {filteredData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={facilitiesHistogram}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="facilities" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500">Tidak ada data untuk ditampilkan.</p>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">📦 Distribusi Fasilitas per Tipe</h3>
              {filteredData.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 h-64">
                  <div>
                    <p className="text-center font-medium text-sm">Premium</p>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={facilityPriceTrends.premium}>
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="avgPrice" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <p className="text-center font-medium text-sm">Non-Premium</p>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={facilityPriceTrends.nonPremium}>
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="avgPrice" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <p className="text-center font-medium text-sm">Netral</p>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={facilityPriceTrends.neutral}>
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="avgPrice" fill="#ffc658" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Tidak ada data untuk ditampilkan.</p>
              )}
            </div>
          </div>

          {/* Scatter Chart: Price vs Area */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-medium mb-2">📐 Harga vs Luas (m²) & Jumlah Fasilitas</h3>
            {filteredData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="luas_m2" name="Luas (m²)" />
                  <YAxis type="number" dataKey="harga" name="Harga (Rp)" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value) => formatPrice(value)} />
                  <Scatter name="Kost" data={filteredData} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">Tidak ada data untuk ditampilkan.</p>
            )}
          </div>

          {/* Trend Charts */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-medium mb-2">📊 Trend Harga Berdasarkan Jumlah Fasilitas</h3>
            {filteredData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-center font-medium">Premium</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={facilityPriceTrends.premium}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="facilities" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatPrice(value)} />
                      <Line type="monotone" dataKey="avgPrice" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h4 className="text-center font-medium">Non-Premium</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={facilityPriceTrends.nonPremium}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="facilities" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatPrice(value)} />
                      <Line type="monotone" dataKey="avgPrice" stroke="#82ca9d" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h4 className="text-center font-medium">Netral</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={facilityPriceTrends.neutral}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="facilities" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatPrice(value)} />
                      <Line type="monotone" dataKey="avgPrice" stroke="#ffc658" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Tidak ada data untuk ditampilkan.</p>
            )}
          </div>

          {/* Map */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">🗺️ Peta Persebaran Kost</h3>
            {filteredData.length > 0 ? (
              <div className="h-96">
                <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {filteredData.map((item, index) => (
                    <CircleMarker key={index} center={[item.latitude, item.longitude]} radius={5 + item.luas_m2 / 5} fillColor="#FF6347" color="#FF6347" weight={1} opacity={0.8} fillOpacity={0.6}>
                      <Popup>
                        <div>
                          <p>
                            <strong>Harga:</strong> Rp {formatPrice(item.harga)}
                          </p>
                          <p>
                            <strong>Luas:</strong> {item.luas_m2} m²
                          </p>
                          <p>
                            <strong>Fasilitas:</strong> {item.total_facilities}
                          </p>
                          <p>
                            <strong>Kecamatan:</strong> {item.kecamatan}
                          </p>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              </div>
            ) : (
              <p className="text-gray-500">Tidak ada data untuk peta.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
