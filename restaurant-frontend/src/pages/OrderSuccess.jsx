import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const OrderSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // optional: pass orderId from previous page
  const orderId = location.state?.orderId || 'XXXX'

  const handleNewOrder = () => {
    navigate('/')
  }

  // 🔥 AUTO REDIRECT (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/')
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="order-success">
      <div className="success-container">
        
        <div className="success-icon">✅</div>

        <h1>Order Placed Successfully!</h1>

        <p className="sub-text">
          Thank you for your order. It's being prepared and will be served shortly.
        </p>

        {/* 🔥 ORDER ID */}
        <p className="order-id">Order ID: #{orderId}</p>

        <div className="order-info">
          <h3>What's Next?</h3>
          <ul>
            <li>Your order has been sent to the kitchen</li>
            <li>We'll prepare your items fresh</li>
            <li>Food will be served to your table</li>
            <li>Payment will be collected at the table</li>
          </ul>
        </div>

        <button 
          onClick={handleNewOrder}
          className="new-order-btn"
        >
          Place Another Order
        </button>
      </div>

      <style jsx>{`
        .order-success {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 1rem;
          background: linear-gradient(135deg, #f0f4f8, #e6ecf2);
        }

        .success-container {
          text-align: center;
          background: white;
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          max-width: 500px;
          width: 100%;
          animation: fadeIn 0.4s ease;
        }

        /* ✅ ICON */
        .success-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: pop 0.4s ease;
        }

        /* ✅ TITLE */
        .success-container h1 {
          color: #22c55e;
          margin-bottom: 0.5rem;
          font-size: 1.8rem;
          font-weight: 700;
        }

        .sub-text {
          color: #6c757d;
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        /* 🔥 ORDER ID */
        .order-id {
          font-size: 14px;
          color: #94a3b8;
          margin-bottom: 1.5rem;
        }

        /* ✅ BOX */
        .order-info {
          text-align: left;
          background: #f1f5f9;
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
        }

        .order-info h3 {
          color: #1e293b;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .order-info ul {
          list-style: none;
          padding: 0;
        }

        .order-info li {
          color: #475569;
          margin-bottom: 0.6rem;
          padding-left: 1.5rem;
          position: relative;
        }

        .order-info li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #22c55e;
          font-weight: bold;
        }

        /* 🔥 BUTTON */
        .new-order-btn {
          background: linear-gradient(135deg, #4facfe, #00c6ff);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .new-order-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        /* ✨ ANIMATIONS */
        @keyframes pop {
          0% { transform: scale(0.7); opacity: 0 }
          100% { transform: scale(1); opacity: 1 }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* 📱 RESPONSIVE */
        @media (min-width: 768px) {
          .success-container {
            padding: 3rem;
          }

          .success-container h1 {
            font-size: 2.2rem;
          }

          .new-order-btn {
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  )
}

export default OrderSuccess