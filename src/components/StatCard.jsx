import React from "react";

export default function StatCard({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-[#37503F]">{value}</p>
    </div>
  );
}
