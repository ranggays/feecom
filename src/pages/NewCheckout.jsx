import { useEffect, useState } from "react";
import { 
  FiShoppingCart, 
  FiUser, 
  FiMenu, 
  FiX, 
  FiPackage,
  FiTruck, 
  FiCreditCard, 
  FiCheck, 
  FiChevronRight,
  FiShield,
  FiLock,
  FiMapPin,
  FiPhone,
  FiMail,
  FiAlertCircle,
  FiArrowRight
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { getCart, createOrder, logout } from "../services/auth.js";

export default function Checkout({ user }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    postal: "",
  });
  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

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

  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Pengiriman Standar',
      description: '5-7 hari kerja',
      price: 0,
      icon: <FiTruck className="text-green-500" />
    },
    {
      id: 'express',
      name: 'Pengiriman Express',
      description: '2-3 hari kerja',
      price: 9900,
      icon: <FiCheck className="text-blue-500" />
    },
    {
      id: 'same-day',
      name: 'Same Day Delivery',
      description: 'Hari yang sama',
      price: 15000,
      icon: <FiShield className="text-purple-500" />
    }
  ];

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cart = await getCart();
        setCartItems(cart);
        // Initialize delivery options with standard as default
        const deliveryDefaults = {};
        cart.forEach(item => {
          deliveryDefaults[item.id] = 'standard';
        });
        setSelectedDelivery(deliveryDefaults);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };

    fetchCartData();
  }, []);

  const handleDeliveryChange = (itemId, deliveryType) => {
    setSelectedDelivery(prev => ({
      ...prev,
      [itemId]: deliveryType
    }));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) =>
      total + item.quantity * item.product.price, 0
    );
  };

  const calculateShipping = () => {
    return cartItems.reduce((total, item) => {
      const delivery = selectedDelivery[item.id] || 'standard';
      const deliveryOption = deliveryOptions.find(opt => opt.id === delivery);
      return total + (deliveryOption?.price || 0);
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!address.name.trim()) newErrors.name = "Name is required";
      if (!address.phone.trim()) newErrors.phone = "Phone is required";
      if (!address.street.trim()) newErrors.street = "Street address is required";
      if (!address.city.trim()) newErrors.city = "City is required";
      if (!address.postal.trim()) newErrors.postal = "Postal code is required";
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

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      const fullAddress = {
        customerName: address.name,
        customerNumber: address.phone,
        customerAddress: `${address.street}, ${address.city}, ${address.postal}`,
        status: "pending"
      };

      const response = await createOrder(fullAddress);

      if (response) {
        alert("🎉 Order placed successfully! Thank you for your purchase.");
        window.location.href = "/";
      } else {
        alert("❌ Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("❌ Error placing order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Premium Navbar - Same as Cart */}
      <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-2xl text-gray-700 hover:text-blue-600 transition-colors">
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
            <Link to="/" className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MyShop
            </Link>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">PREMIUM</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</Link>
            <Link to="/product" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Produk</Link>
            <Link to="/my-orders" className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center">
              <FiPackage className="mr-2" /> Pesanan Saya
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Link to="/carts" className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <FiShoppingCart className="text-lg" />
                </div>
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </div>
            
            <div className="relative">
              <div 
                className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <FiUser className="text-lg" />
              </div>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-6 py-4 text-sm text-gray-700 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="font-bold text-gray-900">👤 {user?.fullName || "Guest"}</div>
                    <div className="text-xs text-gray-500">Premium Member</div>
                  </div>
                  <Link 
                    to="/my-orders" 
                    className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <FiPackage className="mr-3" />
                    Pesanan Saya
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center text-left px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FiX className="mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2 border-t border-gray-200/50 bg-white/95 backdrop-blur-md">
            <Link to="/" className="block py-3 text-gray-700 hover:text-blue-600 font-medium">Home</Link>
            <Link to="/product" className="block py-3 text-gray-700 hover:text-blue-600 font-medium">Produk</Link>
            <Link to="/my-orders" className="block py-3 text-gray-700 hover:text-blue-600 font-medium flex items-center">
              <FiPackage className="mr-2" /> Pesanan Saya
            </Link>
          </div>
        )}
      </nav>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <FiArrowRight className="text-gray-400" />
            <Link to="/carts" className="hover:text-blue-600 transition-colors">Keranjang</Link>
            <FiArrowRight className="text-gray-400" />
            <span className="text-gray-900 font-medium">Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            Secure <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Checkout</span>
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

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to your cart to continue shopping</p>
            <Link 
              to="/" 
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
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

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-gray-600 font-medium mb-2">Full Name</label>
                      <input
                        id="name"
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
                      <label htmlFor="phone" className="block text-gray-600 font-medium mb-2">Phone Number</label>
                      <input
                        id="phone"
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

                    <div>
                      <label htmlFor="street" className="block text-gray-600 font-medium mb-2">Street Address</label>
                      <input
                        id="street"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-gray-600 font-medium mb-2">City</label>
                        <input
                          id="city"
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
                        <label htmlFor="postal" className="block text-gray-600 font-medium mb-2">Postal Code</label>
                        <input
                          id="postal"
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

                  {/* Delivery Options for Each Item */}
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Options</h3>
                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex items-center gap-4 mb-4">
                            <img 
                              src={`${apiBaseUrl}${item.product.image}`} 
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                            />
                            <div>
                              <h4 className="font-semibold text-gray-900">{item.product.name}</h4>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          
                          <div className="grid gap-3">
                            {deliveryOptions.map((option) => (
                              <label key={option.id} className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                selectedDelivery[item.id] === option.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}>
                                <input
                                  type="radio"
                                  name={`delivery-${item.id}`}
                                  value={option.id}
                                  checked={selectedDelivery[item.id] === option.id}
                                  onChange={() => handleDeliveryChange(item.id, option.id)}
                                  className="sr-only"
                                />
                                <div className="flex items-center flex-1">
                                  <div className="mr-3">{option.icon}</div>
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">{option.name}</div>
                                    <div className="text-sm text-gray-500">{option.description}</div>
                                  </div>
                                  <div className="font-bold text-gray-900">
                                    {option.price === 0 ? 'GRATIS' : `Rp ${option.price.toLocaleString('id-ID')}`}
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
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
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <img 
                        src={`${apiBaseUrl}${item.product.image}`} 
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{item.product.name}</h4>
                        <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                        <p className="text-xs text-gray-500">
                          {deliveryOptions.find(d => d.id === (selectedDelivery[item.id] || 'standard'))?.name}
                        </p>
                      </div>
                      <span className="font-bold text-gray-900">
                        Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                    <span>Rp {calculateSubtotal().toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Biaya Pengiriman</span>
                    <span>{calculateShipping() === 0 ? 'GRATIS' : `Rp ${calculateShipping().toLocaleString('id-ID')}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (10%)</span>
                    <span>Rp {calculateTax().toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black text-gray-900 border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Rp {calculateTotal().toLocaleString('id-ID')}
                    </span>
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
        )}
      </div>

      {/* Premium Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10"></div>
        <div className="relative py-16">
          <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  MyShop
                </h3>
                <span className="text-xs font-medium text-gray-400 bg-gray-800 px-2 py-1 rounded-full">PREMIUM</span>
              </div>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Pengalaman berbelanja premium dengan kualitas terbaik, layanan eksklusif, dan kepuasan yang terjamin.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: "📘", href: "#", label: "Facebook" },
                  { icon: "📸", href: "#", label: "Instagram" },
                  { icon: "🐦", href: "#", label: "Twitter" }
                ].map((social, index) => (
                  <a 
                    key={index}
                    href={social.href}
                    className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-white">Navigasi</h3>
              <ul className="space-y-4">
                {[
                  { name: "Beranda", href: "/" },
                  { name: "Produk Premium", href: "/product" },
                  { name: "Pesanan Saya", href: "/my-orders" },
                  { name: "Tentang Kami", href: "#" }
                ].map((item, index) => (
                  <li key={index}>
                    <Link to={item.href} className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                      <FiArrowRight className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-white">Premium Newsletter</h3>
              <p className="text-gray-400 mb-6">
                Dapatkan akses eksklusif ke penawaran premium dan produk terbatas.
              </p>
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Email premium Anda"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold hover:shadow-lg hover:scale-[1.02]">
                  Subscribe Premium
                </button>
              </form>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-500 mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} MyShop Premium. All rights reserved. Crafted with ❤️ for excellence.
              </div>
              <div className="flex gap-6 text-sm text-gray-500">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}