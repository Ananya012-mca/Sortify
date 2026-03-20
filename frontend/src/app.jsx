import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { PointsProvider } from "./contexts/PointsContext";

import FloatingChatbot from "./components/FloatingChatbot";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./components/login"));
const Signup = lazy(() => import("./components/signup"));
const Dashboard = lazy(() => import("./components/dashboard"));
const Rewards = lazy(() => import("./components/rewards"));
const Profile = lazy(() => import("./components/profile"));
const Upload = lazy(() => import("./components/upload"));
const ChatbotPage = lazy(() => import("./pages/ChatbotPage"));


function App() {
  return (
    <PointsProvider>
      <FloatingChatbot />

      <Suspense fallback={<div style={{ padding: 24 }}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/chatbot" element={<ChatbotPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/rewards"
            element={
              <ProtectedRoute>
                <Rewards />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </PointsProvider>
  );
}

export default App;
