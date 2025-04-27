import Card from "./Card.jsx";
import { useState } from "react";
import { FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import bgWireless from "../assets/wireless.jpg";
import bgSmartwatch from "../assets/smartwatch.jpg";
import bgSpeaker from "../assets/portable.jpg";
import { logout } from "@/services/auth.js";

export default function Storefront({user}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
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
  
    return (
      <div className="bg-gray-50 min-h-screen">

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
            <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
            <a href="/products" className="text-gray-700 hover:text-blue-600">Produk</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Kategori</a>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Cari produk..."
              className="hidden md:block px-3 py-1 border rounded-md text-sm w-40"
            />
            <FiShoppingCart className="text-2xl text-gray-700 hover:text-blue-600 cursor-pointer" />
            <div className="relative">
              <FiUser className="text-2xl text-gray-700 hover:text-blue-600 cursor-pointer" onClick={() => setUserDropdownOpen(!userDropdownOpen)}/>

              {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">👤 {user.fullName}</div>
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
            <a href="#" className="block text-gray-700 hover:text-blue-600">Home</a>
            <a href="/products" className="block text-gray-700 hover:text-blue-600">Produk</a>
            <a href="#" className="block text-gray-700 hover:text-blue-600">Kategori</a>
          </div>
        )}
      </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 py-20">
          <div className="bg-white/80 p-10 rounded-xl shadow-md text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Temukan Produk Terbaik Untukmu</h1>
            <p className="text-lg text-gray-600 mb-8">Belanja mudah, aman, dan cepat hanya di toko kami.</p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">Belanja Sekarang</button>
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
                <li><a href="#" className="hover:text-white">Beranda</a></li>
                <li><a href="#" className="hover:text-white">Produk</a></li>
                <li><a href="#" className="hover:text-white">Kategori</a></li>
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
  