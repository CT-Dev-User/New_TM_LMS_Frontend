import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiClock } from "react-icons/fi";
import { PiHandCoinsLight } from "react-icons/pi";
import { TfiWallet } from "react-icons/tfi";
import { server } from "../main";
import Sidebar from "./Sidebar";

const PayoutReport = () => {
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [requestedAmount, setRequestedAmount] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [withdrawalEntered, setWithdrawalEntered] = useState(false);
  const [withdrawalData, setWithdrawalData] = useState(null);
  const [payoutHistory, setPayoutHistory] = useState([]);
  const [totalPayoutAmount, setTotalPayoutAmount] = useState(0);

  useEffect(() => {
    fetchPayoutData();
  }, []);

  const handleWithdrawalButtonClick = () => {
    if (!withdrawalEntered) {
      setShowWithdrawalForm(true);
    }
  };

  const fetchPayoutData = async () => {
    try {
      const token = localStorage.getItem("token");

      const summaryResponse = await axios.get(`${server}/api/summary`, {
        headers: { token }
        // Remove withCredentials: true
      });

      const historyResponse = await axios.get(`${server}/api/history`, {
        headers: { token }
        // Remove withCredentials: true
      });

      const { pendingAmount, totalPayoutAmount, requestedAmount, lastRequestDate } = summaryResponse.data;

      setPendingAmount(pendingAmount);
      setTotalPayoutAmount(totalPayoutAmount);
      setRequestedAmount(requestedAmount);
      setPayoutHistory(historyResponse.data);

      if (requestedAmount > 0) {
        setWithdrawalEntered(true);
        const pendingRequest = historyResponse.data.find(p => p.status === 'pending');
        setWithdrawalData({
          _id: pendingRequest?._id,
          amount: requestedAmount,
          date: new Date(lastRequestDate).toLocaleDateString()
        });
      } else {
        setWithdrawalEntered(false);
        setWithdrawalData(null);
      }
    } catch (error) {
      console.error('Error fetching payout data:', error);
      toast.error("Failed to fetch payout data");
    }
  };


  const handleWithdrawalFormSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(`${server}/api/request`,
        { amount },
        { headers: { token } }
      );

      setWithdrawalEntered(true);
      setWithdrawalData({
        _id: response.data._id,
        amount: amount,
        date: new Date().toLocaleDateString()
      });
      setRequestedAmount(amount);
      await fetchPayoutData();
      setShowWithdrawalForm(false);
      setWithdrawalAmount('');
      toast.success("Withdrawal request submitted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    }
  };

  const handleDeleteWithdrawal = async (payoutId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${server}/api/request/${payoutId}`, {
        headers: { token }
      });

      setWithdrawalEntered(false);
      setWithdrawalData(null);
      setRequestedAmount(0);
      await fetchPayoutData();
      toast.success("Withdrawal request deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete request");
    }
  };


  return (
    <div className="flex h-[100dvh] bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <main className="flex-1 p-4 text-center overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            <div className="space-y-4 flex flex-col h-full">

              {/* Header Section */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-indigo-800">
                  Payout Report
                </h2>
                <button
                  className={`text-sm sm:text-base font-bold py-2 px-4 rounded-xl shadow-md transition-colors ${withdrawalEntered
                      ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                    } text-white`}
                  onClick={
                    withdrawalEntered
                      ? () => handleDeleteWithdrawal(withdrawalData._id)
                      : handleWithdrawalButtonClick
                  }
                >
                  {withdrawalEntered ? 'Delete Request' : '+ New withdrawal'}
                </button>
              </div>

              {/* Withdrawal Form Modal */}
              {showWithdrawalForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-2xl shadow-xl w-11/12 sm:w-96">
                    <h3 className="font-bold text-xl mb-4 text-[#1E88E5]">Request a new withdrawal</h3>
                    <form onSubmit={handleWithdrawalFormSubmit}>
                      <input
                        type="number"
                        className="border-2 border-gray-300 rounded-lg w-full px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                        value={withdrawalAmount}
                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                        required
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
                          onClick={() => setShowWithdrawalForm(false)}
                        >
                          Close
                        </button>
                        <button
                          type="submit"
                          className="bg-[#1E88E5] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                        >
                          Request
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Pending Amount */}
                <div className="bg-gradient-to-r from-red-500 to-red-700 rounded-2xl p-4 shadow-xl transform hover:scale-105 transition-transform duration-300 text-white flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-semibold mb-1">Pending Amount</h3>
                    <p className="text-3xl font-extrabold">₹{pendingAmount}</p>
                  </div>
                  <div className="text-3xl bg-white/20 p-3 rounded-full">
                    <FiClock />
                  </div>
                </div>

                {/* Total Payout */}
                <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-2xl p-4 shadow-xl transform hover:scale-105 transition-transform duration-300 text-white flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-semibold mb-1">Total Payout</h3>
                    <p className="text-3xl font-extrabold">₹{totalPayoutAmount}</p>
                  </div>
                  <div className="text-3xl bg-white/20 p-3 rounded-full">
                    <TfiWallet />
                  </div>
                </div>

                {/* Requested Amount */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-4 shadow-xl transform hover:scale-105 transition-transform duration-300 text-white flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-semibold mb-1">Requested Amount</h3>
                    <p className="text-3xl font-extrabold">₹{requestedAmount}</p>
                  </div>
                  <div className="text-3xl bg-white/20 p-3 rounded-full">
                    <PiHandCoinsLight />
                  </div>
                </div>
              </div>

              {/* Table Section */}
              <div className="bg-white rounded-2xl shadow-lg max-h-[420px] overflow-y-auto">
                {payoutHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                    <div className="text-4xl mb-4">📭</div>
                    <h3 className="text-lg font-medium mb-1">No withdrawals yet</h3>
                    <p className="text-sm text-center">Your withdrawal history will appear here once you make requests</p>
                  </div>
                ) : (
                  <table className="min-w-full table-auto">
                    <thead className="bg-[#E3F2FD] text-[#1E88E5] font-semibold">
                      <tr>
                        <th className="px-4 py-3 text-left">#</th>
                        <th className="px-4 py-3 text-left">Amount</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-700">
                      {payoutHistory.map((payout, index) => (
                        <tr key={payout._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                          <td className="px-4 py-3 whitespace-nowrap">₹{payout.amount}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${payout.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : payout.status === 'processed' || payout.status === 'approved'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                            >
                              {payout.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {new Date(payout.dateRequested).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );

};

export default PayoutReport;

