/* eslint-disable no-unused-vars */
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import image from '../../assets/Login-pana.svg'
import { CourseData } from '../../context/CourseContext'
import { UserData } from '../../context/UserContext'
import ForgetPass from '../ForgetPass/forgetpass'

const Login = () => {
    const navigate = useNavigate();
    const { btnLoading, loginUser } = UserData();
    const { fetchMyCourse } = CourseData();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        await loginUser(email, password, navigate, fetchMyCourse);
    };

    return (
  <div className="flex items-start lg:items-center justify-center h-auto md:min-h-0 lg:min-h-screen bg-white px-4 py-6 md:py-10 lg:py-10">
    <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-3xl shadow-lg overflow-hidden border border-gray-100 bg-white">
      {/* Image Section */}
      <div className="md:w-1/2 bg-[#E3F2FD] flex items-center justify-center p-6 sm:p-8">
        <img
          src={image}
          alt="Login Illustration"
          className="w-full max-w-xs sm:max-w-sm object-contain"
        />
      </div>

      {/* Form Section */}
      <div className="md:w-1/2 px-6 sm:px-10 py-8 sm:py-12 flex flex-col justify-center bg-white">
        <h2 className="text-3xl font-bold text-[#1E88E5] mb-1 text-center md:text-left">
          Welcome Back!
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center md:text-left">
          Sign in to continue your learning journey.
        </p>

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="text-sm text-gray-700 font-medium block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-[#1E88E5]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={btnLoading}
            className={`w-full py-2 rounded-lg font-semibold text-white transition duration-200 ${
              btnLoading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-[#1E88E5] hover:bg-[#1565C0]"
            }`}
          >
            {btnLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm gap-2">
          <button
            onClick={() => setShowResetPassword(true)}
            className="text-[#1E88E5] hover:underline"
          >
            Forgot Password?
          </button>
          <Link
            to="/register"
            className="text-[#1E88E5] hover:underline"
          >
            Don’t have an account?
          </Link>
        </div>
      </div>
    </div>

    {/* Reset Password Modal */}
    {showResetPassword && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
        <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl relative">
          <button
            onClick={() => setShowResetPassword(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
          >
            ✕
          </button>
          <ForgetPass />
        </div>
      </div>
    )}
  </div>
);

};

export default Login;
