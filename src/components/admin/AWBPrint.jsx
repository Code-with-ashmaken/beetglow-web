import { useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';

export default function AWBPrint({ order, onClose }) {
  const printRef = useRef();
  const barcodeRef = useRef();

  useEffect(() => {
    if (barcodeRef.current && order.id) {
      JsBarcode(barcodeRef.current, order.id, {
        format: "CODE128",
        width: 2,
        height: 60,
        displayValue: true,
        fontSize: 14,
        margin: 10
      });
    }
  }, [order.id]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = printRef.current.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>AWB - ${order.id}</title>
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
            .awb-container {
              width: 4in;
              height: 6in;
              margin: 0 auto;
              border: 2px solid #000;
              padding: 15px;
              background: #fff;
              font-family: 'Courier New', monospace;
              box-sizing: border-box;
              page-break-after: always;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .company-name {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .awb-title {
              font-size: 14px;
              font-weight: bold;
            }
            .section {
              margin-bottom: 15px;
            }
            .section-title {
              font-weight: bold;
              margin-bottom: 5px;
              border-bottom: 1px solid #ccc;
              padding-bottom: 2px;
            }
            .row {
              display: flex;
              margin-bottom: 3px;
            }
            .label {
              font-weight: bold;
              width: 80px;
            }
            .value {
              flex: 1;
            }
            .barcode-section {
              text-align: center;
              margin: 20px 0;
            }
            .order-id {
              font-size: 14px;
              font-weight: bold;
              margin-top: 5px;
            }
            @media print {
              body { 
                padding: 0; 
                margin: 0;
                background: white;
              }
              .awb-container { 
                width: 4in !important;
                height: 6in !important;
                border: 2px solid #000;
                box-shadow: none;
                margin: 0;
                padding: 15px !important;
                page-break-inside: avoid;
                page-break-after: always;
              }
              .header, .section {
                page-break-inside: avoid;
              }
              .barcode-section {
                page-break-inside: avoid;
              }
              @page {
                margin: 0;
                size: 4in 6in;
                orientation: portrait;
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
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-lg font-bold">Air Waybill - Preview</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Print AWB
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
          <div className="awb-container">
            {/* Header */}
            <div className="header">
              <div className="company-name">BeetGlow</div>
              <div className="awb-title">AIR WAYBILL</div>
            </div>

            {/* Order Details */}
            <div className="section">
              <div className="section-title">Order Details</div>
              <div className="row">
                <div className="label">Order ID:</div>
                <div className="value">{order.id}</div>
              </div>
              <div className="row">
                <div className="label">Date:</div>
                <div className="value">{formatDate(order.date || order.at)}</div>
              </div>
              <div className="row">
                <div className="label">Weight:</div>
                <div className="value">1 kg</div>
              </div>
              <div className="row">
                <div className="label">Pieces:</div>
                <div className="value">1</div>
              </div>
            </div>

            {/* Sender Details */}
            <div className="section">
              <div className="section-title">From (Sender)</div>
              <div className="row">
                <div className="label">Name:</div>
                <div className="value">BeetGlow</div>
              </div>
              <div className="row">
                <div className="label">Address:</div>
                <div className="value">Islamabad, Pakistan</div>
              </div>
              <div className="row">
                <div className="label">Phone:</div>
                <div className="value">+92 300 1234567</div>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="section">
              <div className="section-title">To (Recipient)</div>
              <div className="row">
                <div className="label">Name:</div>
                <div className="value">
                  {order.customer?.firstName} {order.customer?.lastName}
                </div>
              </div>
              <div className="row">
                <div className="label">Address:</div>
                <div className="value">{order.customer?.address}</div>
              </div>
              <div className="row">
                <div className="label">City:</div>
                <div className="value">{order.customer?.city}</div>
              </div>
              <div className="row">
                <div className="label">Phone:</div>
                <div className="value">{order.customer?.phone}</div>
              </div>
            </div>

            {/* Barcode */}
            <div className="barcode-section">
              <svg ref={barcodeRef}></svg>
              <div className="order-id">{order.id}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
