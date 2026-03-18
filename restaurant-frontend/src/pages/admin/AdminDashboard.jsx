import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { orderAPI } from '../../services/api'
import { io } from 'socket.io-client'

const AdminDashboard = () => {
  const [orders, setOrders] = useState([])
  const [newOrderIds, setNewOrderIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingOrderId, setUpdatingOrderId] = useState(null)

  const navigate = useNavigate()
  const { logout } = useAdminAuth()

  useEffect(() => {
    fetchOrders()

    const socket = io(import.meta.env.VITE_API_URL.replace('/api', ''))

    socket.on("new-order", (order) => {
      setOrders(prev => [order, ...prev])

      setNewOrderIds(prev => [...prev, order._id])

      setTimeout(() => {
        setNewOrderIds(prev => prev.filter(id => id !== order._id))
      }, 3000)

      playSound()
    })

    return () => {
      socket.disconnect() // ✅ FULL CLEANUP
    }
  }, [])

  const playSound = () => {
    const audio = new Audio("/notification.mp3")
    audio.play().catch(() => {}) // ✅ prevent crash if autoplay blocked
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

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId)
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus)

      // ✅ OPTIMISTIC UPDATE (no refetch lag)
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
        <div>
          <button onClick={() => navigate('/admin/menu')}>Menu</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="kanban-board">
        {Object.entries(groupedOrders).map(([status, list]) => (
          <div key={status} className="kanban-column">
            <h3>{status}</h3>

            {list.map(order => (
              <div
                key={order._id}
                className={`order-card 
                  ${isUrgent(order.createdAt) ? 'urgent' : ''} 
                  ${newOrderIds.includes(order._id) ? 'new' : ''}
                `}
              >
                <h2>Table {order.tableNumber}</h2>
                <p>{getTimeAgo(order.createdAt)}</p>

                {isUrgent(order.createdAt) && <p>⚠ Delayed</p>}

                {order.items.map((item, i) => (
                  <div key={i}>
                    {item.name} ×{item.quantity} ₹{item.price * item.quantity}
                  </div>
                ))}

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
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        .kanban-board {
          display: flex;
          gap: 1rem;
        }

        .kanban-column {
          min-width: 300px;
        }

        .order-card {
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 10px;
          background: white;
        }

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