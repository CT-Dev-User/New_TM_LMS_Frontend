/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { server } from "../main"; // Adjust the path to your server config
import Sidebar from "./Sidebar";


// ///////////////////////////////////////
import { FaChalkboardTeacher, FaUsers } from "react-icons/fa";
import { PiBookOpenBold } from "react-icons/pi";
// ////////////////////////////////////////////////
function InstructorDash() {
  const navigate = useNavigate();
  const { user } = UserData();

  // Redirect if user is not an instructor
  if (user && user.role !== "instructor") {
    navigate("/");
  }

  const [stats, setStats] = useState({
    assignedCourses: 0,
    totalLectures: 0,
    totalStudents: 0,
  });

  const handleAddNewCourse = () => {
    navigate("/instructor/course");
  };

  const handleManageStudents = () => {
    navigate("/instructor/students");
  };

  async function fetchInstructorStats() {
    try {
      // Fetch courses assigned to the instructor
      const { data: coursesData } = await axios.get(`${server}/api/instructor/courses`, {
        headers: { token: localStorage.getItem("token") },
      });

      if (!coursesData.success) {
        throw new Error(coursesData.message || "Failed to fetch courses");
      }

      const courses = coursesData.courses || [];
      let totalLectures = 0;
      const studentSet = new Set(); // To deduplicate students

      // Fetch lectures and students for each course
      for (const course of courses) {
        try {
          // Fetch lectures
          const { data: lecturesData } = await axios.get(
            `${server}/api/course/${course._id}/lectures`,
            { headers: { token: localStorage.getItem("token") } }
          );
          if (lecturesData.success) {
            totalLectures += (lecturesData.lectures || []).length;
          }
        } catch (error) {
          console.error(`Error fetching lectures for course ${course._id}:`, error);
        }

        try {
          // Fetch students
          const { data: studentsData } = await axios.get(
            `${server}/api/course/${course._id}/students`,
            { headers: { token: localStorage.getItem("token") } }
          );
          if (studentsData.success) {
            (studentsData.students || []).forEach((student) => {
              // Only include non-admin users
              if (student.role !== "admin") {
                studentSet.add(student._id);
              }
            });
          }
        } catch (error) {
          console.error(`Error fetching students for course ${course._id}:`, error);
        }
      }

      setStats({
        assignedCourses: courses.length,
        totalLectures,
        totalStudents: studentSet.size,
      });
    } catch (error) {
      console.error("Error fetching instructor stats:", error);
    }
  }

  useEffect(() => {
    fetchInstructorStats();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col ">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 sm:p-10">
          <h2 className="text-2xl font-semibold text-indigo-800 p-4">welcome <span className="text-black">{user.name} !!!</span> </h2>
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Stats */}
            

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {/* Assigned Courses */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Assigned Courses</h3>
                  <p className="text-4xl font-extrabold">{stats.assignedCourses}</p>
                </div>
                <div className="text-4xl bg-white/20 p-4 rounded-full">
                  <PiBookOpenBold />
                </div>
              </div>
              {/* Total Lectures */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Total Lectures</h3>
                  <p className="text-4xl font-extrabold">{stats.totalLectures}</p>
                </div>
                <div className="text-4xl bg-white/20 p-4 rounded-full">
                  <FaChalkboardTeacher />
                </div>
              </div>
              {/* Enrolled Students */}
              <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Enrolled Students</h3>
                  <p className="text-4xl font-extrabold">{stats.totalStudents}</p>
                </div>
                <div className="text-4xl bg-white/20 p-4 rounded-full">
                  <FaUsers />
                </div>
              </div>
            </div>
            {/* Actions */}
            <section className="flex flex-wrap gap-4 mt-6">
              <button
                onClick={handleAddNewCourse}
                className="backdrop-blur-md bg-blue-600/90 hover:bg-blue-700/90 text-white font-semibold py-2.5 px-6 rounded-full shadow-lg transition-all duration-300"
              >
                View Courses
              </button>
              <button
                onClick={handleManageStudents}
                className="backdrop-blur-md bg-green-600/90 hover:bg-green-700/90 text-white font-semibold py-2.5 px-6 rounded-full shadow-lg transition-all duration-300"
              >
                Manage Students
              </button>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default InstructorDash;






