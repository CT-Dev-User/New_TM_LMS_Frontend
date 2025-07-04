import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Added toast import
import image from '../../assets/Animation-verify.gif';
import { UserData } from '../../context/UserContext';

const Verify = () => {
  const [otp, setOtp] = useState("");
  const { verifyOtp } = UserData();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const result = await verifyOtp(otp, navigate);
      if (result && result.message === "User registered successfully") {
        toast.success("Account verified and user registered!");
        navigate('/login');
      } else {
        setErrorMessage("Verification failed. Please check your OTP.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred during verification. Please try again.");
      }
    }
  }

  return (
  <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
    {/* Image Container */}
    <div className="w-full lg:w-1/2 flex justify-center mb-10 lg:mb-0 lg:mr-10">
      <img 
        src={image} 
        alt="Verification illustration" 
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg object-contain"
      />
    </div>

    {/* Form Container */}
    <div className="w-full max-w-md p-8 space-y-6 bg-white border border-gray-100 rounded-3xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-[#1E88E5]">Verify Account</h2>

      {errorMessage && (
        <p className="text-center text-sm text-red-500">{errorMessage}</p>
      )}

      <form className="space-y-5" onSubmit={submitHandler}>
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
            Enter OTP
          </label>
          <input 
            type="text" 
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required 
            placeholder="Enter OTP"
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] placeholder-gray-400"
          />
        </div>

        <button 
          type="submit"
          className="w-full py-2 rounded-lg font-semibold text-white bg-[#1E88E5] hover:bg-[#1565C0] transition duration-200"
        >
          Verify
        </button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Go to <Link to="/login" className="text-[#1E88E5] hover:underline">Login</Link> page
      </p>
    </div>
  </div>
);

}

export default Verify;