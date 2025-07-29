import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? 'font-bold text-blue-300' : ''}>Dashboard</NavLink>
          <NavLink to="/admin/add-product" className={({ isActive }) => isActive ? 'font-bold text-blue-300' : ''}>Add Product</NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'font-bold text-blue-300' : ''}>Orders</NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
