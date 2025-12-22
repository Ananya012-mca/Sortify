import "../styles.css";
import coffee from "../assets/images/coffee.jpg";
import plant from "../assets/images/plant.jpg";
import bag from "../assets/images/bag.jpg";

export default function Rewards() {
  const userPoints = 150;

  const rewards = [
    {
      title: "Free Coffee",
      desc: "Get a free coffee at your local eco-friendly cafe.",
      points: 100,
      image: coffee
    },
    {
      title: "Potted Plant",
      desc: "A small succulent to brighten your space.",
      points: 250,
      image: plant
    },
    {
      title: "Reusable Tote Bag",
      desc: "A stylish and sturdy tote bag for groceries.",
      points: 400,
      image: bag
    }
  ];

  return (
    <div className="rewards-page">
      <h2>🎁 Eco Rewards</h2>
      <p className="points-text">You have {userPoints} points</p>

      <div className="rewards-grid">
        {rewards.map((r, i) => (
          <div className="reward-card" key={i}>
            <img src={r.image} alt={r.title} />
            <h3>{r.title}</h3>
            <p>{r.desc}</p>
            <span>💎 {r.points} Points</span>

            <button
              className={`reward-btn ${
                userPoints >= r.points ? "active" : "disabled"
              }`}
            >
              {userPoints >= r.points ? "Redeem" : "Not enough points"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
