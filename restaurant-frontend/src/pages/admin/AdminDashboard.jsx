// FULL PREMIUM VERSION

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { orderAPI } from '../../services/api'
import { io } from 'socket.io-client'

const AdminDashboard = () => {
  const [orders, setOrders] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [newOrderIds, setNewOrderIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingOrderId, setUpdatingOrderId] = useState(null)

  const navigate = useNavigate()
  const { logout } = useAdminAuth()

  useEffect(() => {
    fetchOrders()
    fetchAnalytics()

    const socket = io(import.meta.env.VITE_API_URL.replace('/api', ''))

    socket.on("new-order", (order) => {
      setOrders(prev => [order, ...prev])
      setNewOrderIds(prev => [...prev, order._id])

      setTimeout(() => {
        setNewOrderIds(prev => prev.filter(id => id !== order._id))
      }, 3000)

      playSound()
    })

    return () => socket.disconnect()
  }, [])

  const playSound = () => {
    const audio = new Audio("/notification.mp3")
    audio.play().catch(() => {})
  }

  const fetchOrders = async () => {
    const res = await orderAPI.getAllOrders()
    setOrders(res.data.data)
    setLoading(false)
  }

  const fetchAnalytics = async () => {
    const res = await orderAPI.getAnalytics()
    setAnalytics(res.data.data)
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId)
    await orderAPI.updateOrderStatus(orderId, newStatus)

    setOrders(prev =>
      prev.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    )

    setUpdatingOrderId(null)
  }

  const getTimeAgo = (time) => {
    const diff = Math.floor((Date.now() - new Date(time)) / 60000)
    if (diff < 1) return 'Just now'
    if (diff < 60) return `${diff} min`
    return `${Math.floor(diff / 60)} hr`
  }

  const isUrgent = (time) => {
    return (Date.now() - new Date(time)) / 60000 > 15
  }

  const groupedOrders = {
    Preparing: orders.filter(o => o.status === 'Preparing'),
    Ready: orders.filter(o => o.status === 'Ready'),
    Served: orders.filter(o => o.status === 'Served')
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="dashboard">

      <div className="header">
        <h1>🍳 Kitchen Dashboard</h1>
        <div className="actions">
          <button onClick={() => navigate('/admin/analytics')}>Analytics</button>
          <button onClick={() => logout()}>Logout</button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="analytics">
          <Stat title="Orders" value={analytics.totalOrders} />
          <Stat title="Revenue" value={`₹${analytics.totalRevenue}`} highlight />
          <Stat title="Top Item" value={analytics.mostOrderedItem} />
        </div>
      )}

      {/* Columns */}
      <div className="board">
        {Object.entries(groupedOrders).map(([status, list]) => (
          <div key={status} className="column">
            <h2>{status}</h2>

            {list.map(order => {
              const urgent = isUrgent(order.createdAt)

              return (
                <div
                  key={order._id}
                  className={`card ${status.toLowerCase()} ${urgent ? 'urgent' : ''} ${newOrderIds.includes(order._id) ? 'new' : ''}`}
                >
                  <div className="top">
                    <h3>Table {order.tableNumber}</h3>
                    <span>{getTimeAgo(order.createdAt)}</span>
                  </div>

                  {urgent && <div className="alert">⚠ Delayed</div>}

                  <div className="items">
                    {order.items.map((item, i) => (
                      <div key={i} className="item">
                        {item.name} ×{item.quantity}
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="footer">
                    <strong>₹{order.totalAmount}</strong>

                    {status === 'Preparing' && (
                      <button onClick={() => updateOrderStatus(order._id, 'Ready')}>
                        Mark Ready
                      </button>
                    )}

                    {status === 'Ready' && (
                      <button className="green" onClick={() => updateOrderStatus(order._id, 'Served')}>
                        Mark Served
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <style jsx>{`
        .dashboard {
          padding: 20px;
          background: linear-gradient(135deg, #f8fafc, #eef2f7);
        }

        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .actions button {
          margin-left: 10px;
          padding: 8px 14px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
        }

        .analytics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }

        .board {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .column h2 {
          margin-bottom: 10px;
        }

        .card {
          background: white;
          border-radius: 14px;
          padding: 14px;
          margin-bottom: 14px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          transition: 0.3s;
        }

        .card:hover {
          transform: translateY(-4px);
        }

        .preparing { border-left: 5px solid #f59e0b; }
        .ready { border-left: 5px solid #22c55e; }
        .served { opacity: 0.6; }

        .urgent {
          animation: pulse 1.5s infinite;
          border-left: 5px solid red;
        }

        .alert {
          color: red;
          font-weight: bold;
          margin: 5px 0;
        }

        .items {
          background: #f1f5f9;
          padding: 10px;
          border-radius: 10px;
          margin: 10px 0;
        }

        .item {
          display: flex;
          justify-content: space-between;
        }

        .footer {
          display: flex;
          justify-content: space-between;
        }

        button {
          background: #ff78ac;
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
        }

        .green {
          background: #22c55e;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 rgba(255,0,0,0.4); }
          50% { box-shadow: 0 0 10px rgba(255,0,0,0.7); }
          100% { box-shadow: 0 0 0 rgba(255,0,0,0.4); }
        }
      `}</style>
    </div>
  )
}

const Stat = ({ title, value, highlight }) => (
  <div style={{
    background: 'white',
    padding: '15px',
    borderRadius: '12px',
    textAlign: 'center',
    border: highlight ? '2px solid #ff78ac' : 'none'
  }}>
    <p>{title}</p>
    <h2>{value}</h2>
  </div>
)

export default AdminDashboard