import { Routes, Route } from "react-router-dom";
import Map from "./Pages/Maps";
import Navigator from "./pages/Navigator";
import Marker from "./Pages/Marker";
import Points from "./Pages/Points";
import Line from "./Pages/Line";
import Polygon from "./Pages/Polygon";
import Coba from "./Pages/Coba";

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
    </Routes>
  );
}

export default App;
