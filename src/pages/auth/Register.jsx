import React, { useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle } from "lucide-react";
import Background from '../../assets/images/background.jpg'

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/register", {
        fullName,
        phoneNumber,
      });
      setLoading(false);
      setMessage({
        type: "success",
        text: res.data.message,
      });
      setTimeout(() => navigate("/"), 1500);

    } catch (err) {
      setLoading(false);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Registration failed",
      });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      
      <div className="flex items-center justify-center px-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl"
        >
          <h2 className="text-2xl font-semibold mb-2 text-[#37503F]">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Register to access fertilizer services
          </p>

          {message.text && (
            <div
              className={`mb-4 flex items-center gap-3 rounded-lg px-4 py-3 text-sm
                ${message.type === "success" ? "border border-green-200 bg-green-50 text-green-700" : "border border-red-200 bg-red-50 text-red-700"}`}
            >
              {message.type === "success" ? ( <CheckCircle size={20} /> ) : ( <AlertCircle size={20} />)} <span>{message.text}</span>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm mb-1 text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37503F]"
              required
            />
          </div>

          <div className="mb-6">
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

          <button className="w-full bg-[#37503F] text-white py-3 rounded-lg hover:opacity-90 transition" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-sm text-center mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/")}
              className="text-[#37503F] font-semibold cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      </div>

      <div className="hidden md:flex relative">
        <img
          src={Background}
          className="w-full h-full object-cover"
          alt="Farmer"
        />
        <div className="absolute inset-0 bg-[#37503F]/70 flex items-center px-12">
          <div className="text-white">
            <h1 className="text-4xl font-semibold mb-4">
              Welcome, Farmer 
            </h1>
            <p className="text-sm opacity-90">
              Join the system and manage your fertilizer requests with ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
