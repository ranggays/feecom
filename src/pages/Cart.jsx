// src/pages/Cart.jsx
import { useEffect, useState } from "react";
import { FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { logout } from "@/services/auth"; // pastikan path sesuai dengan struktur project-mu
import bgWireless from "../assets/wireless.jpg";
import bgSmartwatch from "../assets/smartwatch.jpg";
import bgSpeaker from "../assets/portable.jpg";

export default function Cart({ user }) {
  const [cartItems, setCartItems] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  /*
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);
    */

  const products = [
      {
        id: 1,
        name: "Wireless Headphones",
        stars: 4.5,
        ratingCount: 120,
        price: 899000,
        image: bgWireless,
      },
      {
        id: 2,
        name: "Smartwatch Pro",
        stars: 4,
        ratingCount: 80,
        price: 1299000,
        image: bgSmartwatch,
      },
      {
        id: 3,
        name: "Portable Speaker",
        stars: 3.5,
        ratingCount: 45,
        price: 499000,
        image: bgSpeaker,
      },
      {
          id: 4,
          name: "Jajan Pro",
          stars: 1,
          ratingCount: 60,
          price: 1299000,
          image: bgSmartwatch,
        },
    ];

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-['Roboto']">
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
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">👤 {user?.fullName || "Guest"}</div>
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
            <a href="/" className="block text-gray-700 hover:text-blue-600">Home</a>
            <a href="#" className="block text-gray-700 hover:text-blue-600">Produk</a>
            <a href="#" className="block text-gray-700 hover:text-blue-600">Kategori</a>
          </div>
        )}
      </nav>

      {/* Konten Utama */}
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Review your order</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {products.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded shadow">
                <div className="text-sm text-green-600 mb-2">Delivery date: Tuesday, June 21</div>
                <div className="grid grid-cols-5 gap-4">
                  <img src={item.image} alt={item.name} className="col-span-1 h-24 w-24 object-cover" />
                  <div className="col-span-2">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-gray-700">Rp{item.price.toLocaleString()}</div>
                    <div className="text-sm mt-2">
                      Quantity: <span className="font-medium">{item.quantity || 1}</span>{" "}
                      <button className="text-blue-600 ml-2 hover:underline">Update</button>
                      <button className="text-blue-600 ml-2 hover:underline">Delete</button>
                    </div>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <div className="font-medium">Choose a delivery option:</div>
                    <label className="flex items-start space-x-2">
                      <input type="radio" name={`delivery-${index}`} defaultChecked />
                      <div>
                        <div>Tuesday, June 21</div>
                        <div className="text-sm text-gray-500">FREE Shipping</div>
                      </div>
                    </label>
                    <label className="flex items-start space-x-2">
                      <input type="radio" name={`delivery-${index}`} />
                      <div>
                        <div>Wednesday, June 15</div>
                        <div className="text-sm text-gray-500">Rp9.900 - Shipping</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-4 rounded shadow h-fit">
            <h2 className="font-semibold text-lg mb-2">Payment Summary</h2>
            <p>Total Items: {products.length}</p>
            <p>Total Price: Rp{products.reduce((total, item) => total + item.price * (item.quantity || 1), 0).toLocaleString()}</p>

            <button
                onClick={() => window.location.href = "/checkout"}
                className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded"
            >
                Proceed to Checkout
            </button>
            </div>
        </div>
      </main>
    </div>
  );
}
