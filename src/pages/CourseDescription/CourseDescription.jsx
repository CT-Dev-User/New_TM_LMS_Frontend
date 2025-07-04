import React, { useEffect, useState } from 'react';
import './CourseDescription.css';
import { useNavigate, useParams } from 'react-router-dom';
import { CourseData } from '../../context/CourseContext';
import { server } from '../../main';
import { UserData } from '../../context/UserContext';
import Loading from '../../components/loading/loading';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const CourseDescription = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { fetchUser } = UserData();
  const { fetchCourse, course, fetchCourses, fetchMyCourse } = CourseData();

  const [courseDescriptionRef, courseDescriptionInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    fetchCourse(id);
  }, [id]);

  const checkoutHandler = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      
      if (course.price === 0) {
        // If the course is free, simulate a purchase
        const { data } = await axios.post(
          `${server}/api/course/checkout/${id}`,
          {},
          { headers: { token } }
        );
        
        await fetchUser();
        await fetchCourses();
        await fetchMyCourse();

        toast.success("Course subscribed successfully!");
        navigate(`/course/study/${course._id}`);
      } else {
        // For paid courses
        const { data: { order } } = await axios.post(
          `${server}/api/course/checkout/${id}`,
          {},
          { headers: { token } }
        );

        const options = {
          key: "rzp_live_gFHhLyF1CHGKSV",
          amount: order.id,
          currency: "INR",
          name: "TechMomentum",
          description: "Learning solutions",
          order_id: order.id,
          handler: async function(response) {
            try {
              const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

              const { data } = await axios.post(
                `${server}/api/verification/${id}`,
                {
                  razorpay_order_id,
                  razorpay_payment_id,
                  razorpay_signature
                },
                { headers: { token } }
              );

              await fetchUser();
              await fetchCourses();
              await fetchMyCourse();

              toast.success(data.message);
              navigate(`/payment-success/${razorpay_payment_id}`);
            } catch (error) {
              toast.error(error.response?.data?.message || "Payment verification failed");
            }
          },
          theme: {
            color: "#8a4baf",
          },
          prefill: {
            name: user?.name,
            email: user?.email
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!course) return null;

  // Check if the user has access to the course (admin or subscribed)
  const hasAccess = user && (user.role === "admin" || user.subscription?.includes(course._id));


  return (
    <div className="bg-gradient-to-br from-gray-50 to-white py-16 min-h-screen text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Course Overview */}
        <motion.div
          ref={courseDescriptionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: courseDescriptionInView ? 1 : 0,
            y: courseDescriptionInView ? 0 : 30
          }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          {/* Course Image */}
          <div className="relative group shadow-2xl rounded-xl overflow-hidden">
            <motion.img
              src={course.image}
              alt={course.title}
              className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
              <motion.span
                className="text-black text-sm font-semibold uppercase bg-yellow-300 px-3 py-1 rounded-md"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {course.category}
              </motion.span>
            </div>
          </div>

          {/* Course Info */}
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold leading-snug">
              {course.title}
            </h1>
            <div className="text-sm sm:text-base space-y-1">
              <p><strong>👨‍🏫 Instructor:</strong> {course.createdBy}</p>
              <p><strong>⏳ Duration:</strong> {course.duration} Weeks</p>
            </div>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              {course.description}
            </p>
            <div className="text-3xl font-bold text-blue-600">
              ₹{course.price}
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {hasAccess ? (
                <button
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-indigo-500 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300"
                >
                  Start Learning
                </button>
              ) : (
                <button
                  onClick={checkoutHandler}
                  className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-indigo-500 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300"
                >
                  {course.price === 0 ? "Subscribe Now" : "Enroll Now"}
                </button>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Side‑by‑Side Learning & Benefits */}
        <motion.section
          className="mt-20 border-t pt-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* What You'll Learn */}
            <div>
              <h2 className="text-2xl font-bold mb-4">📚 What You’ll Learn</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 text-base sm:text-lg">
                <li>Introduction to Key Concepts</li>
                <li>Mastering Advanced Techniques</li>
                <li>Real-World Applications</li>
              </ul>
            </div>

            {/* Benefits of This Course */}
            <div>
              <h2 className="text-2xl font-bold mb-4">🎯 Benefits of This Course</h2>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                Get lifetime access to structured lessons, guided projects, and
                certification. This course helps you apply real-world skills,
                build a strong portfolio, and accelerate your career growth.
              </p>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
};

export default CourseDescription;

