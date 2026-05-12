import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, X, Check } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { useCart } from '../context/CartContext';
import { defaultVariant } from '../data/products';
import { checkoutFormFields, getInitialFormValues } from '../data/formConfig';
import { getBusinessSettings, generateInvoiceId } from '../data/businessSettings';
import { buttonClass } from '../components/ui/Button';
import Invoice from '../components/Invoice';
import StarRating from '../components/StarRating';
import CustomerFeedback from '../components/CustomerFeedback';
import { trackInitiateCheckout } from '../utils/fbPixel';
import { checkoutLineFromProduct } from '../utils/checkout';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, settings } = useSiteData();
  const { addItem } = useCart();
  
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState(getInitialFormValues());

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (showCheckoutModal || showSuccessModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCheckoutModal, showSuccessModal]);

  const product = products.find(p => p.id === id);

  useEffect(() => {
    if (product) {
      const dv = defaultVariant(product);
      setSelectedVariant(dv);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900">Product not found</h2>
          <button
            onClick={() => navigate('/')}
            className={buttonClass({ variant: 'outline' })}
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const dv = defaultVariant(product);
  const isOutOfStock = product.stockStatus === 'Out of Stock';
  const isPurchasable = settings.enableGlobalShopping !== false && product.purchasable !== false;
  const businessSettings = getBusinessSettings();
  const deliveryCharge = businessSettings.delivery.charge;

  const handleAddToCart = () => {
    if (selectedVariant) {
      addItem(product, selectedVariant, quantity);
    }
  };

  const handleBuyNow = () => {
    if (selectedVariant) {
      setShowCheckoutModal(true);
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      alert('Your browser does not support local storage. Please try a different browser.');
      return;
    }
    
    // Create orderData object with required fields
    const orderData = {
      id: Date.now().toString(),
      customerName: `${checkoutForm.firstName} ${checkoutForm.lastName}`,
      phone: checkoutForm.phone,
      city: checkoutForm.city,
      address: checkoutForm.shippingAddress,
      productName: product.name,
      totalPrice: (selectedVariant?.price * quantity) + 250,
      date: new Date().toISOString(),
      // Additional fields for completeness
      invoiceId: generateInvoiceId(),
      productId: product.id,
      variant: selectedVariant?.label,
      quantity: quantity,
      price: selectedVariant?.price,
      deliveryCharge: 250,
      customer: {
        firstName: checkoutForm.firstName,
        lastName: checkoutForm.lastName,
        email: checkoutForm.email,
        phone: checkoutForm.phone,
        city: checkoutForm.city,
        shippingAddress: checkoutForm.shippingAddress,
        postalCode: checkoutForm.postalCode
      },
      status: 'pending'
    };

    try {
      // Save to localStorage using the exact key requested
      const existingOrders = JSON.parse(localStorage.getItem('beetglow_orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('beetglow_orders', JSON.stringify(existingOrders));
      
      // Verify the order was saved successfully
      const savedOrders = JSON.parse(localStorage.getItem('beetglow_orders') || '[]');
      const wasSaved = savedOrders.some(savedOrder => savedOrder.id === orderData.id);
      
      if (!wasSaved) {
        throw new Error('Order was not saved successfully');
      }

      // Track conversion
      trackInitiateCheckout(selectedVariant.price, [product.id]);
      
      // Store current order for success modal
      setCurrentOrder(orderData);
      
      // Show success modal ONLY after confirmed save
      setShowCheckoutModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error saving order:', error);
      alert('There was an error saving your order. Please try again.');
    }
  };

  const productReviews = (settings.reviews || []).filter(review => 
    review.productId === product.id && review.approved
  );
  
  const averageRating = productReviews.length > 0 
    ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length 
    : 0;

  const totalPrice = selectedVariant ? (selectedVariant.price * quantity) + deliveryCharge : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Top Half - Product Image, Name, Price, Description */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Product Image */}
            <div className="order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="order-1 lg:order-2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
                  {product.name}
                </h1>
                <p className="mt-4 text-2xl font-bold text-brand">
                  {selectedVariant ? selectedVariant.priceDisplay : dv.priceDisplay}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Description</h3>
                <div className="prose prose prose-neutral max-w-none text-neutral-700">
                  <p>{product.description}</p>
                </div>
              </div>

              {/* Variant Selection */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Select Variant</h3>
                <div className="grid gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'border-brand bg-brand text-white'
                          : 'border-neutral-200 bg-white hover:border-brand hover:bg-brand-muted'
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-medium">{variant.label}</div>
                        <div className="text-sm text-neutral-600">{variant.priceDisplay}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-neutral-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-neutral-100 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-0 focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-neutral-100 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || !isPurchasable}
                    className={buttonClass({ variant: 'outline' })}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock || !isPurchasable}
                    className={buttonClass({ variant: 'solid' })}
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Stock Status */}
              {isOutOfStock && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">Out of Stock</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-neutral-900">Checkout</h2>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Order Summary */}
            <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
              <h3 className="font-semibold text-neutral-900 mb-2">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{product.name} ({selectedVariant?.label})</span>
                  <span>{selectedVariant?.priceDisplay}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity</span>
                  <span>{quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>RS {deliveryCharge}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>RS {totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleCheckoutSubmit} className="space-y-4 pb-8">
              {checkoutFormFields.map((field, index) => {
                // Group fields in 2-column grid for fields with gridCols: 1
                const isFirstInPair = index < checkoutFormFields.length - 1 && 
                  checkoutFormFields[index].gridCols === 1 && 
                  checkoutFormFields[index + 1].gridCols === 1;
                
                if (isFirstInPair) {
                  const nextField = checkoutFormFields[index + 1];
                  return (
                    <div key={field.name} className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          required={field.required}
                          placeholder={field.placeholder}
                          value={checkoutForm[field.name]}
                          onChange={(e) => setCheckoutForm({...checkoutForm, [field.name]: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          {nextField.label}
                        </label>
                        <input
                          type={nextField.type}
                          required={nextField.required}
                          placeholder={nextField.placeholder}
                          value={checkoutForm[nextField.name]}
                          onChange={(e) => setCheckoutForm({...checkoutForm, [nextField.name]: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                        />
                      </div>
                    </div>
                  );
                }
                
                // Skip the second field in a pair as it's already rendered
                if (index > 0 && checkoutFormFields[index - 1].gridCols === 1 && 
                    checkoutFormFields[index - 1].gridCols === 1) {
                  return null;
                }
                
                // Render full-width fields
                return (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        required={field.required}
                        placeholder={field.placeholder}
                        value={checkoutForm[field.name]}
                        onChange={(e) => setCheckoutForm({...checkoutForm, [field.name]: e.target.value})}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                        rows={field.rows || 3}
                      />
                    ) : (
                      <input
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={checkoutForm[field.name]}
                        onChange={(e) => setCheckoutForm({...checkoutForm, [field.name]: e.target.value})}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    )}
                  </div>
                );
              }).filter(Boolean)}

              <button
                type="submit"
                className={buttonClass({ variant: 'solid', className: 'w-full' })}
              >
                Submit Order
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && currentOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              Your order is successfully placed!
            </h2>
            <p className="text-neutral-600 mb-6">
              Thank you for your order. We'll process it and send you updates soon.
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/');
              }}
              className={buttonClass({ variant: 'solid', className: 'w-full' })}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Ratings & Customer Reviews Section */}
      <div className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
              Customer Reviews
            </h2>
            <p className="mt-2 text-neutral-600 md:text-lg">
              See what customers are saying about {product.name}
            </p>
          </div>

          {/* Average Rating Display */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-4 p-6 bg-neutral-50 rounded-2xl">
              <div>
                <div className="text-sm text-neutral-600">Average Rating</div>
                <div className="mt-2">
                  <StarRating rating={averageRating} size="lg" showValue />
                </div>
              </div>
              <div>
                <div className="text-sm text-neutral-600">Total Reviews</div>
                <div className="mt-2 text-3xl font-bold text-brand">{productReviews.length}</div>
              </div>
            </div>
          </div>

          {/* Customer Feedback Form */}
          <CustomerFeedback 
            productId={product.id} 
            productName={product.name}
          />

          {/* Approved Reviews List */}
          {productReviews.length > 0 ? (
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-neutral-900 mb-6">Customer Reviews</h3>
              <div className="space-y-4">
                {productReviews.map((review) => (
                  <div key={review.id} className="border-b border-neutral-200 pb-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <StarRating rating={review.rating} size="sm" />
                          <span className="font-medium text-neutral-900">{review.name}</span>
                        </div>
                        <p className="text-neutral-700 leading-relaxed">{review.message}</p>
                        <div className="text-xs text-neutral-500 mt-2">
                          {new Date(review.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-12 text-center py-8">
              <p className="text-neutral-500">No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
