import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Utils/Layout';
import axios from 'axios';
import { useState } from 'react';
import { server } from '../../main';



// ////////////////////////////////////////

import { FaChalkboardTeacher, FaVideo, FaUsers } from "react-icons/fa";

// ///////////////////////////////////////

const AdminDashboard = ({ user }) => {
    const navigate = useNavigate();
    if (user && user.role !== "admin") return navigate("/");

    const [stats, setStats] = useState([]);

    async function fetchStats() {
        try {
            const { data } = await axios.get(`${server}/api/stats`, {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });
            setStats(data.stats);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <Layout>

            <div className="ipadpro:ml-[1%] ipadpro-landscape:ml-[1%] animate-fadeIn mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6">
                    Admin Dashboard
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                    {/* Total Courses */}
                    <div className="bg-gradient-to-r from-[#1E88E5] to-blue-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-full text-white text-3xl">
                                <FaChalkboardTeacher />
                            </div>
                            <div className="text-white">
                                <p className="text-base font-medium">Total Courses</p>
                                <p className="text-2xl font-bold">{stats.totalCourses || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Total Lectures */}
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-full text-white text-3xl">
                                <FaVideo />
                            </div>
                            <div className="text-white">
                                <p className="text-base font-medium">Total Lectures</p>
                                <p className="text-2xl font-bold">{stats.totalLectures || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Total Users */}
                    <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-full text-white text-3xl">
                                <FaUsers />
                            </div>
                            <div className="text-white">
                                <p className="text-base font-medium">Total Users</p>
                                <p className="text-2xl font-bold">{stats.totalUsers || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Layout>
    );
}

export default AdminDashboard;



