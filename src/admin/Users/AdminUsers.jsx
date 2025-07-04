import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { server } from '../../main';
import Layout from '../Utils/Layout';

const AdminUsers = ({ user }) => {
  const navigate = useNavigate();
  if (user && user.role !== "admin") return navigate("/");

  const [users, setUsers] = useState([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  async function fetchUsers() {
    try {
      const { data } = await axios.get(`${server}/api/users`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    }
  }

  useEffect(() => {
    fetchUsers();
    fetchWithdrawalRequests();
  }, []);

  const updateRole = async (id, currentRole) => {
    const newRole = prompt(
      `Current role: ${currentRole}\nEnter new role (user, admin, instructor):`,
      currentRole
    );

    if (!newRole) return;

    const validRoles = ["user", "admin", "instructor"];
    if (!validRoles.includes(newRole.toLowerCase())) {
      toast.error("Invalid role. Please enter 'user', 'admin', or 'instructor'.");
      return;
    }

    if (newRole.toLowerCase() === currentRole.toLowerCase()) {
      toast.info("Role unchanged.");
      return;
    }

    if (confirm(`Are you sure you want to update this user's role to "${newRole}"?`)) {
      try {
        const { data } = await axios.put(
          `${server}/api/user/${id}`,
          { role: newRole.toLowerCase() },
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );
        toast.success(data.message);
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    }
  };

  async function fetchWithdrawalRequests() {
    try {
      const { data } = await axios.get(`${server}/api/withdrawal-requests`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setWithdrawalRequests(data.requests || []);
    } catch (error) {
      console.error("Error fetching withdrawal requests:", error);
      toast.error("Failed to fetch withdrawal requests.");
    }
  }

  const handleWithdrawalAction = async (requestId, action) => {
    try {
      const { data } = await axios.put(
        `${server}/api/withdrawal-requests/${requestId}`,
        { status: action },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      toast.success(data.message || `Request ${action} successfully`);
      fetchWithdrawalRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  //   return (
  //     <Layout>
  //       <div className="ipadpro:ml-[1%] ipadpro-landscape:ml-[1%] animate-fadeIn mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
  //         <div className="flex mb-6">
  //           <button
  //             className={`mr-4 px-4 py-2 rounded-t-lg ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
  //             onClick={() => setActiveTab('users')}
  //           >
  //             Users
  //           </button>
  //           <button
  //             className={`px-4 py-2 rounded-t-lg ${activeTab === 'withdrawals' ? 'bg-indigo-600 text-white' : 'bg-gray-200'} relative`}
  //             onClick={() => setActiveTab('withdrawals')}
  //           >
  //             Withdrawal Requests
  //             {withdrawalRequests.filter(req => req.status === 'pending').length > 0 && (
  //               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
  //                 {withdrawalRequests.filter(req => req.status === 'pending').length}
  //               </span>
  //             )}
  //           </button>
  //         </div>

  //         {activeTab === 'users' ? (
  //           <>
  //             <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">All Users</h1>
  //             <div className="overflow-x-auto">
  //               <table className="min-w-full bg-white divide-y divide-gray-200">
  //                 <thead className="bg-gray-50">
  //                   <tr className="hidden sm:table-row">
  //                     <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
  //                     <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
  //                     <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
  //                       <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>

  //                     <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
  //                     <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:text-right">Actions</th>

  //                   </tr>
  //                 </thead>
  //                 <tbody className="bg-white divide-y divide-gray-200">
  //                   {users.map((user, index) => (
  //                     <React.Fragment key={user._id}>
  //                       <tr className="sm:hidden">
  //                         <td colSpan="6" className="px-2 py-2 border-b border-gray-200">
  //                           <div className="text-sm text-gray-900 font-semibold">{user.name}</div>
  //                           <div className="text-xs text-gray-500">{user.email}</div>
  //                           <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">{user.contact || 'N/A'}</td>

  //                           <div className="text-xs text-gray-500">Role: {user.role}</div>
  //                           <button 
  //                             onClick={() => updateRole(user._id, user.role)} 
  //                             className="mt-2 text-xs text-indigo-600 hover:text-indigo-900"
  //                           >
  //                             Update Role
  //                           </button>
  //                         </td>
  //                       </tr>
  //                       <tr className="hidden sm:table-row">
  //                         <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
  //                         <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
  //                         <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
  //                         <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">{user.contact || 'N/A'}</td>

  //                         <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
  //                         <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm font-medium sm:text-right">
  //                           <button 
  //                             onClick={() => updateRole(user._id, user.role)} 
  //                             className="text-indigo-600 hover:text-indigo-900"
  //                           >
  //                             Update Role
  //                           </button>
  //                         </td>
  //                       </tr>
  //                     </React.Fragment>
  //                   ))}
  //                 </tbody>
  //               </table>
  //             </div>
  //           </>
  //         ) : (
  //           <>
  //             <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Withdrawal Requests</h1>
  //             <div className="overflow-x-auto">
  //               <div className="sm:hidden">
  //                 {withdrawalRequests.length > 0 ? (
  //                   withdrawalRequests.map((request) => (
  //                     <div key={request._id} className="bg-white rounded-lg shadow p-4 mb-4">
  //                       <p className="text-sm font-semibold">Instructor: {request.instructorName}</p>
  //                       <p className="text-sm">Amount: ₹{request.amount}</p>
  //                       <p className="text-sm">Date: {new Date(request.dateRequested).toLocaleDateString()}</p>
  //                       <p className="text-sm">Status: <span className={`px-2 py-1 rounded-full text-xs ${
  //                             request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
  //                             request.status === 'approved' ? 'bg-green-100 text-green-800' : 
  //                             'bg-red-100 text-red-800'
  //                           }`}>{request.status}</span></p>
  //                       {request.status === 'pending' && (
  //                         <div className="flex space-x-2 mt-2">
  //                           <button 
  //                             onClick={() => handleWithdrawalAction(request._id, 'approved')} 
  //                             className="text-green-600 hover:text-green-900 bg-green-100 px-2 py-1 rounded"
  //                           >
  //                             Approve
  //                           </button>
  //                           <button 
  //                             onClick={() => handleWithdrawalAction(request._id, 'rejected')} 
  //                             className="text-red-600 hover:text-red-900 bg-red-100 px-2 py-1 rounded"
  //                           >
  //                             Reject
  //                           </button>
  //                         </div>
  //                       )}
  //                     </div>
  //                   ))
  //                 ) : (
  //                   <p className="text-center text-sm text-gray-500">No withdrawal requests found</p>
  //                 )}
  //               </div>
  //               <table className="min-w-full bg-white divide-y divide-gray-200 hidden sm:table">
  //                 <thead className="bg-gray-50">
  //                   <tr>
  //                     <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
  //                     <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
  //                     <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
  //                     <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Requested</th>
  //                     <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
  //                     <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
  //                   </tr>
  //                 </thead>
  //                 <tbody className="bg-white divide-y divide-gray-200">
  //                   {withdrawalRequests.length > 0 ? (
  //                     withdrawalRequests.map((request, index) => (
  //                       <tr key={request._id}>
  //                         <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
  //                         <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">{request.instructorName}</td>
  //                         <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">₹{request.amount}</td>
  //                         <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">
  //                           {new Date(request.dateRequested).toLocaleDateString()}
  //                         </td>
  //                         <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm">
  //   <span className={`px-2 py-1 rounded-full text-xs ${
  //     request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
  //     request.status === 'approved' ? 'bg-green-100 text-green-800' : 
  //     request.status === 'deleted' ? 'bg-gray-100 text-gray-800' : 
  //     'bg-red-100 text-red-800'
  //   }`}>{request.status}</span>
  // </td>
  //                         <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm font-medium">
  //                           {request.status === 'pending' && (
  //                             <div className="flex space-x-2">
  //                               <button 
  //                                 onClick={() => handleWithdrawalAction(request._id, 'approved')} 
  //                                 className="text-green-600 hover:text-green-900 bg-green-100 px-2 py-1 rounded"
  //                               >
  //                                 Approve
  //                               </button>
  //                               <button 
  //                                 onClick={() => handleWithdrawalAction(request._id, 'rejected')} 
  //                                 className="text-red-600 hover:text-red-900 bg-red-100 px-2 py-1 rounded"
  //                               >
  //                                 Reject
  //                               </button>
  //                             </div>
  //                           )}
  //                         </td>
  //                       </tr>
  //                     ))
  //                   ) : (
  //                     <tr>
  //                       <td colSpan="6" className="px-2 py-4 text-center text-sm text-gray-500">
  //                         No withdrawal requests found
  //                       </td>
  //                     </tr>
  //                   )}
  //                 </tbody>
  //               </table>
  //             </div>
  //           </>
  //         )}
  //       </div>
  //     </Layout>
  //   );



  return (
    <Layout>
      <div className="ipadpro:ml-[1%] ipadpro-landscape:ml-[1%] animate-fadeIn mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Tabs */}
        <div className="flex mb-8 space-x-4">
          <button
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${activeTab === 'users'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm relative ${activeTab === 'withdrawals'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            onClick={() => setActiveTab('withdrawals')}
          >
            Withdrawal Requests
            {withdrawalRequests.filter((req) => req.status === 'pending').length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow">
                {withdrawalRequests.filter((req) => req.status === 'pending').length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'users' ? (
          <>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">
              All Users
            </h1>
            {/* <div className="overflow-x-auto rounded-2xl shadow ring-1 ring-gray-100">
            <table className="min-w-full bg-white divide-y divide-gray-100 rounded-2xl">
              <thead className="bg-gray-50">
                <tr className="hidden sm:table-row">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user, index) => (
                  <React.Fragment key={user._id}>
                    <tr className="sm:hidden">
                      <td colSpan="6" className="px-4 py-4">
                        <div className="text-base font-bold">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-sm text-gray-500">Contact: {user.contact || 'N/A'}</div>
                        <div className="text-sm text-gray-500">Role: {user.role}</div>
                        <button
                          onClick={() => updateRole(user._id, user.role)}
                          className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          Update Role
                        </button>
                      </td>
                    </tr>
                    <tr className="hidden sm:table-row hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{user.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{user.contact || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{user.role}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        <button
                          onClick={() => updateRole(user._id, user.role)}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          Update Role
                        </button>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div> */}


            <div className="overflow-x-auto rounded-2xl shadow ring-1 ring-gray-100">
              <div className="max-h-[600px] overflow-y-auto">
                <table className="min-w-full bg-white divide-y divide-gray-100 rounded-2xl">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr className="hidden sm:table-row">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user, index) => (
                      <React.Fragment key={user._id}>
                        <tr className="sm:hidden">
                          <td colSpan="6" className="px-4 py-4">
                            <div className="text-base font-bold">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-sm text-gray-500">Contact: {user.contact || 'N/A'}</div>
                            <div className="text-sm text-gray-500">Role: {user.role}</div>
                            <button
                              onClick={() => updateRole(user._id, user.role)}
                              className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                            >
                              Update Role
                            </button>
                          </td>
                        </tr>
                        <tr className="hidden sm:table-row hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{index + 1}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{user.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{user.contact || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{user.role}</td>
                          <td className="px-4 py-3 text-sm text-right">
                            <button
                              onClick={() => updateRole(user._id, user.role)}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              Update Role
                            </button>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">
              Withdrawal Requests
            </h1>
            <div className="overflow-x-auto rounded-2xl shadow ring-1 ring-gray-100">
              <div className="max-h-[600px] overflow-y-auto">
                <table className="min-w-full bg-white divide-y divide-gray-100 text-sm sm:table">
                  <thead className="bg-gray-50 sticky top-0 z-10 hidden sm:table-header-group">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Instructor</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {withdrawalRequests.length > 0 ? (
                      withdrawalRequests.map((request, index) => (
                        <tr key={request._id} className="hover:bg-gray-50 transition block sm:table-row">
                          <td className="px-4 py-3 font-medium text-gray-900 block sm:table-cell">
                            <span className="sm:hidden font-semibold text-gray-500"># </span>{index + 1}
                          </td>
                          <td className="px-4 py-3 text-gray-700 block sm:table-cell">
                            <span className="sm:hidden font-semibold text-gray-500">Instructor: </span>{request.instructorName}
                          </td>
                          <td className="px-4 py-3 text-gray-700 block sm:table-cell">
                            <span className="sm:hidden font-semibold text-gray-500">Amount: </span>₹{request.amount}
                          </td>
                          <td className="px-4 py-3 text-gray-700 block sm:table-cell">
                            <span className="sm:hidden font-semibold text-gray-500">Date: </span>
                            {new Date(request.dateRequested).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 block sm:table-cell">
                            <span className="sm:hidden font-semibold text-gray-500">Status: </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : request.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : request.status === 'deleted'
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-red-100 text-red-800'
                              }`}>
                              {request.status}
                            </span>
                          </td>


                          <td className="px-4 py-3 font-medium block sm:table-cell">
                            {request.status === 'pending' && (
                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
                                <button
                                  onClick={() => handleWithdrawalAction(request._id, 'approved')}
                                  className="text-green-600 hover:text-green-800 bg-green-100 px-2 py-1 rounded text-sm"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleWithdrawalAction(request._id, 'rejected')}
                                  className="text-red-600 hover:text-red-800 bg-red-100 px-2 py-1 rounded text-sm"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-6 text-gray-500 text-sm">
                          No withdrawal requests found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>


          </>
        )}
      </div>
    </Layout>
  );

};

export default AdminUsers;







