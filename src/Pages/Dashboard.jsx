import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Map, Trophy, Building, DollarSign, Calendar } from "lucide-react";
import Navbar from "../Components/Navbar";

const MarketIntelligenceDashboard = () => {
  const [selectedDate, setSelectedDate] = useState("Jan, 2025");

  const priceDistributionData = [
    { name: "Group A", value: 20 },
    { name: "Group B", value: 50 },
    { name: "Group C", value: 22 },
    { name: "Group D", value: 10 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const optimalRentalPrices = [
    {
      location: "Cipedes",
      optimalPrice: 2050000,
      dominantFactors: "Location (35%), Facilities (30%)",
    },
    {
      location: "Sari Asih",
      optimalPrice: 1850000,
      dominantFactors: "Facilities (40%), Demand (25%)",
    },
    {
      location: "Sarimanan",
      optimalPrice: 1550000,
      dominantFactors: "Demand (45%), Occupancy (20%)",
    },
  ];

  return (
    <div className="relative h-screen">
      <Navbar />
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="bg-white shadow-md rounded-lg p-6 mt-12">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard Market Intelligence
            </h1>
            <div className="flex items-center">
              <Calendar className="mr-2 text-gray-600" />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded p-2"
              >
                <option>Jan, 2025</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-200 p-4 rounded flex items-center">
              <DollarSign className="mr-2 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Rata-rata Harga Sewa</p>
                <p className="font-bold">Rp1,750,000/bulan</p>
              </div>
            </div>
            <div className="bg-gray-200 p-4 rounded flex items-center">
              <Trophy className="mr-2 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Rata-rata Harga</p>
                <p className="font-bold">85%</p>
              </div>
            </div>
            <div className="bg-gray-200 p-4 rounded flex items-center">
              <Building className="mr-2 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Non Permintaan</p>
                <p className="font-bold">1,500 pencarian</p>
              </div>
            </div>
            <div className="bg-gray-200 p-4 rounded flex items-center">
              <Map className="mr-2 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Lokasi</p>
                <p className="font-bold">Sukasari, Bandung</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-200 p-4 rounded">
              <h2 className="text-lg font-semibold mb-4">
                Data Pemetaan Harga
              </h2>
              <div className="bg-gray-300 h-64 flex items-center justify-center">
                <p className="text-gray-600">Location Heat Map Placeholder</p>
              </div>
            </div>

            <div className="bg-gray-200 p-4 rounded">
              <h2 className="text-lg font-semibold mb-4">Distribusi Harga</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={priceDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {priceDistributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-6 bg-gray-200 p-4 rounded">
            <h2 className="text-lg font-semibold mb-4">
              Prediksi Harga Sewa Optimal
            </h2>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-300">
                  <th className="p-2 text-left">Lokasi</th>
                  <th className="p-2 text-right">Harga Optimal (Rp)</th>
                  <th className="p-2 text-left">Faktor Dominan</th>
                </tr>
              </thead>
              <tbody>
                {optimalRentalPrices.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{item.location}</td>
                    <td className="p-2 text-right">
                      {item.optimalPrice.toLocaleString()}
                    </td>
                    <td className="p-2">{item.dominantFactors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligenceDashboard;
