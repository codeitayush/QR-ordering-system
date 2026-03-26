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
  const [error, setError] = useState('')
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
    try {
      const response = await orderAPI.getAllOrders()
      setOrders(response.data.data)
      setError('')
    } catch {
      setError('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await orderAPI.getAnalytics()
      setAnalytics(response.data.data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId)
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus)

      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      )
    } catch {
      setError('Failed to update order status')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const getTimeAgo = (time) => {
    const diff = Math.floor((Date.now() - new Date(time)) / 60000)
    if (diff < 1) return 'Just now'
    if (diff < 60) return `${diff} min ago`
    return `${Math.floor(diff / 60)} hr ago`
  }

  const isUrgent = (time) => {
    return (Date.now() - new Date(time)) / 60000 > 15
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const groupedOrders = {
    Preparing: orders.filter(o => o.status === 'Preparing'),
    Ready: orders.filter(o => o.status === 'Ready'),
    Served: orders.filter(o => o.status === 'Served')
  }

  if (loading && orders.length === 0) return <div>Loading...</div>

  return (
    <div className="admin-dashboard">

      <div className="dashboard-header">
        <h1>Kitchen Dashboard</h1>
        <div className="header-buttons">

  {/* TEMP HIDE MENU */}
  {false && (
    <button onClick={() => navigate('/admin/menu')}>Menu</button>
  )}

  <button className="logout" onClick={handleLogout}>Logout</button>
</div>
      </div>

      {/* Analytics Section */}
      {analytics && (
        <div className="analytics-section">
          <div className="analytics-card">
            <h3>Orders Today</h3>
            <p className="analytics-value">{analytics.totalOrders}</p>
          </div>
          <div className="analytics-card">
            <h3>Revenue</h3>
            <p className="analytics-value">₹{analytics.totalRevenue}</p>
          </div>
          <div className="analytics-card">
            <h3>Most Ordered</h3>
            <p className="analytics-value">{analytics.mostOrderedItem}</p>
          </div>
        </div>
      )}

      <div className="kanban-board">
        {Object.entries(groupedOrders).map(([status, list]) => (
          <div key={status} className="kanban-column">
            <h3>{status}</h3>

            {list.map(order => (
              <div
                key={order._id}
                className={`order-card 
                ${isUrgent(order.createdAt) ? 'urgent' : ''} 
                ${newOrderIds.includes(order._id) ? 'new' : ''}`}
              >
                <h2>Table {order.tableNumber}</h2>
                <p className="time">{getTimeAgo(order.createdAt)}</p>

                {isUrgent(order.createdAt) && (
                  <p className="delay">⚠ Delayed</p>
                )}

                <div className="items">
                  {order.items.map((item, i) => (
                    <div key={i} className="item-row">
                      <span>{item.name}</span>
                      <span>×{item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="footer">
                  <strong>Total ₹{order.totalAmount}</strong>

                  {order.status === 'Preparing' && (
                    <button
                      disabled={updatingOrderId === order._id}
                      onClick={() => updateOrderStatus(order._id, 'Ready')}
                    >
                      {updatingOrderId === order._id ? 'Updating...' : 'Mark Ready'}
                    </button>
                  )}

                  {order.status === 'Ready' && (
                    <button
                      disabled={updatingOrderId === order._id}
                      onClick={() => updateOrderStatus(order._id, 'Served')}
                    >
                      {updatingOrderId === order._id ? 'Updating...' : 'Mark Served'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
.admin-dashboard {
  padding: 1rem;
  background: #f4f6f8;
  min-height: 100vh;
}

/* HEADER */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.dashboard-header h1 {
  font-size: 28px;
  font-weight: 700;
}

/* BUTTONS */
.header-buttons {
  display: flex;
  gap: 10px;
}

.header-buttons button {
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

/* ANALYTICS */
.analytics-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.analytics-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-width: 200px;
  text-align: center;
}

.analytics-card h3 {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.analytics-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

/* Logout */
.logout {
  background: #ff6b6b;
  color: white;
}

/* BOARD */
.kanban-board {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}

.kanban-column {
  min-width: 320px;
}

/* CARD */
.order-card {
  background: #fff;
  border-radius: 20px;
  padding: 16px;
  padding-left: 18px; /* 🔥 FIX SPACING */
  margin-bottom: 16px;
  position: relative;
  border: 2px solid #ff4d4d;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

/* LEFT COLOR STRIP */
.order-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  border-radius: 20px 0 0 20px;
  background: orange;
}

/* STATUS COLORS */
.kanban-column:nth-child(2) .order-card::before {
  background: #22c55e;
}

.kanban-column:nth-child(3) .order-card::before {
  background: #9ca3af;
}

/* TEXT */
.order-card h2 {
  margin: 0;
  font-size: 20px;
}

.time {
  color: gray;
  font-size: 13px;
}

.delay {
  color: red;
  font-weight: 600;
  margin: 5px 0;
}

/* ITEMS BOX */
.items {
  margin: 10px 0;
  background: #f1f5f9;
  padding: 12px;
  border-radius: 12px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

/* FOOTER */
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.footer button {
  background: orange;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

/* READY BUTTON GREEN */
.kanban-column:nth-child(2) .footer button {
  background: #22c55e;
}

/* EFFECTS */
.urgent {
  border: 2px solid red;
}

.new {
  animation: glow 1s ease-in-out 2;
}

@keyframes glow {
  0% { box-shadow: 0 0 0px blue; }
  50% { box-shadow: 0 0 20px blue; }
  100% { box-shadow: 0 0 0px blue; }
}
`}</style>
    </div>
  )
}

export default AdminDashboard