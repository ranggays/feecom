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
  Wallet,
} from "lucide-react";
import { getOrder, updateOrder } from "@/services/auth";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [status, setStatus] = useState('');
  const [selectId, setSelectId] = useState();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin/dashboard" },
    { name: "Produk", icon: <Box size={20} />, path: "/admin/products" },
    { name: "Pesanan", icon: <ShoppingCart size={20} />, path: "/admin/orders" },
    { name: "Pengguna", icon: <Users size={20} />, path: "/admin/users" },
    { name: "Analisis", icon: <LineChart size={20} />, path: "/admin/analytics" },
  ];
  
  const navigate = useNavigate();
  const location = useLocation();

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await getOrder();
      setOrders(res);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 text-black";
      case "processing":
        return "bg-blue-500 text-white";
      case "shipped":
        return "bg-purple-500 text-white";
      case "delivered":
        return "bg-green-600 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setSelectId(order.id);
    setShowDetailModal(true);
  };

  const changeStatus = async (e) => {
    const stat = e.target.value;
    console.log(typeof(stat));
    console.log('status change', stat);
    // setStatus(stat);
    setSelectedOrder(s => ({...s, status : stat}));
    await updateOrder(stat, selectId);
    fetchOrders();
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
    

    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 border border-gray-700">
      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">
                Detail Pesanan <span className="text-blue-400">#{selectedOrder.id}</span>
              </h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {/* Informasi Customer */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-blue-400 mb-4">Informasi Pelanggan</h4>
                <div className="bg-gray-900 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Nama</p>
                    <p className="text-white">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white">{selectedOrder.user.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">No. Telepon</p>
                    <p className="text-white">{selectedOrder.customerNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Alamat</p>
                    <p className="text-white">{selectedOrder.customerAddress}</p>
                  </div>
                </div>
              </div>
              
              {/* Detail Pesanan */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-blue-400 mb-4">Detail Pesanan</h4>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Produk</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Harga</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300">Jumlah</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {selectedOrder.order_items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-800/60">
                          <td className="px-4 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="h-12 w-12 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                                <img 
                                  src={`http://localhost:3000${item.product.image}`} 
                                  alt={item.product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-white">{item.product.name}</p>
                                <p className="text-xs text-gray-400">ID: {item.product.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-gray-300">
                            Rp {parseInt(item.product.price).toLocaleString('id-ID')}
                          </td>
                          <td className="px-4 py-4 text-center text-gray-300">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-4 text-right font-medium text-white">
                            Rp {(item.price).toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-800">
                      <tr>
                        <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                          Total
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-white">
                          Rp {selectedOrder.total.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              {/* Status Pesanan */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-blue-400 mb-4">Status Pesanan</h4>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Status Saat Ini</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Tanggal Pemesanan</p>
                      <p className="text-white">{new Date(selectedOrder.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-gray-400 text-sm mb-2">Ubah Status</p>
                    <div className="flex space-x-2">
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded text-xs font-medium transition-colors" value="pending" onClick={(e) => changeStatus(e)}>
                        pending
                      </button>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors" value="processing" onClick={(e) => changeStatus(e)}>
                        processing
                      </button>
                      <button className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors" value="shipped" onClick={(e) => changeStatus(e)}>
                        shipped
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors" value="delivered" onClick={(e) => changeStatus(e)}>
                        delivered
                      </button>
                      <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors" value="cancelled" onClick={(e) => changeStatus(e)}>
                        cancelled
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tombol Aksi */}
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Tutup
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Cetak Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">
          <span className="text-blue-400">Daftar</span> Pesanan
        </h2>
        <div className="flex space-x-2">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Baru
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl shadow-inner overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-gray-300">
              <thead className="bg-gray-800 text-gray-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Nama Pelanggan</th>
                  <th className="px-6 py-4 font-semibold">No. Telepon</th>
                  <th className="px-6 py-4 font-semibold">Alamat</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {orders.map((order, index) => (
                  <tr 
                    key={index} 
                    className="hover:bg-gray-800/60 transition-all duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{order.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.customerNumber}</td>
                    <td className="px-6 py-4 max-w-xs truncate">{order.customerAddress}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 px-3 py-1 rounded-lg transition-all duration-200 flex items-center text-xs"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Detail
                        </button>
                        <button className="bg-green-500/20 hover:bg-green-500/30 text-green-400 hover:text-green-300 px-3 py-1 rounded-lg transition-all duration-200 flex items-center text-xs">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-400 text-sm">Tidak ada pesanan yang ditemukan.</p>
                        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200">
                          Refresh Data
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {orders.length > 0 && (
            <div className="bg-gray-800 px-6 py-4 border-t border-gray-700 flex items-center justify-between">
              <div className="text-gray-400 text-sm">
                Menampilkan <span className="font-medium text-white">{orders.length}</span> pesanan
              </div>
              <div className="flex items-center space-x-2">
                <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-md text-sm transition-all duration-200">
                  Sebelumnya
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-all duration-200">
                  1
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-md text-sm transition-all duration-200">
                  2
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-md text-sm transition-all duration-200">
                  Berikutnya
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  </div>
  );
}