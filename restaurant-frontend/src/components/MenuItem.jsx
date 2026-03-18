import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { theme } from '../theme/colors'

const MenuItem = ({ item }) => {
  const { addToCart, items, updateQuantity, removeFromCart } = useCart()

  const itemId = item._id || item.id || item.name
  const cartItem = items.find(i => i.id === itemId)
  const quantity = cartItem?.quantity || 0

  const handleAdd = () => {
    addToCart({
      id: itemId,
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
    <div className="card">
      {/* LEFT CONTENT */}
      <div className="info">
        <h3 className="name">{item.name}</h3>

        {item.description && (
          <p className="desc">{item.description}</p>
        )}

        <div className="bottom">
          <span className="price">₹{item.price}</span>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="imageBox">
        <img src={item.image || `https://picsum.photos/seed/${item.name}/300`} />

        {quantity === 0 ? (
          <button className="addBtn" onClick={handleAdd}>
            ADD
          </button>
        ) : (
          <div className="qtyBox">
            <button onClick={() => handleChange(quantity - 1)}>-</button>
            <span>{quantity}</span>
            <button onClick={() => handleChange(quantity + 1)}>+</button>
          </div>
        )}
      </div>

      <style jsx>{`
       .card {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  margin-bottom: 16px;

  background: ${theme.cardBackground};
  border-radius: 16px;

  box-shadow: 0 6px 16px rgba(0,0,0,0.06);
  transition: transform 0.15s ease;
}

.card:active {
  transform: scale(0.98);
}

/* LEFT */
.info {
  flex: 1;
}

.name {
  font-size: 1.05rem;
  font-weight: 600;
  color: ${theme.text};
  margin-bottom: 4px;
}

.desc {
  font-size: 0.85rem;
  color: #777;
  margin-bottom: 8px;
  line-height: 1.3;
}

.price {
  font-size: 1.15rem;
  font-weight: 700;
  color: ${theme.primary};
}

/* IMAGE */
.imageBox {
  position: relative;
  width: 95px;
  height: 90px;
  flex-shrink: 0;
}

.imageBox img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 14px;
}

/* ADD BUTTON */
.addBtn {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);

  background: white;
  color: ${theme.primary};
  border: 2px solid ${theme.primary};

  padding: 6px 18px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.5px;

  box-shadow: 0 6px 12px rgba(0,0,0,0.12);

  transition: all 0.2s ease;
}

.addBtn:active {
  transform: translateX(-50%) scale(0.92);
}

/* QUANTITY BOX */
.qtyBox {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  align-items: center;
  gap: 10px;

  background: white;
  padding: 6px 12px;
  border-radius: 12px;

  box-shadow: 0 6px 14px rgba(0,0,0,0.12);
}

/* BUTTONS */
.qtyBox button {
  background: ${theme.primary};
  color: white;
  border: none;

  width: 26px;
  height: 26px;
  border-radius: 8px;

  font-weight: 700;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 3px 8px rgba(255,120,172,0.3);
  transition: transform 0.1s ease;
}

.qtyBox button:active {
  transform: scale(0.9);
}

.qtyBox span {
  font-weight: 700;
  font-size: 0.95rem;
  min-width: 16px;
  text-align: center;
}
      `}</style>
    </div>
  )
}

export default MenuItem