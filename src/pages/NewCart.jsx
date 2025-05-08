// src/pages/Cart.jsx
import { useEffect, useState } from "react";
import { FiShoppingCart, FiUser, FiMenu, FiX, FiPackage } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { logout, getCart, updateCart, deleteCart } from "@/services/auth";

export default function Cart({ user }) {
  const [cartItems, setCartItems] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCartId, setEditingCartId] = useState(null);
  const [editedQuantities, setEditedQuantities] = useState({});
  const location = useLocation();

  const cartsDb = async () => {
    const cart = await getCart();
    setCartItems(cart);
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

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
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
      <main className="max-w-7xl mx-auto p-6 flex-1">
        <h1 className="text-2xl font-semibold mb-6">Review your order</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {cartItems.length > 0 ? cartItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow">
                <div className="text-sm text-green-600 mb-2">Delivery date: Tuesday, June 21</div>
                <div className="grid grid-cols-5 gap-4">
                  <img src={`http://localhost:3000${item.product.image}`} alt={item.product.name} className="col-span-1 h-24 w-24 object-cover rounded-md" />
                  <div className="col-span-2">
                    <div className="font-semibold">{item.product.name}</div>
                    <div className="text-gray-700">Rp{item.product.price}</div>
                    <div className="text-sm mt-2">
                      Quantity:{" "}
                      <span className="font-medium">
                        {isEditing && editingCartId === item.id ? (
                          <input
                            type="number"
                            min="1"
                            value={editedQuantities[item.id] ?? item.quantity}
                            onChange={(e) =>
                              setEditedQuantities({ ...editedQuantities, [item.id]: e.target.value })
                            }
                            className="border rounded px-2 py-1 w-16"
                          />
                        ) : (
                          item.quantity || 1
                        )}
                      </span>{" "}
                      {isEditing && editingCartId === item.id ? (
                        <button
                          className="text-green-600 ml-2 hover:underline cursor-pointer"
                          onClick={async () => {
                            const inputValue = editedQuantities[item.id];
                          
                            // Ensure input is not empty and is a valid number >= 1
                            const newQuantity = parseInt(inputValue, 10);
                            if (!inputValue || isNaN(newQuantity) || newQuantity < 1) {
                              alert("Quantity harus berupa angka dan minimal 1.");
                              return;
                            }
                          
                            await updateCart(item.id, newQuantity);
                            setIsEditing(false);
                            setEditingCartId(null);
                            cartsDb(); // Refresh data
                          }}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="text-blue-600 ml-2 hover:underline cursor-pointer"
                          onClick={() => handlerUpdate(item)}
                        >
                          Update
                        </button>
                      )}
                      <button 
                        className="text-red-600 ml-2 hover:underline cursor-pointer" 
                        onClick={() => handlerDelete(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <div className="font-medium">Choose a delivery option:</div>
                    <label className="flex items-start space-x-2">
                      <input type="radio" name={`delivery-${item.id}`} defaultChecked />
                      <div>
                        <div>Tuesday, June 21</div>
                        <div className="text-sm text-gray-500">FREE Shipping</div>
                      </div>
                    </label>
                    <label className="flex items-start space-x-2">
                      <input type="radio" name={`delivery-${item.id}`} />
                      <div>
                        <div>Wednesday, June 15</div>
                        <div className="text-sm text-gray-500">Rp9.900 - Shipping</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )) : (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-600 text-lg">Your cart is empty</p>
                <Link to="/" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="font-semibold text-lg mb-4">Payment Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="flex justify-between font-medium text-lg">
                <span>Total Price:</span>
                <span>Rp{cartItems.reduce((total, item) => total + parseInt(item.product.price) * (item.quantity || 1), 0)}</span>
              </div>
            </div>

            <button
              onClick={() => window.location.href = "/checkouts"}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
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