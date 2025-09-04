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
  ChartBarStacked
} from "lucide-react";
import { getOrder } from "@/services/auth";

export default function AdminDashboard({ children }) {
  const [orders, setOrders] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

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

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await getOrder();
        setOrders(res);
        
        // Calculate stats
        const totalRevenue = res.reduce((sum, order) => sum + order.total, 0);
        const pendingOrders = res.filter(order => order.status === "pending").length;
        const completedOrders = res.filter(order => order.status === "delivered").length;
        
        setStats({
          totalOrders: res.length,
          totalRevenue,
          pendingOrders,
          completedOrders
        });
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Group orders by day for chart data
  const getOrdersByDate = () => {
    const ordersByDate = {};
    
    orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString('id-ID');
      if (ordersByDate[date]) {
        ordersByDate[date]++;
      } else {
        ordersByDate[date] = 1;
      }
    });
    
    return ordersByDate;
  };

  // Get total revenue by day
  const getRevenueByDate = () => {
    const revenueByDate = {};
    
    orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString('id-ID');
      if (revenueByDate[date]) {
        revenueByDate[date] += order.total;
      } else {
        revenueByDate[date] = order.total;
      }
    });
    
    return revenueByDate;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleLogout = () => {
    // Hapus session atau token
    navigate("/login");
  };

  // Check if current route is dashboard
  const isDashboard = location.pathname === "/dashboard";

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

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children || (
            <div>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {/* Stats cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-400">Total Pesanan</p>
                          <h3 className="text-2xl font-bold mt-1">{stats.totalOrders}</h3>
                          <p className="text-xs text-green-400 mt-2 flex items-center">
                            <span>↑ 12%</span>
                            <span className="text-gray-500 ml-1">vs bulan lalu</span>
                          </p>
                        </div>
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                          <ShoppingCart size={20} className="text-blue-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-400">Total Pendapatan</p>
                          <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.totalRevenue)}</h3>
                          <p className="text-xs text-green-400 mt-2 flex items-center">
                            <span>↑ 8%</span>
                            <span className="text-gray-500 ml-1">vs bulan lalu</span>
                          </p>
                        </div>
                        <div className="p-3 bg-green-500/20 rounded-lg">
                          <Wallet size={20} className="text-green-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-6 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-400">Pesanan Pending</p>
                          <h3 className="text-2xl font-bold mt-1">{stats.pendingOrders}</h3>
                          <p className="text-xs text-yellow-400 mt-2 flex items-center">
                            <span>• Perlu tindakan</span>
                          </p>
                        </div>
                        <div className="p-3 bg-yellow-500/20 rounded-lg">
                          <Clock size={20} className="text-yellow-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-400">Pesanan Selesai</p>
                          <h3 className="text-2xl font-bold mt-1">{stats.completedOrders}</h3>
                          <p className="text-xs text-purple-400 mt-2 flex items-center">
                            <span>↑ 18%</span>
                            <span className="text-gray-500 ml-1">vs bulan lalu</span>
                          </p>
                        </div>
                        <div className="p-3 bg-purple-500/20 rounded-lg">
                          <CheckCircle size={20} className="text-purple-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                
                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 shadow-sm">
                      <h3 className="text-lg font-semibold mb-6">Pesanan per Hari</h3>
                      <div className="h-64">
                        <OrdersChart data={getOrdersByDate()} />
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 shadow-sm">
                      <h3 className="text-lg font-semibold mb-6">Pendapatan per Hari</h3>
                      <div className="h-64">
                        <RevenueChart data={getRevenueByDate()} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent Orders */}
                  <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold">Pesanan Terbaru</h3>
                      <button 
                        onClick={() => navigate('/admin/orders')}
                        className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                      >
                        Lihat Semua
                      </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                          <tr className="text-left text-xs text-gray-400">
                            <th className="px-4 py-3 font-medium">ID</th>
                            <th className="px-4 py-3 font-medium">Pelanggan</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Total</th>
                            <th className="px-4 py-3 font-medium">Tanggal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {orders.slice(0, 5).map((order) => (
                            <tr key={order.id} className="hover:bg-gray-700/30 transition-colors">
                              <td className="px-4 py-3 text-sm font-medium">{order.id}</td>
                              <td className="px-4 py-3 text-sm">{order.customerName}</td>
                              <td className="px-4 py-3">
                                <span 
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    order.status === "pending"
                                      ? "bg-yellow-500/30 text-yellow-300"
                                      : "bg-green-500/30 text-green-300"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm font-medium">
                                {formatCurrency(order.total)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-400">
                                {new Date(order.createdAt).toLocaleDateString('id-ID')}
                              </td>
                            </tr>
                          ))}
                          {orders.length === 0 && (
                            <tr>
                              <td colSpan={5} className="px-4 py-6 text-center text-gray-400 text-sm">
                                Tidak ada data pesanan.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-800/50 border-t border-gray-700 px-6 py-4">
          <div className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} ECOM Dashboard. Hak Cipta Dilindungi.
          </div>
        </footer>
      </div>
    </div>
  );
}

// Chart components
function OrdersChart({ data }) {
  // Chart implementation would go here - using recharts
  const chartData = Object.entries(data).map(([date, count]) => ({ date, count }));
  
  return (
    <div className="flex items-end h-full w-full justify-around">
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-full w-full text-gray-400">
          Tidak ada data tersedia
        </div>
      ) : (
        chartData.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className="bg-blue-500/50 hover:bg-blue-500/70 transition-all w-12 rounded-t-md"
              style={{ height: `${(item.count / Math.max(...chartData.map(d => d.count))) * 200}px` }}
            ></div>
            <div className="text-xs text-gray-400 mt-2 whitespace-nowrap">{item.date.split('/').slice(0, 2).join('/')}</div>
          </div>
        ))
      )}
    </div>
  );
}

function RevenueChart({ data }) {
  // Chart implementation would go here - using recharts
  const chartData = Object.entries(data).map(([date, amount]) => ({ date, amount }));
  const maxAmount = Math.max(...chartData.map(d => d.amount));
  
  return (
    <div className="flex items-end h-full w-full justify-around">
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-full w-full text-gray-400">
          Tidak ada data tersedia
        </div>
      ) : (
        chartData.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className="bg-green-500/50 hover:bg-green-500/70 transition-all w-12 rounded-t-md"
              style={{ height: `${(item.amount / maxAmount) * 200}px` }}
            ></div>
            <div className="text-xs text-gray-400 mt-2 whitespace-nowrap">{item.date.split('/').slice(0, 2).join('/')}</div>
          </div>
        ))
      )}
    </div>
  );
}

// Missing icon components
function Clock(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckCircle(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}