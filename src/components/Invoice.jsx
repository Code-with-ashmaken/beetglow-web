import React from 'react';
import { getBusinessSettings } from '../data/businessSettings';

const Invoice = ({ order, showPrintButton = true }) => {
  const businessSettings = getBusinessSettings();
  const subtotal = order.price * order.quantity;
  const total = subtotal + businessSettings.delivery.charge;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="invoice-container">
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .invoice-container, .invoice-container * {
            visibility: visible;
          }
          .invoice-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
          .invoice {
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
          }
        }
        
        .invoice {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          background: white;
          margin: 20px 0;
        }
        
        .invoice-header {
          border-bottom: 2px solid #1f2937;
          padding: 20px;
        }
        
        .invoice-title {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 20px;
          color: #1f2937;
        }
        
        .invoice-addresses {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 20px;
        }
        
        .address-section h3 {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .address-section p {
          margin: 4px 0;
          font-size: 14px;
          color: #374151;
        }
        
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        
        .invoice-table th {
          background-color: #f9fafb;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }
        
        .invoice-table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
          color: #374151;
        }
        
        .invoice-table .text-right {
          text-align: right;
        }
        
        .invoice-totals {
          margin-top: 20px;
          padding: 20px;
          background-color: #f9fafb;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }
        
        .total-row.grand-total {
          font-weight: bold;
          font-size: 16px;
          color: #1f2937;
          border-top: 1px solid #e5e7eb;
          padding-top: 8px;
        }
        
        .invoice-footer {
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          border-top: 1px solid #e5e7eb;
        }
      `}</style>

      <div className="invoice">
        {/* Invoice Header */}
        <div className="invoice-header">
          <div className="invoice-title">INVOICE</div>
          
          {/* Two-column address layout */}
          <div className="invoice-addresses">
            {/* Sender (BeetGlow) Details */}
            <div className="address-section">
              <h3>From</h3>
              <p><strong>{businessSettings.sender.name}</strong></p>
              <p>{businessSettings.sender.address}</p>
              <p>Phone: {businessSettings.sender.phone}</p>
              <p>Email: {businessSettings.sender.email}</p>
            </div>
            
            {/* Bill To (Customer) Details */}
            <div className="address-section">
              <h3>Bill To</h3>
              <p><strong>{order.customer.firstName} {order.customer.lastName}</strong></p>
              <p>{order.customer.shippingAddress}</p>
              <p>{order.customer.city}, {order.customer.postalCode}</p>
              <p>Phone: {order.customer.phone}</p>
              <p>Email: {order.customer.email}</p>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>Invoice Number:</p>
              <p style={{ margin: '4px 0', fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>{order.invoiceId}</p>
            </div>
            <div>
              <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>Date:</p>
              <p style={{ margin: '4px 0', fontSize: '16px', color: '#1f2937' }}>{new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p style={{ margin: '4px 0', fontSize: '14px', color: '#6b7280' }}>Order Status:</p>
              <p style={{ margin: '4px 0', fontSize: '16px', fontWeight: 'bold', color: order.status === 'pending' ? '#f59e0b' : '#10b981' }}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </p>
            </div>
          </div>

          {/* Invoice Table */}
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Weight</th>
                <th className="text-right">Qty</th>
                <th className="text-right">Unit Price</th>
                <th className="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{order.productName}</td>
                <td>{order.variant || 'N/A'}</td>
                <td className="text-right">{order.quantity}</td>
                <td className="text-right">RS {order.price}</td>
                <td className="text-right">RS {subtotal}</td>
              </tr>
            </tbody>
          </table>

          {/* Totals Section */}
          <div className="invoice-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>RS {subtotal}</span>
            </div>
            <div className="total-row">
              <span>{businessSettings.delivery.description}:</span>
              <span>RS {businessSettings.delivery.charge}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total Amount:</span>
              <span>RS {total}</span>
            </div>
          </div>
        </div>

        {/* Invoice Footer */}
        <div className="invoice-footer">
          <p>Thank you for your business! This is a computer-generated invoice.</p>
          <p>For any questions, please contact us at {businessSettings.sender.email}</p>
        </div>
      </div>

      {/* Print Button */}
      {showPrintButton && (
        <div className="no-print" style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={handlePrint}
            style={{
              backgroundColor: '#1f2937',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Print Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default Invoice;
