/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminCourses from './admin/Courses/AdminCourses';
import AdminDashboard from './admin/Dashboard/AdminDashboard';
import AdminUsers from './admin/Users/AdminUsers';
import './App.css';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import Loading from './components/loading/Loading';
import PlaylistDetail from './components/VideoFunctionality/PlaylistDetail';
import { UserData } from './context/UserContext';
import About from './pages/About/About';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Verify from './pages/auth/Verify';
import CourseDescription from './pages/CourseDescription/CourseDescription';
import CourseStudy from './pages/courseStudy/CourseStudy';
import Dashboard from './pages/dashboard/Dashboard';
import Home from './pages/home/Home';
import Lecture from './pages/lecture/Lecture';
import Paymentsuccess from './pages/paymentSuccess/Paymentsuccess';
import Prof from './pages/Profile/Prof.jsx';
import PurchaseHistory from './pages/PurchaseHistory/PurcHis.jsx';
// New instructor imports - you'll need to create these components
import InstructorCourses from './instructor/instructorCourse.jsx';
import InstructorCourseManagement from './instructor/InstructorCourseManagement.jsx';
import InstructorDashboard from './instructor/InstructorDash.jsx';
import Students from './instructor/students.jsx';


import PayoutReport from './instructor/PayoutReport.jsx';
const App = () => {
  const { isAuth, user, loading } = UserData();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Header isAuth={isAuth} />
          <Routes>
            {/* Existing Routes */}
            <Route path="/" element={<Home user={user} />} />
            <Route path="/courses" element={isAuth ? <Dashboard user={user} /> : <Login />} />
            <Route path="/my-courses" element={isAuth ? <Dashboard user={user} /> : <Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={isAuth ? <Home user={user} /> : <Login />} />
            <Route path="/register" element={isAuth ? <Home user={user} /> : <Register />} />
            <Route path="/verify" element={isAuth ? <Home user={user} /> : <Verify />} />
            <Route path="/course/:id" element={isAuth ? <CourseDescription user={user} /> : <Login />} />
            <Route path="/:courseTitle/lectures/:courseId" element={<PlaylistDetail />} />
            <Route path="/purchase-history" element={isAuth ? <PurchaseHistory user={user} /> : <Login />} />
            <Route path="/payment-success/:id" element={isAuth ? <Paymentsuccess user={user} /> : <Login />} />
            <Route path="/:id/dashboard" element={isAuth ? <Dashboard user={user} /> : <Login />} />
            <Route path="/course/study/:id" element={isAuth ? <CourseStudy user={user} /> : <Login />} />
            <Route path="/lectures/:id" element={isAuth ? <Lecture user={user} /> : <Login />} />
            <Route path="/admin/dashboard" element={isAuth ? <AdminDashboard user={user} /> : <Login />} />
            <Route path="/admin/course" element={isAuth ? <AdminCourses user={user} /> : <Login />} />
            <Route path="/admin/users" element={isAuth ? <AdminUsers user={user} /> : <Login />} />
            <Route path="/profile" element={isAuth ? <Prof user={user} /> : <Navigate to="/login" />} />

            {/* New Instructor Routes */}
            <Route 
              path="/instructor/dashboard" 
              element={isAuth ? <InstructorDashboard user={user} /> : <Login />} 
            />
             <Route 
              path="/instructor/students" 
              element={isAuth ? <Students user={user} /> : <Login />} 
            />
            <Route path="/instructor/course" element={isAuth ? <InstructorCourses user={user} /> : <Login />} />
            <Route 
              path="/instructor/course/:id/manage" 
              element={isAuth ? <InstructorCourseManagement user={user} /> : <Login />} 
            />

<Route path="/instructor/payoutreport" element={isAuth ? <PayoutReport user={user} /> : <Login />} />



          </Routes>
         <Footer user={user} />
        </BrowserRouter>
      )}
    </>
  );
};

export default App;



// import React from 'react';
// import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
// // import Loading from './components/loading/Loading';
// import Paymentsuccess from './pages/paymentSuccess/Paymentsuccess.jsx';

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Paymentsuccess/>} />
//         {/* <Route path="/" element={<Loading />} /> */}
//       </Routes>
//     </BrowserRouter>
//   );
// }
// export default App;