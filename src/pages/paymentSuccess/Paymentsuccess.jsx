import React from 'react';
import { Link, useParams } from 'react-router-dom';

const Paymentsuccess = ({ user }) => {
  const params = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {user ? (
        <div className="bg-gray-950/70 backdrop-blur-md rounded-2xl shadow-2xl p-10 max-w-md w-full text-center border border-gray-700">
          {/* Success Icon */}
          <div className="mb-6">
            <svg
              className="w-20 h-20 mx-auto text-green-400 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h2 className="text-3xl font-extrabold text-white mb-3">Payment Successful</h2>
          <p className="text-gray-300 text-base mb-1">
            Your course subscription has been <span className="text-green-400 font-medium">activated</span>.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Reference ID: <span className="text-indigo-400 font-semibold">{params.id}</span>
          </p>

          {/* Button */}
          <Link
            to={`/${user._id}/dashboard`}
            className="inline-block bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:from-indigo-600 hover:to-blue-700 hover:scale-105 transform transition-all duration-300"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="bg-gray-900/80 backdrop-blur-md rounded-xl shadow-lg p-10 max-w-md w-full text-center border border-red-500/30">
          <h2 className="text-3xl font-bold text-red-400 mb-3">Access Denied</h2>
          <p className="text-gray-300 text-base">Please log in to view this page.</p>
        </div>
      )}
    </div>
  );
};

export default Paymentsuccess;