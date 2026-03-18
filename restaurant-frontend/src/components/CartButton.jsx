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
          background: ${theme.primary};
          color: white;
          border: none;
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          
          /* 🔥 premium feel */
          box-shadow: 0 6px 18px rgba(0,0,0,0.15);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .cart-bar:active {
          transform: scale(0.98);
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }

        .left {
          display: flex;
          flex-direction: column;
        }

        .items {
          font-size: 0.85rem;
          opacity: 0.9;
        }

        .price {
          font-size: 1.2rem;
          font-weight: 700;
        }

        .right {
          font-size: 1rem;
          font-weight: 600;
        }

        @media (min-width: 768px) {
          .cart-wrapper {
            max-width: 600px;
            margin: 0 auto;
            left: 0;
            right: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default CartButton