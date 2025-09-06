import Card from "./Card.jsx";
import { useEffect, useState } from "react";
import { FiShoppingCart, FiUser, FiMenu, FiX, FiPackage, FiStar, FiShield, FiTruck, FiHeadphones, FiArrowRight, FiPlay } from "react-icons/fi";
import { Routes, Route, Link, useLocation,  useParams } from "react-router-dom";
import bgWireless from "../assets/wireless.jpg";
import bgSmartwatch from "../assets/smartwatch.jpg";
import bgSpeaker from "../assets/portable.jpg";
import { logout } from "@/services/auth.js";
import MyOrders from "./MyOrder.jsx";
import { getCart } from "@/services/auth.js";
import NewProduct from "./NewProduct.jsx";
import ProductDetailPage from "./ProductDetailPage.jsx";

export default function Storefront({user}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const location = useLocation();
    const params = useParams();

    const productsDb = async () => {
        const itemCart = await getCart();
        setCart(itemCart);
    };

    useEffect(() => {
        productsDb();
    },[])

    // Auto-slide for hero section
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 3);
        }, 5000);
        return () => clearInterval(timer);
    }, []);
    
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

    const heroSlides = [
        {
            title: "Premium Audio Experience",
            subtitle: "Wireless Headphones Collection",
            description: "Immerse yourself in crystal-clear sound with our flagship wireless headphones",
            cta: "Explore Collection",
            bg: "from-slate-900 via-purple-900 to-slate-900"
        },
        {
            title: "Smart Technology",
            subtitle: "Next-Gen Smartwatches",
            description: "Track your life, enhance your style with cutting-edge smartwatch technology",
            cta: "Discover More",
            bg: "from-blue-900 via-indigo-900 to-purple-900"
        },
        {
            title: "Portable Sound",
            subtitle: "Premium Speakers",
            description: "Bring the concert experience anywhere with our portable speaker lineup",
            cta: "Shop Now",
            bg: "from-emerald-900 via-teal-900 to-cyan-900"
        }
    ];

    const features = [
        {
            icon: <FiShield className="w-8 h-8" />,
            title: "Lifetime Warranty",
            description: "Complete protection for all your purchases"
        },
        {
            icon: <FiTruck className="w-8 h-8" />,
            title: "Same Day Delivery",
            description: "Get your products delivered within hours"
        },
        {
            icon: <FiHeadphones className="w-8 h-8" />,
            title: "24/7 Expert Support",
            description: "Premium customer service whenever you need"
        }
    ];

    const stats = [
        { number: "50K+", label: "Happy Customers" },
        { number: "99.9%", label: "Uptime Guarantee" },
        { number: "24/7", label: "Support Available" },
        { number: "100+", label: "Premium Products" }
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
      const pathname = location.pathname;

      if (location.pathname === "/my-orders") {
        return <MyOrders user={user} />;
      }else if(location.pathname === "/product"){
        return <NewProduct user={user} />;
      }
      // else if(location.pathname === "/product/:id"){
      //   return <ProductDetailPage user={user} />
      // }
      else if(pathname.startsWith('/product/')){
        const { productId } = params;
        return <ProductDetailPage user={user} id={productId} />
      }

      
      // Default home page content
      return (
        <>
          {/* Premium Hero Section with Carousel */}
          <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Background with gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${heroSlides[currentSlide].bg} transition-all duration-1000`}>
                <div className="absolute inset-0 bg-black/30"></div>
                {/* Animated background elements */}
                <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>
            
            <div className="relative max-w-7xl mx-auto px-4 py-20 z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-white space-y-8">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-blue-300 tracking-widest uppercase">
                                {heroSlides[currentSlide].subtitle}
                            </p>
                            <h1 className="text-6xl lg:text-7xl font-black leading-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                {heroSlides[currentSlide].title}
                            </h1>
                        </div>
                        <p className="text-xl text-gray-200 leading-relaxed max-w-lg">
                            {heroSlides[currentSlide].description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="group bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center">
                                {heroSlides[currentSlide].cta}
                                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="group border border-white/30 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-white/10 backdrop-blur transition-all duration-300 flex items-center justify-center">
                                <FiPlay className="mr-2" />
                                Watch Demo
                            </button>
                        </div>
                        
                        {/* Hero Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl font-black text-white">{stat.number}</div>
                                    <div className="text-sm text-gray-300">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Hero Image/Animation */}
                    <div className="relative">
                        <div className="relative w-full max-w-lg mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
                            <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20">
                                <div className="space-y-6">
                                    <div className="h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                                    <div className="space-y-3">
                                        <div className="h-3 bg-white/40 rounded-full w-3/4"></div>
                                        <div className="h-3 bg-white/40 rounded-full w-1/2"></div>
                                        <div className="h-3 bg-white/40 rounded-full w-2/3"></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-16 bg-white/20 rounded-xl"></div>
                                        <div className="h-16 bg-white/20 rounded-xl"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Slide indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentSlide ? 'bg-white w-8' : 'bg-white/40'
                        }`}
                    />
                ))}
            </div>
          </section>

          {/* Premium Features Section */}
          <section className="py-20 bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
            <div className="relative max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                        Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Premium</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Experience unmatched quality and service that sets us apart from the competition
                    </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                            <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 hover:border-blue-200 transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </section>
    
          {/* Premium Products Section */}
          <section className="py-20 bg-gray-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20"></div>
            <div className="relative max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
                        Featured <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Collections</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Handpicked premium products that define excellence and innovation
                    </p>
                </div>
                <Card items={products}/>
            </div>
          </section>
          
          {/* Premium Categories Section */}
          <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
            
            <div className="relative max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                        Premium <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Categories</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Explore our carefully curated categories of luxury products
                    </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { name: "Premium Electronics", icon: "🎧", gradient: "from-blue-500 to-cyan-500" },
                        { name: "Luxury Fashion", icon: "👗", gradient: "from-purple-500 to-pink-500" },
                        { name: "Designer Accessories", icon: "💎", gradient: "from-amber-500 to-orange-500" },
                        { name: "Beauty & Wellness", icon: "🌟", gradient: "from-emerald-500 to-teal-500" }
                    ].map((cat, index) => (
                        <div key={index} className="group cursor-pointer">
                            <div className="relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" 
                                     style={{background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`}}></div>
                                <div className={`relative bg-gradient-to-br ${cat.gradient} p-8 rounded-2xl text-white text-center transform group-hover:scale-105 group-hover:-rotate-1 transition-all duration-300 shadow-lg group-hover:shadow-2xl`}>
                                    <div className="text-4xl mb-4">{cat.icon}</div>
                                    <h3 className="font-bold text-lg">{cat.name}</h3>
                                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <FiArrowRight className="mx-auto" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                        What Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Customers Say</span>
                    </h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { name: "Sarah Johnson", role: "Tech Enthusiast", rating: 5, comment: "Absolutely incredible quality and service. The premium experience is worth every penny!" },
                        { name: "Michael Chen", role: "Design Professional", rating: 5, comment: "Best online shopping experience I've ever had. The products exceed all expectations." },
                        { name: "Emma Williams", role: "Business Owner", rating: 5, comment: "Outstanding customer service and premium products. Highly recommend to everyone!" }
                    ].map((testimonial, index) => (
                        <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                ))}
                            </div>
                            <p className="text-gray-700 mb-6 italic">"{testimonial.comment}"</p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                                </div>
                            </div>
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
              <Link to="/" className={`text-gray-700 hover:text-blue-600 font-medium transition-colors relative ${location.pathname === "/" ? "text-blue-600" : ""}`}>
                Home
                {location.pathname === "/" && <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>}
              </Link>
              <Link to="/product" className={`text-gray-700 hover:text-blue-600 font-medium transition-colors relative ${location.pathname === "/products" ? "text-blue-600" : ""}`}>
                Produk
                {location.pathname === "/products" && <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>}
              </Link>
              <Link to="/my-orders" className={`text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center relative ${location.pathname === "/my-orders" ? "text-blue-600" : ""}`}>
                <FiPackage className="mr-2" /> Pesanan Saya
                {location.pathname === "/my-orders" && <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>}
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Cari produk premium..."
                  className="pl-4 pr-4 py-2 border border-gray-300 rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="relative">
                <Link to='/carts' className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <FiShoppingCart className="text-lg" />
                  </div>
                  {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
                      {cart.length}
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
                      <div className="font-bold text-gray-900">👤 {user.fullName}</div>
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

        {/* Main Content */}
        <main>
          {renderContent()}
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
                  Bergabunglah dengan ribuan pelanggan yang telah merasakan perbedaannya.
                </p>
                <div className="flex gap-4">
                  {[
                    { icon: "📘", href: "#", label: "Facebook" },
                    { icon: "📸", href: "#", label: "Instagram" },
                    { icon: "🐦", href: "#", label: "Twitter" },
                    { icon: "💼", href: "#", label: "LinkedIn" }
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
                    { name: "Produk Premium", href: "/products" },
                    { name: "Pesanan Saya", href: "/my-orders" },
                    { name: "Tentang Kami", href: "#" },
                    { name: "Kontak", href: "#" }
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
                  Dapatkan akses eksklusif ke penawaran premium dan produk terbatas langsung ke email Anda.
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
                  <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  } 