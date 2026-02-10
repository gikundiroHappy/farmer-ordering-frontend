import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import { 
  CheckCircle, 
  XCircle, 
  Search,
  Filter,
  User,
  Calendar
} from "lucide-react";

export default function Requests() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, action) => {
    try {
      await API.patch(`/admin/orders/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =  order.farmer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.toString().includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === "ALL" || 
      order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case "APPROVED": return "bg-green-100 text-green-800 border-green-200";
      case "DECLINED": return "bg-red-100 text-red-800 border-red-200";
      case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2D4533] mb-2">Manage Requests</h1>
            <p className="text-gray-600">Review and approve fertilizer requests from farmers</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search farmer or order ID..."
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
                  Farmer Requests
                </h2>
                <span className="text-sm text-gray-500">
                  {filteredOrders.length} {filteredOrders.length === 1 ? 'request' : 'requests'}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#37503F]"></div>
                  <p className="mt-3 text-gray-500">Loading requests...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search size={20} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    {searchTerm || statusFilter !== "ALL" 
                      ? "No matching requests found" 
                      : "No requests yet"}
                  </h3>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Farmer</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Land Area</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Fertilizer</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr 
                        key={order.id} 
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#37503F] to-[#2D4533] flex items-center justify-center">
                              <User size={16} className="text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {order.farmer?.fullName || "Unknown"}
                              </p>
                              <p className="text-xs text-gray-500">ID: #{order.id}</p>
                            </div>
                          </div>
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
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={14} />
                            <span className="text-sm">{formatDate(order.createdAt)}</span>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          {order.status === "PENDING" ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateStatus(order.id, "approve")}
                                className="flex-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center justify-center gap-1"
                              >
                                <CheckCircle size={14} />
                                Approve
                              </button>
                              <button
                                onClick={() => updateStatus(order.id, "decline")}
                                className="flex-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center justify-center gap-1"
                              >
                                <XCircle size={14} />
                                Decline
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Decision made</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
