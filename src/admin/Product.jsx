import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Box, Users, ShoppingCart, LogOut, Edit, Trash2 } from "lucide-react";
import { getProducts, updateProduct, deleteProduct, createProduct } from "@/services/auth";

export default function Product() {
  const menuItems = [
    { name: "Dashboard", icon: <BarChart3 />, path: "/dashboard" },
    { name: "Produk", icon: <Box />, path: "/admin/products" },
    { name: "Pesanan", icon: <ShoppingCart />, path: "/admin/orders" },
    { name: "Pengguna", icon: <Users />, path: "/admin/users" },
  ];
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    stars: "",
    ratingCount: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response);
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
      formData.append("price", newProduct.price);
      formData.append("stars", newProduct.stars);
      formData.append("ratingCount", newProduct.ratingCount);
      if (selectedImageFile) {
        formData.append("image", selectedImageFile);
      }
  
      if (isEditing) {
        // EDIT MODE
        await updateProduct(formData,editingProductId);
      } else {
        // ADD MODE
        await createProduct(formData);
      }
  
      setNewProduct({ name: "", price: "", stars: "", ratingCount: "" });
      setSelectedImageFile(null);
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

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
          <nav className="space-y-4">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className="flex items-center w-full text-left px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="flex items-center text-red-400 hover:text-red-300 mt-4"
        >
          <LogOut />
          <span className="ml-2">Logout</span>
        </button>
      </aside>

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
            <input
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
            />
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
          {products.map((product) => (
            <div key={product.id} className="bg-gray-800 p-4 rounded-lg relative">
              <img
                src={`http://localhost:3000${product.image}`}
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
  );
}
