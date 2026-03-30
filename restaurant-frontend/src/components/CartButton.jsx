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
          bottom: 20px;
          left: 16px;
          right: 16px;
          z-index: 1000;
        }

        .cart-bar {
          width: 100%;
          background: linear-gradient(135deg, #ff4d8d, #ff6b9d);
          color: white;
          border: none;
          border-radius: 16px;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(255, 77, 141, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cart-bar:hover {
          box-shadow: 0 12px 32px rgba(255, 77, 141, 0.4);
          transform: translateY(-2px);
        }

        .cart-bar:active {
          transform: translateY(0);
        }

        .left {
          display: flex;
          flex-direction: column;
        }

        .items {
          font-size: 13px;
          opacity: 0.9;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .price {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .right {
          font-size: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </div>
  )
}

export default CartButton