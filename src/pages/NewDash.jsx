import Card from "./Card.jsx";
import { useEffect, useState } from "react";
import { FiShoppingCart, FiUser, FiMenu, FiX, FiPackage } from "react-icons/fi";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import bgWireless from "../assets/wireless.jpg";
import bgSmartwatch from "../assets/smartwatch.jpg";
import bgSpeaker from "../assets/portable.jpg";
import { logout } from "@/services/auth.js";
import MyOrders from "./MyOrder.jsx";
import { getCart } from "@/services/auth.js";
import NewProduct from "./NewProduct.jsx"

export default function Storefront({user}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const location = useLocation();

    const productsDb = async () => {
        const itemCart = await getCart();
        setCart(itemCart);
    };

    useEffect(() => {
        productsDb();
    },[])
    
    const products = [
      {
        id: 1,
        name: "Wireless Headphones",
        price: "$89.99",
        image: bgWireless,
      },
      {
        id: 2,
        name: "Smartwatch Pro",
        price: "$129.99",
        image: bgSmartwatch,
      },
      {
        id: 3,
        name: "Portable Speaker",
        price: "$49.99",
        image: bgSpeaker,
      },
    ];

    const handleLogout = async () => {
      try {
        await logout();
        window.location.href = "/login";
      } catch (error) {
        console.error("Logout failed", error);
      }
    }
  
    // Render content based on current route
    const renderContent = () => {
      if (location.pathname === "/my-orders") {
        return <MyOrders user={user} />;
      }else if(location.pathname === "/product"){
        return <NewProduct user={user} />;
      }
      
      // Default home page content
      return (
        <>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-blue-500 to-purple-600 py-20">
            <div className="max-w-7xl mx-auto px-4">
              <div className="bg-white/80 p-10 rounded-xl shadow-md text-center">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Temukan Produk Terbaik Untukmu</h1>
                <p className="text-lg text-gray-600 mb-8">Belanja mudah, aman, dan cepat hanya di toko kami.</p>
                <Link to="/products" className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">Belanja Sekarang</Link>
              </div>
            </div>
          </section>
    
          {/* Produk Populer */}
          <Card items={products}/>
          
          {/* Kategori */}
          <section className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Kategori</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {["Elektronik", "Fashion", "Aksesoris", "Kecantikan"].map((cat, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 hover:bg-gray-200 p-6 text-center rounded-lg font-medium text-gray-700 transition cursor-pointer"
                  >
                    {cat}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      );
    };

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
              <Link to="/product" className={`text-gray-700 hover:text-blue-600 ${location.pathname === "/products" ? "text-blue-600 font-medium" : ""}`}>Produk</Link>
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
                <Link to='/carts'>
                <FiShoppingCart className="text-2xl text-gray-700 hover:text-blue-600 cursor-pointer" href="/cart"/>
                {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cart.length}
                    </span>
                )}
                </Link>
              </div>
              <div className="relative">
                <FiUser className="text-2xl text-gray-700 hover:text-blue-600 cursor-pointer" onClick={() => setUserDropdownOpen(!userDropdownOpen)}/>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">👤 {user.fullName}</div>
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
              <Link to="/products" className="block text-gray-700 hover:text-blue-600">Produk</Link>
              <Link to="/my-orders" className="block text-gray-700 hover:text-blue-600 flex items-center">
                <FiPackage className="mr-1" /> Pesanan Saya
              </Link>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main>
          {renderContent()}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12 mt-12">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
            {/* Info Toko */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">MyShop</h3>
              <p className="text-sm mb-4">Toko online terbaik untuk segala kebutuhanmu. Belanja cepat, aman, dan nyaman.</p>
              <div className="flex gap-4 mt-4 text-xl">
                <a href="#"><i className="fab fa-facebook hover:text-white"></i></a>
                <a href="#"><i className="fab fa-instagram hover:text-white"></i></a>
                <a href="#"><i className="fab fa-twitter hover:text-white"></i></a>
              </div>
            </div>

            {/* Navigasi */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Navigasi</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white">Beranda</Link></li>
                <li><Link to="/products" className="hover:text-white">Produk</Link></li>
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