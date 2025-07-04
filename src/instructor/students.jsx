/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { server } from "../main";
import { UserData } from "../context/UserContext";
import Sidebar from "./Sidebar";
import toast from "react-hot-toast";

const Students = ({ user }) => {
  const navigate = useNavigate();
  const { isAuth } = UserData();

  // Redirect if user is not authenticated or not an instructor
  if (!isAuth || (user && user.role !== "instructor")) {
    navigate("/login");
    return null;
  }

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all courses assigned to the instructor
  async function fetchInstructorCourses() {
    try {
      const { data } = await axios.get(`${server}/api/instructor/courses`, {
        headers: { token: localStorage.getItem("token") },
      });
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch courses");
      }
      setCourses(data.courses || []);
      return data.courses || [];
    } catch (error) {
      console.error("Error fetching instructor courses:", error);
      toast.error("Error fetching courses: " + (error.response?.data?.message || error.message));
      return [];
    }
  }

  // Fetch enrolled students for all courses
  async function fetchStudents() {
    try {
      const courses = await fetchInstructorCourses();
      if (courses.length === 0) {
        setStudents([]);
        return;
      }
      const studentMap = new Map(); // To deduplicate students
      for (const course of courses) {
        try {
          const { data } = await axios.get(
            `${server}/api/course/${course._id}/students`,
            {
              headers: { token: localStorage.getItem("token") },
            }
          );
          if (data.success && data.students) {
            data.students.forEach((student) => {
              if (!studentMap.has(student._id)) {
                studentMap.set(student._id, {
                  ...student,
                  courses: [course.title],
                });
              } else {
                studentMap.get(student._id).courses.push(course.title);
              }
            });
          }
        } catch (error) {
          console.error(`Error fetching students for course ${course._id}:`, error);
          toast.error(`Failed to fetch students for course ${course.title}`);
        }
      }
      setStudents(Array.from(studentMap.values()));
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Error fetching students.");
    }
  }

  // Fetch assignments for all courses
  async function fetchAssignments() {
    try {
      const allAssignments = [];
      for (const course of courses) {
        try {
          const { data } = await axios.get(
            `${server}/api/course/${course._id}/assignments`,
            {
              headers: { token: localStorage.getItem("token") },
            }
          );
          if (data.success) {
            allAssignments.push(...(data.assignments || []));
          }
        } catch (error) {
          console.error(`Error fetching assignments for course ${course._id}:`, error);
        }
      }
      setAssignments(allAssignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast.error("Error fetching assignments.");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchStudents();
      await fetchAssignments();
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-r from-indigo-50 to-blue-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto scrollbar-hidden p-6  animate-fadeIn">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-8">
            <h1 className="text-2xl font-semibold text-indigo-800">
              Your Students
            </h1>

            {/* Students Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-slideUp">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                All Enrolled Students ({students.length})
              </h2>
              {students.length > 0 ? (
                <div className="space-y-4">
                  {students.map((student, index) => (
                    <div
                      key={student._id}
                      className="flex items-center justify-between space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-indigo-600">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                        <p className="text-xs text-gray-400">
                          Enrolled in: {student.courses.join(", ") || "No courses"}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">#{index + 1}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-lg text-center py-4">
                  No students enrolled in your courses yet.
                </p>
              )}
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Students;