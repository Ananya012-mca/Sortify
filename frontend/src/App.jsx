import { Routes, Route } from "react-router-dom";
import Rewards from "./pages/Rewards";
import Dashboard from "./pages/Dashboard";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import WasteDetails from "./pages/WasteDetails";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/waste/:type" element={<WasteDetails />} />
      <Route path="/rewards" element={<Rewards />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
