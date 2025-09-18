// src/admin/components/AdminDashboardHeader.jsx
import React from "react";
import { Menu } from "lucide-react";

const AdminDashboardHeader = ({ onToggleSidebar }) => {
  return (
    
      <button
        onClick={onToggleSidebar}
        className="md:hidden p-2 rounded-md hover:bg-gray-100"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>
     
    
  );
};

export default AdminDashboardHeader;
