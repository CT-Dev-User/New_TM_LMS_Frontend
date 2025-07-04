import React, { useEffect, useState } from "react";
import { BiCheckCircle } from "react-icons/bi";
import { FaRegClock } from "react-icons/fa";
import { GrCertificate } from "react-icons/gr";
import { PiBookOpenBold } from "react-icons/pi";
import Sidebar from "../../components/Sidebar/Sidebar";
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import ContentCard from "./ContentCard";

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const { mycourse: myCourses, fetchMyCourse } = CourseData();
  const [error, setError] = useState(null);

  const { user } = UserData();

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!myCourses || myCourses.length === 0) {
      fetchMyCourse().catch(() => setError("Failed to load your courses"));
    }
  }, [fetchMyCourse, myCourses]);

  if (!myCourses)
    return (
      <div className="h-screen flex items-center justify-center animate-pulse">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex items-center justify-center animate-pulse ml-4">
        Error: {error}
      </div>
    );
  return (
    <div className="w-full min-h-screen flex bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] text-gray-900">
      {/* Sidebar */}
      {isLargeScreen && <Sidebar user={user} course={myCourses} />}

      {/* Main Content */}
      <main className="flex-grow px-6 lg:px-10 py-8">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-8 text-slate-800">
          Welcome back, <span className="text-blue-700">{user?.name?.split(" ")[0]}</span>
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Courses In Progress"
            count={myCourses.filter((course) => !course.completed).length}
            icon={<PiBookOpenBold />}
            gradient="from-blue-400 to-blue-600"
          />
          <StatCard
            title="Completed Courses"
            count={myCourses.filter((course) => course.completed).length}
            icon={<BiCheckCircle />}
            gradient="from-green-400 to-green-600"
          />
          <StatCard
            title="Hours Spent"
            count={0} // replace with backend data
            icon={<FaRegClock />}
            gradient="from-purple-400 to-purple-600"
          />
          <StatCard
            title="Certificates"
            count={0} // replace with backend data
            icon={<GrCertificate />}
            gradient="from-yellow-400 to-yellow-600"
          />
        </div>

        {/* Continue Learning */}
        <div>
          {myCourses.length > 0 ? (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-slate-700">
                Continue Learning
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCourses.map((course) => (
                  <ContentCard key={course._id} course={course} />
                ))}
              </div>
            </>
          ) : (
            <p className="text-xl text-slate-500 font-medium">No Courses Enrolled Yet</p>
          )}
        </div>
      </main>
    </div>
  );
};

// 🌟 Modern Stat Card Component
const StatCard = ({ title, count, icon, gradient }) => (
  <div className="bg-white/60 backdrop-blur-md shadow-lg rounded-2xl p-6 flex items-center justify-between border border-white/30 transition-all hover:scale-[1.02] duration-300 ease-in-out">
    <div className="flex flex-col">
      <span className="text-md text-slate-700 font-medium mb-1">{title}</span>
      <span className="text-4xl font-bold text-slate-900">{count}</span>
    </div>
    <div
      className={`text-white text-2xl p-4 rounded-full bg-gradient-to-br ${gradient} shadow-md`}
    >
      {icon}
    </div>
  </div>
);
export default DashboardPage;

