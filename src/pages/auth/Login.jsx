import React, { useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { phoneNumber, otp });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      res.data.role === "ADMIN" ? navigate("/admin/dashboard") : navigate("/farmer/dashboard");
    } catch {
      setError("Invalid phone number or OTP");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      <div className="hidden md:flex relative">
        <img
          src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
          className="w-full h-full object-cover"
          alt="Farmer"
        />
        <div className="absolute inset-0 bg-[#37503F]/70 flex items-center px-12">
          <div className="text-white">
            <h1 className="text-4xl font-semibold mb-4">
              Welcome Back
            </h1>
            <p className="text-sm opacity-90">
              Login to manage your fertilizer requests and approvals.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl"
        >
          <h2 className="text-2xl font-semibold mb-2 text-[#37503F]">
            Login
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Access your account
          </p>

          {error && (
            <div className="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm mb-1 text-gray-600">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="e.g. 078xxxxxxx"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37503F]"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-1 text-gray-600">
              OTP
            </label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37503F]"
              required
            />
          </div>

          <button className="w-full bg-[#37503F] text-white py-3 rounded-lg hover:opacity-90 transition">
            Login
          </button>

          <p className="text-sm text-center mt-6">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-[#37503F] font-semibold cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
