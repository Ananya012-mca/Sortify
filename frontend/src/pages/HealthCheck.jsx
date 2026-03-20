import React, { useEffect, useState } from "react";

const HealthCheck = () => {
  const [backends, setBackends] = useState([
    { url: "http://localhost:5000", status: "checking", name: "Flask Backend" },
    { url: "http://localhost:5173", status: "checking", name: "Frontend (Vite)" },
  ]);

  useEffect(() => {
    const checkHealth = async () => {
      const results = [...backends];

      for (let i = 0; i < results.length; i++) {
        try {
          const response = await fetch(`${results[i].url}/health`, { timeout: 5000 });
          results[i].status = response.ok ? "✅ Running" : "❌ Error";
        } catch (err) {
          results[i].status = "❌ Not responding";
        }
      }

      setBackends(results);
    };

    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace", background: "#1a1a1a", color: "#fff" }}>
      <h2>🔍 Service Health Check</h2>
      {backends.map((service) => (
        <div key={service.url} style={{ margin: "10px 0", padding: "10px", background: "#333", borderRadius: "5px" }}>
          <strong>{service.name}</strong>: {service.status}
          <br />
          <small>{service.url}</small>
        </div>
      ))}
      <div style={{ marginTop: "20px", padding: "10px", background: "#2a2a2a", borderRadius: "5px" }}>
        <h3>To fix "Cannot connect" errors:</h3>
        <pre>
          {`# Terminal 1 - Start Backend\ncd backend\npython app.py\n\n# Terminal 2 - Start Frontend\ncd frontend\nnpm run dev`}
        </pre>
      </div>
    </div>
  );
};

export default HealthCheck;
