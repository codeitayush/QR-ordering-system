import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { orderAPI } from '../../services/api'
import {
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import { theme } from '../../theme/colors'

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const { logout } = useAdminAuth()

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const res = await orderAPI.getAdvancedAnalytics()
      setAnalytics(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return current > 0 ? "New Activity 🚀" : "0%"
    return ((current - previous) / previous * 100).toFixed(1) + "%"
  }

  if (loading) return <div className="loading">Loading analytics...</div>

  // 📊 Hourly
  const hourlyData = analytics.hourlyOrderDistribution.map((c, i) => ({
    hour: `${i}:00`,
    orders: c
  }))

  // 🍽️ Status
  const statusData = [
    { name: 'Preparing', value: analytics.ordersByStatus.Preparing, color: '#FF78AC' },
    { name: 'Ready', value: analytics.ordersByStatus.Ready, color: '#A8D5E3' },
    { name: 'Served', value: analytics.ordersByStatus.Served, color: '#F8BBD0' }
  ]

  return (
    <div className="page">

      {/* HEADER */}
      <div className="header">
        <h1>📊 Advanced Analytics</h1>
        <div className="actions">
          <button className="btn secondary" onClick={() => navigate('/admin/dashboard')}>
            ← Dashboard
          </button>
          <button className="btn danger" onClick={() => { logout(); navigate('/admin/login') }}>
            Logout
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="cards">
        <Card title="Orders Today" value={analytics.totalOrdersToday} />
        <Card title="Revenue Today" value={`₹${analytics.totalRevenueToday}`} highlight />
        <Card title="Avg Order Value" value={`₹${analytics.averageOrderValue.toFixed(2)}`} />
        <Card title="Peak Hour" value={`${analytics.peakHour}:00`} />
      </div>

      {/* 🔥 SMART INSIGHTS */}
      <div className="box premium highlight">
        <h2>🧠 Smart Insights</h2>

        <div className="insights-grid">
          <InsightCard
            title="Best Seller"
            value={analytics.smartInsights?.bestItem?.name || '—'}
            sub={`₹${analytics.smartInsights?.bestItem?.revenue || 0}`}
          />

          <InsightCard
            title="Avg Orders / Hour"
            value={analytics.smartInsights?.avgOrdersPerHour}
          />

          <InsightCard
            title="Slow Hours"
            value={
              analytics.smartInsights?.slowHours?.length
                ? analytics.smartInsights.slowHours.map(h => `${h.hour}:00`).join(', ')
                : 'None'
            }
          />

          <InsightCard
            title="Trend"
            value={analytics.smartInsights?.insight}
          />
        </div>
      </div>

      {/* MONTHLY */}
      <div className="box premium">
        <h2>📈 Monthly Performance</h2>

        <div className="monthly">
          <div>
            <h4>This Month</h4>
            <p>Orders: {analytics.monthlyComparison.thisMonth.orders}</p>
            <p>Revenue: ₹{analytics.monthlyComparison.thisMonth.revenue}</p>
          </div>

          <div>
            <h4>Last Month</h4>
            <p>Orders: {analytics.monthlyComparison.lastMonth.orders}</p>
            <p>Revenue: ₹{analytics.monthlyComparison.lastMonth.revenue}</p>
          </div>

          <div className="growthBox">
            <h4>Growth</h4>
            <span className="badge green">
              Orders: {calculateGrowth(
                analytics.monthlyComparison.thisMonth.orders,
                analytics.monthlyComparison.lastMonth.orders
              )}
            </span>
            <span className="badge green">
              Revenue: {calculateGrowth(
                analytics.monthlyComparison.thisMonth.revenue,
                analytics.monthlyComparison.lastMonth.revenue
              )}
            </span>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="charts">

        <div className="box">
          <h3>Orders by Hour</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line
                dataKey="orders"
                stroke={theme.primary}
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="box">
          <h3>Order Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                outerRadius={90}
                label={({ name, value }) => `${name} (${value})`}
              >
                {statusData.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* TOP ITEMS */}
      <div className="box premium">
        <h3>🔥 Top Items Today</h3>
        {analytics.top5Items.map((item, i) => (
          <div key={i} className="row">
            <span>#{i + 1} {item.name}</span>
            <span>{item.count} orders • ₹{item.revenue}</span>
          </div>
        ))}
      </div>

      {/* STYLES */}
      <style jsx>{`
        .page {
          padding: 24px;
          background: linear-gradient(135deg, #f9fafc, #eef1f5);
          min-height: 100vh;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .btn {
          padding: 8px 14px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }

        .secondary { background: #dceef3; }
        .danger { background: #ff6b6b; color: white; }

        .cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin: 20px 0;
        }

        .box {
          background: white;
          padding: 16px;
          border-radius: 14px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
        }

        .premium {
          border: 1px solid rgba(0,0,0,0.05);
        }

        .highlight {
          border-left: 5px solid #ff78ac;
        }

        .monthly {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }

        .growthBox {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .badge {
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .green {
          background: #e6f7ec;
          color: #1b7f3b;
        }

        .charts {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 20px 0;
        }

        .row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 10px;
        }

        .loading {
          padding: 40px;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

// 🔥 REUSABLE COMPONENTS
const Card = ({ title, value, highlight }) => (
  <div className="box" style={{
    border: highlight ? '2px solid #ff78ac' : 'none'
  }}>
    <h4>{title}</h4>
    <p style={{
      fontSize: '22px',
      fontWeight: 'bold',
      color: highlight ? '#ff78ac' : '#333'
    }}>
      {value}
    </p>
  </div>
)

const InsightCard = ({ title, value, sub }) => (
  <div style={{
    background: '#f8fafc',
    padding: '10px',
    borderRadius: '10px'
  }}>
    <p style={{ fontSize: '12px', opacity: 0.6 }}>{title}</p>
    <p style={{ fontWeight: 'bold' }}>{value}</p>
    {sub && <p style={{ fontSize: '12px' }}>{sub}</p>}
  </div>
)

export default Analytics