
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import { useNavigate, useParams } from 'react-router-dom';
// import Loading from '../../components/loading/Loading.jsx';
// import AnswerForm from '../../instructor/AnswerForm.jsx';
// import { server } from '../../main';

// const Lecture = ({ user }) => {
//     const [lectures, setLectures] = useState([]);
//     const [lecture, setLecture] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [lecLoading, setLecLoading] = useState(false);
//     const [showAddLectureForm, setShowAddLectureForm] = useState(false);
//     const [meetingFormVisible, setMeetingFormVisible] = useState(false);
//     const [meetingLink, setMeetingLink] = useState('');
//     const [meetingDate, setMeetingDate] = useState('');
//     const [meetingTime, setMeetingTime] = useState('');
//     const [platform, setPlatform] = useState('');
//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');
//     const [video, setVideo] = useState(null);
//     const [videoPreview, setVideoPreview] = useState('');
//     const [btnLoading, setBtnLoading] = useState(false);
//     const [courseMeetings, setCourseMeetings] = useState([]);
//     // States for instructor assignment
//     const [instructors, setInstructors] = useState([]);
//     const [selectedInstructor, setSelectedInstructor] = useState('');
//     const [currentInstructor, setCurrentInstructor] = useState(null);
//     const [assignLoading, setAssignLoading] = useState(false);

//     const params = useParams();
//     const navigate = useNavigate();

//     // Redirect non-subscribed users or non-admins
//     useEffect(() => {
//         if (user && user.role !== 'admin' && !user.subscription.includes(params.id)) {
//             navigate('/');
//         }
//     }, [user, params.id, navigate]);

//     // Fetch all lectures for the course
//     const fetchLectures = async () => {
//         try {
//             const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
//                 headers: { token: localStorage.getItem('token') },
//             });
//             setLectures(data.lectures);
//             await fetchCourseMeetings();
//             setLoading(false);
//         } catch (error) {
//             console.error('Failed to fetch lectures:', error);
//             toast.error('Error fetching lectures.');
//             setLoading(false);
//         }
//     };

//     // Fetch course meetings
//     const fetchCourseMeetings = async () => {
//         try {
//             const { data } = await axios.get(`${server}/api/course/${params.id}/meetings`, {
//                 headers: { token: localStorage.getItem('token') },
//             });
//             setCourseMeetings(data.meetings);
//         } catch (error) {
//             console.error('Failed to fetch meetings:', error);
//             toast.error('Error fetching meetings.');
//         }
//     };

//     // Fetch a specific lecture
//     const fetchLecture = async (id) => {
//         setLecLoading(true);
//         try {
//             const { data } = await axios.get(`${server}/api/lecture/${id}`, {
//                 headers: { token: localStorage.getItem('token') },
//             });
//             setLecture(data.lecture);
//         } catch (error) {
//             console.error('Failed to fetch lecture:', error);
//             toast.error('Error fetching lecture.');
//         } finally {
//             setLecLoading(false);
//         }
//     };

//     // Fetch all instructors (admin only)
//     const fetchInstructors = async () => {
//         try {
//             const { data } = await axios.get(`${server}/api/users`, {
//                 headers: { token: localStorage.getItem('token') },
//             });
//             const instructorList = data.users.filter((u) => u.role === 'instructor');
//             setInstructors(instructorList);
//         } catch (error) {
//             console.error('Failed to fetch instructors:', error);
//             toast.error('Error fetching instructors.');
//         }
//     };

//     // Fetch current course assignment (admin only)
// const fetchCourseAssignment = async () => {
//     try {
//         const { data } = await axios.get(`${server}/api/course/${params.id}`, {
//             headers: { token: localStorage.getItem('token') },
//         });

//         const instructorId = data.course.assignedTo;
//         setSelectedInstructor(instructorId || '');

//         if (!instructorId) {
//             setCurrentInstructor(null);
//         } else {
//             // Only look up instructor if we have a list loaded
//             const instructor = instructors.find((inst) => inst._id === instructorId);
//             setCurrentInstructor(instructor || { name: 'Unknown', email: 'N/A' });
//         }
//     } catch (error) {
//         console.error('Failed to fetch course assignment:', error);
//         toast.error('Error fetching course assignment.');
//     }
// };


//     // Handle instructor assignment/de-assignment (admin only)
//    const handleAssignInstructor = async () => {
//     setAssignLoading(true);
//     try {
//         const { data } = await axios.put(
//             `${server}/api/course/${params.id}/assign`,
//             { instructorId: selectedInstructor || null },
//             { headers: { token: localStorage.getItem('token') } }
//         );
//         toast.success(data.message);
//         fetchCourseAssignment(); // Refresh display
//     } catch (error) {
//         console.error('Error assigning instructor:', error);
//         toast.error(error.response?.data?.message || 'Error assigning instructor.');
//     } finally {
//         setAssignLoading(false);
//     }
// };

//     const handleVideoChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setVideoPreview(reader.result);
//                 setVideo(file);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleSubmitLecture = async (e) => {
//         e.preventDefault();
//         setBtnLoading(true);
//         const formData = new FormData();
//         formData.append('title', title);
//         formData.append('description', description);
//         formData.append('file', video);

//         try {
//             const { data } = await axios.post(`${server}/api/course/${params.id}`, formData, {
//                 headers: { token: localStorage.getItem('token') },
//             });
//             toast.success(data.message);
//             setShowAddLectureForm(false);
//             fetchLectures();
//             resetLectureForm();
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Error adding lecture.');
//         } finally {
//             setBtnLoading(false);
//         }
//     };

//     const handleDeleteLecture = async (id) => {
//         if (confirm('Are you sure you want to delete this lecture?')) {
//             try {
//                 const { data } = await axios.delete(`${server}/api/lecture/${id}`, {
//                     headers: { token: localStorage.getItem('token') },
//                 });
//                 toast.success(data.message);
//                 fetchLectures();
//             } catch (error) {
//                 toast.error(error.response?.data?.message || 'Error deleting lecture.');
//             }
//         }
//     };

//     const handleSubmitMeeting = async (e) => {
//         e.preventDefault();
//         const meetingData = { platform, meetingDate, meetingTime, meetingLink };

//         try {
//             const response = await axios.post(`${server}/api/course/${params.id}/meeting`, meetingData, {
//                 headers: { token: localStorage.getItem('token') },
//             });
//             toast.success(response.data.message);
//             setMeetingFormVisible(false);
//             resetMeetingForm();
//             fetchCourseMeetings();
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Error creating meeting.');
//         }
//     };

//     const handleDeleteMeeting = async (id) => {
//         if (confirm('Are you sure you want to delete this meeting?')) {
//             try {
//                 const { data } = await axios.delete(`${server}/api/course/${params.id}/meeting/${id}`, {
//                     headers: { token: localStorage.getItem('token') },
//                 });
//                 toast.success(data.message);
//                 fetchCourseMeetings();
//             } catch (error) {
//                 toast.error(error.response?.data?.message || 'Error deleting meeting.');
//             }
//         }
//     };

//     const resetLectureForm = () => {
//         setTitle('');
//         setDescription('');
//         setVideo(null);
//         setVideoPreview('');
//     };

//     const resetMeetingForm = () => {
//         setMeetingLink('');
//         setMeetingDate('');
//         setMeetingTime('');
//         setPlatform('');
//     };

//     // Initial data fetch
//     useEffect(() => {
//         fetchLectures();
//         if (user && user.role === 'admin') {
//             fetchInstructors();
//             fetchCourseAssignment();
//         }
//     }, [user]);

//     const convertTo12Hour = (time24) => {
//         const [hours, minutes] = time24.split(':');
//         let period = 'AM';
//         let hours12 = parseInt(hours);

//         if (hours12 >= 12) {
//             period = 'PM';
//             if (hours12 > 12) hours12 -= 12;
//         }
//         if (hours12 === 0) hours12 = 12;

//         return `${hours12}:${minutes} ${period}`;
//     };

//     return (
//         <div className="container mx-auto p-6 min-h-screen overflow-y-auto pb-20">
//             {loading ? (
//                 <Loading />
//             ) : (
//                 <div className="flex flex-col md:flex-row gap-8">
//                     {/* Left Section - Lecture Content */}
//                     <div className="w-full md:w-2/3 p-6 bg-white rounded-lg shadow-md">
//                         {lecLoading ? (
//                             <Loading />
//                         ) : (
//                             <>
//                                 {lecture.video ? (
//                                     <div className="mb-6">
//                                         <video
//                                             src={lecture.video}
//                                             className="w-full rounded-md mb-4"
//                                             controls
//                                         />
//                                         <h2 className="text-3xl font-semibold text-gray-800">{lecture.title}</h2>
//                                         <p className="text-lg text-gray-600">{lecture.description}</p>
//                                     </div>
//                                 ) : (
//                                     <h2 className="text-xl font-semibold text-gray-800">Select a Lecture to View</h2>
//                                 )}
//                             </>
//                         )}
//                     </div>

//                     {/* Right Section - Admin Controls */}
//                     <div className="w-full md:w-1/3 space-y-6">
//                         {user && user.role === 'admin' && (
//                             <>
//                                 {/* Instructor Assignment Section */}
//                                 <div className="bg-white p-6 rounded-lg shadow-md">
//                                     <h3 className="text-xl font-semibold mb-4">Assign Instructor</h3>
//                                     <div className="flex flex-col space-y-4">
//                                         <select
//                                             value={selectedInstructor}
//                                             onChange={(e) => setSelectedInstructor(e.target.value)}
//                                             className="w-full p-3 border rounded-md shadow-sm"
//                                         >
//                                             <option value="">Select an Instructor</option>
//                                             {instructors.map((instructor) => (
//                                                 <option key={instructor._id} value={instructor._id}>
//                                                     {instructor.name} ({instructor.email})
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         <button
//                                             onClick={handleAssignInstructor}
//                                             disabled={assignLoading}
//                                             className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
//                                         >
//                                             {assignLoading ? 'Assigning...' : currentInstructor ? 'Update Assignment' : 'Assign Instructor'}
//                                         </button>


//                                         <p className="text-gray-600">
//                                             {currentInstructor
//                                                 ? ` `
//                                                 : 'No instructor assigned'}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 {/* Add Lecture Button */}
//                                 <div className="flex justify-between items-center">
//                                     <button
//                                         onClick={() => setShowAddLectureForm(!showAddLectureForm)}
//                                         className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
//                                     >
//                                         {showAddLectureForm ? 'Close' : 'Add Lecture'}
//                                     </button>
//                                 </div>

//                                 {/* Add Lecture Form */}
//                                 {showAddLectureForm && (
//                                     <div className="bg-white p-6 rounded-lg shadow-md">
//                                         <h3 className="text-2xl font-semibold mb-4">Add New Lecture</h3>
//                                         <form onSubmit={handleSubmitLecture}>
//                                             <input
//                                                 type="text"
//                                                 value={title}
//                                                 onChange={(e) => setTitle(e.target.value)}
//                                                 placeholder="Lecture Title"
//                                                 className="w-full p-3 mb-4 border rounded-md shadow-sm"
//                                                 required
//                                             />
//                                             <input
//                                                 type="text"
//                                                 value={description}
//                                                 onChange={(e) => setDescription(e.target.value)}
//                                                 placeholder="Lecture Description"
//                                                 className="w-full p-3 mb-4 border rounded-md shadow-sm"
//                                                 required
//                                             />
//                                             <input
//                                                 type="file"
//                                                 accept="video/*"
//                                                 onChange={handleVideoChange}
//                                                 className="w-full mb-4"
//                                                 required
//                                             />
//                                             {videoPreview && (
//                                                 <video src={videoPreview} className="w-1/3 mb-4" controls />
//                                             )}
//                                             <button
//                                                 type="submit"
//                                                 disabled={btnLoading}
//                                                 className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition"
//                                             >
//                                                 {btnLoading ? 'Please Wait...' : 'Add Lecture'}
//                                             </button>
//                                         </form>
//                                     </div>
//                                 )}

//                                 {/* Add Meeting Button */}
//                                 <button
//                                     onClick={() => setMeetingFormVisible(!meetingFormVisible)}
//                                     className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
//                                 >
//                                     {meetingFormVisible ? 'Close Meeting Form' : 'Add Meeting'}
//                                 </button>

//                                 {/* Add Meeting Form */}
//                                 {meetingFormVisible && (
//                                     <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full mx-auto">
//                                         <h3 className="text-2xl font-semibold mb-4">Create Meeting</h3>
//                                         <form onSubmit={handleSubmitMeeting} className="space-y-4">
//                                             <div className="w-full">
//                                                 <input
//                                                     type="text"
//                                                     value={platform}
//                                                     onChange={(e) => setPlatform(e.target.value)}
//                                                     placeholder="Platform"
//                                                     className="w-full p-3 mb-4 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500"
//                                                     required
//                                                 />
//                                             </div>
//                                             <div className="w-full">
//                                                 <input
//                                                     type="date"
//                                                     value={meetingDate}
//                                                     onChange={(e) => setMeetingDate(e.target.value)}
//                                                     className="w-full p-3 mb-4 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500"
//                                                     required
//                                                 />
//                                             </div>
//                                             <div className="w-full">
//                                                 <input
//                                                     type="time"
//                                                     value={meetingTime}
//                                                     onChange={(e) => setMeetingTime(e.target.value)}
//                                                     className="w-full p-3 mb-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
//                                                     required
//                                                     step="60"
//                                                 />
//                                             </div>
//                                             <div className="w-full">
//                                                 <input
//                                                     type="url"
//                                                     value={meetingLink}
//                                                     onChange={(e) => setMeetingLink(e.target.value)}
//                                                     placeholder="Meeting Link"
//                                                     className="w-full p-3 mb-4 border rounded-md shadow-sm focus:ring-2 focus:ring-green-500"
//                                                     required
//                                                 />
//                                             </div>
//                                             <div className="flex justify-center">
//                                                 <button
//                                                     type="submit"
//                                                     className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
//                                                 >
//                                                     Create Meeting
//                                                 </button>
//                                             </div>
//                                         </form>
//                                     </div>
//                                 )}

//                                 {/* Lectures List */}
//                                 <div>
//                                     <h3 className="text-xl font-semibold mb-4">Lectures</h3>
//                                     {lectures.length ? (
//                                         lectures.map((lec, i) => (
//                                             <div key={lec._id} className="flex justify-between items-center mb-4">
//                                                 <div
//                                                     onClick={() => fetchLecture(lec._id)}
//                                                     className={`cursor-pointer px-4 py-2 rounded-md hover:bg-gray-100 ${
//                                                         i === 0 ? 'bg-blue-100' : 'bg-gray-50'
//                                                     }`}
//                                                 >
//                                                     {lec.title}
//                                                 </div>
//                                                 <button
//                                                     onClick={() => handleDeleteLecture(lec._id)}
//                                                     className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
//                                                 >
//                                                     Delete
//                                                 </button>
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <p>No lectures available</p>
//                                     )}
//                                 </div>

//                                 {/* Meetings List */}
//                                 <div>
//                                     <h3 className="text-xl font-semibold mb-4">Meetings</h3>
//                                     {courseMeetings.length ? (
//                                         courseMeetings.map((meeting) => (
//                                             <div key={meeting._id} className="flex justify-between items-center mb-4">
//                                                 <div className="flex flex-col">
//                                                     <span className="font-semibold">{meeting.platform}</span>
//                                                     <span>Date: {new Date(meeting.meetingDate).toLocaleDateString()}</span>
//                                                     <span>Time: {convertTo12Hour(meeting.meetingTime)}</span>
//                                                     <a
//                                                         href={meeting.meetingLink}
//                                                         target="_blank"
//                                                         rel="noopener noreferrer"
//                                                         className="text-blue-500"
//                                                     >
//                                                         Join Meeting
//                                                     </a>
//                                                 </div>
//                                                 <button
//                                                     onClick={() => handleDeleteMeeting(meeting._id)}
//                                                     className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
//                                                 >
//                                                     Delete
//                                                 </button>
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <p>No meetings scheduled</p>
//                                     )}
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             )}
//             {/* Course Questions Section */}
//             {user && (user.role === 'admin' || user.role === 'instructor') && (
//                 <div className="mt-8 p-6">
//                     <AnswerForm courseId={params.id} />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Lecture;




// //////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////


import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../components/loading/Loading.jsx';
import AnswerForm from '../../instructor/AnswerForm.jsx';
import { server } from '../../main';

const Lecture = ({ user }) => {
    const [lectures, setLectures] = useState([]);
    const [lecture, setLecture] = useState({});
    const [loading, setLoading] = useState(true);
    const [lecLoading, setLecLoading] = useState(false);
    const [showAddLectureForm, setShowAddLectureForm] = useState(false);
    const [meetingFormVisible, setMeetingFormVisible] = useState(false);
    const [meetingLink, setMeetingLink] = useState('');
    const [meetingDate, setMeetingDate] = useState('');
    const [meetingTime, setMeetingTime] = useState('');
    const [platform, setPlatform] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [video, setVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);
    const [courseMeetings, setCourseMeetings] = useState([]);
    // States for instructor assignment
    const [instructors, setInstructors] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState('');
    const [currentInstructor, setCurrentInstructor] = useState(null);
    const [assignLoading, setAssignLoading] = useState(false);

    const params = useParams();
    const navigate = useNavigate();

    // Redirect non-subscribed users or non-admins
    useEffect(() => {
        if (user && user.role !== 'admin' && !user.subscription.includes(params.id)) {
            navigate('/');
        }
    }, [user, params.id, navigate]);

    // Fetch all lectures for the course
    const fetchLectures = async () => {
        try {
            const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
                headers: { token: localStorage.getItem('token') },
            });
            setLectures(data.lectures);
            await fetchCourseMeetings();
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch lectures:', error);
            toast.error('Error fetching lectures.');
            setLoading(false);
        }
    };

    // Fetch course meetings
    const fetchCourseMeetings = async () => {
        try {
            const { data } = await axios.get(`${server}/api/course/${params.id}/meetings`, {
                headers: { token: localStorage.getItem('token') },
            });
            setCourseMeetings(data.meetings);
        } catch (error) {
            console.error('Failed to fetch meetings:', error);
            toast.error('Error fetching meetings.');
        }
    };

    // Fetch a specific lecture
    const fetchLecture = async (id) => {
        setLecLoading(true);
        try {
            const { data } = await axios.get(`${server}/api/lecture/${id}`, {
                headers: { token: localStorage.getItem('token') },
            });
            setLecture(data.lecture);
        } catch (error) {
            console.error('Failed to fetch lecture:', error);
            toast.error('Error fetching lecture.');
        } finally {
            setLecLoading(false);
        }
    };

    // Fetch all instructors (admin only)
    const fetchInstructors = async () => {
        try {
            const { data } = await axios.get(`${server}/api/users`, {
                headers: { token: localStorage.getItem('token') },
            });
            const instructorList = data.users.filter((u) => u.role === 'instructor');
            setInstructors(instructorList);
        } catch (error) {
            console.error('Failed to fetch instructors:', error);
            toast.error('Error fetching instructors.');
        }
    };

    // Fetch current course assignment (admin only)
    const fetchCourseAssignment = async () => {
        try {
            const { data } = await axios.get(`${server}/api/course/${params.id}`, {
                headers: { token: localStorage.getItem('token') },
            });

            const instructorId = data.course.assignedTo;
            setSelectedInstructor(instructorId || '');

            if (!instructorId) {
                setCurrentInstructor(null);
            } else {
                // Only look up instructor if we have a list loaded
                const instructor = instructors.find((inst) => inst._id === instructorId);
                setCurrentInstructor(instructor || { name: 'Unknown', email: 'N/A' });
            }
        } catch (error) {
            console.error('Failed to fetch course assignment:', error);
            toast.error('Error fetching course assignment.');
        }
    };


    // Handle instructor assignment/de-assignment (admin only)
    const handleAssignInstructor = async () => {
        setAssignLoading(true);
        try {
            const { data } = await axios.put(
                `${server}/api/course/${params.id}/assign`,
                { instructorId: selectedInstructor || null },
                { headers: { token: localStorage.getItem('token') } }
            );
            toast.success(data.message);
            fetchCourseAssignment(); // Refresh display
        } catch (error) {
            console.error('Error assigning instructor:', error);
            toast.error(error.response?.data?.message || 'Error assigning instructor.');
        } finally {
            setAssignLoading(false);
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setVideoPreview(reader.result);
                setVideo(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitLecture = async (e) => {
        e.preventDefault();
        setBtnLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('file', video);

        try {
            const { data } = await axios.post(`${server}/api/course/${params.id}`, formData, {
                headers: { token: localStorage.getItem('token') },
            });
            toast.success(data.message);
            setShowAddLectureForm(false);
            fetchLectures();
            resetLectureForm();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding lecture.');
        } finally {
            setBtnLoading(false);
        }
    };

    const handleDeleteLecture = async (id) => {
        if (confirm('Are you sure you want to delete this lecture?')) {
            try {
                const { data } = await axios.delete(`${server}/api/lecture/${id}`, {
                    headers: { token: localStorage.getItem('token') },
                });
                toast.success(data.message);
                fetchLectures();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error deleting lecture.');
            }
        }
    };

    const handleSubmitMeeting = async (e) => {
        e.preventDefault();
        const meetingData = { platform, meetingDate, meetingTime, meetingLink };

        try {
            const response = await axios.post(`${server}/api/course/${params.id}/meeting`, meetingData, {
                headers: { token: localStorage.getItem('token') },
            });
            toast.success(response.data.message);
            setMeetingFormVisible(false);
            resetMeetingForm();
            fetchCourseMeetings();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating meeting.');
        }
    };

    const handleDeleteMeeting = async (id) => {
        if (confirm('Are you sure you want to delete this meeting?')) {
            try {
                const { data } = await axios.delete(`${server}/api/course/${params.id}/meeting/${id}`, {
                    headers: { token: localStorage.getItem('token') },
                });
                toast.success(data.message);
                fetchCourseMeetings();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error deleting meeting.');
            }
        }
    };

    const resetLectureForm = () => {
        setTitle('');
        setDescription('');
        setVideo(null);
        setVideoPreview('');
    };

    const resetMeetingForm = () => {
        setMeetingLink('');
        setMeetingDate('');
        setMeetingTime('');
        setPlatform('');
    };

    // Initial data fetch
    useEffect(() => {
        fetchLectures();
        if (user && user.role === 'admin') {
            fetchInstructors();
            fetchCourseAssignment();
        }
    }, [user]);

    const convertTo12Hour = (time24) => {
        const [hours, minutes] = time24.split(':');
        let period = 'AM';
        let hours12 = parseInt(hours);

        if (hours12 >= 12) {
            period = 'PM';
            if (hours12 > 12) hours12 -= 12;
        }
        if (hours12 === 0) hours12 = 12;

        return `${hours12}:${minutes} ${period}`;
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen overflow-y-auto">
            {loading ? (
                <Loading />
            ) : (
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Section - Lecture Content */}
                    <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-lg p-6">
                        {lecLoading ? (
                            <Loading />
                        ) : lecture.video ? (
                            <div>
                                <video
                                    src={lecture.video}
                                    className="w-full rounded-xl mb-4 shadow"
                                    controls
                                />
                                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-[#1E88E5] mb-2">
                                    {lecture.title}
                                </h2>
                                <p className="text-lg text-gray-600">{lecture.description}</p>
                            </div>
                        ) : (
                            <h2 className="text-xl font-semibold text-gray-800">
                                Select a Lecture to View
                            </h2>
                        )}
                    </div>

                    {/* Right Section - Admin Controls */}
                    <div className="w-full md:w-1/3 space-y-6">
                        {user?.role === 'admin' && (
                            <>
                                {/* Assign Instructor Section */}
                                <div className="bg-white p-6 rounded-2xl shadow-lg">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                                        Assign Instructor
                                    </h3>
                                    <div className="space-y-4">
                                        <select
                                            value={selectedInstructor}
                                            onChange={(e) => setSelectedInstructor(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select an Instructor</option>
                                            {instructors.map((instructor) => (
                                                <option key={instructor._id} value={instructor._id}>
                                                    {instructor.name} ({instructor.email})
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={handleAssignInstructor}
                                            disabled={assignLoading}
                                            className="w-full bg-gradient-to-r from-blue-600 to-[#1E88E5] text-white py-2 px-4 rounded-lg font-semibold hover:brightness-110 transition"
                                        >
                                            {assignLoading
                                                ? 'Assigning...'
                                                : currentInstructor
                                                    ? 'Update Assignment'
                                                    : 'Assign Instructor'}
                                        </button>
                                        <p className="text-sm text-gray-500">
                                            {currentInstructor ? `Currently assigned.` : 'No instructor assigned'}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            {/* Add Meeting Button */}
            {meetingFormVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-lg w-full mx-4 animate-fadeIn">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">Create Meeting</h3>
                        <form onSubmit={handleSubmitMeeting} className="space-y-4">
                            <input
                                type="text"
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                                placeholder="Platform"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                                required
                            />
                            <input
                                type="date"
                                value={meetingDate}
                                onChange={(e) => setMeetingDate(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                                required
                            />
                            <input
                                type="time"
                                value={meetingTime}
                                onChange={(e) => setMeetingTime(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                                required
                                step="60"
                            />
                            <input
                                type="url"
                                value={meetingLink}
                                onChange={(e) => setMeetingLink(e.target.value)}
                                placeholder="Meeting Link"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                                required
                            />
                            <div className="flex justify-end space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setMeetingFormVisible(false)}
                                    className="text-gray-600 hover:text-red-500 font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-600 to-[#1E88E5] text-white py-2 px-6 rounded-lg font-semibold hover:brightness-110 transition"
                                >
                                    Create Meeting
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Lecture Section */}
            <div className="bg-white p-6 rounded-2xl shadow-lg mt-6 relative">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-extrabold text-[#1E88E5] mb-6">Lectures</h3>
                    <button
                        onClick={() => setShowAddLectureForm(true)}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium py-2 px-6 rounded-xl hover:brightness-110 transition"
                    >
                        Add Lecture
                    </button>
                </div>

                {/* Modal for Add Lecture Form */}
                {showAddLectureForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md mx-4 relative">
                            <button
                                onClick={() => setShowAddLectureForm(false)}
                                className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold"
                            >
                                &times;
                            </button>
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">Add New Lecture</h3>
                            <form onSubmit={handleSubmitLecture} className="space-y-4">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Lecture Title"
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                                    required
                                />
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Lecture Description"
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                                    required
                                />
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoChange}
                                    className="w-full p-3 bg-gray-50 rounded-lg border"
                                    required
                                />
                                {videoPreview && (
                                    <video src={videoPreview} className="w-full rounded-lg mb-2" controls />
                                )}
                                <button
                                    type="submit"
                                    disabled={btnLoading}
                                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:brightness-110 transition"
                                >
                                    {btnLoading ? 'Please Wait...' : 'Add Lecture'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Scrollable Lecture List */}
                <div className="max-h-96 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    {lectures.length ? (
                        lectures.map((lec, i) => (
                            <div key={lec._id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                                <div
                                    onClick={() => fetchLecture(lec._id)}
                                    className={`cursor-pointer w-full px-4 py-2 rounded-md transition font-medium ${i === 0 ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 text-gray-800'
                                        }`}
                                >
                                    {lec.title}
                                </div>
                                <button
                                    onClick={() => handleDeleteLecture(lec._id)}
                                    className="ml-2 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No lectures available</p>
                    )}
                </div>
            </div>

            {/* ///////////////////////////////// */}

            {/* Meetings List */}

            <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-extrabold text-[#1E88E5] mb-6">Meetings</h3>
                    <button
                        onClick={() => setMeetingFormVisible(!meetingFormVisible)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-2 px-6 rounded-xl hover:brightness-110 transition"
                    >
                        {meetingFormVisible ? 'Close Meeting Form' : 'Add Meeting'}
                    </button>
                </div>

                {/* Scrollable meeting list */}
                <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {courseMeetings.length ? (
                        courseMeetings.map((meeting) => (
                            <div key={meeting._id} className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
                                <div className="flex flex-col text-sm text-gray-700">
                                    <span className="font-semibold text-base">{meeting.platform}</span>
                                    <span>Date: {new Date(meeting.meetingDate).toLocaleDateString()}</span>
                                    <span>Time: {convertTo12Hour(meeting.meetingTime)}</span>
                                    <a
                                        href={meeting.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline mt-1"
                                    >
                                        Join Meeting
                                    </a>
                                </div>
                                <button
                                    onClick={() => handleDeleteMeeting(meeting._id)}
                                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No meetings scheduled</p>
                    )}
                </div>
            </div>
            {/* ///////////////////////////////// */}
            {/* Course Questions Section */}
            {user && (user.role === 'admin' || user.role === 'instructor') && (
                <div className=" mt-10">

                    <AnswerForm courseId={params.id} />
                </div>
            )}

        </div>
    );

};

export default Lecture;

