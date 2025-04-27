import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Box,
  Users,
  ShoppingCart,
  LogOut,
} from "lucide-react";
import DashboardContent from "./DashboardContent.jsx";


export default function AdminDashboard({ children }) {
    const menuItems = [
      { name: "Dashboard", icon: <BarChart3 />, path: "/dashboard" },
      { name: "Produk", icon: <Box />, path: "/admin/products" },
      { name: "Pesanan", icon: <ShoppingCart />, path: "/admin/orders" },
      { name: "Pengguna", icon: <Users />, path: "/admin/users" },
    ];
    const navigate = useNavigate();

  const handleLogout = () => {
    // Hapus session atau token
    navigate("/login");
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
        {children || (
          <div>
            <h2 className="text-3xl font-semibold mb-4">Selamat datang, Admin!</h2>
            <p className="text-gray-400">Gunakan panel di sebelah kiri untuk mengelola data.</p>
          </div>
        )}
      </main>
    </div>
  );
}
