import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("userData")) || {
      name: "Ananya",
      points: 150,
      scans: 28,
      categories: 4,
      feedbacks: 6,
      activity: []
    };
  });

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(user));
  }, [user]);

  // Actions
  const addScan = (type, points) => {
    setUser(prev => ({
      ...prev,
      scans: prev.scans + 1,
      points: prev.points + points,
      activity: [
        `🟢 ${type} waste scanned – +${points} points`,
        ...prev.activity
      ]
    }));
  };

  const addFeedback = () => {
    setUser(prev => ({
      ...prev,
      feedbacks: prev.feedbacks + 1,
      activity: ["🟢 Feedback submitted", ...prev.activity]
    }));
  };

  return (
    <UserContext.Provider value={{ user, addScan, addFeedback }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
