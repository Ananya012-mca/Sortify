import { useState } from "react";

export default function ScanCard() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [points, setPoints] = useState(0);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setResult(null);
      setFeedbackGiven(false);
      setPoints(0);
    }
  }

  function analyzeItem() {
    setLoading(true);

    setTimeout(() => {
      setResult({
        type: "Organic Waste",
        confidence: "92%",
        instruction: "Compost this waste or dispose in green bin."
      });
      setLoading(false);
    }, 2000);
  }

  function handleCorrect() {
    setPoints(25);
    setFeedbackGiven(true);
  }

  function handleIncorrect() {
    setFeedbackGiven(true);
  }

  return (
    <div className="card">
      <h3>New Scan</h3>

      <label className="scan-btn">
        Upload Image 📷
        <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
      </label>

      {image && (
        <div className="image-preview">
          <img src={image} alt="Preview" />
        </div>
      )}

      {image && (
        <button
          className="scan-btn"
          style={{ marginTop: "14px" }}
          onClick={analyzeItem}
          disabled={loading}
        >
          {loading ? "Classifying..." : "Analyze Item"}
        </button>
      )}

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h4>Result</h4>
          <p><strong>Type:</strong> {result.type}</p>
          <p><strong>Confidence:</strong> {result.confidence}</p>
          <p><strong>Disposal:</strong> {result.instruction}</p>

          {!feedbackGiven && (
            <div style={{ marginTop: "14px", display: "flex", gap: "10px" }}>
              <button className="ghost-btn" onClick={handleCorrect}>
                ✔ Correct
              </button>
              <button className="ghost-btn" onClick={handleIncorrect}>
                ✖ Incorrect
              </button>
            </div>
          )}

          {points > 0 && (
            <p style={{ marginTop: "12px", color: "#2ecc71" }}>
              🌱 You earned <strong>{points}</strong> eco-points!
            </p>
          )}

          {feedbackGiven && points === 0 && (
            <p style={{ marginTop: "12px", color: "#999" }}>
              Thanks for your feedback!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
