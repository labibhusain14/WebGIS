import { Routes, Route } from "react-router-dom";
import Map from "./Pages/Maps";
import Navigator from "./Pages/Navigator";
import Marker from "./Pages/Marker";
import Points from "./Pages/Points";
import Line from "./Pages/Line";
import Polygon from "./Pages/Polygon";
import Coba from "./Pages/Coba";
import DetailPage from "./Pages/Detail";
import LoginPage from "./Pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Map />} />
      <Route path="/navigator" element={<Navigator />} />
      <Route path="/marker" element={<Marker />} />
      <Route path="/points" element={<Points />} />
      <Route path="/line" element={<Line />} />
      <Route path="/polygon" element={<Polygon />} />
      <Route path="/coba" element={<Coba />} />
      <Route path="/detail" element={<DetailPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
