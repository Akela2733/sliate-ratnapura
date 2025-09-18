import React, { useState, useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiHome, FiBook, FiUsers, FiInfo, FiCalendar, FiPhone } from "react-icons/fi";
import AuthContext from "../context/AuthContext";

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const pages = [
    { name: "Home", icon: <FiHome />, path: "/" },
    { name: "About", icon: <FiInfo />, path: "/about" },
    { name: "Courses", icon: <FiBook />, path: "/courses" },
    { name: "Staff", icon: <FiUsers />, path: "/staff" },
    { name: "News", icon: <FiCalendar />, path: "/news" },
    { name: "Events", icon: <FiCalendar />, path: "/events" },
    { name: "Contact", icon: <FiPhone />, path: "/contact" },
  ];

  return (
    <header className="w-full shadow-md sticky top-0 z-50 bg-white">
      {/* Top Bar */}
      <div className="bg-primary text-white py-1 px-3 sm:px-6 md:px-18 text-center md:text-left text-xs sm:text-sm md:text-base">
        INQUIRIES: 045 22 31 492 / 045 22 31 493
      </div>

      {/* Main Navigation */}
      <nav className="flex justify-between items-center py-3 px-4 sm:px-6 md:px-18 relative">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="logo"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
          />
          <span className="hidden md:inline text-lg text-primary font-bold">
            ATI Ratnapura
          </span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-8 font-medium">
          {pages.map((page) => (
            <li key={page.name}>
              <NavLink
                to={page.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-primary font-semibold border-b-2 border-primary"
                    : "text-gray-700 hover:text-primary transition"
                }
              >
                {page.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop Auth */}
        <div className="hidden md:flex gap-4">
          {isAuthenticated ? (
            <>
              {/* {user?.role === "admin" && (
                <Link
                  to="/add-course"
                  className="hover:text-primary text-gray-600"
                >
                  Add Course
                </Link>
              )} */}
              <button
                onClick={handleLogout}
                className="hover:text-primary text-gray-600"
              >
                Logout ({user?.username})
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-primary text-gray-600">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-2xl text-gray-800"
          onClick={() => setMenuOpen(true)}
        >
          <FiMenu />
        </button>

        {/* Overlay + Side Drawer */}
        {menuOpen && (
          <>
            {/* Dark Overlay */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
              onClick={() => setMenuOpen(false)}
            />

            {/* Fancy Side Drawer */}
            <div className="fixed top-0 left-0 w-3/4 max-w-xs h-full bg-gradient-to-b from-white via-gray-50 to-gray-100 shadow-2xl z-50 p-6 flex flex-col animate-slide-in">
              {/* Drawer Header */}
              <div className="flex justify-between items-center mb-6">
                <img src="/logo.png" alt="logo" className="w-10 h-10" />
                <button
                  className="text-3xl text-gray-600 hover:text-primary transition-transform transform hover:rotate-90"
                  onClick={() => setMenuOpen(false)}
                >
                  <FiX />
                </button>
              </div>

              {/* Navigation Links */}
              <ul className="flex flex-col gap-4 text-base font-medium">
                {pages.map((page) => (
                  <li key={page.name}>
                    <NavLink
                      to={page.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-2 rounded-lg transition-all ${
                          isActive
                            ? "bg-primary text-white"
                            : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                        }`
                      }
                      onClick={() => setMenuOpen(false)}
                    >
                      {page.icon}
                      {page.name}
                    </NavLink>
                  </li>
                ))}
              </ul>

              {/* Auth Section */}
              <div className="border-t border-gray-200 pt-4 mt-auto">
                {isAuthenticated ? (
                  <>
                    {/* {user?.role === "admin" && (
                      <Link
                        to="/add-course"
                        className="block text-gray-700 hover:text-primary mb-2"
                        onClick={() => setMenuOpen(false)}
                      >
                        Add Course
                      </Link>
                    )} */}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left text-gray-700 hover:text-primary"
                    >
                      Logout ({user?.username})
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block text-gray-700 hover:text-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
