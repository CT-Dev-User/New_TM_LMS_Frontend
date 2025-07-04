import axios from 'axios';
import React, { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../../components/courseCard/CourseCard';
import { CourseData } from '../../context/CourseContext';
import { server } from '../../main';
import Layout from '../Utils/Layout';

const categories = [
    "Web Development",
    "App Development",
    "Data Science",
    "Artificial Intelligence",
    "Machine Learning",
    "Data Structure",
];

const AdminCourses = ({ user }) => {
    const navigate = useNavigate();
    if (user && user.role !== "admin") return navigate("/");

    // State management
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [createdBy, setCreatedBy] = useState("");
    const [duration, setDuration] = useState("");
    const [image, setImage] = useState("");
    const [imagePrev, setImagePrev] = useState("");
    const [btnLoading, setBtnLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const formRef = useRef(null);

    const changeImageHandler = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImagePrev(reader.result);
            setImage(file);
        };
    };

    const { courses, fetchCourses } = CourseData();

    const submitHandler = async (e) => {
        e.preventDefault();
        setBtnLoading(true);
        const myForm = new FormData();
        myForm.append("title", title);
        myForm.append("description", description);
        myForm.append("category", category);
        myForm.append("price", price);
        myForm.append("createdBy", createdBy);
        myForm.append("duration", duration);
        myForm.append("file", image);

        try {
            const { data } = await axios.post(`${server}/api/course/new`, myForm, {
                headers: {
                    token: localStorage.getItem("token"),
                }
            });
            toast.success(data.message);
            setBtnLoading(false);
            await fetchCourses();
            setImage("");
            setTitle("");
            setDescription("");
            setDuration("");
            setImagePrev("");
            setCreatedBy("");
            setPrice("");
            setCategory("");
            setShowForm(false);
        } catch (error) {
            toast.error(error.response.data.message);
            setBtnLoading(false);
        }
    };

    // return (
    //     <Layout>
    //         <div className=" ipadpro:ml-[1%] ipadpro-landscape:ml-[1%] animate-fadeIn mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12"><h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6">All Courses</h2>
    //             <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
    //                 <button
    //                     onClick={() => {
    //                         setShowForm(!showForm);
    //                         if (!showForm && formRef.current) {
    //                             formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    //                         }
    //                     }}
    //                     className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
    //                 >
    //                     {showForm ? "Hide Form" : "New Course"}
    //                 </button>
    //             </div>

    //             {showForm && (
    //                 <div ref={formRef} className="mt-6 bg-white shadow-xl rounded-lg overflow-hidden mb-10">
    //                     <div className="px-4 py-4 sm:px-6">
    //                         <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">Add Course</h2>
    //                         <form onSubmit={submitHandler} className="space-y-4 sm:space-y-6">
    //                             {[
    //                                 { label: 'Title', state: title, setState: setTitle, type: 'text' },
    //                                 { label: 'Description', state: description, setState: setDescription, type: 'text' },
    //                                 { label: 'Price', state: price, setState: setPrice, type: 'number' },
    //                                 { label: 'Created By', state: createdBy, setState: setCreatedBy, type: 'text' },
    //                                 { label: 'Duration', state: duration, setState: setDuration, type: 'text' },
    //                             ].map(({ label, state, setState, type }) => (
    //                                 <div key={label}>
    //                                     <label htmlFor={label.toLowerCase()} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    //                                     <input
    //                                         type={type}
    //                                         value={state}
    //                                         onChange={(e) => setState(e.target.value)}
    //                                         required
    //                                         className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
    //                                     />
    //                                 </div>
    //                             ))}

    //                             <div>
    //                                 <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
    //                                 <select
    //                                     value={category}
    //                                     onChange={(e) => setCategory(e.target.value)}
    //                                     className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
    //                                 >
    //                                     <option value="">Select Category</option>
    //                                     {categories.map((cat, index) => (
    //                                         <option key={index} value={cat}>{cat}</option>
    //                                     ))}
    //                                 </select>
    //                             </div>

    //                             <div>
    //                                 <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">Image</label>
    //                                 <input
    //                                     type="file"
    //                                     required
    //                                     onChange={changeImageHandler}
    //                                     className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
    //                                 />
    //                                 {imagePrev && <img src={imagePrev} alt="preview" className="mt-2 w-full h-48 sm:h-64 object-cover rounded-md border border-gray-200" />}
    //                             </div>

    //                             <button
    //                                 type='submit'
    //                                 disabled={btnLoading}
    //                                 className="w-full py-2 px-4 sm:py-3 sm:px-6 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
    //                             >
    //                                 {btnLoading ? "Please Wait..." : "Add Course"}
    //                             </button>
    //                         </form>
    //                     </div>
    //                 </div>
    //             )}

    //             <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ipadpro:grid-cols-2 ipadpro-landscape:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
    //                 {courses && courses.length > 0 ? (
    //                     courses.map((course) => (
    //                         <CourseCard key={course._id} course={course} />
    //                     ))
    //                 ) : (
    //                     <p className="text-center col-span-full text-gray-600">No Courses Yet</p>
    //                 )}
    //             </div>
    //         </div>
    //     </Layout>
    // );

// /////////////////////////////////////////////////////////////////////

//     return (
//   <Layout>
//     <div className="ipadpro:ml-[1%] ipadpro-landscape:ml-[1%] animate-fadeIn mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-gray-100">
//       <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E88E5] mb-8 border-b border-gray-700 pb-4">
//         All Courses
//       </h2>

//       <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
//         <button
//           onClick={() => {
//             setShowForm(!showForm);
//             if (!showForm && formRef.current) {
//               formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
//             }
//           }}
//           className="w-full sm:w-auto px-6 py-3 bg-[#1E88E5] text-white rounded-lg shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/50"
//         >
//           {showForm ? "Hide Form" : "New Course"}
//         </button>
//       </div>

//       {showForm && (
//         <div ref={formRef} className="mt-6 bg-gray-800 rounded-xl overflow-hidden mb-12 shadow-lg border border-gray-700">
//           <div className="px-6 py-6">
//             <h2 className="text-2xl font-semibold mb-6 text-white">Add Course</h2>
//             <form onSubmit={submitHandler} className="space-y-6">
//               {[
//                 { label: "Title", state: title, setState: setTitle, type: "text" },
//                 { label: "Description", state: description, setState: setDescription, type: "text" },
//                 { label: "Price", state: price, setState: setPrice, type: "number" },
//                 { label: "Created By", state: createdBy, setState: setCreatedBy, type: "text" },
//                 { label: "Duration", state: duration, setState: setDuration, type: "text" },
//               ].map(({ label, state, setState, type }) => (
//                 <div key={label}>
//                   <label htmlFor={label.toLowerCase()} className="block text-sm font-medium text-gray-300 mb-2">
//                     {label}
//                   </label>
//                   <input
//                     type={type}
//                     value={state}
//                     onChange={(e) => setState(e.target.value)}
//                     required
//                     className="w-full bg-gray-900 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
//                   />
//                 </div>
//               ))}

//               <div>
//                 <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">Category</label>
//                 <select
//                   value={category}
//                   onChange={(e) => setCategory(e.target.value)}
//                   className="w-full bg-gray-900 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map((cat, index) => (
//                     <option key={index} value={cat}>{cat}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label htmlFor="file" className="block text-sm font-medium text-gray-300 mb-2">Image</label>
//                 <input
//                   type="file"
//                   required
//                   onChange={changeImageHandler}
//                   className="w-full bg-gray-900 text-gray-300 border border-gray-600 rounded-lg cursor-pointer py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
//                 />
//                 {imagePrev && (
//                   <img
//                     src={imagePrev}
//                     alt="preview"
//                     className="mt-4 w-full h-64 object-cover rounded-lg border border-gray-600"
//                   />
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 disabled={btnLoading}
//                 className="w-full py-3 bg-[#1E88E5] text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/50 disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 {btnLoading ? "Please Wait..." : "Add Course"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ipadpro:grid-cols-2 ipadpro-landscape:grid-cols-3 gap-6">
//         {courses && courses.length > 0 ? (
//           courses.map((course) => (
//             <CourseCard key={course._id} course={course} />
//           ))
//         ) : (
//           <p className="text-center col-span-full text-gray-400">No Courses Yet</p>
//         )}
//       </div>
//     </div>
//   </Layout>
// );


// //////////////////////////////////////////////////////////////////////////////

// return (
//   <Layout>
//     <div className="ipadpro:ml-[1%] ipadpro-landscape:ml-[1%] animate-fadeIn mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-white">
//       <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-[#0f172a] mb-10 border-b border-[#1E88E5]/30 pb-4">
//         All Courses
//       </h2>

//       <div className="flex justify-between items-center mb-8">
//         <button
//           onClick={() => {
//             setShowForm(!showForm);
//             if (!showForm && formRef.current) {
//               formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
//             }
//           }}
//           className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1E88E5] to-[#0f172a] hover:from-[#3492f7] hover:to-[#1c2a4d] transition-all text-white font-semibold shadow-xl"
//         >
//           {showForm ? "Hide Form" : "+ Add New Course"}
//         </button>
//       </div>

//       {showForm && (
//         <div
//           ref={formRef}
//           className="mt-6 bg-[#0f172a]/70 border border-[#1E88E5]/20 backdrop-blur-md rounded-2xl p-8 shadow-2xl transition-all duration-500"
//         >
//           <h3 className="text-2xl font-semibold text-white mb-6 bg-gradient-to-r from-[#1E88E5] to-[#0f172a] text-transparent bg-clip-text">
//             📝 New Course Details
//           </h3>
//           <form onSubmit={submitHandler} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             {[
//               { label: "Title", state: title, setState: setTitle, type: "text" },
//               { label: "Description", state: description, setState: setDescription, type: "text" },
//               { label: "Price (₹)", state: price, setState: setPrice, type: "number" },
//               { label: "Created By", state: createdBy, setState: setCreatedBy, type: "text" },
//               { label: "Duration", state: duration, setState: setDuration, type: "text" },
//             ].map(({ label, state, setState, type }) => (
//               <div key={label}>
//                 <label className="block text-sm text-gray-300 mb-1">{label}</label>
//                 <input
//                   type={type}
//                   value={state}
//                   onChange={(e) => setState(e.target.value)}
//                   required
//                   className="w-full px-4 py-2 rounded-lg bg-[#121a2a] border border-[#1E88E5]/30 text-white focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
//                 />
//               </div>
//             ))}

//             <div>
//               <label className="block text-sm text-gray-300 mb-1">Category</label>
//               <select
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 className="w-full px-4 py-2 rounded-lg bg-[#121a2a] border border-[#1E88E5]/30 text-white focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((cat, index) => (
//                   <option key={index} value={cat}>{cat}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm text-gray-300 mb-1">Course Thumbnail</label>
//               <input
//                 type="file"
//                 required
//                 onChange={changeImageHandler}
//                 className="w-full px-4 py-2 bg-[#121a2a] border border-[#1E88E5]/30 text-white rounded-lg cursor-pointer"
//               />
//               {imagePrev && (
//                 <img
//                   src={imagePrev}
//                   alt="preview"
//                   className="mt-3 w-full h-48 object-cover rounded-xl border border-[#1E88E5]/20"
//                 />
//               )}
//             </div>

//             <div className="sm:col-span-2">
//               <button
//                 type="submit"
//                 disabled={btnLoading}
//                 className="w-full py-3 mt-2 bg-gradient-to-r from-[#1E88E5] to-[#0f172a] hover:from-[#3492f7] hover:to-[#1c2a4d] text-white rounded-xl font-semibold shadow-xl disabled:opacity-50"
//               >
//                 {btnLoading ? "Uploading..." : "🚀 Add Course"}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* COURSE CARDS */}
//       <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//         {courses && courses.length > 0 ? (
//           courses.map((course) => (
//             <CourseCard key={course._id} course={course} />
//           ))
//         ) : (
//           <p className="text-center col-span-full text-gray-400 text-lg">🚫 No Courses Available Yet</p>
//         )}
//       </div>
//     </div>
//   </Layout>
// );



return (
  <Layout>
    <div className="ipadpro:ml-[1%] ipadpro-landscape:ml-[1%] animate-fadeIn mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-[#0f172a] border-b border-[#1E88E5]/30 pb-4">
          All Courses
        </h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm && formRef.current) {
              formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1E88E5] to-[#0f172a] hover:from-[#3492f7] hover:to-[#1c2a4d] transition-all text-white font-medium shadow-lg"
        >
          {showForm ? "Hide Form" : "+ Add New Course"}
        </button>
      </div>

      {/* Course Form */}
{showForm && (
  <div
    ref={formRef}
    className="mt-8 bg-white rounded-2xl shadow-2xl p-10 border border-[#e0e0e0] transition-all duration-500"
  >
    <h3 className="text-2xl font-bold text-[#0f172a] mb-6 border-b pb-2 border-[#1E88E5]/30">
      📝 Add New Course
    </h3>

    <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { label: "Course Title", state: title, setState: setTitle, type: "text" },
        { label: "Short Description", state: description, setState: setDescription, type: "text" },
        { label: "Price (₹)", state: price, setState: setPrice, type: "number" },
        { label: "Created By", state: createdBy, setState: setCreatedBy, type: "text" },
        { label: "Duration (e.g. 6 weeks)", state: duration, setState: setDuration, type: "text" },
      ].map(({ label, state, setState, type }) => (
        <div key={label}>
          <label className="block text-sm text-gray-700 mb-1 font-medium">{label}</label>
          <input
            type={type}
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
            placeholder={label}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1E88E5] transition-all"
          />
        </div>
      ))}

      <div>
        <label className="block text-sm text-gray-700 mb-1 font-medium">Course Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
        >
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1 font-medium">Course Thumbnail</label>
        <input
          type="file"
          onChange={changeImageHandler}
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg cursor-pointer text-gray-800"
        />
        {imagePrev && (
          <img
            src={imagePrev}
            alt="Preview"
            className="mt-3 w-full h-40 object-cover rounded-xl border border-gray-200"
          />
        )}
      </div>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={btnLoading}
          className="w-full py-3 mt-4 bg-gradient-to-r from-[#1E88E5] to-[#0f172a] hover:from-[#3492f7] hover:to-[#1c2a4d] text-white rounded-xl font-semibold shadow-md transition-all disabled:opacity-60"
        >
          {btnLoading ? "Uploading..." : " Add Course"}
        </button>
      </div>
    </form>
  </div>
)}


      {/* Course Cards */}
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses && courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-400 text-lg">
            🚫 No Courses Available Yet
          </div>
        )}
      </div>
    </div>
  </Layout>
);


};

export default AdminCourses;


// import axios from 'axios';
// import React, { useRef, useState } from 'react';
// import { toast } from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';
// import CourseCard from '../../components/courseCard/CourseCard';
// import { CourseData } from '../../context/CourseContext';
// import { server } from '../../main';
// import Layout from '../Utils/Layout';

// const categories = [
//     "Web Development",
//     "App Development",
//     "Data Science",
//     "Artificial Intelligence",
//     "Machine Learning",
//     "Data Structure",
// ];

// const AdminCourses = ({ user }) => {
//     const navigate = useNavigate();
//     if (user && user.role !== "admin") return navigate("/");

//     // State management
//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const [category, setCategory] = useState("");
//     const [price, setPrice] = useState("");
//     const [createdBy, setCreatedBy] = useState("");
//     const [duration, setDuration] = useState("");
//     const [image, setImage] = useState("");
//     const [imagePrev, setImagePrev] = useState("");
//     const [btnLoading, setBtnLoading] = useState(false);
//     const [showForm, setShowForm] = useState(false);

//     const formRef = useRef(null);

//     const changeImageHandler = (e) => {
//         const file = e.target.files[0];
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onloadend = () => {
//             setImagePrev(reader.result);
//             setImage(file);
//         };
//     };

//     const { courses, fetchCourses } = CourseData();

//     const submitHandler = async (e) => {
//         e.preventDefault();
//         setBtnLoading(true);
//         const myForm = new FormData();
//         myForm.append("title", title);
//         myForm.append("description", description);
//         myForm.append("category", category);
//         myForm.append("price", price);
//         myForm.append("createdBy", createdBy);
//         myForm.append("duration", duration);
//         myForm.append("file", image);

//         try {
//             const { data } = await axios.post(`${server}/api/course/new`, myForm, {
//                 headers: {
//                     token: localStorage.getItem("token"),
//                 }
//             });
//             toast.success(data.message);
//             setBtnLoading(false);
//             await fetchCourses();
//             setImage("");
//             setTitle("");
//             setDescription("");
//             setDuration("");
//             setImagePrev("");
//             setCreatedBy("");
//             setPrice("");
//             setCategory("");
//             setShowForm(false);
//         } catch (error) {
//             toast.error(error.response.data.message);
//             setBtnLoading(false);
//         }
//     };

//     return (
//         <Layout>
//             <div className="animate-fadeIn mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
//                 <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6">All Courses</h2>
//                 <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
//                     <button
//                         onClick={() => {
//                             setShowForm(!showForm);
//                             if (!showForm && formRef.current) {
//                                 formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
//                             }
//                         }}
//                         className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
//                     >
//                         {showForm ? "Hide Form" : "New Course"}
//                     </button>
//                 </div>

//                 {showForm && (
//                     <div ref={formRef} className="mt-6 bg-white shadow-xl rounded-lg overflow-hidden mb-10">
//                         <div className="px-4 py-4 sm:px-6">
//                             <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">Add Course</h2>
//                             <form onSubmit={submitHandler} className="space-y-4 sm:space-y-6">
//                                 {[
//                                     { label: 'Title', state: title, setState: setTitle, type: 'text' },
//                                     { label: 'Description', state: description, setState: setDescription, type: 'text' },
//                                     { label: 'Price', state: price, setState: setPrice, type: 'number' },
//                                     { label: 'Created By', state: createdBy, setState: setCreatedBy, type: 'text' },
//                                     { label: 'Duration', state: duration, setState: setDuration, type: 'text' },
//                                 ].map(({ label, state, setState, type }) => (
//                                     <div key={label}>
//                                         <label htmlFor={label.toLowerCase()} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
//                                         <input
//                                             type={type}
//                                             value={state}
//                                             onChange={(e) => setState(e.target.value)}
//                                             required
//                                             className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                                         />
//                                     </div>
//                                 ))}

//                                 <div>
//                                     <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                                     <select
//                                         value={category}
//                                         onChange={(e) => setCategory(e.target.value)}
//                                         className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                                     >
//                                         <option value="">Select Category</option>
//                                         {categories.map((cat, index) => (
//                                             <option key={index} value={cat}>{cat}</option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 <div>
//                                     <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">Image</label>
//                                     <input
//                                         type="file"
//                                         required
//                                         onChange={changeImageHandler}
//                                         className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                     />
//                                     {imagePrev && <img src={imagePrev} alt="preview" className="mt-2 w-full h-48 sm:h-64 object-cover rounded-md border border-gray-200" />}
//                                 </div>

//                                 <button
//                                     type='submit'
//                                     disabled={btnLoading}
//                                     className="w-full py-2 px-4 sm:py-3 sm:px-6 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     {btnLoading ? "Please Wait..." : "Add Course"}
//                                 </button>
//                             </form>
//                         </div>
//                     </div>
//                 )}

//                 <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ipadpro:grid-cols-2 ipadpro-landscape:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
//                     {courses && courses.length > 0 ? (
//                         courses.map((course) => (
//                             <CourseCard key={course._id} course={course} />
//                         ))
//                     ) : (
//                         <p className="text-center col-span-full text-gray-600">No Courses Yet</p>
//                     )}
//                 </div>
//             </div>
//         </Layout>
//     );
// };

// export default AdminCourses;
