// pages/ProductDetailPage.jsx

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiShoppingCart, FiChevronRight } from "react-icons/fi";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

// Asumsi Anda punya service untuk mengambil satu produk dan semua produk
import { getProductById, getProducts } from "../services/auth.js"; 
import { createCart } from "../services/auth.js";

// Impor komponen Header atau Footer jika Anda memisahkannya
// import Header from '../components/Header';
// import Footer from '../components/Footer';

// Fungsi renderStars (bisa disalin dari ProductPage atau diletakkan di file utilitas)
const renderStars = (rating) => {
  // ... (salin fungsi renderStars lengkap dari ProductPage.jsx Anda)
  if (typeof rating !== 'number' || isNaN(rating)) return null;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <>
      {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} className="text-yellow-400" />)}
      {halfStar && <FaStarHalfAlt className="text-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`empty-${i}`} className="text-yellow-400" />)}
    </>
  );
};


export default function ProductDetailPage({ user }) {
  const { productId } = useParams(); // Mengambil ID dari URL
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        // 1. Ambil data produk utama
        const productData = await getProductById(productId); // Anda perlu membuat fungsi ini di services
        setProduct(productData);
        
        // 2. (Opsional) Ambil produk lain untuk "Produk Terkait"
        const allProducts = await getProducts();
        const related = allProducts
          .filter(p => p.categoryId === productData.categoryId && p.id !== productData.id)
          .slice(0, 4); // Ambil 4 produk terkait
        setRelatedProducts(related);

      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0); // Selalu scroll ke atas saat halaman berubah
  }, [productId]); // Jalankan ulang jika productId berubah

  const handleAddToCart = async (event) => {
    if (!product) return;
    try {
      await createCart(product.id, quantity);
      const button = event.currentTarget;
      button.innerHTML = '✓ Ditambahkan!';
      button.classList.add('bg-emerald-500', 'hover:bg-emerald-600');
      setTimeout(() => {
        button.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" class="mr-2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>Tambah ke Keranjang';
        button.classList.remove('bg-emerald-500', 'hover:bg-emerald-600');
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold">Produk Tidak Ditemukan</h2>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Jika Anda punya komponen Header, letakkan di sini */}
      {/* <Header user={user} /> */}

      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-blue-600">Beranda</Link>
            <FiChevronRight className="mx-2" />
            <span className="font-semibold text-gray-800">{product.name}</span>
          </div>

          {/* Product Detail Section */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Image Gallery */}
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200/50">
              <img 
                src={`${apiBaseUrl}${product.image}`} 
                alt={product.name}
                className="w-full h-auto object-cover rounded-xl"
              />
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-3">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center gap-1 text-lg">
                  {renderStars(product.stars)}
                </div>
                <span className="text-sm text-gray-500">({product.ratingCount || 0} ulasan)</span>
              </div>

              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Rp {product.price?.toLocaleString('id-ID') || 'N/A'}
              </div>

              <div className="text-gray-700 leading-relaxed mb-8">
                <p>{product.description || "Deskripsi produk belum tersedia."}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center"
                >
                  <FiShoppingCart className="mr-2" />
                  Tambah ke Keranjang
                </button>
              </div>
            </div>
          </div>
          
          {/* Related Products Section (Opsional) */}
          {relatedProducts.length > 0 && (
            <div className="mt-24">
              <h2 className="text-3xl font-bold text-center mb-10">Produk Terkait</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map(rp => (
                  <Link key={rp.id} to={`/product/${rp.id}`} className="block group">
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200/50">
                      <img src={`${apiBaseUrl}${rp.image}`} alt={rp.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform"/>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-800 truncate">{rp.name}</h3>
                        <p className="text-blue-600 font-semibold mt-2">Rp {rp.price.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
      
      {/* Jika Anda punya komponen Footer, letakkan di sini */}
      {/* <Footer /> */}
    </div>
  );
}