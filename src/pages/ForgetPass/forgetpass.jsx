/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { server } from '../../main'; // Import server variable

const ForgetPass = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetStep, setResetStep] = useState('email'); // 'email' or 'otp'

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        `${server}/api/user/forgot-password`, // Use server variable
        { email }
      );
      console.log('Email Submit Response:', response.data); // Debug log
      setMessage('OTP sent to your email. Please check your inbox.');
      setResetStep('otp');
      localStorage.setItem('resetToken', response.data.resetToken); // Assuming resetToken is returned
    } catch (err) {
      console.error('Error Sending OTP:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const resetToken = localStorage.getItem('resetToken');
    if (!resetToken) {
      setError('Reset token is missing. Please restart the process.');
      return;
    }

    try {
      const response = await axios.post(
        `${server}/api/user/reset-password`, // Use server variable
        {
          resetToken,
          otp,
          newPassword,
        }
      );
      console.log('Reset Password Response:', response.data); // Debug log
      setMessage('Password reset successfully!');
      setResetStep('email'); // Reset to the initial step
      setEmail(''); // Clear form fields
      setOtp('');
      setNewPassword('');
      localStorage.removeItem('resetToken'); // Clean up
    } catch (err) {
      console.error('Error Resetting Password:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (

    <div className="forget-pass-container max-w-md w-full p-8 space-y-6 bg-white border border-gray-100 rounded-3xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-[#1E88E5]">Reset Your Password</h2>
      <p className="text-sm text-gray-600 text-center">
        Enter your registered email and follow the steps to reset your password.
      </p>

      {message && <p className="text-green-600 text-center text-sm">{message}</p>}
      {error && <p className="text-red-600 text-center text-sm">{error}</p>}

      {resetStep === 'email' ? (
        <form className="space-y-4" onSubmit={handleEmailSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg font-semibold text-white bg-[#1E88E5] hover:bg-[#1565C0] transition duration-200"
          >
            Send OTP
          </button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleResetSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg font-semibold text-white bg-[#1E88E5] hover:bg-[#1565C0] transition duration-200"
          >
            Reset Password
          </button>
        </form>
      )}
    </div>
  );

};

export default ForgetPass;