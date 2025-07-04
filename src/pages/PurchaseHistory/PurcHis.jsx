import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";

const PurchaseHistory = () => {
  const { mycourse: myCourses, fetchMyCourse } = CourseData();
  const { user } = UserData();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!myCourses || myCourses.length === 0) {
      fetchMyCourse().catch(() => setError("Failed to load your courses"));
    }
  }, [fetchMyCourse, myCourses]);

  const handleStudyClick = (course) => {
    const safeTitle = course.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");
    navigate(`/${safeTitle}/lectures/${course._id}`, { state: { course } });
  };

  const filteredCourses = myCourses?.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!myCourses) return <div className="h-screen flex items-center justify-center animate-pulse">Loading...</div>;
  if (error) return <div className="h-screen flex items-center justify-center text-red-500">Error: {error}</div>;

  return (
 

    <div className="flex min-h-screen bg-gray-100">
  {/* Sidebar - Hidden on Small and Medium Screens */}
  {isLargeScreen && <Sidebar user={user} course={myCourses} />}

  {/* Main Content */}
  <div className={`flex-grow p-6 transition-all duration-300 ${isLargeScreen ? "ml-[50px]" : "ml-0"}`}>
    <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow p-8 border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-800">Purchase History</h1>
      <p className="text-gray-500 text-sm mt-1">View your purchased courses</p>

      {/* Search Input */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search by course, category, or instructor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:outline-none transition"
        />
      </div>

      <div className="overflow-x-auto mt-8">
        {/* Table View for Large Screens */}
        <div className="hidden lg:block">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-blue-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Course</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Instructor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 flex items-center">
                      <img src={course.image} alt={course.title} className="h-10 w-10 rounded-full object-cover shadow-sm" />
                      <span className="ml-4 text-sm font-medium text-gray-900">{course.title}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{course.createdBy}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-semibold">₹{course.price}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{course.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{course.duration} Weeks</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleStudyClick(course)}
                        className="bg-[#1E88E5] hover:bg-[#1565C0] text-white font-medium px-4 py-2 rounded-md transition"
                      >
                        Study
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-gray-500">No courses found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Card View for Small Screens */}
        <div className="lg:hidden">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div key={course._id} className="bg-white shadow-md rounded-xl p-5 mb-5 border border-gray-200">
                <div className="flex items-center">
                  <img src={course.image} alt={course.title} className="h-14 w-14 rounded-full object-cover shadow" />
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">{course.title}</h2>
                    <p className="text-sm text-gray-600">Instructor: {course.createdBy}</p>
                    <p className="text-sm text-gray-600">Category: {course.category}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center text-sm">
                  <span className="text-gray-800 font-semibold">₹{course.price}</span>
                  <span className="text-gray-500">{course.duration} Weeks</span>
                  <button
                    onClick={() => handleStudyClick(course)}
                    className="bg-[#1E88E5] hover:bg-[#1565C0] text-white px-4 py-2 rounded-md font-bold transition"
                  >
                    Study
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No courses found.</div>
          )}
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default PurchaseHistory;
