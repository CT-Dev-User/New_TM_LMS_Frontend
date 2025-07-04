import { AiOutlineBook } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { CiMoneyCheck1 } from "react-icons/ci";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

function Sidebar({ user, course }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCourseClick = (course) => {
    if (!course._id || !course.title) return;
    const safeTitle = encodeURIComponent(course.title.replace(/ /g, "-").toLowerCase());
    navigate(`/${safeTitle}/lectures/${course._id}`, {
      state: { course },
    });
  };

  const menuItems = [
    { icon: <MdOutlineDashboardCustomize size={24} />, label: "Home", link: "/" },
    { icon: <CiMoneyCheck1 size={24} />, label: "Purchase History", link: "/purchase-history" },
    { icon: <BsPersonCircle size={24} />, label: "Profile", link: "/profile" },
  ];

  // ✅ Only render for users
  if (!user || user.role !== "user") return null;

  return (
    <aside className="hidden lg:flex w-64 h-screen flex-col bg-black text-white shadow-lg border-r border-blue-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <span className="font-bold text-lg">User Panel</span>
      </div>

      {/* Profile */}
      <div className="p-4 flex flex-col items-center">
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-20 h-20 rounded-full border-4 border-sky-500"
          />
        ) : (
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl bg-sky-500">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <h2 className="text-lg mt-2 text-center text-sky-600">{user.name}</h2>
        <p className="text-sm text-gray-300 text-center">{user.email}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto max-h-full">
        <ul className="space-y-6 px-2">
          {/* My Courses */}
          <li>
            <div
              className="flex items-center gap-4 px-4 py-2 cursor-pointer hover:bg-sky-200 hover:text-black rounded-lg transition"
              onClick={() => navigate("/my-courses")}
            >
              <AiOutlineBook size={24} />
              <span>My Courses</span>
            </div>

            {/* Courses List (only visible if already on /my-courses page) */}
            {location.pathname === "/my-courses" && (
              <ul className="ml-4 space-y-2 overflow-y-auto scrollbar-hidden mt-2">
                {course.map((c) => (
                  <li
                    key={c.id}
                    className="cursor-pointer px-4 py-2 bg-sky-500 hover:bg-sky-200 hover:text-black rounded-lg transition shadow-md"
                    onClick={() => handleCourseClick(c)}
                  >
                    {c.title}
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Other Menu Items */}
          {menuItems.map((item, index) => (
            <NavLink key={index} to={item.link}>
              <li className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-sky-200 hover:text-black rounded-lg transition-colors duration-300">
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </li>
            </NavLink>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
