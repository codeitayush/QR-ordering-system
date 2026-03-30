import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { orderAPI } from '../services/api'
import { theme } from '../theme/colors'

const Cart = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const tableParam = searchParams.get('table')
  const tableNumber = tableParam || localStorage.getItem('tableNumber')

  const totalPrice = getTotalPrice()

  useEffect(() => {
    if (tableParam) {
      localStorage.setItem('tableNumber', tableParam)
    }
  }, [tableParam])

  useEffect(() => {
    if (!tableNumber) {
      navigate('/')
    }
  }, [tableNumber, navigate])

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleCheckout = async () => {
    if (items.length === 0) return

    try {
      setLoading(true)
      setError(null)

      const orderData = {
        tableNumber: Number(tableNumber),
        items: items.map(item => ({
          itemId: item._id, // ✅ FIX
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      }

      console.log("SENDING ORDER:", orderData)

      const response = await orderAPI.createOrder(orderData)

      if (response.data.success) {
        clearCart()
        navigate('/order-success')
      }
    } catch (err) {
      console.log("ERROR:", err)
      setError(err?.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="empty">
        <h2>Your cart is empty</h2>
        <p>Add some delicious items from the menu</p>
        <button onClick={() => navigate(`/?table=${tableNumber}`)}>
          Browse Menu
        </button>

        <style jsx>{`
          .empty {
            text-align: center;
            padding: 4rem 1rem;
          }

          button {
            margin-top: 1rem;
            padding: 12px 24px;
            border: none;
            background: ${theme.primary};
            color: white;
            border-radius: 10px;
            font-size: 1rem;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="cart">

      <div className="cart-header">
        <h1>Your Cart</h1>
        <p className="table-info">Table {tableNumber}</p>
      </div>

      <div className="cart-items">
        {items.map(item => (
          <div key={item._id} className="cart-item">

            <div className="item-info">
              <h3 className="item-name">{item.name}</h3>
              <div className="price-info">
                <span className="item-price">₹{item.price}</span>
              </div>
            </div>

            <div className="item-controls">
              <div className="qty-selector">
                <button className="qty-btn" onClick={() => handleQuantityChange(item._id, item.quantity - 1)}>-</button>
                <span className="qty-text">{item.quantity}</span>
                <button className="qty-btn" onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>+</button>
              </div>

              <div className="item-total">
                ₹{item.price * item.quantity}
              </div>
            </div>

          </div>
        ))}
      </div>

      <div className="checkout-bar">
        <div className="total-section">
          <span className="total-label">Total</span>
          <span className="total-amount">₹{totalPrice}</span>
        </div>

        {error && <div className="error">{error}</div>}

        <button className="checkout-btn" onClick={handleCheckout} disabled={loading}>
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>

      <style jsx>{`
        .cart {
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0;
          padding-bottom: 120px;
          background: #fafafa;
          min-height: 100vh;
        }

        .cart-header {
          text-align: center;
          padding: 16px 20px 8px 20px;
          background: #ffffff;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        .cart-header h1 {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 4px 0;
          letter-spacing: -0.02em;
        }

        .table-info {
          color: #777;
          font-size: 14px;
          margin: 0;
          font-weight: 500;
        }

        .cart-items {
          padding: 12px 16px;
        }

        .cart-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #ffffff;
          padding: 16px;
          margin-bottom: 8px;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(0, 0, 0, 0.06);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cart-item:hover {
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .item-info {
          flex: 1;
          min-width: 0;
        }

        .item-name {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 6px 0;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }

        .price-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .item-price {
          font-size: 14px;
          color: #888;
          font-weight: 500;
        }

        .item-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .qty-selector {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #f5f5f5;
          padding: 6px 8px;
          border-radius: 20px;
          border: 1px solid #e0e0e0;
        }

        .qty-btn {
          width: 24px;
          height: 24px;
          border: none;
          border-radius: 50%;
          background: #ff4d8d;
          color: white;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          outline: none;
        }

        .qty-btn:hover {
          background: #ff3366;
          transform: scale(1.1);
        }

        .qty-btn:active {
          transform: scale(0.95);
        }

        .qty-text {
          font-weight: 700;
          font-size: 14px;
          color: #1a1a1a;
          min-width: 16px;
          text-align: center;
        }

        .item-total {
          font-weight: 800;
          color: #ff4d8d;
          font-size: 16px;
          min-width: 60px;
          text-align: right;
          letter-spacing: -0.02em;
        }

        .checkout-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #ffffff;
          padding: 16px 20px 20px 20px;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
        }

        .total-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .total-label {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .total-amount {
          font-size: 20px;
          font-weight: 800;
          color: #ff4d8d;
          letter-spacing: -0.02em;
        }

        .checkout-btn {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 16px;
          background: linear-gradient(135deg, #ff4d8d, #ff6b9d);
          color: white;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(255, 77, 141, 0.3);
        }

        .checkout-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(255, 77, 141, 0.4);
        }

        .checkout-btn:active {
          transform: translateY(0) scale(0.97);
        }

        .checkout-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .error {
          color: #ff4d4d;
          text-align: center;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
        }
      `}</style>
    </div>
  )
}

export default Cart