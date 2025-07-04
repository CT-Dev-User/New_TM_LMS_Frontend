/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { CourseData } from "../context/CourseContext";
import Sidebar from "./Sidebar";

const InstructorCourses = ({ user }) => {
  const navigate = useNavigate();
  const { isAuth } = UserData();
  const { courses, fetchCourses } = CourseData();

  // Redirect if unauthenticated or not instructor
  useEffect(() => {
    if (!isAuth || (user && user.role !== "instructor")) {
      navigate("/login");
    } else {
      fetchCourses(); // Fetch only assigned courses from backend
    }
  }, [isAuth, user]);

  const InstructorCourseCard = ({ course }) => {
    const handleStudyClick = () => {
      navigate(`/instructor/course/${course._id}/manage`);
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleStudyClick();
      }
    };

  return (
    <div
      className="relative bg-white/80 backdrop-blur-md border border-blue-100 shadow-md rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group focus:outline-none focus:ring-2 focus:ring-blue-400"
      tabIndex="0"
      onKeyDown={handleKeyDown}
      role="button"
      aria-label={`Open course ${course.title}`}
    >
      {/* Thumbnail */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={course.image}
          alt={course.title || "Course thumbnail"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-yellow-300  text-black text-xs font-semibold px-3 py-1 rounded-full z-10">
          {course.category || "Category"}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>
      </div>

      {/* Details */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate capitalize">
          {course.title || "Untitled Course"}
        </h3>
        <div className="space-y-1 mb-4 text-sm">
          <p className="text-gray-700">
            <span className="font-semibold text-gray-800">Instructor:</span>{" "}
            {course.createdBy || "N/A"}
          </p>
          <p className="text-gray-700 line-clamp-2">
            <span className="font-semibold text-gray-800">Description:</span>{" "}
            {course.description || "N/A"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold text-gray-800">Duration:</span>{" "}
            {course.duration || "N/A"} Weeks
          </p>
        </div>
        <button
          onClick={handleStudyClick}
          className="w-full bg-gradient-to-r from-[#1E88E5] to-[#3949ab] hover:from-[#1565c0] hover:to-[#283593] text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Teach
        </button>
      </div>
    </div>
  );
};

return (
  <div className="flex h-screen bg-gradient-to-r from-indigo-50 to-blue-100">
    <Sidebar />
    <main className="flex-1 overflow-y-auto p-6 ">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold  text-indigo-800 mb-6">
          Assigned Courses
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ipadpro:grid-cols-2 gap-6">
          {courses && courses.length > 0 ? (
            courses
              .filter((course) => course.assignedTo === user._id)
              .map((course) => (
                <InstructorCourseCard key={course._id} course={course} />
              ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">
              No Courses Assigned Yet
            </p>
          )}
        </div>
      </div>
    </main>
  </div>
);

};

export default InstructorCourses;
