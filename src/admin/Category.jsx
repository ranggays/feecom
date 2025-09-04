import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart3,
  Box,
  Users,
  ShoppingCart,
  LogOut,
  ChevronLeft,
  Bell,
  Search,
  Settings,
  ChevronDown,
  CircleUserRound,
  LayoutDashboard,
  LineChart,
  Edit,
  Trash2,
  Wallet,
  ChartBarStacked
} from "lucide-react";
import { getCategory, createCategory } from "@/services/auth";

export default function Categories() {
  
  const [categories, setCategories] = useState([]);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    // price: "",
    // image: "",
    // stars: "",
    // ratingCount: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin/dashboard" },
    { name: "Produk", icon: <Box size={20} />, path: "/admin/products" },
    { name: "Category", icon: <ChartBarStacked size={20} />, path: "/admin/categories" },
    { name: "Pesanan", icon: <ShoppingCart size={20} />, path: "/admin/orders" },
    { name: "Pengguna", icon: <Users size={20} />, path: "/admin/users" },
    { name: "Analisis", icon: <LineChart size={20} />, path: "/admin/analytics" },
  ];
  
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProducts = async () => {
    try {
      const response = await getCategory();
      setCategories(response);
    } catch (error) {
      console.error("Gagal mengambil produk:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /*
  const handleAddProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price);
      formData.append("stars", newProduct.stars);
      formData.append("ratingCount", newProduct.ratingCount);
      formData.append("image", selectedImageFile); // ini file, bukan URL string
  
      const response = await createProduct(formData);
  
      if (response.ok) {
        setNewProduct({ name: "", price: "", stars: "", ratingCount: "" });
        setSelectedImageFile(null);
        fetchProducts(); // Refresh list
      }
    } catch (error) {
      console.error("Gagal menambah produk:", error);
    }
  };
  */

  const handleSaveProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
    //   formData.append("price", newProduct.price);
    //   formData.append("stars", newProduct.stars);
    //   formData.append("ratingCount", newProduct.ratingCount);
    //   if (selectedImageFile) {
    //     formData.append("image", selectedImageFile);
    //   }
  
      if (isEditing) {
        // EDIT MODE
        await updateProduct(formData,editingProductId);
      } else {
        // ADD MODE
        await createCategory(newProduct.name);
      }
  
      setNewProduct({ name: "" });
    //   setSelectedImageFile(null);
      setIsEditing(false);
      setEditingProductId(null);
      fetchProducts();
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
    }
  };

  const handleEditProduct = (product) => {
    setIsEditing(true);
    setEditingProductId(product.id);
    setNewProduct({
      name: product.name,
      price: product.price,
      stars: product.stars,
      ratingCount: product.ratingCount
    });
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error("Gagal menghapus produk:", error);
    }
  };

  const handleLogout = () => {
    // Hapus session atau token
    navigate("/login");
  };


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white">
      {/* Sidebar */}
      <aside 
        className={`${
          isCollapsed ? "w-20" : "w-64"
        } bg-gray-800 transition-all duration-300 ease-in-out border-r border-gray-700 relative`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`p-6 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
            {!isCollapsed && <h1 className="text-xl font-bold">ECOM<span className="text-blue-400">ADMIN</span></h1>}
            {isCollapsed && <LayoutDashboard size={24} className="text-blue-400" />}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className="p-1 rounded-full hover:bg-gray-700 transition"
            >
              <ChevronLeft size={18} className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="mt-6 flex-1">
            <div className="space-y-1 px-3">
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={index}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center w-full ${
                      isCollapsed ? "justify-center" : "justify-start"
                    } px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? "bg-blue-500/20 text-blue-400" 
                        : "hover:bg-gray-700/70 text-gray-300 hover:text-white"
                    }`}
                  >
                    <div className={isActive ? "text-blue-400" : "text-gray-400"}>
                      {item.icon}
                    </div>
                    {!isCollapsed && <span className={`ml-3 ${isActive ? "font-medium" : ""}`}>{item.name}</span>}
                  </button>
                );
              })}
            </div>
          </nav>
          
          {/* User profile and logout */}
          <div className={`p-4 ${isCollapsed ? "items-center" : ""}`}>
            {!isCollapsed && (
              <div className="border-t border-gray-700 pt-4 mb-4">
                <div className="flex items-center">
                  <div className="rounded-full bg-gray-700 p-2">
                    <CircleUserRound size={24} className="text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-gray-400">admin@example.com</p>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className={`flex items-center text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg px-4 py-2 w-full ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <LogOut size={20} />
              {!isCollapsed && <span className="ml-2">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800/50 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold">
                {menuItems.find(item => item.path === location.pathname)?.name || "Dashboard"}
              </h2>
              <div className="hidden md:flex bg-gray-700/50 rounded-lg">
                <div className="flex items-center px-3 py-1.5 text-xs text-gray-400">
                  <span>Admin</span>
                  <ChevronDown size={14} className="ml-1" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center bg-gray-700/40 rounded-lg px-3 py-1.5">
                <Search size={16} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Cari..." 
                  className="bg-transparent border-none text-sm focus:outline-none text-gray-300 ml-2 w-36 lg:w-64"
                />
              </div>
              
              <button className="relative p-2 bg-gray-700/40 rounded-lg hover:bg-gray-700 transition">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <button className="p-2 bg-gray-700/40 rounded-lg hover:bg-gray-700 transition">
                <Settings size={18} />
              </button>
            </div>
          </div>
        </header>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-3xl font-semibold mb-6">Kelola Produk</h2>

        {/* Form Tambah Produk */}
        <div className="bg-gray-800 p-6 rounded-lg mb-10">
          <h3 className="text-xl font-semibold mb-4">Tambah Produk Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="p-2 rounded bg-gray-700"
              type="text"
              placeholder="Nama Produk"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            {/* <input
              className="p-2 rounded bg-gray-700"
              type="text"
              placeholder="Harga"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <input
              className="p-2 rounded bg-gray-700"
              type="file"
              placeholder="URL Gambar"
              // value={newProduct.image}
              onChange={(e) => setSelectedImageFile(e.target.files[0])}
            />
            <input
              className="p-2 rounded bg-gray-700"
              type="text"
              placeholder="Rating (1-5)"
              value={newProduct.stars}
              onChange={(e) => setNewProduct({ ...newProduct, stars: e.target.value })}
            />
            <input
              className="p-2 rounded bg-gray-700"
              type="text"
              placeholder="Jumlah Rating"
              value={newProduct.ratingCount}
              onChange={(e) => setNewProduct({ ...newProduct, ratingCount: e.target.value })}
            /> */}
          </div>
          <button
            onClick={handleSaveProduct}
            className={`mt-4 ${isEditing ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'} px-6 py-2 rounded text-white`}
          >
            {isEditing ? "Simpan Perubahan" : "Tambah Produk"}
          </button>
        </div>

        {/* Daftar Produk */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((product) => (
            <div key={product.id} className="bg-gray-800 p-4 rounded-lg relative">
              <img
                // src={`http://localhost:3000${product.image}`}
                src={`${apiBaseUrl}${product.image}`}
                alt={product.name}
                className="h-40 w-full object-cover rounded"
              />
              <h4 className="mt-4 text-lg font-semibold">{product.name}</h4>
              <p className="text-gray-400">Harga: Rp {product.price}</p>
              <p className="text-gray-400">⭐ {product.stars} ({product.ratingCount} reviews)</p>

              {/* Tombol Edit & Delete */}
              <div className="flex gap-2 mt-4">
              <button
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 py-2 rounded text-sm flex items-center justify-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 py-2 rounded text-sm flex items-center justify-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  </div>
  );
}
