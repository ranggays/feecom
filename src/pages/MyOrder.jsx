import { useState, useEffect } from "react";
import { FiChevronRight, FiPackage, FiClock, FiCheckCircle, FiXCircle, FiTruck } from "react-icons/fi";
import { getOrderId } from "@/services/auth";

// Fungsi ini akan diganti dengan panggilan API sebenarnya


const getStatusIcon = (status) => {
  switch (status) {
    case "pending":
      return <FiClock className="text-yellow-500" />;
    case "processing":
      return <FiPackage className="text-blue-500" />;
    case "shipped":
      return <FiTruck className="text-purple-500" />;
    case "delivered":
      return <FiCheckCircle className="text-green-600" />;
    case "cancelled":
      return <FiXCircle className="text-red-500" />;
    default:
      return <FiClock className="text-gray-500" />;
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "pending":
      return "Menunggu Pembayaran";
    case "processing":
      return "Diproses";
    case "shipped":
      return "Dikirim";
    case "delivered":
      return "Diterima";
    case "cancelled":
      return "Dibatalkan";
    default:
      return status;
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function MyOrders({ user }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      if (user && user.id) {
        setIsLoading(true);
        try {
          const data = await getOrderId(user.id);
          setOrders(data);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchOrders();
  }, [user]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Pesanan Saya</h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <FiPackage className="text-gray-400 text-6xl mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">Belum Ada Pesanan</h3>
              <p className="text-gray-500 mb-6">Anda belum memiliki pesanan. Mulai belanja sekarang!</p>
              <a 
                href="/products" 
                className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              >
                Belanja Sekarang
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="text-gray-500 text-sm">ID Pesanan:</span>
                      <span className="ml-2 font-medium">#{order.id}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <span className="text-gray-500 text-sm">Tanggal Pesanan:</span>
                      <span className="ml-2">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 text-sm">Total:</span>
                      <span className="ml-2 font-bold">
                        Rp {order.total?.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end">
                    <div className={`flex items-center px-3 py-1 rounded-full ${getStatusClass(order.status)} text-sm mb-3`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-2">{getStatusText(order.status)}</span>
                    </div>
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      Lihat Detail
                      <FiChevronRight className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Detail Pesanan */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                Detail Pesanan <span className="text-blue-600">#{selectedOrder.id}</span>
              </h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {/* Status Pesanan */}
              <div className="mb-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-2 font-medium">
                      Status: {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(selectedOrder.createdAt).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              
              {/* Detail Produk */}
              <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Produk</h4>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="min-w-full">
                <thead className="bg-gray-100">
                    <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Produk</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Harga</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Jumlah</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Subtotal</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {selectedOrder.order_items && selectedOrder.order_items.map((item) => {
                    console.log("Rendering item:", item);
                    console.log("Product data:", item.product);
                    return (
                        <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                            <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                {item.product && item.product.image ? (
                                <img 
                                    src={`${apiBaseUrl}/${item.product.image}`} 
                                    alt={item.product?.name || "Product Image"}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                    console.error("Image failed to load:", item.product.image);
                                    e.target.onerror = null;
                                    e.target.src = "/placeholder-image.jpg"; // Fallback image
                                    }}
                                />
                                ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">
                                {item.product ? item.product.name : "Product Name Missing"}
                                </p>
                                <p className="text-xs text-gray-500">
                                ID: {item.product ? item.product.id : "ID Missing"}
                                </p>
                            </div>
                            </div>
                        </td>
                        <td className="px-4 py-4 text-gray-700">
                            Rp {item.product && item.product.price ? 
                            parseInt(item.product.price).toLocaleString('id-ID') : 
                            "Price Missing"}
                        </td>
                        <td className="px-4 py-4 text-center text-gray-700">
                            {item.quantity || 0}
                        </td>
                        <td className="px-4 py-4 text-right font-medium text-gray-800">
                            Rp {(item.price || 0).toLocaleString('id-ID')}
                        </td>
                        </tr>
                    );
                    })}
                </tbody>
                <tfoot className="bg-gray-100">
                    <tr>
                    <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                        Total
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-800">
                        Rp {selectedOrder.total?.toLocaleString('id-ID')}
                    </td>
                    </tr>
                </tfoot>
                </table>
            </div>
            </div>
                        
              {/* Informasi Pengiriman */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Informasi Pengiriman</h4>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Nama Penerima</p>
                    <p className="font-medium">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">No. Telepon</p>
                    <p className="font-medium">{selectedOrder.customerNumber}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-500 text-sm">Alamat Pengiriman</p>
                    <p className="font-medium">{selectedOrder.customerAddress}</p>
                  </div>
                </div>
              </div>
              
              {/* Tombol */}
              <div className="flex justify-end space-x-3">
                {selectedOrder.status === "delivered" && (
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition">
                    Nilai Produk
                  </button>
                )}
                
                {selectedOrder.status === "pending" && (
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
                    Bayar Sekarang
                  </button>
                )}
                
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}