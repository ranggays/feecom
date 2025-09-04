import { useState, useEffect } from "react";
import { FiShoppingCart, FiUser, FiMenu, FiX, FiPackage, FiSearch, FiFilter, FiGrid, FiList, FiHeart, FiEye, FiStar } from "react-icons/fi";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { logout } from "@/services/auth.js";
import { Link, useNavigate } from 'react-router-dom';
import { createProduct, getProducts, updateProduct, deleteProduct} from '../services/auth.js'
import { createCart, updateCart, deleteCart, getCart } from "../services/auth.js";
import { getCategory } from "@/services/auth.js";

export default function ProductPage({ user }) {
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [products, setProducts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000000 });
  const [loading, setLoading] = useState(true);
  const [categoriess, setCategories] = useState([]);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  
  const productsDb = async () => {
    try {
      setLoading(true);
      const product = await getProducts();
      const itemCart = await getCart();
      setProducts(product);
      setCart(itemCart);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    productsDb();
    getCategories();
  },[]);

  const handleQuantityChange = (productId, value) => {
    const quantity = Math.max(1, parseInt(value) || 1);
    setQuantities(q => ({...q, [productId]:quantity}));
  };

  const addToCart = async (product) => {
    const quantity = quantities[product.id] || 1;
    try {
      const cart = await createCart(product.id, quantity);
      if(cart){
        console.log('Berhasil masuk keranjang');
        // Show success animation
        const button = event.target;
        button.textContent = '✓ Ditambahkan!';
        button.style.backgroundColor = '#10b981';
        setTimeout(() => {
          button.textContent = 'Tambah ke Keranjang';
          button.style.backgroundColor = '';
        }, 2000);
      }
      setCart(c => [...c, product]);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // const categories = [
  //   { id: 'all', name: 'Semua Produk', count: products.length },
  //   { id: 'electronics', name: 'Elektronik', count: products.filter(p => p.category === 'electronics').length },
  //   { id: 'fashion', name: 'Fashion', count: products.filter(p => p.category === 'fashion').length },
  //   { id: 'accessories', name: 'Aksesoris', count: products.filter(p => p.category === 'accessories').length },
  // ];

  const getProcessedCategories = () => {
    const allCategory = {
      id: 'all',
      name: 'Semua Produk',
      count: products.length
    };

    const processedCategories = categoriess.map(category => ({
      ...category,
      count: products.filter(p => p.categoryId === category.id).length
    }));

    return [allCategory, ...processedCategories];
  }


  const getCategories = async () => {
    try {      
      const res = await getCategory();
      if (!res){
        throw new Error('Categories not found');
      }
      setCategories(res);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  }

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'all' || product.categoryId === Number(selectedCategory)) &&
      product.price >= priceRange.min && product.price <= priceRange.max
    )
    .sort((a, b) => {
      switch(sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return (b.stars || 0) - (a.stars || 0);
        case 'newest': return b.id - a.id;
        default: return a.name.localeCompare(b.name);
      }
    });

  const renderStars = (rating) => {
    if (typeof rating !== 'number' || isNaN(rating)) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat produk premium...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-6xl font-black text-white mb-6">
            Premium <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Collection</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Jelajahi koleksi produk premium kami yang telah dipilih khusus untuk memberikan pengalaman terbaik
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Cari produk premium..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl bg-white/95 backdrop-blur-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Sort Section */}
      <section className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {getProcessedCategories().map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id.toString())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Urutkan: Nama</option>
                <option value="price-low">Harga: Rendah ke Tinggi</option>
                <option value="price-high">Harga: Tinggi ke Rendah</option>
                <option value="rating">Rating Tertinggi</option>
                <option value="newest">Terbaru</option>
              </select>

              {/* View Mode */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <FiList />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FiFilter />
                Filter
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {filterOpen && (
            <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rentang Harga</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value) || 10000000})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Results Info */}
          <div className="mb-8">
            <p className="text-gray-600">
              Menampilkan <span className="font-semibold">{filteredProducts.length}</span> produk
              {searchTerm && ` untuk "${searchTerm}"`}
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                <FiSearch className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Tidak ada produk ditemukan</h3>
              <p className="text-gray-600 mb-6">Coba ubah filter pencarian atau kata kunci</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setPriceRange({ min: 0, max: 10000000 });
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-300"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="block">                
                  <div 
                    key={product.id} 
                    className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200/50 hover:border-blue-200 ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Product Image */}
                    <div className={`relative overflow-hidden ${
                      viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-square'
                    }`}>
                      <img 
                        src={`${apiBaseUrl}${product.image}`} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"></div>
                      
                      {/* Quick Actions */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:text-red-500 hover:bg-white transition-colors" onClick={(e) => e.preventDefault()}>
                          <FiHeart />
                        </button>
                        <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:text-blue-500 hover:bg-white transition-colors">
                          <FiEye />
                        </button>
                      </div>

                      {/* Badge */}
                      {product.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                            ⭐ Featured
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className={`p-6 flex flex-col ${viewMode === 'list' ? 'flex-1' : ''} cursor-pointer`}>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex text-sm">
                            {renderStars(product.stars)}
                          </div>
                          <span className="text-sm text-gray-500">
                            ({product.ratingCount || 0} ulasan)
                          </span>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                          <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Rp {product.price?.toLocaleString('id-ID') || 'N/A'}
                          </div>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="text-sm text-gray-500 line-through">
                              Rp {product.originalPrice.toLocaleString('id-ID')}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Add to Cart */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 min-w-0">Jumlah:</span>
                          <select
                            value={quantities[product.id] || 1}
                            onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {[...Array(10)].map((_, i) => 
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            )}
                          </select>
                        </div>

                        <button
                          onClick={(e) => addToCart(product)}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                          <FiShoppingCart />
                          Tambah ke Keranjang
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}