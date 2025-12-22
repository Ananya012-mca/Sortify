export default function RewardsCard() {
  return (
    <div className="card rewards-card">
      <h3>Eco-Points Hub</h3>

      <div className="points">1,875</div>
      <p>Total Eco-Points</p>

      <div className="level-bar">
        <div className="level-fill"></div>
      </div>

      <p>Level 3</p>
      <button className="reward-btn">Explore Rewards 🎁</button>
    </div>
  );
}
