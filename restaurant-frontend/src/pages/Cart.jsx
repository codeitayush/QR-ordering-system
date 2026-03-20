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
        tableNumber: tableNumber,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      }

      const response = await orderAPI.createOrder(orderData)

      if (response.data.success) {
        clearCart()
        navigate('/order-success')
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message)
console.log("ERROR:", err)
    } finally {
      setLoading(false)
    }
  }

  // ✅ EMPTY STATE
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

      {/* HEADER */}
      <div className="cart-header">
        <h1>Your Cart</h1>
        <p className="table-info">Table {tableNumber}</p>
      </div>

      {/* ITEMS */}
      <div className="cart-items">
        {items.map(item => (
          <div key={item.id} className="cart-item">

            <div className="left">
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
            </div>

            <div className="right">
              <div className="qty">
                <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
              </div>

              <div className="item-total">
                ₹{item.price * item.quantity}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* 🔥 STICKY CHECKOUT */}
      <div className="checkout-bar">
        <div className="total">
          <span>Total</span>
          <span>₹{totalPrice}</span>
        </div>

        {error && <div className="error">{error}</div>}

        <button onClick={handleCheckout} disabled={loading}>
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>

      <style jsx>{`
        .cart {
  padding-bottom: 130px;
  background: ${theme.background};
  min-height: 100vh;
}

/* HEADER */
.cart-header {
  text-align: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
}

.cart-header h1 {
  font-size: 1.7rem;
  font-weight: 700;
  color: ${theme.text};
}

.table-info {
  color: #888;
  font-size: 0.95rem;
}

/* ITEMS */
.cart-items {
  padding: 0 1rem;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: ${theme.cardBackground};
  padding: 14px;
  margin-bottom: 10px;

  border-radius: 14px;

  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
  transition: transform 0.15s ease;
}

.cart-item:active {
  transform: scale(0.98);
}

/* LEFT */
.left h3 {
  font-size: 1.05rem;
  font-weight: 600;
  color: ${theme.text};
}

.left p {
  font-size: 0.9rem;
  color: #888;
}

/* RIGHT */
.right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* QUANTITY */
.qty {
  display: flex;
  align-items: center;
  gap: 8px;

  background: rgba(0,0,0,0.03);
  padding: 4px 8px;
  border-radius: 10px;
}

.qty button {
  width: 28px;
  height: 28px;

  border: none;
  border-radius: 8px;

  background: ${theme.primary};
  color: white;

  font-size: 1rem;
  font-weight: 600;

  display: flex;
  align-items: center;
  justify-content: center;

  /* 🔥 softened shadow */
  box-shadow: 0 2px 6px rgba(255, 120, 172, 0.25);

  transition: transform 0.1s ease;
}

.qty button:active {
  transform: scale(0.9);
}

.qty span {
  font-weight: 600;
  min-width: 18px;
  text-align: center;
}

/* ITEM TOTAL */
.item-total {
  font-weight: 800;
  color: ${theme.primary};
  font-size: 1.2rem;
}

/* CHECKOUT BAR */
.checkout-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  background: ${theme.cardBackground};
  padding: 1rem;

  border-top-left-radius: 16px;
  border-top-right-radius: 16px;

  /* 🔥 subtle divider */
  border-top: 1px solid rgba(0,0,0,0.05);

  box-shadow: 0 -6px 18px rgba(0,0,0,0.08);
}

/* TOTAL */
.total {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.total span:last-child {
  color: ${theme.primary};
}

/* BUTTON */
button {
  width: 100%;
  padding: 15px;

  border: none;
  border-radius: 12px;

  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.5px;

  background: linear-gradient(
    135deg,
    ${theme.primary},
    #ff5a8c
  );

  color: white;

  box-shadow: 0 6px 14px rgba(255, 120, 172, 0.35);

  transition: transform 0.1s ease;
}

button:active {
  transform: scale(0.96);
}

/* ERROR */
.error {
  color: #e74c3c;
  text-align: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
}
        }
      `}</style>
    </div>
  )
}

export default Cart