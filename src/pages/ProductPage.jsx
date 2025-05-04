import { useState, useEffect } from "react";
import { FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import bgWireless from "../assets/wireless.jpg";
import bgSmartwatch from "../assets/smartwatch.jpg";
import bgSpeaker from "../assets/portable.jpg";
import { logout } from "@/services/auth.js";
import { Link, useNavigate } from 'react-router-dom';
import { createProduct, getProducts, updateProduct, deleteProduct} from '../services/auth.js'
import { createCart, updateCart, deleteCart, getCart } from "../services/auth.js";

export default function ProductPage({ user }) {
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [products, setProducts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  
  const productsDb = async () => {
    const product = await getProducts();
    const itemCart = await getCart();
    // console.log('Isi product dari getProducts:', product);
    // console.log('Isi product dari cart:', itemCart);
    // console.log('user:', user);
    setProducts(product); // <- kalau isinya { data: [...] }
    setCart(itemCart);
  };

  useEffect(() => {
    productsDb();
  },[]);

  const handleQuantityChange = (productId, value) => {
    const quantity = Math.max(1, parseInt(value) || 1);
    setQuantities(q => ({...q, [productId]:quantity}));
  };

  const addToCart = async (product) => {
    const quantity = quantities[product.id] || 1;
    const cart = await createCart(product.id, quantity);
    if(cart){
      console.log('Berhasil masuk keranjang');
    }
    setCart(c => [...c, product]);
  };

  /*
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
  */

  const renderStars = (rating) => {
    if (typeof rating !== 'number' || isNaN(rating)) {
      // Jika rating tidak valid, tampilkan bintang kosong
      return (
        <>
          {[...Array(5)].map((_, i) => <FaRegStar key={`empty-${i}`} className="text-yellow-400 inline" />)}
        </>
      );
    }
  
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
    return (
      <>
        {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} className="text-yellow-400 inline" />)}
        {halfStar && <FaStarHalfAlt className="text-yellow-400 inline" />}
        {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`empty-${i}`} className="text-yellow-400 inline" />)}
      </>
    );
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
    <div className="bg-gray-50 min-h-screen">

      {/* Navbar (copy from Storefront) */}
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
            {/* <FiShoppingCart className="text-2xl text-gray-700 hover:text-blue-600 cursor-pointer" /> */}
            <div className="relative" >
                <Link to="/cart">                
                <FiShoppingCart className="text-2xl text-gray-700 hover:text-blue-600 cursor-pointer" href="/cart"/>
                {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cart.length}
                    </span>
                )}
                </Link>
            </div> 
            <div className="relative">
              <FiUser className="text-2xl text-gray-700 hover:text-blue-600 cursor-pointer" onClick={() => setUserDropdownOpen(!userDropdownOpen)} />
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
            <a href="/" className="block text-gray-700 hover:text-blue-600">Home</a>
            <a href="/products" className="block text-gray-700 hover:text-blue-600">Produk</a>
            <a href="#" className="block text-gray-700 hover:text-blue-600">Kategori</a>
          </div>
        )}
      </nav>

      {/* Product Listing */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Semua Produk</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products?.map((product) => (
            <div key={product.id} className="bg-white shadow rounded-lg p-4 hover:shadow-md transition">
              <img src={`http://localhost:3000${product.image}`} alt={product.name} className="w-full h-56 object-cover rounded-md mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
              <div className="flex items-center gap-2 mb-1">
                {renderStars(product.stars)}
                <span className="text-sm text-gray-500">({product.ratingCount})</span>
              </div>
              <p className="text-xl font-bold text-blue-600">Rp {product.price}</p>

              <select
                value={quantities[product.id]}
                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1 mb-3">
                  {[...Array(10)].map((_, i) => 
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>)}
              </select>

              <button
                onClick={() => addToCart(product)} // nanti diganti dengan fungsi addToCart(product)
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                >
                Tambah ke Keranjang
            </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
