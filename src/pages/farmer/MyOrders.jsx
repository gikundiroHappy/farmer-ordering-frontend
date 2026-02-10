import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import { 
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get("/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchTerm) ||
      order.landArea.toString().includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === "ALL" || 
      order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case "APPROVED": return <CheckCircle size={16} className="text-green-500" />;
      case "PENDING": return <Clock size={16} className="text-yellow-500" />;
      case "DECLINED": return <XCircle size={16} className="text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "APPROVED": return "bg-green-100 text-green-800 border-green-200";
      case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "DECLINED": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2D4533] mb-2">My Orders</h1>
            <p className="text-gray-600">
              Track all your fertilizer order submissions
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#37503F] focus:ring-1 focus:ring-[#37503F] outline-none"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#37503F] focus:ring-1 focus:ring-[#37503F] outline-none bg-white min-w-[140px]"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="DECLINED">Declined</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  Order History
                </h2>
                <span className="text-sm text-gray-500">
                  {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#37503F]"></div>
                  <p className="mt-3 text-gray-500">Loading orders...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search size={20} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    {searchTerm || statusFilter !== "ALL" 
                      ? "No matching orders found" 
                      : "No orders yet"}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {!searchTerm && statusFilter === "ALL" && "Create your first order to get started"}
                  </p>
                  {!searchTerm && statusFilter === "ALL" && (
                    <a
                      href="/farmer/create-order"
                      className="inline-block px-6 py-2.5 bg-[#37503F] text-white rounded-lg hover:bg-[#2D4533] transition-colors"
                    >
                      Create Order
                    </a>
                  )}
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">ID</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Land Area</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Fertilizer</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr 
                        key={order.id} 
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <span className="font-medium text-gray-900">#{order.id}</span>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div>
                            <span className="font-medium text-gray-900">{order.landArea}</span>
                            <p className="text-xs text-gray-500">hectares</p>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div>
                            <span className="font-medium text-gray-900">{order.fertilizerQty}</span>
                            <p className="text-xs text-gray-500">bags</p>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {filteredOrders.length > 0 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
