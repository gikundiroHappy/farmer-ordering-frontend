import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import { 
  Calculator, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Loader2
} from "lucide-react";

export default function CreateOrder() {
  const [landArea, setLandArea] = useState("");
  const [message, setMessage] = useState("");
  const [latestRate, setLatestRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [calculatedFertilizer, setCalculatedFertilizer] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await API.get("/admin/rate", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLatestRate(res.data.rate?.value || 0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRate();
  }, [token]);

  useEffect(() => {
    if (landArea && latestRate > 0) {
      const calculated = parseFloat(landArea) * latestRate;
      setCalculatedFertilizer(Math.round(calculated * 100) / 100);
    } else {
      setCalculatedFertilizer(0);
    }
  }, [landArea, latestRate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!landArea || parseFloat(landArea) <= 0) {
      setMessage("Please enter a valid land area");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await API.post(
        "/orders",
        { landArea: parseFloat(landArea) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage(`Order submitted successfully! Fertilizer Qty: ${res.data.order.fertilizerQty} bags`);
      setLandArea("");
      setCalculatedFertilizer(0);
      
      setTimeout(() => setMessage(""), 5000);
      
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to submit order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="pt-10 lg:pt-20 flex items-center justify-center ">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#2D4533] to-[#37503F] flex items-center justify-center shadow-lg">
              <Calculator size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#2D4533] mb-2">
              Create Order
            </h1>
            <p className="text-gray-600">
              Enter your land area to request fertilizer
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Land Area (hectares)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Enter land area"
                      value={landArea}
                      onChange={(e) => setLandArea(e.target.value)}
                      className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-[#37503F] focus:ring-2 focus:ring-[#37503F]/20 outline-none transition-all bg-gray-50"
                      required
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <span className="text-gray-500 font-medium">ha</span>
                    </div>
                  </div>
                </div>

                {landArea && latestRate > 0 && (
                  <div className="bg-gradient-to-r from-[#F0F7F4] to-[#E8F5E9] p-4 rounded-xl border border-[#A7BEAF]">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">You will receive</p>
                        <p className="text-2xl font-bold text-[#37503F]">
                          {calculatedFertilizer} <span className="text-lg">bags</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">For</p>
                        <p className="text-lg font-semibold text-gray-900">{landArea} ha</p>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      {calculatedFertilizer < 50 ? "Small order" : 
                       calculatedFertilizer < 200 ? "Medium order" : 
                       "Large order"}
                    </div>
                  </div>
                )}

                {message && (
                  <div className={`p-4 rounded-xl border ${
                    message.includes("successfully") ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                  }`}>
                    <div className="flex items-start gap-3">
                      {message.includes("successfully") ? (
                        <CheckCircle size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                      )}
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
                  disabled={loading || !landArea || parseFloat(landArea) <= 0}
                  className="w-full bg-gradient-to-r from-[#37503F] to-[#2D4533] text-white py-4 rounded-xl font-semibold text-lg hover:from-[#2D4533] hover:to-[#1E3527] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit Order
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Orders will be reviewed and approved by administrators
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}