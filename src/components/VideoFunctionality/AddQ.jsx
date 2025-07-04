import axios from "axios";
import { useEffect, useState } from "react";
import { FaPlus, FaSearch, FaThumbsUp, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { server } from "../../main";

const Forum = () => {
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { courseId } = useParams();

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to view questions");
        setLoading(false);
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
      setError(err.response?.data?.message || "Failed to load questions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchQuestions();
    } else {
      setError("Course ID is required to load questions");
    }
  }, [courseId]);

  const filteredQuestions = questions.filter((question) => {
    return question.title?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const deleteQuestion = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${server}/api/question/${id}`, {
        headers: { token }
      });

      setQuestions(questions.filter(question => question._id !== id));
      toast.success("Question deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete question");
    }
  };

  const updateVotes = async (id, increment) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${server}/api/question/${id}/vote`,
        { increment },
        { headers: { token } }
      );

      setQuestions(prevQuestions =>
        prevQuestions.map(q =>
          q._id === id ? { ...q, votes: response.data.votes } : q
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update vote");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You must be logged in to ask a question");
        return;
      }

      const response = await axios.post(
        `${server}/api/course/${courseId}/question`,
        { title, details },
        { headers: { token } }
      );

      setQuestions([response.data.question, ...questions]);
      setTitle("");
      setDetails("");
      setShowForm(false);
      toast.success("Question submitted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit question");
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading questions...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }


  // Helper function to check if a question has answers
  const hasAnswers = (question) => {
    return question.answers && question.answers.length > 0;
  };


// return (
//   <div className="animate-fadeIn">
//     <div className="flex items-center mb-4">
//       <button
//         className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors mr-auto"
//         onClick={() => setShowForm(true)}
//       >
//         <FaPlus className="text-lg" />
//       </button>
//     </div>

//     <div className="relative mb-4">
//       <input
//         type="text"
//         placeholder="Search questions..."
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         className="w-full border border-gray-300 rounded-lg p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
//       />
//       <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
//     </div>

//     <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
//       {filteredQuestions.length > 0 ? (
//         filteredQuestions.map((question) => (
//           <div
//             key={question._id}
//             className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
//           >
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">
//               {question.title}
//             </h3>
//             <p className="text-gray-600 mb-3">{question.details}</p>
            
//             <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500">
//               <div>
//                 <span>By {question.authorName}</span> · 
//                 <span> {new Date(question.createdAt).toLocaleDateString()}</span>
//               </div>
//               <div className="flex items-center gap-3 mt-2 sm:mt-0">
//                 <span className="text-blue-500">{question.votes || 0} votes</span>
//                 <button
//                   onClick={() => updateVotes(question._id, 1)}
//                   className="text-gray-500 hover:text-blue-500"
//                 >
//                   <FaThumbsUp />
//                 </button>
//                 {!hasAnswers(question) && (
//                   <button
//                     onClick={() => deleteQuestion(question._id)}
//                     className="text-gray-500 hover:text-red-500"
//                   >
//                     <FaTrash />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {question.answers && question.answers.length > 0 && (
//               <div className="mt-4 pl-4 border-l-2 border-gray-200">
//                 <h4 className="text-sm font-medium text-gray-700 mb-2">Answers:</h4>
//                 {question.answers.map(answer => (
//                   <div key={answer._id} className="mb-3 pb-2 border-b border-gray-100 last:border-b-0">
//                     <p className="text-sm text-gray-600">{answer.content}</p>
//                     <div className="text-xs text-gray-500 mt-1">
//                       <span className={answer.isInstructor ? "text-green-600 font-medium" : ""}>
//                         {answer.authorName} {answer.isInstructor ? "(Instructor)" : ""}
//                       </span> · 
//                       <span> {new Date(answer.createdAt).toLocaleDateString()}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))
//       ) : (
//         <div className="bg-white p-6 rounded-lg shadow-md text-center">
//           <p className="text-gray-600">No questions found.</p>
//         </div>
//       )}
//     </div>

//     {showForm && (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
//         <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">Ask Your Question</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Title
//               </label>
//               <input
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full text-black border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none"
//                 placeholder="Enter your question title"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Details
//               </label>
//               <textarea
//                 value={details}
//                 onChange={(e) => setDetails(e.target.value)}
//                 className="w-full border text-black border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-300 focus:outline-none"
//                 placeholder="Provide more details about your question"
//                 required
//               />
//             </div>
//             <div className="flex justify-end gap-3">
//               <button
//                 type="button"
//                 onClick={() => setShowForm(false)}
//                 className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//               >
//                 Publish
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     )}
//   </div>
// );


return (
  <div className="animate-fadeIn text-gray-800">
    {/* Header Section */}
    <div className="flex items-center mb-4">
      <button
        className="bg-gradient-to-r from-[#1E88E5] to-blue-700 text-white p-2 rounded-full hover:scale-105 transition-transform shadow-lg"
        onClick={() => setShowForm(true)}
      >
        <FaPlus className="text-lg" />
      </button>
    </div>

    {/* Search Input */}
    <div className="relative mb-6">
      <input
        type="text"
        placeholder="Search questions..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border border-gray-300 rounded-xl py-2 pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
      />
      <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
    </div>

    {/* Questions List */}
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      {filteredQuestions.length > 0 ? (
        filteredQuestions.map((question) => (
          <div
            key={question._id}
            className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-[#1E88E5] mb-2">
              {question.title}
            </h3>
            <p className="text-sm text-gray-700 mb-3">{question.details}</p>

            <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500">
              <div>
                <span>By {question.authorName}</span> ·{" "}
                <span>{new Date(question.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <span className="text-blue-600 font-medium">
                  {question.votes || 0} votes
                </span>
                <button
                  onClick={() => updateVotes(question._id, 1)}
                  className="hover:text-blue-600 transition-colors"
                >
                  <FaThumbsUp />
                </button>
                {!hasAnswers(question) && (
                  <button
                    onClick={() => deleteQuestion(question._id)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>

            {/* Answers */}
            {question.answers?.length > 0 && (
              <div className="mt-4 pl-4 border-l-4 border-blue-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Answers:
                </h4>
                {question.answers.map((answer) => (
                  <div
                    key={answer._id}
                    className="mb-3 pb-2 border-b border-gray-100 last:border-b-0"
                  >
                    <p className="text-sm text-gray-600">{answer.content}</p>
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
                      ·{" "}
                      <span>
                        {new Date(answer.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-600">No questions found.</p>
        </div>
      )}
    </div>

    {/* Popup Form */}
    {showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
          <h2 className="text-2xl font-bold text-[#1E88E5] mb-6">
            Ask Your Question
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#1E88E5] focus:outline-none"
                placeholder="Enter your question title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-[#1E88E5] focus:outline-none"
                placeholder="Provide more details about your question"
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-[#1E88E5] to-blue-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition"
              >
                Publish
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);

}

export default Forum;