import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { server } from "../main";
import CourseQuestions from "./AnswerForm.jsx";
import InsLectures from "./InsLectures.jsx";
import Sidebar from "./Sidebar";

const InstructorCourseManagement = ({ user }) => {
  const [courseMeetings, setCourseMeetings] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]); // State for enrolled students
  const [showStudents, setShowStudents] = useState(false); // State to toggle student list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showLectures, setShowLectures] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    title: "",
    description: "",
    deadline: "",
    questions: [],
  });
  const [newQuestion, setNewQuestion] = useState({
    type: "free-text",
    questionText: "",
    options: [],
    maxMarks: 1,
  });
  const [submissions, setSubmissions] = useState({});
  const [editingMarks, setEditingMarks] = useState({});

  const params = useParams();
  const navigate = useNavigate();

  // Redirect if user is not authenticated or not an instructor/admin
  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    navigate("/login");
    return null;
  }

  const fetchCourseMeetings = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/course/${params.id}/meetings`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      setCourseMeetings(data.meetings);
    } catch (error) {
      toast.error("Error fetching meetings.");
      setError("Failed to fetch meetings.");
    }
  };

  const fetchAssignments = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/course/${params.id}/assignments`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      setAssignments(data.assignments);
      const submissionsData = {};
      for (const assignment of data.assignments) {
        try {
          const { data: subData } = await axios.get(
            `${server}/api/assignment/${assignment._id}/submissions`,
            { headers: { token: localStorage.getItem("token") } }
          );
          submissionsData[assignment._id] = subData;
        } catch (subError) {
          submissionsData[assignment._id] = { submissions: [] };
        }
      }
      setSubmissions(submissionsData);
    } catch (error) {
      toast.error("Error fetching assignments.");
      setError("Failed to fetch assignments.");
    }
  };

  const fetchEnrolledStudents = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/course/${params.id}/students`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      setEnrolledStudents(data.students);
    } catch (error) {
      toast.error("Error fetching enrolled students.");
      console.error("Error fetching enrolled students:", error);
    }
  };

  const handleToggleStudents = () => {
    if (!showStudents) {
      fetchEnrolledStudents(); // Fetch students when showing the list
    }
    setShowStudents(!showStudents);
  };

  const createAssignment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No authentication token found. Please log in.");
      navigate("/login");
      return;
    }

    if (assignmentData.questions.length === 0) {
      toast.error("Please add at least one question.");
      return;
    }

    const formattedData = {
      ...assignmentData,
      deadline: assignmentData.deadline
        ? new Date(assignmentData.deadline).toISOString()
        : null,
    };

    try {
      const { data } = await axios.post(
        `${server}/api/course/${params.id}/assignment`,
        formattedData,
        { headers: { token } }
      );
      toast.success(data.message);
      setAssignments([...assignments, data.assignment]);
      setSubmissions({
        ...submissions,
        [data.assignment._id]: { submissions: [] },
      });
      setShowAssignmentForm(false);
      setAssignmentData({
        title: "",
        description: "",
        deadline: "",
        questions: [],
      });
      setNewQuestion({
        type: "free-text",
        questionText: "",
        options: [],
        maxMarks: 1,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error creating assignment."
      );
    }
  };

  const deleteAssignment = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?"))
      return;
    try {
      const { data } = await axios.delete(
        `${server}/api/assignment/${assignmentId}`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      toast.success(data.message);
      setAssignments(
        assignments.filter((assignment) => assignment._id !== assignmentId)
      );
      const updatedSubmissions = { ...submissions };
      delete updatedSubmissions[assignmentId];
      setSubmissions(updatedSubmissions);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error deleting assignment."
      );
    }
  };

  const updateMarks = async (assignmentId, submissionId, newMarks) => {
    try {
      const { data } = await axios.put(
        `${server}/api/assignment/${assignmentId}/submission/${submissionId}`,
        { marks: newMarks },
        { headers: { token: localStorage.getItem("token") } }
      );
      toast.success(data.message);
      setSubmissions((prev) => ({
        ...prev,
        [assignmentId]: {
          ...prev[assignmentId],
          submissions: prev[assignmentId].submissions.map((sub) =>
            sub._id === submissionId ? { ...sub, marks: newMarks } : sub
          ),
        },
      }));
      setEditingMarks((prev) => ({ ...prev, [submissionId]: false }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating marks.");
    }
  };

  const addOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, { text: "", isCorrect: false }],
    });
  };

  const updateOption = (index, field, value) => {
    const updatedOptions = newQuestion.options.map((opt, i) =>
      i === index
        ? { ...opt, [field]: field === "isCorrect" ? !opt.isCorrect : value }
        : opt
    );
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const addQuestion = () => {
    if (!newQuestion.questionText) {
      toast.error("Please enter the question text.");
      return;
    }
    if (
      (newQuestion.type === "mcq" || newQuestion.type === "true-false") &&
      (newQuestion.options.length === 0 ||
        newQuestion.options.some((opt) => !opt.text))
    ) {
      toast.error("Please fill out all options for the question.");
      return;
    }
    if (
      (newQuestion.type === "mcq" || newQuestion.type === "true-false") &&
      !newQuestion.options.some((opt) => opt.isCorrect)
    ) {
      toast.error("Please mark at least one option as correct.");
      return;
    }
    if (newQuestion.type === "true-false" && newQuestion.options.length !== 2) {
      toast.error("True/False questions must have exactly 2 options.");
      return;
    }
    setAssignmentData({
      ...assignmentData,
      questions: [...assignmentData.questions, newQuestion],
    });
    setNewQuestion({
      type: "free-text",
      questionText: "",
      options: [],
      maxMarks: 1,
    });
  };

  const convertTo12Hour = (time24) => {
    const [hours, minutes] = time24.split(":");
    let period = "AM";
    let hours12 = parseInt(hours);
    if (hours12 >= 12) {
      period = "PM";
      if (hours12 > 12) hours12 -= 12;
    }
    if (hours12 === 0) hours12 = 12;
    return `${hours12}:${minutes} ${period}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchCourseMeetings().catch((error) => {
          console.error("Error fetching meetings:", error);
        }),
        fetchAssignments().catch((error) => {
          console.error("Error fetching assignments:", error);
        }),
      ]);
      setLoading(false);
    };
    fetchData();
  }, [params.id]);
  const now = new Date();

  const sortedMeetings = [...courseMeetings]
    .sort((a, b) => new Date(a.meetingDate + 'T' + a.meetingTime) - new Date(b.meetingDate + 'T' + b.meetingTime))
    .sort((a, b) => {
      const aTime = new Date(`${a.meetingDate}T${a.meetingTime}`);
      const bTime = new Date(`${b.meetingDate}T${b.meetingTime}`);
      const aIsUpcoming = aTime >= now;
      const bIsUpcoming = bTime >= now;
      return (aIsUpcoming === bIsUpcoming) ? 0 : aIsUpcoming ? -1 : 1;
    });

  return (
    <div className="flex h-screen bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6  animate-fadeIn">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E88E5]"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-gray-600">{error}</div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1E88E5] to-black text-transparent bg-clip-text">
                Course Management
              </h1>
              <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
                <button
                  onClick={() => setShowAssignmentForm(!showAssignmentForm)}
                  className="bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold py-2 px-5 rounded-xl shadow hover:shadow-lg transition-all"
                >
                  {showAssignmentForm ? "Cancel" : "Create Assignment"}
                </button>
                <button
                  onClick={() => setShowLectures(!showLectures)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 px-5 rounded-xl shadow hover:shadow-lg transition-all"
                >
                  {showLectures ? "Hide Lectures" : "View Lectures"}
                </button>
                <button
                  onClick={handleToggleStudents}
                  className="bg-gradient-to-r from-[#1E88E5] to-black text-white font-semibold py-2 px-5 rounded-xl shadow hover:shadow-lg transition-all"
                >
                  {showStudents ? "Hide Students" : "View Enrolled Students"}
                </button>
              </div>
            </div>

            {/* Lectures Section */}
            {showLectures && <InsLectures courseId={params.id} />}

            {/* Students Section */}
            {showStudents && (
              <div className="bg-white rounded-2xl shadow-lg p-6 animate-slideUp">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Enrolled Students ({enrolledStudents.length})
                </h2>
                {enrolledStudents.length > 0 ? (
                  <div className="space-y-4">
                    {enrolledStudents.map((student) => (
                      <div
                        key={student._id}
                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        <p className="text-sm font-medium text-gray-900">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 text-lg">
                    No students enrolled yet
                  </p>
                )}
              </div>
            )}

            {/* //////////////////////////// */}
            {showAssignmentForm && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
                <div className="relative bg-white w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl p-8 animate-slideUp space-y-6">

                  {/* ❌ Close Button */}
                  <button
                    onClick={() => setShowAssignmentForm(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                    Create New Assignment
                  </h2>

                  <form onSubmit={createAssignment} className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={assignmentData.title}
                        onChange={(e) =>
                          setAssignmentData({ ...assignmentData, title: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#1E88E5] focus:outline-none"
                        placeholder="Enter assignment title"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                      <textarea
                        value={assignmentData.description}
                        onChange={(e) =>
                          setAssignmentData({ ...assignmentData, description: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#1E88E5] focus:outline-none"
                        rows="3"
                        placeholder="Provide a brief description"
                        required
                      />
                    </div>

                    {/* Deadline */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Deadline</label>
                      <input
                        type="datetime-local"
                        value={assignmentData.deadline}
                        onChange={(e) =>
                          setAssignmentData({ ...assignmentData, deadline: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#1E88E5] focus:outline-none"
                      />
                    </div>

                    {/* Existing Questions */}
                    {assignmentData.questions.length > 0 && (
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">📌 Added Questions</h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                          {assignmentData.questions.map((q, index) => (
                            <li key={index}>
                              <span className="font-semibold">[{q.type}]</span> {q.questionText} (Max Marks: {q.maxMarks})
                              <button
                                type="button"
                                onClick={() =>
                                  setAssignmentData({
                                    ...assignmentData,
                                    questions: assignmentData.questions.filter((_, i) => i !== index),
                                  })
                                }
                                className="text-red-500 ml-2 text-xs hover:underline"
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Add New Question */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">➕ Add New Question</h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Question Type</label>
                          <select
                            value={newQuestion.type}
                            onChange={(e) =>
                              setNewQuestion({ ...newQuestion, type: e.target.value, options: [] })
                            }
                            className="w-full border border-gray-300 rounded-xl p-2"
                          >
                            <option value="free-text">Free Text</option>
                            <option value="mcq">Multiple Choice (MCQ)</option>
                            <option value="true-false">True/False</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Max Marks</label>
                          <input
                            type="number"
                            min="1"
                            value={newQuestion.maxMarks}
                            onChange={(e) =>
                              setNewQuestion({
                                ...newQuestion,
                                maxMarks: parseInt(e.target.value) || 1,
                              })
                            }
                            className="w-full border border-gray-300 rounded-xl p-2"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Question Text</label>
                        <input
                          type="text"
                          value={newQuestion.questionText}
                          onChange={(e) =>
                            setNewQuestion({ ...newQuestion, questionText: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-xl p-2"
                        />
                      </div>

                      {(newQuestion.type === "mcq" || newQuestion.type === "true-false") && (
                        <div className="space-y-3">
                          {newQuestion.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={option.text}
                                onChange={(e) => updateOption(index, "text", e.target.value)}
                                className="flex-grow border border-gray-300 rounded-lg p-2"
                                placeholder={`Option ${index + 1}`}
                              />
                              <input
                                type="checkbox"
                                checked={option.isCorrect}
                                onChange={() => updateOption(index, "isCorrect")}
                              />
                              <label className="text-sm">Correct</label>
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setNewQuestion({
                                      ...newQuestion,
                                      options: newQuestion.options.filter((_, i) => i !== index),
                                    })
                                  }
                                  className="text-red-500 text-xs hover:underline"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addOption}
                            className="bg-[#1E88E5] text-white px-4 py-1 rounded-md hover:bg-[#1565C0]"
                          >
                            ➕ Add Option
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={addQuestion}
                        className="bg-green-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        ✅ Add This Question
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-[#1E88E5] text-white text-lg font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition"
                    >
                      Create Assignment
                    </button>
                  </form>
                </div>
              </div>
            )}



            {/* Meetings Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
              <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-black mb-6">
                Scheduled Meetings
              </h2>

              {sortedMeetings.length > 0 ? (
                <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                    {sortedMeetings.map((meeting) => (
                      <div
                        key={meeting._id}
                        className="bg-gradient-to-tr from-indigo-50 to-blue-100 p-5 rounded-xl shadow hover:shadow-xl transition-transform transform hover:-translate-y-1"
                      >
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-indigo-700">
                            {meeting.platform}
                          </h3>
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Date:</span>{" "}
                            {new Date(meeting.meetingDate).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Time:</span>{" "}
                            {convertTo12Hour(meeting.meetingTime)}
                          </p>
                          <a
                            href={meeting.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block w-full bg-gradient-to-r from-purple-600 to-blue-700 text-white text-center py-2.5 rounded-lg font-semibold hover:shadow-lg hover:from-purple-700 hover:to-blue-800 transition-transform transform hover:scale-105"
                          >
                            Join Meeting
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-lg">No meetings scheduled yet</p>
                  <p className="text-gray-500">Contact your admin to schedule meetings</p>
                </div>
              )}
            </div>

            {/* Assignments Section */}

            <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
              <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-black mb-6">
                Assignments
              </h2>

              {assignments.length > 0 ? (
                <div className="max-h-[500px] overflow-y-auto pr-2 custom-scroll">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                    {assignments.map((assignment) => (
                      <div
                        key={assignment._id}
                        className="bg-gradient-to-tr from-indigo-50 to-blue-100 p-5 rounded-xl shadow hover:shadow-xl transition-transform transform hover:-translate-y-1"
                      >
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-indigo-700">
                            {assignment.title}
                          </h3>
                          <p className="text-sm text-gray-700">{assignment.description}</p>
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Deadline:</span>{" "}
                            {assignment.deadline
                              ? new Date(assignment.deadline).toLocaleString()
                              : "No deadline"}
                          </p>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Questions:</p>
                            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                              {assignment.questions.map((q, i) => (
                                <li key={i}>
                                  <span className="font-semibold">[ {q.type} ]</span>{" "}
                                  {q.questionText} (Max Marks: {q.maxMarks})
                                </li>
                              ))}
                            </ul>
                          </div>
                          <button
                            onClick={() => deleteAssignment(assignment._id)}
                            className="w-full bg-red-500 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-red-600"
                          >
                            Delete Assignment
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-lg">No assignments created yet</p>
                </div>
              )}
            </div>


            {/* Student Submissions Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
              <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-black mb-6">
                Student Submissions
              </h2>

              {Object.keys(submissions).some(
                (assignmentId) => submissions[assignmentId].submissions.length > 0
              ) ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                  {Object.keys(submissions)
                    .filter(
                      (assignmentId) =>
                        submissions[assignmentId].submissions.length > 0
                    )
                    .map((assignmentId) => {
                      const assignment = assignments.find(
                        (a) => a._id === assignmentId
                      );
                      const subData = submissions[assignmentId];
                      const totalMaxMarks =
                        assignment?.questions.reduce(
                          (sum, q) => sum + (q.maxMarks || 1),
                          0
                        ) || 0;

                      return (
                        <div
                          key={assignmentId}
                          className="bg-gradient-to-br from-indigo-50 to-blue-100 p-5 rounded-xl shadow hover:shadow-xl transition-transform transform hover:-translate-y-1"
                        >
                          <h3 className="text-lg font-semibold text-indigo-700 mb-3">
                            {subData.assignmentTitle || assignment?.title || "Untitled Assignment"}
                          </h3>

                          <div className="space-y-3">
                            {subData.submissions.map((submission) => (
                              <div
                                key={submission._id}
                                className="bg-white p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
                              >
                                <p className="text-sm">
                                  <span className="font-semibold text-gray-700">Student:</span>{" "}
                                  {submission.studentName || "Unknown Student"}
                                </p>
                                <p className="text-sm">
                                  <span className="font-semibold text-gray-700">Submitted At:</span>{" "}
                                  {new Date(submission.submittedAt).toLocaleString()}
                                </p>

                                <div className="text-sm mt-2">
                                  <p className="font-semibold text-gray-700 mb-1">Answers:</p>
                                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                    {submission.answers.map((ans, i) => {
                                      const question = assignment?.questions[i];
                                      return (
                                        <li key={i}>
                                          <span className="font-semibold">
                                            [{question ? question.type : "Unknown"}]{" "}
                                            {question?.questionText || "Question not found"}:
                                          </span>{" "}
                                          {ans.answer || "No answer"}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>

                                <p className="text-sm mt-2">
                                  <span className="font-semibold text-gray-700">Marks:</span>{" "}
                                  {submission.marks !== null
                                    ? `${submission.marks}/${totalMaxMarks} (${Math.round(
                                      (submission.marks / totalMaxMarks) * 100
                                    )}%)`
                                    : "Not graded"}
                                </p>

                                <div className="mt-3">
                                  {editingMarks[submission._id] ? (
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="number"
                                        min="0"
                                        max={totalMaxMarks}
                                        value={submission.marks || 0}
                                        onChange={(e) =>
                                          setSubmissions((prev) => ({
                                            ...prev,
                                            [assignmentId]: {
                                              ...prev[assignmentId],
                                              submissions: prev[assignmentId].submissions.map((sub) =>
                                                sub._id === submission._id
                                                  ? {
                                                    ...sub,
                                                    marks: parseInt(e.target.value) || 0,
                                                  }
                                                  : sub
                                              ),
                                            },
                                          }))
                                        }
                                        className="w-20 border-gray-300 rounded-md shadow-sm"
                                      />
                                      <button
                                        onClick={() =>
                                          updateMarks(
                                            assignmentId,
                                            submission._id,
                                            submission.marks
                                          )
                                        }
                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() =>
                                          setEditingMarks((prev) => ({
                                            ...prev,
                                            [submission._id]: false,
                                          }))
                                        }
                                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        setEditingMarks((prev) => ({
                                          ...prev,
                                          [submission._id]: true,
                                        }))
                                      }
                                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md"
                                    >
                                      Update Marks
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-lg">No student submissions yet</p>
                </div>
              )}
            </div>

            {/* Course Questions Component */}
            <CourseQuestions courseId={params.id} />
          </div>
        )}
      </main>

      {/* Styles */}
      <style jsx>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
        @keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}
.animate-slideUp {
  animation: slideUp 0.4s ease-out forwards;
}


      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fadeIn {
        animation: fadeIn 0.6s ease-in-out both;
      }

      .animate-slideUp {
        animation: slideUp 0.6s ease-in-out both;
      }

      .scrollbar-hidden {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      .scrollbar-hidden::-webkit-scrollbar {
        display: none;
      }
    `}</style>
    </div>
  );
}

export default InstructorCourseManagement;