import { useEffect, useState } from "react";
import { FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { getCart, createOrder } from "../services/auth.js"; // pastikan path-nya benar

export default function Checkout() {
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

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cart = await getCart(); // Fetch cart dari backend
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

  const totalPrice = cartItems.reduce((total, item) =>
    total + item.quantity * item.product.price, 0
  );

  return (
    <div className="bg-gray-100 min-h-screen font-['Roboto'] p-6">
      {/* Navbar */}
      <nav className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-2xl">
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
            <span className="text-xl font-bold text-blue-600">MyShop</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
            <a href="/products" className="text-gray-700 hover:text-blue-600">Produk</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Kategori</a>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Cari produk..."
              className="hidden md:block px-3 py-1 border rounded-md text-sm w-40"
            />
            <a href="/cart">
              <FiShoppingCart className="text-2xl text-gray-700 hover:text-blue-600 cursor-pointer" />
            </a>
            <div className="relative">
              <FiUser
                className="text-2xl text-gray-700 hover:text-blue-600 cursor-pointer"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              />
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">👤 Guest</div>
                  <button
                    onClick={() => {
                      // Tambahkan handleLogout jika dibutuhkan
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-3 space-y-2">
            <a href="/" className="block text-gray-700 hover:text-blue-600">Home</a>
            <a href="#" className="block text-gray-700 hover:text-blue-600">Produk</a>
            <a href="#" className="block text-gray-700 hover:text-blue-600">Kategori</a>
          </div>
        )}
      </nav>

      {/* Checkout Page */}
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Address Form */}
        <div className="md:col-span-2 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <form className="space-y-4">
            <input name="name" onChange={handleChange} value={address.name} placeholder="Full Name" className="w-full p-2 border rounded" required />
            <input name="phone" onChange={handleChange} value={address.phone} placeholder="Phone Number" className="w-full p-2 border rounded" required />
            <input name="street" onChange={handleChange} value={address.street} placeholder="Street Address" className="w-full p-2 border rounded" required />
            <input name="city" onChange={handleChange} value={address.city} placeholder="City" className="w-full p-2 border rounded" required />
            <input name="postal" onChange={handleChange} value={address.postal} placeholder="Postal Code" className="w-full p-2 border rounded" required />
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded shadow h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <ul className="mb-4">
            {cartItems.map((item, index) => (
              <li key={index} className="flex justify-between text-sm mb-1">
                <span>{item.product.name} x {item.quantity}</span>
                <span>Rp{(item.product.price * item.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="font-semibold border-t pt-2 mb-4">
            Total: Rp{totalPrice.toLocaleString()}
          </div>
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
