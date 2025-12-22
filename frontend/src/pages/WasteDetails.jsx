import { useParams } from "react-router-dom";
import wasteData from "../data/wasteData";
import "../styles.css";

export default function WasteDetails() {
  const { type } = useParams();
  const waste = wasteData[type];

  if (!waste) {
    return <h2 style={{ textAlign: "center" }}>Waste type not found</h2>;
  }

  return (
    <div className="waste-details">
      <h1>{waste.title}</h1>

      <div className="details-card">
        <p><strong>Type of Waste:</strong> {waste.type}</p>
        <p><strong>What is it?</strong> {waste.description}</p>
        <p><strong>When is it generated?</strong> {waste.whenToUse}</p>
        <p><strong>When NOT to mix or use?</strong> {waste.whenNotToUse}</p>
        <p><strong>How to dispose?</strong> {waste.disposal}</p>
        <p><strong>Recyclable?</strong> {waste.recyclable}</p>
      </div>
    </div>
  );
}
