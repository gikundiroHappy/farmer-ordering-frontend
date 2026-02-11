import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import { 
  ArrowUpCircle, 
  CheckCircle, 
  XCircle, 
  PlusCircle, 
  TrendingUp,
  Clock,
  BarChart3,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FarmerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    declined: 0,
    totalLand: 0,
    avgLandArea: 0
  });
  
  const token = localStorage.getItem("token");
  const farmerName = localStorage.getItem("fullname") || "Farmer";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await API.get("/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders);
        
        const pending = res.data.orders.filter(o => o.status === "PENDING").length;
        const approved = res.data.orders.filter(o => o.status === "APPROVED").length;
        const declined = res.data.orders.filter(o => o.status === "DECLINED").length;
        const totalLand = res.data.orders.reduce((sum, order) => sum + (parseFloat(order.landArea) || 0), 0);
        const avgLandArea = res.data.orders.length > 0 ? totalLand / res.data.orders.length : 0;
        
        setStats({
          pending,
          approved,
          declined,
          totalLand,
          avgLandArea
        });

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <DashboardLayout>
      <div className="mb-8 pt-10">
        <h1 className="text-3xl font-bold text-[#2D4533] mb-2">
          Welcome back, {farmerName}!
        </h1>
        <p className="text-gray-600">
          Manage your fertilizer orders and track their status here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-yellow-50">
              <ArrowUpCircle size={24} className="text-yellow-500" />
            </div>
            <TrendingUp size={20} className="text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.pending}</h3>
          <p className="text-gray-500">Pending Orders</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-green-50">
              <CheckCircle size={24} className="text-green-500" />
            </div>
            <BarChart3 size={20} className="text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.approved}</h3>
          <p className="text-gray-500">Approved Orders</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-red-50">
              <XCircle size={24} className="text-red-500" />
            </div>
            <Clock size={20} className="text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.declined}</h3>
          <p className="text-gray-500">Declined Orders</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-blue-50">
              <BarChart3 size={24} className="text-blue-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {stats.avgLandArea.toFixed(1)} <span className="text-sm">ha</span>
          </h3>
          <p className="text-gray-500">Avg. Land Area</p>
          <p className="text-sm text-gray-400 mt-2">
            Total: {stats.totalLand.toFixed(1)} ha
          </p>
        </div>
      </div>

      <div className="block space-y-2 sm:space-y-0 sm:flex gap-4 mb-6 ">
        <button
          onClick={() => navigate("/farmer/create-order")}
          className="flex items-center gap-2 bg-[#37503F] text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
        >
          <PlusCircle size={20} /> Create Fertilizer Order
        </button>

        <button
          onClick={() => navigate("/farmer/orders")}
          className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
        >
          View My Orders
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <button
              onClick={() => navigate("/farmer/orders")}
              className="text-[#37503F] font-medium hover:text-[#2D4533] transition-colors"
            >
              View all →
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#37503F]"></div>
              <p className="mt-2 text-gray-500">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Orders Yet</h3>
              <p className="text-gray-500 mb-4">You haven't submitted any fertilizer orders.</p>
              <button
                onClick={() => navigate("/farmer/create-order")}
                className="px-6 py-2 bg-[#37503F] text-white rounded-lg hover:bg-[#2D4533] transition-colors"
              >
                Create Your First Order
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Land Area</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Fertilizer Qty</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded">
                        #{order.id}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-medium">{order.landArea} ha</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium">{order.fertilizerQty}</span>
                      <p className="text-sm text-gray-500">bags</p>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : order.status === "APPROVED"
                            ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500">
                      {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
