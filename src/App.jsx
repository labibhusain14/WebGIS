import { Routes, Route } from 'react-router-dom';
import Navigator from './Pages/Navigator';
import Marker from './Pages/Marker';
import Points from './Pages/Points';
import Line from './Pages/Line';
import Polygon from './Pages/Polygon';
import Home from './Pages/Home';
import Beranda from './Pages/Beranda';
import DetailPage from './Pages/Detail';
import LoginPage from './Pages/Login';
import MarketIntelligenceDashboard from './Pages/Dashboard';
import HelpCenterPage from './Pages/HelpCenter';
import AboutUsPage from './Pages/AboutUs';
import RegisterPage from './Pages/Register';
import ProtectedLayout from './Pages/ProtectedLayout';
import LandingPage from './Pages/Landing';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/*       <Route path="/" element={<Map />} /> */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/navigator" element={<Navigator />} />
      <Route path="/marker" element={<Marker />} />
      <Route path="/points" element={<Points />} />
      <Route path="/line" element={<Line />} />
      <Route path="/polygon" element={<Polygon />} />
      <Route path="/beranda" element={<Beranda />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<MarketIntelligenceDashboard />} />
        <Route path="/pusat-bantuan" element={<HelpCenterPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/detail/:id" element={<DetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
