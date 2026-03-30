import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { theme } from '../theme/colors'

const CartButton = () => {
  const navigate = useNavigate()
  const { getTotalItems, getTotalPrice } = useCart()

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  if (totalItems === 0) return null

  const handleCartClick = () => {
    const table = localStorage.getItem('tableNumber')
    navigate(`/cart?table=${table}`)
  }

  return (
    <div className="cart-wrapper">
      <button onClick={handleCartClick} className="cart-bar">
        
        <div className="left">
          <div className="items">{totalItems} items</div>
          <div className="price">₹{totalPrice}</div>
        </div>

        <div className="right">
          View Cart →
        </div>

      </button>

      <style jsx>{`
        .cart-wrapper {
          position: fixed;
          bottom: 12px;
          left: 12px;
          right: 12px;
          z-index: 1000;
        }

        .cart-bar {
          width: 100%;
          background: #ff4d8d;
          color: white;
          border: none;
          border-radius: 16px;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          transition: all 0.2s ease;
        }

        .cart-bar:hover {
          box-shadow: 0 10px 28px rgba(0,0,0,0.18);
        }

        .left {
          display: flex;
          flex-direction: column;
        }

        .items {
          font-size: 0.85rem;
          opacity: 0.9;
          font-weight: 500;
        }

        .price {
          font-size: 1.3rem;
          font-weight: 700;
        }

        .right {
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }
      `}</style>
    </div>
  )
}

export default CartButton