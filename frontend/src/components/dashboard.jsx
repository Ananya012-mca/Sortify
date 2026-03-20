import React, { useEffect, useState, useContext } from "react";
import { PointsContext } from "../contexts/PointsContext";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const { points, setPoints } = useContext(PointsContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const [profileRes, historyRes] = await Promise.all([
          fetch(`${API_BASE_URL}/profile`, {
            headers: { "Authorization": `Bearer ${token}` }
          }),
          fetch(`${API_BASE_URL}/history`, {
            headers: { "Authorization": `Bearer ${token}` }
          })
        ]);

        if (profileRes.ok && historyRes.ok) {
          const profileData = await profileRes.json();
          const historyData = await historyRes.json();
          setPoints(profileData.points || 0);
          setHistory(historyData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div style={{ padding: "30px" }}>Loading dashboard...</div>;

  const totalClassified = history.length;

  // Items this month
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const itemsThisMonth = history.filter(item => {
    if (!item.timestamp) return false;
    const itemDate = new Date(item.timestamp);
    if (isNaN(itemDate.getTime())) return false;
    return itemDate.getMonth() === thisMonth && itemDate.getFullYear() === thisYear;
  }).length;

  // Category data with enhanced styling
  const CATEGORY_CONFIG = {
    paper: { name: "Paper", color: "#1e88e5", icon: "📄", co2Savings: 0.3 },
    plastic: { name: "Plastic", color: "#00c49f", icon: "🥤", co2Savings: 0.5 },
    metal: { name: "Metal", color: "#ffbb28", icon: "🥫", co2Savings: 0.6 },
    glass: { name: "Glass", color: "#ff8042", icon: "🍾", co2Savings: 0.4 },
    cardboard: { name: "Cardboard", color: "#8884d8", icon: "📦", co2Savings: 0.3 },
    trash: { name: "Trash", color: "#ef5350", icon: "🗑️", co2Savings: 0 },
  };

  const categoryCounts = {};
  let totalCO2Saved = 0;
  history.forEach(item => {
    const cat = item.category?.toLowerCase();
    if (cat) {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      const config = CATEGORY_CONFIG[cat];
      if (config) {
        totalCO2Saved += config.co2Savings;
      }
    }
  });

  const categoryData = Object.keys(CATEGORY_CONFIG).map(key => ({
    name: CATEGORY_CONFIG[key].name,
    count: categoryCounts[key] || 0,
    color: CATEGORY_CONFIG[key].color,
    icon: CATEGORY_CONFIG[key].icon
  }));

  const pieData = categoryData.filter(item => item.count > 0);

  // Recent activity (last 5 items)
  const recentActivity = [...history]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  // Week-wise performance (last 4 weeks)
  const getWeekWiseData = () => {
    const weekData = {};
    const now = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - (i * 7));
      date.setDate(date.getDate() - date.getDay());
      
      const weekStart = new Date(date);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekKey = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      
      const itemsInWeek = history.filter(item => {
        if (!item.timestamp) return false;
        const itemDate = new Date(item.timestamp);
        if (isNaN(itemDate.getTime())) return false;
        return itemDate >= weekStart && itemDate <= weekEnd;
      }).length;
      
      weekData[weekKey] = itemsInWeek;
    }
    
    return Object.entries(weekData).map(([week, count]) => ({
      week,
      items: count
    }));
  };

  // Month-wise performance (last 12 months)
  const getMonthWiseData = () => {
    const monthData = {};
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      const itemsInMonth = history.filter(item => {
        if (!item.timestamp) return false;
        const itemDate = new Date(item.timestamp);
        if (isNaN(itemDate.getTime())) return false;
        return itemDate.getMonth() === date.getMonth() && itemDate.getFullYear() === date.getFullYear();
      }).length;
      
      monthData[monthKey] = itemsInMonth;
    }
    
    return Object.entries(monthData).map(([month, count]) => ({
      month,
      items: count
    }));
  };

  const weekWiseData = getWeekWiseData();
  const monthWiseData = getMonthWiseData();

  return (
    <div className="home-wrapper">
      {/* SIDEBAR NAVIGATION */}
      <div className="sidebar">
        <div className="home-navigation">
          <div className="nav-item">
            <span className="nav-number">1.</span>
            <Link to="/" className="nav-link">Home</Link>
          </div>
          <div className="nav-item">
            <span className="nav-number">2.</span>
            <Link to="/dashboard" className="nav-link">Analytics</Link>
          </div>
          <div className="nav-item">
            <span className="nav-number">3.</span>
            <Link to="/upload" className="nav-link">Classify</Link>
          </div>
          <div className="nav-item">
            <span className="nav-number">4.</span>
            <Link to="/rewards" className="nav-link">Rewards</Link>
          </div>
          <div className="nav-item">
            <span className="nav-number">5.</span>
            <Link to="/profile" className="nav-link">Profile</Link>
          </div>
          <div className="nav-item">
            <span className="nav-number">6.</span>
            <button className="nav-link" style={{background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left'}} onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>Logout</button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="content-inner">
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening with your waste classification.</p>
        </div>
        <div className="date-display">
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* TOP CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(46, 125, 50, 0.1)", color: "#2e7d32" }}>📊</div>
          <div className="stat-content">
            <h3>Total Classified</h3>
            <h1>{totalClassified}</h1>
            <p>All-time items</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(30, 136, 229, 0.1)", color: "#1e88e5" }}>📅</div>
          <div className="stat-content">
            <h3>This Month</h3>
            <h1>{itemsThisMonth}</h1>
            <p>Items tracked</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(251, 192, 45, 0.1)", color: "#fbc02d" }}>⭐</div>
          <div className="stat-content">
            <h3>Total Points</h3>
            <h1>{points}</h1>
            <p>Available to redeem</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(76, 175, 80, 0.1)", color: "#2e7d32" }}>🌍</div>
          <div className="stat-content">
            <h3>CO₂ Saved</h3>
            <h1>{totalCO2Saved.toFixed(1)} kg</h1>
            <p>Environmental impact</p>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      {pieData.length > 0 ? (
        <div className="charts-grid">
          {/* BAR CHART */}
          <div className="dashboard-card chart-container">
            <div className="card-header">
              <h3>Category Distribution</h3>
              <p>Breakdown of items per waste category</p>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#666', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#666', fontSize: 12 }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar 
                    dataKey="count" 
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE CHART */}
          <div className="dashboard-card chart-container">
            <div className="card-header">
              <h3>Waste Proportions</h3>
              <p>Percentage share of classified items</p>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state-card">
          <div className="empty-icon">🌱</div>
          <h3>No Data Yet</h3>
          <p>Start classifying waste to see your analytics here!</p>
          <button className="primary-action-btn" onClick={() => window.location.href = '/'}>
            Start Classifying
          </button>
        </div>
      )}

      {/* PERFORMANCE CHARTS SECTION */}
      <div className="charts-grid" style={{ marginTop: '30px' }}>
        {/* WEEK-WISE PERFORMANCE */}
        <div className="dashboard-card chart-container">
          <div className="card-header">
            <h3>Weekly Performance</h3>
            <p>Items classified in the last 4 weeks</p>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weekWiseData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="week" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ stroke: 'rgba(46, 125, 50, 0.2)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value} items`, 'Classified']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="items" 
                  stroke="#2e7d32" 
                  strokeWidth={3}
                  dot={{ fill: '#2e7d32', r: 6 }}
                  activeDot={{ r: 8 }}
                  name="Items Classified"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MONTH-WISE PERFORMANCE */}
        <div className="dashboard-card chart-container">
          <div className="card-header">
            <h3>Monthly Performance</h3>
            <p>Items classified in the last 12 months</p>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthWiseData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ stroke: 'rgba(30, 136, 229, 0.2)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value} items`, 'Classified']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="items" 
                  stroke="#1e88e5" 
                  strokeWidth={3}
                  dot={{ fill: '#1e88e5', r: 6 }}
                  activeDot={{ r: 8 }}
                  name="Items Classified"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      {recentActivity.length > 0 && (
        <div className="dashboard-card recent-activity">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <p>Your latest classification history</p>
          </div>
          <div className="activity-list">
            {recentActivity.map((item, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {CATEGORY_CONFIG[item.category?.toLowerCase()]?.icon || "❓"}
                </div>
                <div className="activity-info">
                  <span className="activity-category">
                    {CATEGORY_CONFIG[item.category?.toLowerCase()]?.name || item.category}
                  </span>
                  <span className="activity-time">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="activity-points">
                  +10 pts
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
