import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { orderAPI } from '../../services/api'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { theme } from '../../theme/colors'

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  const { logout } = useAdminAuth()

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await orderAPI.getAdvancedAnalytics()
      setAnalytics(response.data.data)
      setError('')
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      setError('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const handleBackToDashboard = () => {
    navigate('/admin/dashboard')
  }

  // Prepare hourly data for chart
  const hourlyData = analytics?.hourlyOrderDistribution?.map((count, hour) => ({
    hour: `${hour}:00`,
    orders: count
  })) || []

  // Prepare status data for pie chart
  const statusData = analytics?.ordersByStatus ? [
    { name: 'Preparing', value: analytics.ordersByStatus.Preparing, color: '#FF78AC' },
    { name: 'Ready', value: analytics.ordersByStatus.Ready, color: '#A8D5E3' },
    { name: 'Served', value: analytics.ordersByStatus.Served, color: '#F8BBD0' }
  ] : []

  // Calculate growth percentages
  const calculateGrowth = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous * 100).toFixed(1)
  }

  const ordersGrowth = calculateGrowth(
    analytics?.monthlyComparison?.thisMonth?.orders || 0,
    analytics?.monthlyComparison?.lastMonth?.orders || 0
  )

  const revenueGrowth = calculateGrowth(
    analytics?.monthlyComparison?.thisMonth?.revenue || 0,
    analytics?.monthlyComparison?.lastMonth?.revenue || 0
  )

  if (loading) return <div className="loading">Loading analytics...</div>

  if (error) return <div className="error">{error}</div>

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>Advanced Analytics</h1>
        <div className="header-buttons">
          <button className="back-btn" onClick={handleBackToDashboard}>← Back to Dashboard</button>
          <button className="logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Orders Today</h3>
          <p className="value">{analytics?.totalOrdersToday || 0}</p>
        </div>
        <div className="summary-card">
          <h3>Revenue Today</h3>
          <p className="value">₹{analytics?.totalRevenueToday || 0}</p>
        </div>
        <div className="summary-card">
          <h3>Avg Order Value</h3>
          <p className="value">₹{analytics?.averageOrderValue?.toFixed(2) || 0}</p>
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="monthly-comparison">
        <h2>Monthly Comparison</h2>
        <div className="comparison-cards">
          <div className="comparison-card">
            <h4>This Month</h4>
            <div className="metrics">
              <div>
                <span className="label">Orders:</span>
                <span className="value">{analytics?.monthlyComparison?.thisMonth?.orders || 0}</span>
              </div>
              <div>
                <span className="label">Revenue:</span>
                <span className="value">₹{analytics?.monthlyComparison?.thisMonth?.revenue || 0}</span>
              </div>
            </div>
          </div>
          <div className="comparison-card">
            <h4>Last Month</h4>
            <div className="metrics">
              <div>
                <span className="label">Orders:</span>
                <span className="value">{analytics?.monthlyComparison?.lastMonth?.orders || 0}</span>
              </div>
              <div>
                <span className="label">Revenue:</span>
                <span className="value">₹{analytics?.monthlyComparison?.lastMonth?.revenue || 0}</span>
              </div>
            </div>
          </div>
          <div className="growth-indicators">
            <div className={`growth ${ordersGrowth >= 0 ? 'positive' : 'negative'}`}>
              <span>Orders: {ordersGrowth >= 0 ? '+' : ''}{ordersGrowth}%</span>
            </div>
            <div className={`growth ${revenueGrowth >= 0 ? 'positive' : 'negative'}`}>
              <span>Revenue: {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Hourly Orders Chart */}
        <div className="chart-container">
          <h3>Orders by Hour</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke={theme.primary} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie Chart */}
        <div className="chart-container">
          <h3>Orders by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Items */}
      <div className="top-items">
        <h3>Top 5 Items Today</h3>
        <div className="items-list">
          {analytics?.top5Items?.map((item, index) => (
            <div key={index} className="item-row">
              <span className="rank">#{index + 1}</span>
              <span className="item-name">{item.name}</span>
              <span className="item-count">{item.count} orders</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .analytics-page {
          padding: 1rem;
          background: ${theme.background};
          min-height: 100vh;
        }

        .loading, .error {
          text-align: center;
          padding: 2rem;
          font-size: 1.2rem;
          color: ${theme.text};
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .analytics-header h1 {
          font-size: 2rem;
          color: ${theme.text};
          margin: 0;
        }

        .header-buttons {
          display: flex;
          gap: 1rem;
        }

        .header-buttons button {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .back-btn {
          background: ${theme.secondary};
          color: ${theme.text};
        }

        .back-btn:hover {
          background: #98c5d3;
        }

        .logout {
          background: #ff6b6b;
          color: white;
        }

        .logout:hover {
          background: #ff5252;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .summary-card {
          background: ${theme.cardBackground};
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .summary-card h3 {
          font-size: 0.9rem;
          color: ${theme.text};
          opacity: 0.7;
          margin-bottom: 0.5rem;
        }

        .summary-card .value {
          font-size: 2rem;
          font-weight: 700;
          color: ${theme.primary};
          margin: 0;
        }

        .monthly-comparison {
          background: ${theme.cardBackground};
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .monthly-comparison h2 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: ${theme.text};
        }

        .comparison-cards {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 1rem;
          align-items: center;
        }

        .comparison-card {
          background: ${theme.background};
          padding: 1rem;
          border-radius: 8px;
        }

        .comparison-card h4 {
          margin-top: 0;
          margin-bottom: 0.5rem;
          color: ${theme.text};
        }

        .comparison-card .metrics {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .comparison-card .metrics div {
          display: flex;
          justify-content: space-between;
        }

        .comparison-card .label {
          color: ${theme.text};
          opacity: 0.7;
        }

        .comparison-card .value {
          font-weight: 600;
          color: ${theme.text};
        }

        .growth-indicators {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .growth {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 600;
          text-align: center;
        }

        .growth.positive {
          background: #e8f5e8;
          color: #2e7d32;
        }

        .growth.negative {
          background: #ffebee;
          color: #c62828;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .chart-container {
          background: ${theme.cardBackground};
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .chart-container h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: ${theme.text};
        }

        .top-items {
          background: ${theme.cardBackground};
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .top-items h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: ${theme.text};
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .item-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: ${theme.background};
          border-radius: 8px;
        }

        .rank {
          font-weight: 700;
          color: ${theme.primary};
          min-width: 30px;
        }

        .item-name {
          flex: 1;
          color: ${theme.text};
        }

        .item-count {
          font-weight: 600;
          color: ${theme.text};
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .analytics-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .comparison-cards {
            grid-template-columns: 1fr;
          }

          .growth-indicators {
            flex-direction: row;
            justify-content: space-around;
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default Analytics
