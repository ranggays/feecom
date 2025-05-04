import { useEffect, useState } from "react";
import bgWireless from "../assets/wireless.jpg";
import bgSmartwatch from "../assets/smartwatch.jpg";
import bgSpeaker from "../assets/portable.jpg";
import { FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";


export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    postal: ""
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);


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

  /*
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);
    */

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    // Di sini nanti kamu bisa kirim data ke backend
    console.log("Order placed!", {
      cartItems,
      address
    });

    alert("Order placed successfully!");
    // localStorage.removeItem("cartItems");
    window.location.href = "/";
  };

  const totalPrice = products.reduce((total, item) => total + item.price * (item.quantity || 1), 0);

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
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Alamat Pengiriman */}
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

        {/* Ringkasan */}
        <div className="bg-white p-6 rounded shadow h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <ul className="mb-4">
            {products.map((item, index) => (
              <li key={index} className="flex justify-between text-sm mb-1">
                <span>{item.name} x {item.quantity || 1}</span>
                <span>Rp{(item.price * (item.quantity || 1)).toLocaleString()}</span>
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
