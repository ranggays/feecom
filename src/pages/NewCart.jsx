// src/pages/Cart.jsx
import { useEffect, useState } from "react";
import { FiShoppingCart, FiUser, FiMenu, FiX, FiPackage, FiMinus, FiPlus, FiTrash2, FiEdit3, FiCheck, FiTruck, FiShield, FiClock, FiArrowRight, FiArrowLeft, FiHeart, FiGift } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { logout, getCart, updateCart, deleteCart } from "@/services/auth";

export default function Cart({ user }) {
  const [cartItems, setCartItems] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCartId, setEditingCartId] = useState(null);
  const [editedQuantities, setEditedQuantities] = useState({});
  const [selectedDelivery, setSelectedDelivery] = useState({});
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const cartsDb = async () => {
    try {
      setLoading(true);
      const cart = await getCart();
      setCartItems(cart);
      // Initialize delivery options
      const deliveryDefaults = {};
      cart.forEach(item => {
        deliveryDefaults[item.id] = 'standard';
      });
      setSelectedDelivery(deliveryDefaults);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    cartsDb();
  }, []);

  const handlerUpdate = async (cart) => {
    setIsEditing(true);
    setEditingCartId(cart.id);
    setEditedQuantities(q => ({...q, [cart.id]: String(cart.quantity || 1)}));
  };

  const handlerDelete = async (id) => {
    const delCart = await deleteCart(id);
    if(delCart) {
      cartsDb();
    }
  };

  const handleQuantityChange = (itemId, change) => {
    const currentItem = cartItems.find(item => item.id === itemId);
    const newQuantity = Math.max(1, (currentItem?.quantity || 1) + change);
    
    setEditedQuantities(prev => ({
      ...prev,
      [itemId]: String(newQuantity)
    }));
    
    // Auto-save after a short delay
    clearTimeout(window.quantityTimeout);
    window.quantityTimeout = setTimeout(() => {
      updateCart(itemId, newQuantity).then(() => {
        cartsDb();
      });
    }, 500);
  };

  const handleDeliveryChange = (itemId, deliveryType) => {
    setSelectedDelivery(prev => ({
      ...prev,
      [itemId]: deliveryType
    }));
  };

  const applyPromoCode = () => {
    // Mock promo code logic
    if (promoCode.toLowerCase() === 'premium10') {
      setAppliedPromo({ code: 'PREMIUM10', discount: 10, type: 'percentage' });
    } else if (promoCode.toLowerCase() === 'save50k') {
      setAppliedPromo({ code: 'SAVE50K', discount: 50000, type: 'fixed' });
    } else {
      alert('Kode promo tidak valid');
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const quantity = parseInt(editedQuantities[item.id]) || item.quantity || 1;
      return total + parseInt(item.product.price) * quantity;
    }, 0);
  };

  const calculateShipping = () => {
    return cartItems.reduce((total, item) => {
      const delivery = selectedDelivery[item.id];
      if (delivery === 'express') return total + 9900;
      if (delivery === 'same-day') return total + 15000;
      return total; // free for standard
    }, 0);
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    const subtotal = calculateSubtotal();
    if (appliedPromo.type === 'percentage') {
      return Math.floor(subtotal * appliedPromo.discount / 100);
    }
    return appliedPromo.discount;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() - calculateDiscount();
  };

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
      icon: <FiClock className="text-blue-500" />
    },
    {
      id: 'same-day',
      name: 'Same Day Delivery',
      description: 'Hari yang sama',
      price: 15000,
      icon: <FiShield className="text-purple-500" />
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat keranjang belanja...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Premium Navbar */}
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
            <span className="text-gray-900 font-medium">Keranjang Belanja</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1">
        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <FiShoppingCart className="text-gray-400 text-5xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Keranjang Belanja Kosong</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Belum ada produk dalam keranjang Anda. Mari jelajahi koleksi premium kami!
            </p>
            <div className="space-y-4">
              <Link 
                to="/product" 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <FiArrowLeft className="mr-2" />
                Mulai Berbelanja
              </Link>
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <FiShield className="mr-2" />
                  Transaksi Aman
                </div>
                <div className="flex items-center">
                  <FiTruck className="mr-2" />
                  Gratis Ongkir
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-black text-gray-900 mb-2">
                Keranjang <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Belanja</span>
              </h1>
              <p className="text-gray-600">Review produk pilihan Anda sebelum melanjutkan ke checkout</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item, index) => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-300">
                    {/* Delivery Status */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-3 border-b border-green-100">
                      <div className="flex items-center text-sm text-green-700">
                        <FiTruck className="mr-2" />
                        <span className="font-medium">Estimasi tiba: 2-7 hari kerja</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="relative group">
                          <img 
                            src={`${apiBaseUrl}${item.product.image}`} 
                            alt={item.product.name} 
                            className="w-32 h-32 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" 
                          />
                          <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                            <FiHeart className="text-sm" />
                          </button>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 space-y-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{item.product.name}</h3>
                            <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              Rp {parseInt(item.product.price).toLocaleString('id-ID')}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700">Jumlah:</span>
                            <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                              <button
                                onClick={() => handleQuantityChange(item.id, -1)}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                disabled={(item.quantity || 1) <= 1}
                              >
                                <FiMinus />
                              </button>
                              <span className="w-12 text-center font-bold text-gray-900">
                                {parseInt(editedQuantities[item.id]) || item.quantity || 1}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, 1)}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              >
                                <FiPlus />
                              </button>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => handlerDelete(item.id)}
                              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                            >
                              <FiTrash2 />
                              Hapus
                            </button>
                            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                              <FiHeart />
                              Simpan untuk nanti
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Options */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-4">Pilih opsi pengiriman:</h4>
                        <div className="grid gap-3">
                          {deliveryOptions.map((option) => (
                            <label key={option.id} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
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
                                <div className="mr-4">
                                  {option.icon}
                                </div>
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
                    </div>
                  </div>
                ))}

                {/* Continue Shopping */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Butuh produk lain?</h3>
                      <p className="text-gray-600">Jelajahi koleksi premium kami</p>
                    </div>
                    <Link 
                      to="/product"
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <FiArrowLeft className="mr-2" />
                      Lanjut Belanja
                    </Link>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                {/* Promo Code */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <FiGift className="mr-2 text-purple-500" />
                    Kode Promo
                  </h3>
                  
                  {appliedPromo ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-green-700">
                          <FiCheck className="mr-2" />
                          <span className="font-medium">{appliedPromo.code}</span>
                        </div>
                        <button
                          onClick={() => setAppliedPromo(null)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <FiX />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Masukkan kode promo"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={applyPromoCode}
                        disabled={!promoCode.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Terapkan
                      </button>
                    </div>
                  )}
                  
                  <div className="mt-4 text-xs text-gray-500">
                    Coba: <span className="font-mono bg-gray-100 px-2 py-1 rounded">PREMIUM10</span> atau <span className="font-mono bg-gray-100 px-2 py-1 rounded">SAVE50K</span>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 sticky top-28">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Ringkasan Pesanan</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                      <span>Rp {calculateSubtotal().toLocaleString('id-ID')}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Biaya Pengiriman</span>
                      <span>{calculateShipping() === 0 ? 'GRATIS' : `Rp ${calculateShipping().toLocaleString('id-ID')}`}</span>
                    </div>
                    
                    {appliedPromo && (
                      <div className="flex justify-between text-green-600">
                        <span>Diskon ({appliedPromo.code})</span>
                        <span>-Rp {calculateDiscount().toLocaleString('id-ID')}</span>
                      </div>
                    )}
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-xl font-bold text-gray-900">
                        <span>Total</span>
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Rp {calculateTotal().toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => window.location.href = "/checkouts"}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    Lanjut ke Checkout
                    <FiArrowRight />
                  </button>

                  <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiShield className="mr-1" />
                      Pembayaran Aman
                    </div>
                    <div className="flex items-center">
                      <FiTruck className="mr-1" />
                      Pengiriman Cepat
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

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