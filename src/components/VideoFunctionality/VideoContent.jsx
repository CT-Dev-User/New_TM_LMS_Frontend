import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaFileAlt } from "react-icons/fa";
import { PiBookmarkSimpleThin, PiChats, PiVideoCameraFill } from "react-icons/pi";
import { server } from "../../main";
import Forum from "./AddQ";

export default function VideoContent({
  activeSection,
  setActiveSection,
  lecture,
  courseId,
  onSelectAssignment,
}) {
  const [meetings, setMeetings] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissionData, setSubmissionData] = useState({});
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;

      try {
        const meetingsResponse = await fetch(`${server}/api/lecture/${courseId}/meetings`, {
          headers: { token: localStorage.getItem("token") },
        });
        const meetingsData = await meetingsResponse.json();
        if (meetingsData.success) {
          setMeetings(meetingsData.meetings);
        } else {
          setError("Failed to fetch meetings.");
        }

        const assignmentsResponse = await axios.get(`${server}/api/course/${courseId}/assignments`, {
          headers: { token: localStorage.getItem("token") },
        });
        if (assignmentsResponse.data.success) {
          setAssignments(assignmentsResponse.data.assignments);
        } else {
          setError("Failed to fetch assignments.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleSubmissionChange = (assignmentId, questionIndex, answer) => {
    setSubmissionData((prev) => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        [questionIndex]: answer,
      },
    }));
  };

  const submitAssignment = async (assignmentId) => {
    const answers = submissionData[assignmentId]
      ? Object.entries(submissionData[assignmentId]).map(([questionIndex, answer]) => ({
        questionIndex: parseInt(questionIndex),
        answer,
      }))
      : [];

    if (answers.length === 0) {
      toast.error("Please answer at least one question.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${server}/api/assignment/${assignmentId}/submit`,
        { answers },
        { headers: { token: localStorage.getItem("token") } }
      );
      toast.success("Test submitted successfully!", { duration: 3000 });
      const { data: updatedAssignments } = await axios.get(`${server}/api/course/${courseId}/assignments`, {
        headers: { token: localStorage.getItem("token") }
      }
      );
      setAssignments(updatedAssignments.assignments);
      setSubmissionData((prev) => ({ ...prev, [assignmentId]: {} }));
      setExpandedAssignment(null);
    } catch (error) {
      console.error("Error submitting assignment:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error submitting assignment.");
    }
  };

  const toggleAssignment = (assignmentId) => {
    setExpandedAssignment(expandedAssignment === assignmentId ? null : assignmentId);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="mt-2 flex justify-center px-2 sm:px-4 animate-fadeIn">
      <div className="w-full">
        {/* Top Tab Navigation for desktop */}
        <div className="hidden sm:flex justify-start mb-4 space-x-4 border-b border-gray-300">
          {[
            { section: "summary", icon: <PiBookmarkSimpleThin />, text: "Summary" },
            { section: "live-class", icon: <PiVideoCameraFill />, text: "Live class" },
            { section: "assignment", icon: <FaFileAlt />, text: "Assignment" },
            { section: "forum", icon: <PiChats />, text: "Forum" },
          ].map(({ section, icon, text }) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition duration-300 ${activeSection === section
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-500"
                }`}
            >
              {icon}
              <span>{text}</span>
            </button>
          ))}
        </div>

        {/* Dropdown for mobile view */}
        <div className="sm:hidden w-full mb-3">
          <select
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="summary">Summary</option>
            <option value="live-class">Live class</option>
            <option value="assignment">Assignment</option>
            <option value="forum">Forum</option>
          </select>
        </div>

        {/* Section Content Container */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl transition-all duration-500 space-y-6">
          {/* Include all your section conditionals here (summary, live-class, assignment, forum) */}
          {/* They’re already well structured in your current code */}
          <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg animate-fadeIn">
            {activeSection === "summary" && (
              <div className="animate-fadeIn">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-500 mb-4">Summary</h2>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  {lecture?.title || "Untitled Lecture"}
                </h3>
                <p className="text-gray-600">{lecture?.description || "No description available."}</p>
                <p className="text-base sm:text-lg text-gray-700">Total {assignments.length} Assignments</p>
              </div>
            )}

            {activeSection === "live-class" && (
              <div className="text-center animate-fadeIn">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-500 mb-4">Live Class Schedule</h2>
                {meetings.length > 0 ? (
                  meetings.map((meeting, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center bg-white p-4 sm:p-6 mb-4 rounded-lg shadow-md"
                    >
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{meeting.platform}</h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-4">
                        {meeting.meetingTime}, {new Date(meeting.meetingDate).toLocaleDateString()}
                      </p>
                      <a
                        href={meeting.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                      >
                        <PiVideoCameraFill className="inline mr-2" />
                        Join Meeting
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No meetings scheduled for this course.</p>
                )}
              </div>
            )}

            {activeSection === "assignment" && (
              <div className="animate-fadeIn">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-500 mb-4">Assignments</h2>
                {assignments.length > 0 ? (
                  assignments.map((assignment) => {
                    const hasSubmitted = assignment.submissions.some(
                      (sub) => sub.student.toString() === userId
                    );
                    const isPastDeadline = assignment.deadline && new Date() > new Date(assignment.deadline);
                    const isExpanded = expandedAssignment === assignment._id;

                    return (
                      <div
                        key={assignment._id}
                        className="bg-white p-4 sm:p-6 mb-4 rounded-lg shadow-md animate-slideUp"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                              {assignment.title}
                            </h3>
                            <p className="text-gray-600 mb-2">{assignment.description}</p>
                          </div>
                          <button
                            onClick={() => {
                              toggleAssignment(assignment._id);
                              onSelectAssignment(assignment); // Switch to TestPlayer
                            }}
                            className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600"
                          >
                            {isExpanded ? "Hide Details" : "Take Test"}
                          </button>
                        </div>

                        {isExpanded && !onSelectAssignment && (
                          <div className="mt-4">
                            {hasSubmitted ? (
                              <p className="text-green-600 text-sm">You have already submitted this test.</p>
                            ) : isPastDeadline ? (
                              <p className="text-red-600 text-sm">Deadline passed.</p>
                            ) : (
                              <>
                                <p className="text-sm text-gray-600">
                                  <span className="font-semibold">Assigned by:</span> {assignment.instructor.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-semibold">Deadline:</span>{" "}
                                  {assignment.deadline
                                    ? new Date(assignment.deadline).toLocaleString()
                                    : "No deadline"}
                                </p>
                                <div className="mt-2 space-y-4">
                                  {assignment.questions.map((question, index) => (
                                    <div key={index}>
                                      <p className="text-sm font-semibold text-gray-700">
                                        {index + 1}. {question.questionText} ({question.type}, Max Marks: {question.maxMarks})
                                      </p>
                                      {question.type === "mcq" && (
                                        <div className="mt-1 space-y-2">
                                          {question.options.map((option, optIndex) => (
                                            <label
                                              key={optIndex}
                                              className="flex items-center space-x-2 text-gray-700"
                                            >
                                              <input
                                                type="radio"
                                                name={`question-${assignment._id}-${index}`}
                                                checked={
                                                  submissionData[assignment._id]?.[index] === option.text
                                                }
                                                onChange={() =>
                                                  handleSubmissionChange(assignment._id, index, option.text)
                                                }
                                                className="form-radio h-4 w-4 text-blue-600"
                                              />
                                              <span>{option.text}</span>
                                            </label>
                                          ))}
                                        </div>
                                      )}
                                      {question.type === "true-false" && (
                                        <div className="mt-1 space-y-2">
                                          {question.options.map((option, optIndex) => (
                                            <label
                                              key={optIndex}
                                              className="flex items-center space-x-2 text-gray-700"
                                            >
                                              <input
                                                type="radio"
                                                name={`question-${assignment._id}-${index}`}
                                                checked={
                                                  submissionData[assignment._id]?.[index] === option.text
                                                }
                                                onChange={() =>
                                                  handleSubmissionChange(assignment._id, index, option.text)
                                                }
                                                className="form-radio h-4 w-4 text-blue-600"
                                              />
                                              <span>{option.text}</span>
                                            </label>
                                          ))}
                                        </div>
                                      )}
                                      {question.type === "free-text" && (
                                        <textarea
                                          className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 text-gray-800 bg-white"
                                          placeholder="Enter your answer here"
                                          value={submissionData[assignment._id]?.[index] || ""}
                                          onChange={(e) =>
                                            handleSubmissionChange(assignment._id, index, e.target.value)
                                          }
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <button
                                  onClick={() => submitAssignment(assignment._id)}
                                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                                >
                                  Submit Test
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-600">No assignments available for this course.</p>
                )}
              </div>
            )}

            {activeSection === "forum" && (
              <div className="animate-fadeIn">
                <h3 className="text-xl sm:text-2xl font-bold text-blue-500 mb-4">Forum</h3>

                <Forum />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}