import { useState } from 'react';
import { Printer, FileText, X } from 'lucide-react';
import AWBPrint from './AWBPrint';
import InvoicePrint from './InvoicePrint';

export default function OrderManageModal({ order, products, onClose }) {
  const [showAWB, setShowAWB] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  const handlePrintAWB = () => {
    setShowAWB(true);
  };

  const handlePrintInvoice = () => {
    setShowInvoice(true);
  };

  const handleClose = () => {
    setShowAWB(false);
    setShowInvoice(false);
    onClose();
  };

  return (
    <>
      {/* Main Order Management Modal */}
      {!showAWB && !showInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-lg font-bold">Manage Order - {order.id}</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Customer Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-neutral-900">Customer Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {order.customer?.firstName} {order.customer?.lastName}</p>
                    <p><span className="font-medium">Phone:</span> {order.customer?.phone}</p>
                    <p><span className="font-medium">Email:</span> {order.customer?.email || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <p><span className="font-medium">Address:</span> {order.customer?.address}</p>
                    <p><span className="font-medium">City:</span> {order.customer?.city}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-neutral-900">Order Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="text-left p-3 font-medium">Product</th>
                        <th className="text-left p-3 font-medium">Variant</th>
                        <th className="text-left p-3 font-medium">Quantity</th>
                        <th className="text-left p-3 font-medium">Price</th>
                        <th className="text-left p-3 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(order.lines || []).map((line, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-3">{line.name}</td>
                          <td className="p-3">{line.variantLabel}</td>
                          <td className="p-3">{line.quantity}</td>
                          <td className="p-3">Rs {line.price.toLocaleString()}</td>
                          <td className="p-3 font-medium">Rs {(line.price * line.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-neutral-900">Order Summary</h3>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span className="font-medium">Rs {(order.lines || []).reduce((sum, line) => sum + (line.price * line.quantity), 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping:</span>
                    <span className="font-medium">Rs 0</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Tax:</span>
                    <span className="font-medium">Rs 0</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t text-lg font-bold">
                    <span>Total:</span>
                    <span>Rs {(order.lines || []).reduce((sum, line) => sum + (line.price * line.quantity), 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handlePrintAWB}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  Print AWB
                </button>
                <button
                  onClick={handlePrintInvoice}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Print Invoice
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AWB Print Modal */}
      {showAWB && (
        <AWBPrint
          order={order}
          onClose={() => setShowAWB(false)}
        />
      )}

      {/* Invoice Print Modal */}
      {showInvoice && (
        <InvoicePrint
          order={order}
          products={products}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </>
  );
}
