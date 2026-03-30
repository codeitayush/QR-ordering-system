import { useCart } from '../context/CartContext'
import { theme } from '../theme/colors'

const MenuItem = ({ item }) => {
  const { addToCart, items, updateQuantity, removeFromCart } = useCart()

  // ✅ ALWAYS USE _id
  const itemId = item._id || item.name

  const cartItem = items.find(i => i._id === itemId)
  const quantity = cartItem?.quantity || 0

  const handleAdd = () => {
    addToCart({
      _id: itemId,   // 🔥 FIXED
      name: item.name,
      price: item.price,
      image: item.image
    })
  }

  const handleChange = (q) => {
    if (q <= 0) removeFromCart(itemId)
    else updateQuantity(itemId, q)
  }

  return (
    <div className="menu-item-card">
      
      <div className="item-info">
        <h3 className="item-name">{item.name}</h3>

        {item.description && (
          <p className="item-desc">{item.description}</p>
        )}

        <div className="item-price">₹{item.price}</div>
      </div>

      <div className="item-image-box">
        <img src={item.image || `https://source.unsplash.com/200x200/?indian-food&sig=${item.name}`} className="item-image" />

        {quantity === 0 ? (
          <button className="add-btn" onClick={handleAdd}>
            ADD
          </button>
        ) : (
          <div className="qty-box">
            <button className="qty-btn" onClick={() => handleChange(quantity - 1)}>-</button>
            <span className="qty-text">{quantity}</span>
            <button className="qty-btn" onClick={() => handleChange(quantity + 1)}>+</button>
          </div>
        )}
      </div>

      <style jsx>{`
        .menu-item-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 16px;
          margin: 0 16px 8px 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03), 0 4px 12px rgba(0, 0, 0, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(0, 0, 0, 0.06);
          animation: fadeInUp 0.4s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .menu-item-card:hover {
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06), 0 8px 20px rgba(0, 0, 0, 0.12);
          transform: scale(0.98);
        }

        .menu-item-card:active {
          transform: scale(0.97);
        }

        .item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          justify-content: center;
        }

        .item-name {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 4px 0;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }

        .item-desc {
          font-size: 14px;
          color: #999;
          margin: 0 0 8px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-price {
          font-size: 20px;
          font-weight: 800;
          color: #ff4d8d;
          margin-top: 4px;
          letter-spacing: -0.02em;
        }

        .item-image-box {
          position: relative;
          width: 100px;
          height: 100px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .item-image {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 16px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
          transition: transform 0.3s ease;
        }

        .menu-item-card:hover .item-image {
          transform: scale(1.03);
        }

        .add-btn {
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: #ffffff;
          border: 2px solid #ff4d8d;
          color: #ff4d8d;
          border-radius: 18px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          outline: none;
          box-shadow: 0 2px 6px rgba(255, 77, 141, 0.25);
        }

        .add-btn:hover {
          background: #ff4d8d;
          color: white;
          transform: translateX(-50%) translateY(-1px);
          box-shadow: 0 4px 10px rgba(255, 77, 141, 0.35);
        }

        .add-btn:active {
          transform: translateX(-50%) translateY(0) scale(0.97);
        }

        .qty-box {
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 4px;
          background: #ff4d8d;
          border-radius: 22px;
          padding: 6px 10px;
          box-shadow: 0 3px 10px rgba(255, 77, 141, 0.35);
        }

        .qty-btn {
          background: white;
          color: #ff4d8d;
          border: none;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: all 0.2s ease;
          outline: none;
        }

        .qty-btn:hover {
          background: #f8f8f8;
          transform: scale(1.08);
        }

        .qty-btn:active {
          transform: scale(0.95);
        }

        .qty-text {
          color: white;
          font-weight: 700;
          font-size: 14px;
          min-width: 18px;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

export default MenuItem