import React, { createContext, useState, useEffect } from "react";
import API_BASE_URL from "../config";

export const PointsContext = createContext({
  points: 0,
  setPoints: () => {},
  addPoints: () => {},
});

export const PointsProvider = ({ children }) => {
  const [points, setPointsState] = useState(0);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPointsState(data.points || 0);
        }
      } catch (err) {
        console.error("PointsProvider init error:", err);
      }
    };

    init();
  }, []);

  const setPoints = (v) => setPointsState(v);
  const addPoints = (delta) => setPointsState((p) => (Number(p) || 0) + Number(delta || 0));

  return (
    <PointsContext.Provider value={{ points, setPoints, addPoints }}>
      {children}
    </PointsContext.Provider>
  );
};

export default PointsProvider;
