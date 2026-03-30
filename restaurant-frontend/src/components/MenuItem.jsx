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
        <img src={item.image || `https://picsum.photos/seed/${item.name}/300`} className="item-image" />

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
          border-radius: 16px;
          padding: 14px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          transition: all 0.2s ease;
        }

        .menu-item-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .item-name {
          font-size: 16px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 4px;
          line-height: 1.3;
        }

        .item-desc {
          font-size: 13px;
          color: #777;
          margin-bottom: 8px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-price {
          font-size: 16px;
          font-weight: 700;
          color: #ff4d8d;
        }

        .item-image-box {
          position: relative;
          width: 60px;
          height: 60px;
          flex-shrink: 0;
        }

        .item-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .add-btn {
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          border: 1px solid #ff4d8d;
          color: #ff4d8d;
          border-radius: 12px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .add-btn:hover {
          background: #ff4d8d;
          color: white;
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
          border-radius: 20px;
          padding: 4px 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .qty-btn {
          background: white;
          color: #ff4d8d;
          border: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .qty-btn:hover {
          background: #f5f5f5;
        }

        .qty-text {
          color: white;
          font-weight: 600;
          font-size: 12px;
          min-width: 16px;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

export default MenuItem