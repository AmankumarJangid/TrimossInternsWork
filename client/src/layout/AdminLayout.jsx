import React from "react";
// import Navbar from "../components/Navbar"; // adjust path as needed
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
