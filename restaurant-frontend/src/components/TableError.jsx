import { useNavigate } from 'react-router-dom'

const TableError = () => {
  const navigate = useNavigate()

  const handleScanQR = () => {
    navigate('/')
  }

  return (
    <div className="table-error">
      <div className="error-container">
        <h1>⚠️ Table Number Required</h1>
        <p>Please scan the QR code at your table to start ordering.</p>
        <p>The QR code should contain your table number.</p>
        
        <button 
          onClick={handleScanQR}
          className="scan-qr-btn"
        >
          Scan QR Code
        </button>
      </div>
      
      <style jsx>{`
        .table-error {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 1rem;
          background-color: #f8f9fa;
        }
        
        .error-container {
          text-align: center;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 100%;
        }
        
        .error-container h1 {
          color: #e74c3c;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }
        
        .error-container p {
          color: #6c757d;
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        
        .scan-qr-btn {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        
        .scan-qr-btn:hover {
          background-color: #2980b9;
        }
        
        @media (min-width: 768px) {
          .error-container {
            padding: 3rem;
          }
          
          .error-container h1 {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  )
}

export default TableError
