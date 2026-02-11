import React, { useState, useMemo } from "react";
import { LogOut, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const role = localStorage.getItem("role") || role;

  const userInitial = useMemo(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        return user.name?.charAt(0)?.toUpperCase() || (role === "ADMIN" ? "A" : "F");
      }
    } catch {
      return
    }
    return role === "ADMIN" ? "A" : "F";
  }, [role]);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="px-6 h-16  md:h-20 flex items-center justify-end">

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#37503F] to-[#4a6b57] flex items-center justify-center text-white font-bold text-lg">
              {userInitial}
            </div>
            
            <div className="hidden md:block text-left">
              <p className="font-semibold text-gray-800">
                {role === "ADMIN" ? "Admin" : "Farmer"}
              </p>
              <p className="text-sm text-gray-500">Welcome back!</p>
            </div>
            
            <ChevronDown 
              size={20} 
              className={`text-gray-500 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              />
              
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#37503F] to-[#4a6b57] flex items-center justify-center text-white font-bold text-xl">
                      {userInitial}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {role === "ADMIN" ? "Administrator Account" : "Farmer Account"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {role === "ADMIN" ? "Full system access" : "Order management"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 mt-1"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
