import React from "react";
import wasteDatabase from "./wasteInfo.json";
import "./wasteInfoModal.css";

const WasteInfoModal = ({ wasteType, onClose }) => {
  const waste = wasteDatabase[wasteType];

  if (!waste) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-header" style={{ backgroundColor: waste.color }}>
          <span className="modal-icon">{waste.icon}</span>
          <h2>{waste.name}</h2>
        </div>

        <div className="modal-body">
          {/* Description */}
          <section className="info-section">
            <h3>📝 Description</h3>
            <p>{waste.description}</p>
            <div className="waste-type-badge">
              <span>Type: {waste.type}</span>
            </div>
          </section>

          {/* Disposal Methods */}
          <section className="info-section">
            <h3>♻️ Disposal Methods</h3>
            <ul className="methods-list">
              {waste.disposalMethods.map((method, idx) => (
                <li key={idx}>
                  <span className="method-number">{idx + 1}</span>
                  <span>{method}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Benefits */}
          <section className="info-section">
            <h3>🌍 Environmental Benefits</h3>
            <div className="benefits-grid">
              {waste.benefits.map((benefit, idx) => (
                <div key={idx} className="benefit-card">
                  <span className="benefit-icon">
                    {["💚", "🌱", "🌊", "☁️", "🌳"][idx % 5]}
                  </span>
                  <p>{benefit}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tips */}
          <section className="info-section">
            <h3>💡 Helpful Tips</h3>
            <div className="tips-list">
              {waste.tips.map((tip, idx) => (
                <div key={idx} className="tip-item">
                  <span className="tip-bullet">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="info-section cta-section">
            <button className="cta-button" onClick={onClose}>
              Got it! Let me classify more
            </button>
            <p className="cta-text">
              Every proper disposal helps save the environment! 🌎
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default WasteInfoModal;
