import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - only visible on large screens (lg and above) */}
      <div className="hidden lg:block h-screen sticky top-0">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};

export default Layout;
