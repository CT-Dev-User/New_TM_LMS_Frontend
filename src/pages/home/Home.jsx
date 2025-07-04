/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from "../../components/courseCard/CourseCardAll";
import { CourseData } from "../../context/CourseContext";
import { useInView } from 'react-intersection-observer';
import img from '../../assets/img3.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';

const Home = ({ user }) => {
  const navigate = useNavigate();
  const { courses } = CourseData();

  // State for search and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Responsive courses per page
  const getCoursesPerPage = () => {
    if (window.innerWidth >= 1024) return 8; // Desktop
    if (window.innerWidth >= 768) return 6; // Tablet
    return 4; // Mobile
  };
  const [coursesPerPage, setCoursesPerPage] = useState(getCoursesPerPage());

  // Update courses per page on window resize
  useEffect(() => {
    const handleResize = () => {
      setCoursesPerPage(getCoursesPerPage());
      setCurrentPage(1); // Reset to first page on resize
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Intersection Observer hooks
  const [heroTextRef, heroTextInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [heroImageRef, heroImageInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [coursesSectionRef, coursesSectionInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Filter courses based on search term
  useEffect(() => {
    if (courses) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const newFilteredCourses = courses.filter(course =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (course.category && course.category.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredCourses(newFilteredCourses);
        setIsLoading(false);
        setCurrentPage(1); // Reset to first page on new search
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [courses, searchTerm]);

  // Featured courses (reversed order, top 5)
  const featuredCourses = courses ? [...courses].reverse().slice(0, 5) : [];

  // Handle category click
  const handleCategoryClick = (category) => {
    setSearchTerm(category.toLowerCase());
  };

  // Handle Get Started button navigation based on user role
  const handleGetStarted = () => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/courses');
      }
    } else {
      navigate('/login');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Generate page numbers for pagination (limit to 5 visible pages)
  const getVisiblePages = () => {
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  // Categories
  const categories = [
    'Web Development',
    'App Development',
    'Data Science',
    'Artificial Intelligence',
    'Machine Learning',
    'Data Structure',
  ];

  return (
    <div className=" min-h-screen">
      <div className="hero-section flex flex-col md:flex-row items-center justify-between p-6 md:p-12 lg:p-16 ipadpro:p-10 ipadpro-landscape:p-8 relative overflow-hidden">
        <div
          ref={heroTextRef}
          className={`hero-text w-full max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl ipadpro:max-w-3xl ipadpro-landscape:max-w-5xl
            mb-6 md:mb-0 z-10 transition-all duration-1000 ease-in-out ${heroTextInView ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
            } md:w-1/2 lg:w-5/12 ipadpro:w-2/3 ipadpro-landscape:w-full`}
        >
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl font-bold text-gray-900 mb-4 leading-tight">
            Start Learning From{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-black">
              Best Platform
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-gray-600 mb-6 text-base sm:text-lg md:text-lg lg:text-xl 2xl:text-xl">
            Study any topic, anytime, explore thousands of courses for the lowest price ever!
          </p>

          {/* Search Bar */}
          <div className="search-bar flex flex-col sm:flex-row items-stretch mb-6 shadow-lg rounded-xl overflow-hidden w-full">
            <label
              htmlFor="search"
              className="bg-gradient-to-r from-[#1E88E5] to-black text-white px-4 py-2 flex items-center whitespace-nowrap"
            >
              Q. What do you want to learn?
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search courses"
              className="px-4 py-2 border-none focus:outline-none focus:ring-0 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Get Started Button */}
          <div className="w-full flex justify-start mb-6">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto bg-gradient-to-r from-[#1E88E5] to-black text-white px-8 py-3 sm:py-4 rounded-full shadow-lg text-center hover:from-indigo-600 hover:to-blue-600 transition-all duration-300"
            >
              Get Started
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats flex flex-col md:flex-row gap-4 mb-6 w-full">
            {[
              { icon: "📚", title: "2000+", desc: "Online Courses" },
              { icon: "🎓", title: "25k+", desc: "Happy Students" },
              { icon: "🤖", title: "AI", desc: "Powered Learning" },
              { icon: "💼", title: "100+", desc: "Expert Instructors" }

            ].map((stat, index) => (
              <div
                key={index}
                className="flex-1 min-w-[160px] flex items-center gap-3 bg-white text-gray-800 p-4 rounded-xl shadow-md"
              >
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <div className="font-bold text-base">{stat.title}</div>
                  <div className="text-gray-600 text-sm">{stat.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>


        <div
          ref={heroImageRef}
          className={`ml-[2%] hero-image max-w-md md:max-w-full relative z-10 transition-all duration-1000 ease-in-out ${heroImageInView ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'} md:w-1/2 lg:w-7/12 ipadpro:w-1/3 ipadpro-landscape:w-full md:-mt-24 lg:-mt-24 xl:mt-16 ipadpro:-mt-20 ipadpro-landscape:mt-0`}
        >
          <img src={img} alt="Student with books" className="rounded-lg shadow-2xl w-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E88E5] to-black opacity-25 rounded-lg"></div>
        </div>
        <div className="absolute inset-0 bg-indigo-100 animate-pulse opacity-25"></div>
      </div>

      {/* Featured Courses Section */}
      <div className="featured-courses px-4 sm:px-6 lg:px-[10%] mt-8">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6 md:text-2xl lg:text-3xl ipadpro:text-2xl ipadpro-landscape:text-xl">
          Featured Courses
        </h2>
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
          modules={[Pagination, Autoplay]}
          className="mySwiper"
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          onTouchStart={(swiper) => swiper.autoplay.stop()}
          onTouchEnd={(swiper) => setTimeout(() => swiper.autoplay.start(), 8000)}
        >
          {featuredCourses.map((course) => (
            <SwiperSlide key={course._id}>
              <CourseCard course={course} className="mb-10" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Categories Section */}
      <div className="categories-section px-4 sm:px-6 lg:px-[10%] mt-8">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6 md:text-2xl lg:text-3xl ipadpro:text-2xl ipadpro-landscape:text-xl">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className="category-item bg-gray-50 p-4 rounded-lg shadow-md text-center cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => handleCategoryClick(category)}
            >
              <span className="text-2xl">📚</span>
              <p className="text-gray-800 font-semibold mt-2">{category}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Courses Section */}
      <div
        ref={coursesSectionRef}
        className={`courses-section px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 mt-8 transition-all duration-1000 ease-in-out ${coursesSectionInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6 md:text-2xl lg:text-3xl ipadpro:text-2xl ipadpro-landscape:text-xl">
          Available Courses
        </h2>
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center h-64">
                <div className="spinner border-t-4 border-indigo-500 border-solid rounded-full animate-spin h-16 w-16"></div>
              </div>
            ) : currentCourses && currentCourses.length > 0 ? (
              currentCourses.map((course, index) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  className={`mb-10 transition-all duration-1000 ease-in-out rounded-3xl ${coursesSectionInView ? 'translate-y-0 opacity-100' : `translate-y-10 opacity-0 delay-${index * 100}`}`}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full mb-10">
                No courses match your search
              </p>
            )}
          </div>
          {/* Beautiful Pagination */}
          {totalPages > 1 && (
            <div className="pagination pb-10 flex items-center justify-center mt-12 gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : ' bg-gradient-to-r from-[#1E88E5] to-black text-white  shadow-md hover:shadow-lg'
                  }`}
                aria-label="Previous page"
              >
                Prev
              </button>
              {getVisiblePages().map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentPage === page
                      ? 'bg-[#1E88E5] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  aria-label={`Page ${page}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : ' bg-gradient-to-r from-[#1E88E5] to-black text-white hover:bg-indigo-600 shadow-md hover:shadow-lg'
                  }`}
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;


