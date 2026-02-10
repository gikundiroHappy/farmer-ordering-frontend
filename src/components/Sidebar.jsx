import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  FilePlus, 
  ListOrdered,
  Settings,
  FileText,
  Settings2
} from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const role = localStorage.getItem("role") || role; // Fallback to prop if localStorage is not set

  const navItems = {
    FARMER: [
      {
        path: "/farmer/dashboard",
        icon: <LayoutDashboard size={22} />,
        label: "Dashboard",
      },
      {
        path: "/farmer/create-order",
        icon: <FilePlus size={22} />,
        label: "New Order",
      },
      {
        path: "/farmer/orders",
        icon: <ListOrdered size={22} />,
        label: "My Orders",
      },
    ],
    ADMIN: [
      {
        path: "/admin/dashboard",
        icon: <LayoutDashboard size={22} />,
        label: "Dashboard",
      },
      {
        path: "/admin/requests",
        icon: <FileText size={22} />,
        label: "Requests",
      },
      {
        path: "/admin/settings",
        icon: <Settings2 size={22} />,
        label: "Settings",
      },
    ],
  };

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-gradient-to-r from-[#37503F] to-[#2D4533] text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#37503F] font-bold text-lg">🌱</span>
          </div>
          <span className="font-bold text-lg">AgriOrder</span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-white/10 transition-colors" >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside
        className={`
          fixed md:relative z-40 bg-gradient-to-b from-[#2D4533] to-[#37503F] 
          text-white h-screen transition-all duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          w-64
          md:translate-x-0 shadow-2xl
        `}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-[#37503F] font-bold text-2xl">🌱</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold">AgriOrder</h1>
                  <p className="text-xs text-white/70">Farm Management</p>
                </div>
              </div>
          </div>
        </div>

        <nav className="px-4 py-2 md:py-6">
          <div className="space-y-1">
            {navItems[role]?.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive ? "bg-white/20 text-white shadow-lg" : "text-white/80 hover:bg-white/10 hover:text-white"}`
                }
              >
                <div className="mr-3">
                  {item.icon}
                </div>
                  <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}
