import { Routes, Route } from "react-router-dom";
import BetaBanner from "./components/BetaBanner";
import HomePage from "./pages/HomePage";
import NursingPage from "./pages/NursingPage";
import ComingSoonPage from "./pages/ComingSoonPage";

export default function App() {
  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <BetaBanner />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nursing" element={<NursingPage />} />
        <Route
          path="/facade"
          element={
            <ComingSoonPage
              title="Façade Inspection"
              description="MBIS-aligned drone footage rehearsal."
            />
          }
        />
        <Route
          path="/drone"
          element={
            <ComingSoonPage
              title="Drone Mission"
              description="Pre-flight rehearsal and perception coverage."
            />
          }
        />
        <Route
          path="/robotic"
          element={
            <ComingSoonPage
              title="Robotic Field Ops"
              description="Robot mission planning and safety envelope rehearsal."
            />
          }
        />
        <Route
          path="*"
          element={
            <div className="max-w-3xl mx-auto px-6 py-12">
              <h1 className="text-2xl text-white">Not found</h1>
            </div>
          }
        />
      </Routes>
    </div>
  );
}
