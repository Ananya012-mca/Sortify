import React, { useEffect, useState } from "react";

export default function PointsBadge() {
  const [points, setPoints] = useState(()=> {
    try { return parseInt(localStorage.getItem("sortify_points")||"0",10); } catch { return 0; }
  });

  useEffect(() => {
    const onStorage = () => setPoints(parseInt(localStorage.getItem("sortify_points")||"0",10));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return <div className="points-badge">Points: {points}</div>;
}
