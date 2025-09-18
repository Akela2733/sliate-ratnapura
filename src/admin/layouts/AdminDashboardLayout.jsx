// src/admin/layouts/AdminDashboardLayout.jsx
import React, { useEffect, useContext, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Newspaper, Calendar, Users, MessageSquare, LogOut, Menu, X, GraduationCap // Added GraduationCap icon
} from 'lucide-react';
import AuthContext from '../../context/AuthContext'; 

const AdminDashboardLayout = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]); 

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminNavItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "Manage Students", icon: GraduationCap, path: "/admin/manage-students" }, // NEW: Link to Manage Students
    { name: "Manage Courses", icon: BookOpen, path: "/admin/manage-courses" },
    { name: "Manage News", icon: Newspaper, path: "/admin/manage-news" },
    { name: "Manage Events", icon: Calendar, path: "/admin/manage-events" },
    { name: "Manage Staff", icon: Users, path: "/admin/manage-staff" },
    // { name: "View Messages", icon: MessageSquare, path: "/admin/contact-messages" },
  ];

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-inter"> 
      {/* Sidebar - Responsive */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-br from-[#0A174E] to-[#1C3AA9] text-white flex flex-col shadow-2xl p-6
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex`} 
      >
        <div className="text-center pb-8 mb-8 border-b border-blue-700/50">
          <h2 className="text-3xl font-extrabold text-[#F5F8FF] tracking-wide">Admin Panel</h2>
          <p className="text-sm text-blue-200 mt-2">Content Management</p>
        </div>
        <nav className="flex-grow space-y-3">
          <ul className="space-y-3">
            {adminNavItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] group
                    ${location.pathname === item.path || (item.path === "/admin" && location.pathname === "/admin-dashboard")
                      ? 'bg-white text-[#1C3AA9] shadow-lg font-bold'
                      : 'hover:bg-blue-700/30 text-blue-100 hover:text-white font-medium'
                    }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className={`w-6 h-6 mr-4 ${location.pathname === item.path || (item.path === "/admin" && location.pathname === "/admin-dashboard") ? 'text-[#1C3AA9]' : 'text-blue-300 group-hover:text-white'}`} />
                  <span className="text-lg">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-blue-700/50 mt-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2 rounded-xl bg-red-600 hover:bg-red-700 transition-all duration-300 text-lg font-semibold shadow-md transform hover:scale-[1.02]"
          >
            <LogOut className="w-6 h-6 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Backdrop for small screens when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden  ">
        {/* <header className="bg-white shadow-md p-5 flex justify-between items-center border-b border-gray-200"> */}
          {/* Hamburger menu for small screens */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          {/* <h1 className="text-2xl font-bold text-[#0A174E] flex-grow text-center md:text-left">
            {adminNavItems.find(item => location.pathname.startsWith(item.path))?.name || "Dashboard"}
          </h1> */}
          {/* <span className="text-gray-600 font-medium hidden md:block">Logged in as: {user?.username || 'Admin'}</span> */}
        {/* </header> */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
