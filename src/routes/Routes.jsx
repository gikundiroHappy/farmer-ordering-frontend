import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import CreateOrder from "../pages/farmer/CreateOrder";
import MyOrders from "../pages/farmer/MyOrders";
import Dashboard from "../pages/admin/Dashboard";
import Requests from '../pages/admin/Requests';
import FarmerDashboard from '../pages/farmer/Dashboard';
import SettingsPage from '../pages/admin/settings';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/farmer/orders" element={<MyOrders />} />
        <Route path="/farmer/create-order" element={<CreateOrder />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/requests" element={<Requests />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
