import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.jpg';
import { UserData } from "../../context/UserContext";
import DropdownMenu from '../../pages/Dropdownmenu/dropdown.jsx';

const Header = ({ isAuth, handleLogout }) => {
  const { user } = UserData();

  return (
    <header className="bg-gradient-to-r from-[#1E3A8A] to-[#1E88E5] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <img
            src={Logo}
            alt="TechMomentum Logo"
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
          <h1 className="text-xl font-bold">TechMomentum</h1>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
          {/* Main Nav Links (visible on sm and up) */}
          <nav className="hidden sm:flex items-center gap-6">
            <Link to="/" className="hover:text-blue-100 transition">Home</Link>
            <Link to="/about" className="hover:text-blue-100 transition">About</Link>

            {!isAuth ? (
              <Link to="/login" className="hover:text-blue-100 transition">Login</Link>
            ) : (
              <>
                {user?.role === "user" && (
                  <Link to="/my-courses" className="hover:text-blue-100 transition">My Courses</Link>
                )}
                {user?.role === "admin" && (
                  <Link to="/admin/dashboard" className="hover:text-blue-100 transition">Admin Dashboard</Link>
                )}
                {user?.role === "instructor" && (
                  <Link to="/instructor/dashboard" className="hover:text-blue-100 transition">Instructor Dashboard</Link>
                )}
                {/* Dropdown visible for logged-in users */}
                <DropdownMenu user={user} setIsAuth={handleLogout} />
              </>
            )}
          </nav>

          {/* Mobile View: Only show Login or Dropdown */}
          <div className="sm:hidden">
            {isAuth ? (
              <DropdownMenu user={user} setIsAuth={handleLogout} />
            ) : (
              <Link to="/login" className="hover:text-blue-100 transition">Login</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
