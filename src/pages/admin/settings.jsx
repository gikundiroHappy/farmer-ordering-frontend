import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import { 
  Settings, 
  TrendingUp, 
  Save,
  History,
  CheckCircle
} from "lucide-react";

export default function SettingsPage() {
  const [rate, setRate] = useState("");
  const [currentRate, setCurrentRate] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [rateHistory, setRateHistory] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCurrentRate();
    fetchRateHistory();
  }, [token]);

  const fetchCurrentRate = async () => {
    try {
      const res = await API.get("/admin/rate", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentRate(res.data.rate?.value || 0);
    } catch (err) {
      console.error("Error fetching rate:", err);
    }
  };

  const fetchRateHistory = async () => {
    try {
      const res = await API.get("/admin/rate-history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRateHistory(res.data.history || []);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rate || parseFloat(rate) <= 0) {
      setMessage("Please enter a valid rate");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await API.post("/admin/rate", 
        { value: parseFloat(rate) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage("Rate updated successfully!");
      setCurrentRate(parseFloat(rate));
      setRate("");
      fetchRateHistory();
      
      setTimeout(() => setMessage(""), 3000);
      
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update rate");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-[#2D4533]">System Settings</h1>
            </div>
            <p className="text-gray-600">Manage fertilizer calculation rate and system preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Update Fertilizer Rate</h2>
                
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Current Rate</p>
                      <p className="text-3xl font-bold text-[#2D4533]">
                        {currentRate} <span className="text-lg">bags/hectare</span>
                      </p>
                    </div>
                    <TrendingUp size={32} className="text-blue-500" />
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Rate (bags per hectare)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter new rate"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#37503F] focus:ring-2 focus:ring-[#37503F]/20 outline-none"
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <span className="text-gray-500 font-medium">bags/ha</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      This rate determines how much fertilizer farmers receive per hectare of land
                    </p>
                  </div>

                  {message && (
                    <div className={`p-3 rounded-lg border ${
                      message.includes("successfully") 
                        ? "bg-green-50 border-green-200" 
                        : "bg-red-50 border-red-200"
                    }`}>
                      <div className="flex items-center gap-2">
                        {message.includes("successfully") && <CheckCircle size={16} className="text-green-500" />}
                        <p className={
                          message.includes("successfully") 
                            ? "text-green-700" 
                            : "text-red-700"
                        }>
                          {message}
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !rate || parseFloat(rate) <= 0}
                    className="w-full bg-gradient-to-r from-[#37503F] to-[#2D4533] text-white py-3 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Update Rate
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <History size={20} className="text-gray-600" />
                  <h3 className="text-lg font-bold text-gray-900">Rate History</h3>
                </div>
                
                {rateHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No rate changes yet</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {rateHistory.slice(0, 5).map((record, index) => (
                      <div 
                        key={index} 
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-900">
                            {record.value} bags/ha
                          </span>
                          {index === 0 && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatDate(record.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-[#37503F] to-[#2D4533] rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-3">About This Rate</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>Determines fertilizer allocation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>Applied to all new orders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>Doesn't affect existing orders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>Changes are logged for transparency</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
