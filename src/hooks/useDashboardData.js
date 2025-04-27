// src/hooks/useDashboardData.js
import { useState, useEffect, useMemo } from 'react';

export const useDashboardData = (initialData) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Filter states
  const [selectedKecamatans, setSelectedKecamatans] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [selectedGenders, setSelectedGenders] = useState([]);

  useEffect(() => {
    // Process the imported JSON data
    const processedData = initialData.filter((item) => item.harga); // Filter out incomplete rows

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
  }, [initialData]);

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
      avgPrice: Math.round(filteredData.reduce((sum, item) => sum + item.harga, 0) / filteredData.length),
      avgArea: Number((filteredData.reduce((sum, item) => sum + item.luas_m2, 0) / filteredData.length).toFixed(2)),
      kecCount: new Set(filteredData.map((item) => item.kecamatan)).size,
    };
  }, [filteredData]);

  // Chart data preparation
  const chartData = useMemo(() => {
    if (!filteredData.length)
      return {
        priceCategories: [],
        facilitiesHistogram: [],
        facilityPriceTrends: { premium: [], nonPremium: [], neutral: [] },
      };

    // Price categories
    const categories = {};
    filteredData.forEach((item) => {
      categories[item.kategori_harga] = (categories[item.kategori_harga] || 0) + 1;
    });

    const priceCategories = Object.keys(categories)
      .map((key) => ({
        category: key,
        count: categories[key],
      }))
      .sort((a, b) => b.count - a.count);

    // Facilities histogram
    const histogram = {};
    filteredData.forEach((item) => {
      const bin = item.total_facilities;
      histogram[bin] = (histogram[bin] || 0) + 1;
    });

    const facilitiesHistogram = Object.keys(histogram)
      .map((key) => ({
        facilities: parseInt(key),
        count: histogram[key],
      }))
      .sort((a, b) => a.facilities - b.facilities);

    // Price vs facilities trends
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

    const facilityPriceTrends = {
      premium: Object.keys(premiumGroups)
        .map((key) => ({
          facilities: parseInt(key),
          avgPrice: Math.round(premiumGroups[key].sum / premiumGroups[key].count),
          count: premiumGroups[key].count,
        }))
        .sort((a, b) => a.facilities - b.facilities),

      nonPremium: Object.keys(nonPremiumGroups)
        .map((key) => ({
          facilities: parseInt(key),
          avgPrice: Math.round(nonPremiumGroups[key].sum / nonPremiumGroups[key].count),
          count: nonPremiumGroups[key].count,
        }))
        .sort((a, b) => a.facilities - b.facilities),

      neutral: Object.keys(neutralGroups)
        .map((key) => ({
          facilities: parseInt(key),
          avgPrice: Math.round(neutralGroups[key].sum / neutralGroups[key].count),
          count: neutralGroups[key].count,
        }))
        .sort((a, b) => a.facilities - b.facilities),
    };

    return {
      priceCategories,
      facilitiesHistogram,
      facilityPriceTrends,
    };
  }, [filteredData]);

  // Map center calculation
  const mapCenter = useMemo(() => {
    if (!filteredData.length) return [-6.9, 107.6]; // Default to Bandung area

    const latSum = filteredData.reduce((sum, item) => sum + item.latitude, 0);
    const lngSum = filteredData.reduce((sum, item) => sum + item.longitude, 0);

    return [latSum / filteredData.length, lngSum / filteredData.length];
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

  // Fixed handler for the price range slider
  const handlePriceRangeChange = (event) => {
    const [min, max] = event.target.value.split(',').map(Number);
    setPriceRange([min, max]);
  };

  // Filter handlers
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

  return {
    data,
    filteredData,
    metrics,
    chartData,
    mapCenter,
    availableKecamatans,
    availableGenders,
    selectedKecamatans,
    selectedGenders,
    priceRange,
    fullPriceRange,
    handleKecamatanChange,
    handleSelectAllKecamatans,
    handleClearKecamatans,
    handleGenderChange,
    handlePriceRangeChange,
  };
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price);
};
