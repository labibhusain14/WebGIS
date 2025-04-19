import Navbar from '../Components/Navbar';

const MarketIntelligenceDashboard = () => {
  return (
    <div className="relative h-screen">
      <Navbar />
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="bg-white shadow-md rounded-lg p-6 mt-12">
          <iframe src="https://kost-dashboard.streamlit.app?embed=true" width="100%" height="800px" frameBorder="0" title="Kost Dashboard" allowFullScreen></iframe>
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligenceDashboard;
