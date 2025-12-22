// frontend/src/pages/History.jsx
import React from "react";
import { getHistory, clearHistory } from "../services/api";

export default function HistoryPage() {
  const [history, setHistory] = React.useState(() => getHistory());

  function handleClear() {
    if (!confirm("Clear history?")) return;
    clearHistory();
    setHistory([]);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2>History</h2>
        <div>
          <button className="btn secondary" onClick={handleClear}>Clear</button>
        </div>
      </div>

      <div className="history-list">
        {history.length === 0 && <div className="card small">No history yet.</div>}
        {history.map((it) => (
          <div key={it.ts} className="card h-item">
            {it.thumb ? <img src={it.thumb} className="h-thumb" alt="thumb" /> : <div className="h-thumb" />}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ textTransform: "capitalize", fontWeight: 700 }}>{it.category}</div>
                <div className="small">{new Date(it.ts).toLocaleString()}</div>
              </div>
              <div className="small" style={{ marginTop: 6 }}>{it.instructions}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
