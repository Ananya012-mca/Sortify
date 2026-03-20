
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const FloatingChatbot = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show the floating button on the chatbot page itself
  if (location.pathname === "/chatbot") {
    return null;
  }

  return (
    <button 
      className="floating-chatbot-btn" 
      onClick={() => navigate("/chatbot")}
      title="Chat with Waste Assistant"
    >
      🤖
    </button>
  );
};

export default FloatingChatbot;
