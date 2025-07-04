import React from "react";
import { AiFillHome } from "react-icons/ai";
import { FaBook, FaUserAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/admin/dashboard", icon: <AiFillHome size={24} />, label: "Dashboard" },
    { path: "/admin/course", icon: <FaBook size={24} />, label: "Course" },
    { path: "/admin/users", icon: <FaUserAlt size={24} />, label: "Users" },
  ];

  return (
    <div className="h-full">
      {/* Sidebar - always expanded on large screens */}
      <div className="h-full w-64 bg-gray-900 text-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-5 flex items-center justify-between border-b border-gray-700">
            <span className="font-bold text-xl">Admin Panel</span>
          </div>

          {/* Sidebar Menu */}
          <ul className="mt-6 space-y-2 flex-grow">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center p-5 hover:bg-gray-800 transition-all ${
                    location.pathname === item.path ? "bg-gray-800 border-l-4 border-blue-500" : ""
                  }`}
                >
                  <div className="text-xl">{item.icon}</div>
                  <span className="ml-4 text-lg">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          
          
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
