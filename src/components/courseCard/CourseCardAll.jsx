/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import { CourseData } from "../../context/CourseContext";

const CourseCard = ({ course, className }) => {
  const navigate = useNavigate();
  const { user, isAuth } = UserData();
  const { fetchCourses } = CourseData();

  // Determine button text and click handler based on user role and assignment
  let buttonText;
  let onClickHandler;

  if (!isAuth) {
    buttonText = "Login to Enroll";
    onClickHandler = () => navigate("/login");
  } else if (user.role === "instructor") {
    if (course.assignedTo === user._id) {
      buttonText = "Manage Course";
      onClickHandler = () => navigate(`/instructor/course/${course._id}/manage`);
    } else {
      buttonText = "View Course";
      onClickHandler = () => navigate(`/course/${course._id}`);
    }
  } else if (user.role === "admin") {
    buttonText = "View Course";
    onClickHandler = () => navigate(`/course/${course._id}`);
  } else { // student
    if (user.subscription.includes(course._id)) {
      buttonText = "Study Now";
      onClickHandler = () => navigate(`/my-courses`);
    } else {
      buttonText = "Enroll Now";
      onClickHandler = () => navigate(`/course/${course._id}`);
    }
  }

  // Handle keydown for accessibility, matching the button's behavior
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onClickHandler();
    }
  };

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group ${className}`}
      tabIndex="0"
      onKeyDown={handleKeyDown}
      role="button"
      aria-label={`Open course ${course.title}`}
    >
      {/* Course Thumbnail */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img
          src={course.image || "https://via.placeholder.com/640x360?text=Course+Image"}
          alt={course.title || "Course thumbnail"}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-yellow-300 text-black text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
          {course.category || "Category"}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Course Details */}
      <div className="p-4 sm:p-5">
        {/* Course Title */}
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 capitalize line-clamp-1">
          {course.title || "Untitled Course"}
        </h3>

        {/* Course Metadata */}
        <div className="space-y-1.5 mb-3 text-sm text-gray-600">
          <p className="flex items-center gap-1">
            <span className="font-semibold text-gray-800">Instructor:</span>
            <span className="truncate">{course.createdBy || "N/A"}</span>
          </p>
          <p className="line-clamp-2">
            <span className="font-semibold text-gray-800">Description:</span>{" "}
            {course.description || "No description available"}
          </p>
          <p className="flex items-center gap-1">
            <span className="font-semibold text-gray-800">Duration:</span>
            {course.duration ? `${course.duration} Weeks` : "N/A"}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-3">
          <button
            onClick={onClickHandler}
            className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#1E88E5] text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-indigo-700 hover:to-[#1565C0] transform hover:scale-105"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;


