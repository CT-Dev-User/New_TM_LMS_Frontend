import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaTrash } from "react-icons/fa"; // Make sure to install react-icons if not already
import { server } from "../main";

// Answer Form Component
const AnswerForm = ({ questionId, onAnswerSubmit }) => {
  const [content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error("Answer cannot be empty");
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        `${server}/api/question/${questionId}/answer`,
        { content },
        { headers: { token } }
      );
      
      // Call the parent component's callback with the new answer
      onAnswerSubmit(questionId, response.data.answer);
      
      // Reset the form and hide it
      setContent("");
      setShowForm(false);
      toast.success("Answer submitted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit answer");
    }
  };
  
return (
  <div className="mt-6">
    {!showForm ? (
      <button
        onClick={() => setShowForm(true)}
        className="bg-gradient-to-r from-[#1E88E5] to-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow hover:shadow-lg transition-colors"
      >
        Answer this question
      </button>
    ) : (
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-800 bg-gray-50 focus:ring-2 focus:ring-[#1E88E5] focus:outline-none"
          placeholder="Write your answer..."
          rows="4"
          required
        ></textarea>
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-gradient-to-r from-[#1E88E5] to-blue-700  text-white px-5 py-2 rounded-lg font-semibold hover:shadow-lg transition-colors"
          >
            Submit Answer
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    )}
  </div>
);

};

// Main Course Questions Component
const CourseQuestions = ({ courseId }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Fetch current user info
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const response = await axios.get(`${server}/api/user/me`, {
        headers: { token }
      });
      
      setCurrentUser(response.data.user);
    } catch (err) {
    }
  };
  
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Authentication required");
        return;
      }
      
      const response = await axios.get(`${server}/api/course/${courseId}/fetchquestions`, {
        headers: { token }
      });
      
      
      if (response.data && Array.isArray(response.data.questions)) {
        setQuestions(response.data.questions);
      } else {
        setError("Received invalid data format from server");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load questions");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAnswerSubmit = (questionId, newAnswer) => {
    setQuestions(prevQuestions =>
      prevQuestions.map(q =>
        q._id === questionId
          ? { ...q, answers: [...(q.answers || []), newAnswer] }
          : q
      )
    );
  };
  
  // Delete an answer
  const handleDeleteAnswer = async (questionId, answerId) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) {
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      
      await axios.delete(`${server}/api/question/${questionId}/answer/${answerId}`, {
        headers: { token }
      });
      
      // Update local state
      setQuestions(prevQuestions =>
        prevQuestions.map(q =>
          q._id === questionId
            ? { ...q, answers: (q.answers || []).filter(a => a._id !== answerId) }
            : q
        )
      );
      
      toast.success("Answer deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete answer");
    }
  };
  
  // Check if user can delete an answer
  const canDeleteAnswer = (answer) => {
    if (!currentUser) return false;
    
    // User can delete if they are the author, an admin, or an instructor
    return (
      currentUser._id === answer.authorId ||
      currentUser.role === 'admin' ||
      currentUser.role === 'instructor'
    );
  };
  
  useEffect(() => {
    if (courseId) {
      fetchQuestions();
      fetchCurrentUser();
    } else {
      setError("Course ID is required to load questions");
    }
  }, [courseId]);
  
  if (loading) {
    return <div className="text-center p-4">Loading questions...</div>;
  }
  
  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }
  

return (
  <div className="bg-white rounded-2xl shadow-xl p-6">
    <h2 className="text-2xl font-extrabold text-[#1E88E5] mb-6">Course Questions</h2>

    {questions.length > 0 ? (
      <div
        className={`space-y-6 ${
          questions.length > 5 ? "max-h-[600px] overflow-y-auto pr-2" : ""
        }`}
      >
        {questions.map((question) => {
          const hasAnswers = question.answers && question.answers.length > 0;

          return (
            <div
              key={question._id}
              className="bg-gray-50 p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <h3
                className={`text-lg font-semibold mb-1 ${
                  hasAnswers ? "text-green-600" : "text-[#1E88E5]"
                }`}
              >
                {question.title}
                {hasAnswers && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    Answered
                  </span>
                )}
              </h3>

              <p className="text-sm text-gray-700 mb-3">{question.details}</p>

              <div className="text-xs text-gray-500 flex flex-wrap gap-2 items-center">
                <span>By {question.authorName}</span>•
                <span>{new Date(question.createdAt).toLocaleDateString()}</span>•
                <span className="text-[#1E88E5] font-medium">{question.votes || 0} votes</span>
              </div>

              {/* Display answers */}
              {hasAnswers && (
                <div className="mt-5 pl-4 border-l-4 border-blue-100">
                  <h4 className="text-sm font-semibold text-[#1E88E5] mb-2">Answers:</h4>
                  {question.answers.map((answer) => (
                    <div
                      key={answer._id}
                      className="mb-4 pb-3 border-b border-gray-200 last:border-none"
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-gray-700">{answer.content}</p>
                        {canDeleteAnswer(answer) && (
                          <button
                            onClick={() =>
                              handleDeleteAnswer(question._id, answer._id)
                            }
                            className="text-red-500 hover:text-red-700 transition-colors ml-3"
                            title="Delete answer"
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <span
                          className={
                            answer.isInstructor
                              ? "text-green-600 font-medium"
                              : ""
                          }
                        >
                          {answer.authorName}{" "}
                          {answer.isInstructor ? "(Instructor)" : ""}
                        </span>{" "}
                        •{" "}
                        <span>
                          {new Date(answer.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Answer Form */}
              <div className="mt-6 pt-4 border-t border-gray-300">
                <AnswerForm
                  questionId={question._id}
                  onAnswerSubmit={handleAnswerSubmit}
                />
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg font-semibold">
          No questions have been asked yet.
        </p>
        <p className="text-gray-500">Questions from students will appear here.</p>
      </div>
    )}
  </div>
);


};

export default CourseQuestions;
