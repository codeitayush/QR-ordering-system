import { useNavigate } from 'react-router-dom'

const OrderSuccess = () => {
  const navigate = useNavigate()

  const handleNewOrder = () => {
    navigate('/')
  }

  return (
    <div className="order-success">
      <div className="success-container">
        <div className="success-icon">✅</div>
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for your order. It's being prepared and will be served to your table shortly.</p>
        
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
          background-color: #f8f9fa;
        }
        
        .success-container {
          text-align: center;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          width: 100%;
        }
        
        .success-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        
        .success-container h1 {
          color: #27ae60;
          margin-bottom: 1rem;
          font-size: 1.8rem;
        }
        
        .success-container p {
          color: #6c757d;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        
        .order-info {
          text-align: left;
          background-color: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }
        
        .order-info h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }
        
        .order-info ul {
          list-style: none;
          padding: 0;
        }
        
        .order-info li {
          color: #6c757d;
          margin-bottom: 0.5rem;
          padding-left: 1.5rem;
          position: relative;
        }
        
        .order-info li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #27ae60;
          font-weight: bold;
        }
        
        .new-order-btn {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
          width: 100%;
        }
        
        .new-order-btn:hover {
          background-color: #2980b9;
        }
        
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
