import React from "react";

export default function ResultPanel({ result, loading }) {
  if (loading) {
    return <div className="card"><p className="small">Classifying…</p></div>;
  }
  if (!result) {
    return <div className="card"><p className="small">No result yet. Upload an image to classify.</p></div>;
  }
  if (result.category === "error") {
    return <div className="card"><p style={{color:"crimson"}}>{result.instructions}</p></div>;
  }

  return (
    <div className="card">
      <div className="result-title">
        <h3 style={{margin:0,textTransform:"capitalize"}}>{result.category}</h3>
        <span className="confidence">{Math.round((result.confidence||0)*100)}%</span>
      </div>
      <p className="small" style={{marginTop:10}}>{result.instructions}</p>

      {result.thumb && <img src={result.thumb} alt="thumb" style={{width:"100%",borderRadius:8,marginTop:12}} />}

      <div style={{display:"flex",gap:8,marginTop:12}}>
        <button className="btn" onClick={()=>{
          const prev = parseInt(localStorage.getItem("sortify_points")||"0",10);
          localStorage.setItem("sortify_points", String(prev + (result.points||5)));
          window.dispatchEvent(new Event("storage"));
          alert(`You've earned ${result.points||5} points!`);
        }}>Claim {result.points||5} points</button>

        <button className="btn secondary" onClick={()=>{
          navigator.clipboard?.writeText(result.instructions||"");
          alert("Instructions copied");
        }}>Copy instructions</button>
      </div>
    </div>
  );
}
