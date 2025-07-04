/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BsFillChatRightTextFill,
  BsInfoCircleFill,
} from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import {
  FaBook,
  FaCartArrowDown,
  FaUserAlt,
} from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { IoMdHome, IoMdLogOut } from "react-icons/io";
import { IoSchool } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";

const getRoleTheme = (role) => {
  switch (role) {
    case "admin":
      return {
        bg: "bg-[#C68642]",
        hover: "hover:bg-[#F1CFA4]",
        ring: "ring-[#8D5524]",
        border: "border-[#8D5524]",
        text: "text-[#C68642]",
      };
    case "instructor":
      return {
        bg: "bg-blue-800",
        hover: "hover:bg-blue-200",
        ring: "ring-blue-700",
        border: "border-blue-800",
        text: "text-blue-800",
      };
    default:
      return {
        bg: "bg-sky-400",
        hover: "hover:bg-sky-100",
        ring: "ring-sky-300",
        border: "border-sky-400",
        text: "text-sky-600",
      };
  }
};

function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logoutUser } = UserData();

  const theme = getRoleTheme(user?.role);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, handleClickOutside]);

  const getInitials = (name) => {
    if (!name) return "";
    const [firstName, lastName] = name.split(" ");
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const MenuItem = ({ to, icon, label }) => (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 text-sm text-gray-700 ${theme.hover} hover:border-l-4 ${theme.border}`}
      onClick={toggleDropdown}
    >
      {icon}
      {label}
    </Link>
  );

  const MenuItemBtn = ({ onClick, icon, label, className = "" }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-200 hover:rounded-lg hover:border-l-4 ${theme.border} ${className}`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div ref={dropdownRef} className="relative">
      <div
        className={`flex items-center gap-1 px-2 py-1 rounded-full cursor-pointer shadow-sm ${theme.ring} ring-2`}
        onClick={toggleDropdown}
      >
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={user?.name || "User"}
            className="w-8 h-8 object-cover rounded-full"
          />
        ) : (
          <div
            className={`w-8 h-8 rounded-full ${theme.bg} flex items-center justify-center text-white text-xs font-semibold`}
            title={user?.name || "User"}
          >
            {getInitials(user?.name || "")}
          </div>
        )}
        <FiChevronDown className="text-gray-700" />
      </div>

      {isOpen && (
        <div
          className={`dropdown-content absolute right-0 w-56 bg-white rounded-2xl shadow-xl border ${theme.border} z-50`}
        >
          <div className="p-4 pt-3 pb-2 text-center">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user?.name || "User"}
                className="w-16 h-16 rounded-full mx-auto border-4 border-white transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div
                className={`w-16 h-16 rounded-full ${theme.bg} flex items-center justify-center text-white text-xl mx-auto border-4 border-white`}
                title={user?.name || "User"}
              >
                {getInitials(user?.name || "")}
              </div>
            )}
            <h2 className="text-sm font-semibold mt-2">{user?.name || "User"}</h2>
          </div>

          <div className="py-1">
            <MenuItem to="/" icon={<IoMdHome />} label="Home" />

            {user?.role === "admin" && (
              <>
                <MenuItem to="/admin/course" icon={<FaBook />} label="Courses" />
                <MenuItem to="/admin/users" icon={<FaUserAlt />} label="Users" />
                <MenuItem to='/admin/dashboard' icon={<MdDashboard />} label="Admin Dashboard"/>
              </>
            )}

            {user?.role === "user" && (
              <>
                <MenuItem to="/my-courses" icon={<IoSchool />} label="My Courses" />
                <MenuItem
                  to="/purchase-history"
                  icon={<FaCartArrowDown />}
                  label="Purchase History"
                />
              </>
            )}

            {user?.role === "instructor" && (
              <>
                <MenuItem
                  to="/instructor/dashboard"
                  icon={<MdDashboard />}
                  label="Instructor Dashboard"
                />
                <MenuItem
                  to="/instructor/payoutreport"
                  icon={<BsFillChatRightTextFill />}
                  label="Payment Report"
                />
                <MenuItem to="/instructor/course" icon={<FaBook />} label="Courses" />
                <MenuItem to="/instructor/students" icon={<FaUserAlt />} label="Students" />
              </>
            )}

            <MenuItem to="/profile" icon={<CgProfile />} label="Profile" />
            <MenuItem to="/about" icon={<BsInfoCircleFill />} label="About" />

            <div className="border-t border-gray-200 my-1" />

            <MenuItemBtn
              onClick={() => logoutUser(navigate)}
              icon={<IoMdLogOut />}
              label="Logout"
              className="text-red-600 hover:bg-red-100 hover:border-red-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;
