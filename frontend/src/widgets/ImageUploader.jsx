import React, { useRef, useState } from "react";

export default function ImageUploader({ onSubmit, loading }) {
  const inputRef = useRef();
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [err, setErr] = useState("");

  function handlePick() { inputRef.current?.click(); }

  function handleFileChange(e) {
    setErr("");
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) { setErr("Please upload an image."); return; }
    if (f.size > 5 * 1024 * 1024) { setErr("File too large (max 5MB)."); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function submit() {
    if (!file) { setErr("Choose an image first."); return; }
    await onSubmit(file);
  }

  return (
    <div className="card">
      <div className="uploader" onClick={handlePick} role="button" tabIndex={0}>
        {preview ? (
          <>
            <img src={preview} alt="preview" className="preview" />
            <div style={{display:"flex",gap:8}}>
              <button className="btn secondary" onClick={(e)=>{e.stopPropagation(); setPreview(null); setFile(null); setErr("");}}>Remove</button>
              <button className="btn" onClick={(e)=>{e.stopPropagation(); submit();}} disabled={loading}>{loading ? "Classifying…" : "Classify"}</button>
            </div>
          </>
        ) : (
          <>
            <p style={{margin:0}} className="small">Drag & drop or click to choose</p>
            <div style={{height:8}} />
            <button className="btn" onClick={(e)=>{e.stopPropagation(); handlePick();}}>Choose image</button>
            <p className="small" style={{marginTop:10}}>Accepted: JPG, PNG • Max 5MB</p>
          </>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} style={{display:"none"}} />
      </div>
      {err && <p style={{color:"crimson", marginTop:10}}>{err}</p>}
    </div>
  );
}
