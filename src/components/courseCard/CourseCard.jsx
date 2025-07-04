/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import { server } from "../../main";
import axios from 'axios';
import toast from 'react-hot-toast';
import { CourseData } from '../../context/CourseContext';

const CourseCard = ({ course, className }) => {
  const navigate = useNavigate();
  const { user, isAuth } = UserData();
  const { fetchCourses } = CourseData();

  const handleStudyClick = () => {
    if (isAuth && user.subscription.includes(course._id)) {
      navigate(`/course/study/${course._id}`);
    } else {
      navigate(`/course/${course._id}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigate(`/course/${course._id}`);
    }
  };

  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        const { data } = await axios.delete(`${server}/api/course/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        toast.success(data.message);
        fetchCourses(); // Refresh the list of courses
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting course");
      }
    }
  };

  // return (
  //   <div
  //     className={`relative bg-white shadow-lg rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group ${className}`}
  //     tabIndex="0"
  //     onKeyDown={handleKeyDown}
  //     role="button"
  //     aria-label={`Open course ${course.title}`}
  //   >
  //     {/* Course Thumbnail */}
  //     <div className="relative h-56 overflow-hidden">
  //       <img
  //         src={course.image}
  //         alt={course.title || "Course thumbnail"}
  //         className="w-full h-full object-cover transform transition-all duration-300 group-hover:scale-105"
  //       />
  //       <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
  //         {course.category || "Category"}
  //       </div>
  //       <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-70"></div>
  //     </div>

  //     {/* Course Details */}
  //     <div className="p-6">
  //       {/* Course Title */}
  //       <h3 className="text-xl font-bold text-gray-900 mb-3 truncate capitalize">
  //         {course.title || "Untitled Course"}
  //       </h3>

  //       {/* Course Metadata */}
  //       <div className="space-y-2 mb-4">
  //         <p className="text-sm text-gray-600">
  //           <span className="font-semibold text-gray-800 capita">Instructor:</span> {course.createdBy || "N/A"}
  //         </p>
  //         <p className="text-sm text-gray-600 line-clamp-2">
  //           <span className="font-semibold text-gray-800">Description:</span> {course.description || "N/A"}
  //         </p>
  //         <p className="text-sm text-gray-600">
  //           <span className="font-semibold text-gray-800">Duration:</span> {course.duration || "N/A"} Weeks
  //         </p>
  //       </div>

  //       {/* Action Buttons */}
  //       <div className="space-y-3">
  //         {isAuth ? (
  //           user.role !== "admin" ? (
  //             <>
  //               {user.subscription.includes(course._id) ? (
  //                 <button
  //                   onClick={handleStudyClick}
  //                   className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-blue-700 transform hover:scale-105"
  //                 >
  //                   Study Now
  //                 </button>
  //               ) : (
  //                 <button
  //                   onClick={handleStudyClick}
  //                   className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-blue-700 transform hover:scale-105"
  //                 >
  //                   Get Started
  //                 </button>
  //               )}
  //             </>
  //           ) : (
  //             <button
  //               onClick={handleStudyClick}
  //               className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-blue-700 transform hover:scale-105"
  //             >
  //               Study
  //             </button>
  //           )
  //         ) : (
  //           <button
  //             onClick={() => navigate("/login")}
  //             className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-blue-700 transform hover:scale-105"
  //           >
  //             Login to Enroll
  //           </button>
  //         )}

  //         {/* Admin Delete Button */}
  //         {user && user.role === "admin" && (
  //           <button
  //             onClick={() => deleteHandler(course._id)}
  //             className="w-full bg-red-500 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-red-600 transform hover:scale-105"
  //           >
  //             Delete Course
  //           </button>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );

return (
  <div
    className={`relative bg-white shadow-lg rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group ${className}`}
    tabIndex="0"
    onKeyDown={handleKeyDown}
    role="button"
    aria-label={`Open course ${course.title}`}
  >
    {/* Course Thumbnail */}
    <div className="relative h-56 overflow-hidden">
      <img
        src={course.image}
        alt={course.title || "Course thumbnail"}
        className="w-full h-full object-cover transform transition-all duration-300 group-hover:scale-105"
      />
      <div className="absolute top-2 left-2 bg-[#1E88E5] text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
        {course.category || "Category"}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
    </div>

    {/* Course Details */}
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-3 truncate capitalize">
        {course.title || "Untitled Course"}
      </h3>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-gray-900">Instructor:</span>{" "}
          {course.createdBy || "N/A"}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2">
          <span className="font-semibold text-gray-900">Description:</span>{" "}
          {course.description || "N/A"}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-gray-900">Duration:</span>{" "}
          {course.duration || "N/A"} Weeks
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {isAuth ? (
          user.role !== "admin" ? (
            user.subscription.includes(course._id) ? (
              <button
                onClick={handleStudyClick}
                className="w-full py-2.5 px-6 rounded-lg bg-gradient-to-r from-[#1E88E5] to-[#0f172a] text-white font-semibold shadow-md hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
              >
              Study Now
              </button>
            ) : (
              <button
                onClick={handleStudyClick}
                className="w-full py-2.5 px-6 rounded-lg bg-gradient-to-r from-[#1E88E5] to-[#0f172a] text-white font-semibold shadow-md hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
              >
              Get Started
              </button>
            )
          ) : (
            <button
              onClick={handleStudyClick}
              className="w-full py-2.5 px-6 rounded-lg bg-gradient-to-r from-[#1E88E5] to-[#0f172a] text-white font-semibold shadow-md hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
            >
              Study
            </button>
          )
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="w-full py-2.5 px-6 rounded-lg bg-gradient-to-r from-[#1E88E5] to-[#0f172a] text-white font-semibold shadow-md hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
          >
            Login to Enroll
          </button>
        )}

        {/* Admin Delete Button */}
        {user && user.role === "admin" && (
          <button
            onClick={() => deleteHandler(course._id)}
            className="w-full py-2.5 px-6 rounded-lg bg-red-600 text-white font-semibold shadow-md hover:bg-red-700 hover:scale-105 transition-all duration-300"
          >
            🗑 Delete Course
          </button>
        )}
      </div>
    </div>
  </div>
);

};

export default CourseCard;