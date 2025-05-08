// src/pages/Checkout.jsx
import { useEffect, useState } from "react";
import { FiShoppingCart, FiUser, FiMenu, FiX, FiPackage } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { getCart, createOrder, logout } from "../services/auth.js";

export default function Checkout({ user }) {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    postal: "",
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cart = await getCart(); // Fetch cart from backend
        setCartItems(cart);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };

    fetchCartData();
  }, []);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    // Validate form fields
    for (const [key, value] of Object.entries(address)) {
      if (!value.trim()) {
        alert(`Please fill in your ${key}`);
        return;
      }
    }

    try {
      const fullAddress = {
        customerName: address.name,
        customerNumber: address.phone,
        customerAddress: `${address.street}, ${address.city}, ${address.postal}`,
        status: "pending"
      };

      const response = await createOrder(fullAddress);

      if (response) {
        alert("Order placed successfully!");
        window.location.href = "/";
      } else {
        alert("Failed to place order.");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Error placing order");
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

  const totalPrice = cartItems.reduce((total, item) =>
    total + item.quantity * item.product.price, 0
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-2xl">
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
            <Link to="/" className="text-xl font-bold text-blue-600">MyShop</Link>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-gray-700 hover:text-blue-600 ${location.pathname === "/" ? "text-blue-600 font-medium" : ""}`}>Home</Link>
            <Link to="/product" className={`text-gray-700 hover:text-blue-600 ${location.pathname === "/product" ? "text-blue-600 font-medium" : ""}`}>Produk</Link>
            <Link to="/my-orders" className={`text-gray-700 hover:text-blue-600 flex items-center ${location.pathname === "/my-orders" ? "text-blue-600 font-medium" : ""}`}>
              <FiPackage className="mr-1" /> Pesanan Saya
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Cari produk..."
              className="hidden md:block px-3 py-1 border rounded-md text-sm w-40"
            />

            <div className="relative">
              <Link to="/carts">
                <FiShoppingCart className="text-2xl text-gray-700 hover:text-blue-600 cursor-pointer" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </div>
            <div className="relative">
              <FiUser
                className="text-2xl text-gray-700 hover:text-blue-600 cursor-pointer"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              />
              
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">👤 {user?.fullName || "Guest"}</div>
                  <Link 
                    to="/my-orders" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    Pesanan Saya
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-3 space-y-2">
            <Link to="/" className="block text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/product" className="block text-gray-700 hover:text-blue-600">Produk</Link>
            <Link to="/my-orders" className="block text-gray-700 hover:text-blue-600 flex items-center">
              <FiPackage className="mr-1" /> Pesanan Saya
            </Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Address Form */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  id="name"
                  name="name" 
                  onChange={handleChange} 
                  value={address.name} 
                  placeholder="Enter your full name" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  id="phone"
                  name="phone" 
                  onChange={handleChange} 
                  value={address.phone} 
                  placeholder="Enter your phone number" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input 
                  id="street"
                  name="street" 
                  onChange={handleChange} 
                  value={address.street} 
                  placeholder="Enter your street address" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input 
                    id="city"
                    name="city" 
                    onChange={handleChange} 
                    value={address.city} 
                    placeholder="Enter your city" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="postal" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input 
                    id="postal"
                    name="postal" 
                    onChange={handleChange} 
                    value={address.postal} 
                    placeholder="Enter your postal code" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    required 
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {cartItems.length > 0 ? (
              <>
                <ul className="mb-4 divide-y">
                  {cartItems.map((item, index) => (
                    <li key={index} className="flex justify-between text-sm py-2">
                      <div>
                        <span className="font-medium">{item.product.name}</span>
                        <span className="text-gray-600 block">x{item.quantity}</span>
                      </div>
                      <span className="font-medium">Rp{(item.product.price * item.quantity).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="border-t border-b py-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>Rp{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                </div>
                
                <div className="flex justify-between font-semibold text-lg mb-4">
                  <span>Total</span>
                  <span>Rp{totalPrice.toLocaleString()}</span>
                </div>
                
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
                >
                  Place Order
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600">Your cart is empty</p>
                <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          {/* Store Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">MyShop</h3>
            <p className="text-sm mb-4">Toko online terbaik untuk segala kebutuhanmu. Belanja cepat, aman, dan nyaman.</p>
            <div className="flex gap-4 mt-4 text-xl">
              <a href="#"><i className="fab fa-facebook hover:text-white"></i></a>
              <a href="#"><i className="fab fa-instagram hover:text-white"></i></a>
              <a href="#"><i className="fab fa-twitter hover:text-white"></i></a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Navigasi</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Beranda</Link></li>
              <li><Link to="/product" className="hover:text-white">Produk</Link></li>
              <li><Link to="/my-orders" className="hover:text-white">Pesanan Saya</Link></li>
              <li><a href="#" className="hover:text-white">Tentang Kami</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Newsletter</h3>
            <p className="text-sm mb-4">Dapatkan promo dan info menarik langsung ke emailmu.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Email kamu"
                className="px-4 py-2 rounded-md text-gray-800 w-full sm:w-auto"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Daftar
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} MyShop. All rights reserved.
        </div>
      </footer>
    </div>
  );
}