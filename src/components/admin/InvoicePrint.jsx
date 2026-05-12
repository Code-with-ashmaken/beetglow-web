import { useRef } from 'react';
import Barcode from 'react-barcode';

export default function InvoicePrint({ order, products, onClose }) {
  const printRef = useRef();

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = printRef.current.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              padding: 20px;
              background: white;
            }
            .invoice-container {
              max-width: 600px;
              margin: 0 auto;
              border: 1px solid #ddd;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .invoice-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .invoice-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            .info-block {
              width: 48%;
            }
            .info-title {
              font-weight: bold;
              margin-bottom: 5px;
              border-bottom: 1px solid #ccc;
              padding-bottom: 2px;
            }
            .info-row {
              margin-bottom: 3px;
            }
            .products-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .products-table th,
            .products-table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .products-table th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .total-section {
              text-align: right;
              margin-bottom: 20px;
            }
            .total-row {
              margin-bottom: 5px;
            }
            .grand-total {
              font-size: 16px;
              font-weight: bold;
              border-top: 2px solid #333;
              padding-top: 5px;
            }
            .barcode-section {
              text-align: center;
              margin-top: 30px;
            }
            .notes {
              margin-top: 20px;
              padding: 10px;
              background-color: #f9f9f9;
              border: 1px solid #eee;
            }
            @media print {
              body { 
                padding: 0; 
                margin: 0;
                background: white;
              }
              .invoice-container { 
                border: 1px solid #000;
                box-shadow: none;
                margin: 0;
                padding: 10px;
                page-break-inside: avoid;
              }
              .header, .invoice-info, .products-table, .total-section {
                page-break-inside: avoid;
              }
              @page {
                margin: 0.5in;
                size: auto;
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateTotal = () => {
    return (order.lines || []).reduce((total, line) => {
      return total + (line.price * line.quantity);
    }, 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-lg font-bold">Invoice - Preview</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Print Invoice
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
        
        <div ref={printRef} className="p-4">
          <div className="invoice-container">
            {/* Header */}
            <div className="header">
              <div className="company-name">BeetGlow</div>
              <div className="invoice-title">TAX INVOICE</div>
              <div>Organic Skin Care Products</div>
            </div>

            {/* Invoice Info */}
            <div className="invoice-info">
              <div className="info-block">
                <div className="info-title">Invoice Details</div>
                <div className="info-row">Invoice #: {order.id}</div>
                <div className="info-row">Date: {formatDate(order.date || order.at)}</div>
                <div className="info-row">Status: {order.status || 'Pending'}</div>
              </div>
              <div className="info-block">
                <div className="info-title">Billing To</div>
                <div className="info-row">
                  {order.customer?.firstName} {order.customer?.lastName}
                </div>
                <div className="info-row">{order.customer?.address}</div>
                <div className="info-row">{order.customer?.city}</div>
                <div className="info-row">Phone: {order.customer?.phone}</div>
              </div>
            </div>

            {/* Products Table */}
            <table className="products-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Product Name</th>
                  <th>Variant</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {(order.lines || []).map((line, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{line.name}</td>
                    <td>{line.variantLabel}</td>
                    <td>{line.quantity}</td>
                    <td>Rs {line.price.toLocaleString()}</td>
                    <td>Rs {(line.price * line.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Section */}
            <div className="total-section">
              <div className="total-row">Subtotal: Rs {calculateTotal().toLocaleString()}</div>
              <div className="total-row">Shipping: Rs 0</div>
              <div className="total-row">Tax: Rs 0</div>
              <div className="grand-total">Grand Total: Rs {calculateTotal().toLocaleString()}</div>
            </div>

            {/* Barcode */}
            <div className="barcode-section">
              <Barcode value={order.id} width={1.5} height={50} />
              <div className="order-id">{order.id}</div>
            </div>

            {/* Notes */}
            <div className="notes">
              <strong>Notes:</strong>
              <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
                <li>Payment: Cash on Delivery (COD)</li>
                <li>Delivery: 3-5 working days</li>
                <li>Thank you for choosing BeetGlow!</li>
              </ul>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '10px' }}>
              <div>BeetGlow | Organic Skin Care</div>
              <div>Lahore ♥ Karachi, Pakistan</div>
              <div>www.beetglow.pk</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
