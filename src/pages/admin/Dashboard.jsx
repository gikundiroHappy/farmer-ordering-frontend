import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({ 
    approved: 0, 
    declined: 0, 
    pending: 0,
    total: 0 
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMetrics();
  }, [token]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setMetrics({
        approved: data.approved || 0,
        declined: data.declined || 0,
        pending: data.pending || 0,
        total: (data.approved || 0) + (data.declined || 0) + (data.pending || 0)
      });
    } catch (err) {
      console.error("Error fetching metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: "Approved", value: metrics.approved, color: "#10B981" },
    { name: "Declined", value: metrics.declined, color: "#EF4444" },
    { name: "Pending", value: metrics.pending, color: "#F59E0B" },
  ];

  const getPercentage = (value) => {
    if (metrics.total === 0) return 0;
    return Math.round((value / metrics.total) * 100);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2D4533] mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Overview of all farmer requests and system metrics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-green-50">
                  <CheckCircle size={24} className="text-green-500" />
                </div>
                <TrendingUp size={20} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {loading ? "..." : metrics.approved}
              </h3>
              <p className="text-gray-600 mb-2">Approved Requests</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-red-50">
                  <XCircle size={24} className="text-red-500" />
                </div>
                <BarChart3 size={20} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {loading ? "..." : metrics.declined}
              </h3>
              <p className="text-gray-600 mb-2">Declined Requests</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-yellow-50">
                  <Clock size={24} className="text-yellow-500" />
                </div>
                <TrendingUp size={20} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {loading ? "..." : metrics.pending}
              </h3>
              <p className="text-gray-600 mb-2">Pending Requests</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Request Distribution</h2>
                <p className="text-gray-600">Breakdown of all farmer requests</p>
              </div>
              <div className="text-right">
                <h3 className="text-2xl font-bold text-[#2D4533]">{metrics.total}</h3>
                <p className="text-gray-600">Total Requests</p>
              </div>
            </div>

            <div className="space-y-4">
              {chartData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{item.name}</span>
                    <span className="text-gray-600">
                      {item.value} ({getPercentage(item.value)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full"
                      style={{ 
                        width: `${getPercentage(item.value)}%`,
                        backgroundColor: item.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-4">
                {chartData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  to="/admin/requests" 
                  className="block w-full px-4 py-3 bg-[#2D4533] text-white rounded-lg hover:bg-[#37503F] transition-colors text-center"
                >
                  Manage Requests
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Requests</span>
                  <span className="font-medium text-gray-900">{metrics.pending}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Approval Rate</span>
                  <span className="font-medium text-green-600">
                    {metrics.total > 0 ? Math.round((metrics.approved / metrics.total) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">System Active</span>
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
