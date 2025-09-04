import { useEffect, useState } from "react";
import { 
  FiShoppingCart, 
  FiUser, 
  FiMenu, 
  FiX, 
  FiTruck, 
  FiCreditCard, 
  FiCheck, 
  FiChevronRight,
  FiShield,
  FiLock,
  FiMapPin,
  FiPhone,
  FiMail,
  FiAlertCircle
} from "react-icons/fi";

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      product: { name: "Premium Laptop", price: 15000000, image: "/api/placeholder/80/80" },
      quantity: 1
    },
    {
      id: 2,
      product: { name: "Wireless Mouse", price: 500000, image: "/api/placeholder/80/80" },
      quantity: 2
    }
  ]);
  
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    postal: "",
  });

  const [selectedPayment, setSelectedPayment] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const steps = [
    { id: 1, name: "Shipping", icon: FiTruck },
    { id: 2, name: "Payment", icon: FiCreditCard },
    { id: 3, name: "Review", icon: FiCheck }
  ];

  const paymentMethods = [
    { id: "credit", name: "Credit Card", icon: "💳", desc: "Secure payment with credit card" },
    { id: "bank", name: "Bank Transfer", icon: "🏦", desc: "Direct bank transfer" },
    { id: "ewallet", name: "E-Wallet", icon: "📱", desc: "Pay with digital wallet" },
    { id: "cod", name: "Cash on Delivery", icon: "💵", desc: "Pay when item delivered" }
  ];

  const totalPrice = cartItems.reduce((total, item) =>
    total + item.quantity * item.product.price, 0
  );
  const shippingFee = 50000;
  const tax = totalPrice * 0.1;
  const finalTotal = totalPrice + shippingFee + tax;

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!address.name) newErrors.name = "Name is required";
      if (!address.phone) newErrors.phone = "Phone is required";
      if (!address.email) newErrors.email = "Email is required";
      if (!address.street) newErrors.street = "Street address is required";
      if (!address.city) newErrors.city = "City is required";
      if (!address.postal) newErrors.postal = "Postal code is required";
    }
    
    if (step === 2 && !selectedPayment) {
      newErrors.payment = "Please select a payment method";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert("🎉 Order placed successfully! Thank you for your purchase.");
      // In real app: navigate to success page or order tracking
      
    } catch (error) {
      console.error("Order error:", error);
      alert("❌ Error placing order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 min-h-screen font-['Inter']">
      {/* Navbar */}
      <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="md:hidden text-2xl p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300"
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MyShop
              </span>
              <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full">
                PREMIUM
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">Home</a>
            <a href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">Products</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">Categories</a>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search products..."
              className="hidden lg:block px-4 py-2 border border-gray-200 rounded-xl text-sm w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
            <a href="/cart" className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300">
              <FiShoppingCart className="text-xl text-gray-700 hover:text-blue-600" />
            </a>
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300"
              >
                <FiUser className="text-xl text-gray-700 hover:text-blue-600" />
              </button>
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 backdrop-blur-md">
                  <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-semibold">👤 Guest User</div>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-300">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2 border-t border-gray-200/50">
            <a href="/" className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">Home</a>
            <a href="/products" className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">Products</a>
            <a href="#" className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">Categories</a>
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Secure Checkout
          </h1>
          <p className="text-gray-600 font-medium">Complete your order with our secure payment system</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-12 h-12 rounded-2xl border-2 transition-all duration-300
                    ${isActive ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent shadow-lg' : 
                      isCompleted ? 'bg-green-500 text-white border-green-500' : 
                      'bg-white text-gray-400 border-gray-300'}
                  `}>
                    <Icon className="text-xl" />
                  </div>
                  <span className={`ml-3 font-semibold ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <FiChevronRight className="mx-4 text-gray-300" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                    <FiTruck className="text-xl" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">Shipping Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 font-medium mb-2">Full Name</label>
                    <input
                      name="name"
                      value={address.name}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <div className="flex items-center gap-2 mt-1 text-red-500 text-sm">
                        <FiAlertCircle className="text-xs" />
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-600 font-medium mb-2">Phone Number</label>
                    <input
                      name="phone"
                      value={address.phone}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter phone number"
                    />
                    {errors.phone && (
                      <div className="flex items-center gap-2 mt-1 text-red-500 text-sm">
                        <FiAlertCircle className="text-xs" />
                        {errors.phone}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-600 font-medium mb-2">Email Address</label>
                    <input
                      name="email"
                      type="email"
                      value={address.email}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <div className="flex items-center gap-2 mt-1 text-red-500 text-sm">
                        <FiAlertCircle className="text-xs" />
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-600 font-medium mb-2">Street Address</label>
                    <input
                      name="street"
                      value={address.street}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        errors.street ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter street address"
                    />
                    {errors.street && (
                      <div className="flex items-center gap-2 mt-1 text-red-500 text-sm">
                        <FiAlertCircle className="text-xs" />
                        {errors.street}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-600 font-medium mb-2">City</label>
                    <input
                      name="city"
                      value={address.city}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter city"
                    />
                    {errors.city && (
                      <div className="flex items-center gap-2 mt-1 text-red-500 text-sm">
                        <FiAlertCircle className="text-xs" />
                        {errors.city}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-600 font-medium mb-2">Postal Code</label>
                    <input
                      name="postal"
                      value={address.postal}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                        errors.postal ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter postal code"
                    />
                    {errors.postal && (
                      <div className="flex items-center gap-2 mt-1 text-red-500 text-sm">
                        <FiAlertCircle className="text-xs" />
                        {errors.postal}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                    <FiCreditCard className="text-xl" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">Payment Method</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => {
                        setSelectedPayment(method.id);
                        setErrors(prev => ({ ...prev, payment: "" }));
                      }}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        selectedPayment === method.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{method.icon}</div>
                        <div>
                          <h3 className="font-bold text-gray-900">{method.name}</h3>
                          <p className="text-sm text-gray-600">{method.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {errors.payment && (
                  <div className="flex items-center gap-2 mt-4 text-red-500 text-sm">
                    <FiAlertCircle />
                    {errors.payment}
                  </div>
                )}

                {/* Security Badges */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiShield className="text-green-500" />
                      <span>SSL Secured</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiLock className="text-blue-500" />
                      <span>256-bit Encryption</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Order Review */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                    <FiCheck className="text-xl" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">Review Order</h2>
                </div>

                {/* Shipping Address Review */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FiMapPin className="text-blue-500" />
                    Shipping Address
                  </h3>
                  <div className="text-gray-700">
                    <p className="font-semibold">{address.name}</p>
                    <p>{address.street}</p>
                    <p>{address.city}, {address.postal}</p>
                    <p className="flex items-center gap-2 mt-2">
                      <FiPhone className="text-xs" />
                      {address.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <FiMail className="text-xs" />
                      {address.email}
                    </p>
                  </div>
                </div>

                {/* Payment Method Review */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FiCreditCard className="text-purple-500" />
                    Payment Method
                  </h3>
                  <p className="text-gray-700">
                    {paymentMethods.find(p => p.id === selectedPayment)?.name}
                  </p>
                </div>

                {/* Final Terms */}
                <div className="p-4 bg-blue-50 rounded-xl">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 rounded focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">
                      I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and 
                      <a href="#" className="text-blue-600 hover:underline"> Privacy Policy</a>. 
                      I understand that my order will be processed securely.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-all duration-300"
              >
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:scale-[1.02] hover:shadow-lg transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <h3 className="text-xl font-black text-gray-900 mb-6">Order Summary</h3>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{item.product.name}</h4>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-gray-900">
                      Rp{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rp{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Rp{shippingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>Rp{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-black text-gray-900 border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span className="text-blue-600">Rp{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-2 text-green-700 text-sm font-semibold">
                  <FiShield />
                  <span>Secure & Protected Checkout</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}