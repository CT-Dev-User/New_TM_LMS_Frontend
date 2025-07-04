import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Layout from "../../admin/Utils/Layout.jsx";
import UserSidebar from "../../components/Sidebar/Sidebar";
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import InstructorSidebar from "../../instructor/Sidebar.jsx";
import { server } from "../../main";

const ProfileSettings = ({ user }) => {
  const { setIsAuth, setUser, logoutUser } = UserData();
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    contactNumber: user?.contact || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // New loading state
  const [isLoggingOut, setIsLoggingOut] = useState(false); // New loading state for logout

  const { mycourse: myCourses, fetchMyCourse } = CourseData();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!myCourses || myCourses.length === 0) {
      fetchMyCourse().catch(() => setError("Failed to load your courses"));
    }
  }, [fetchMyCourse, myCourses]);

  useEffect(() => {
    if (user) {
      const names = user.name?.split(" ") || ["", ""];
      setFormData({
        firstName: names[0] || "",
        lastName: names[1] || "",
        email: user.email || "",
        contactNumber: user.contact || "", // ✅ THIS LINE IS MISSING IN YOUR CURRENT CODE
      });

      if (user.profileImage) {
        setProfileImage(user.profileImage);
      }
    }
  }, [user]);

  const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 5000000) {
    toast.error("Image size should be less than 5MB");
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    const imageData = e.target.result;
    try {
      const updatedData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        profileImage: imageData,
        contact: formData.contactNumber, // ✅ Include contact here too
        profileComplete: true,
      };

      const token = localStorage.getItem("token");
      const response = await axios.put(`${server}/api/user/update-profile`, updatedData, {
        headers: {
          token,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setProfileImage(imageData);
        const updatedUser = { 
          ...user, 
          profileImage: imageData,
          contact: formData.contactNumber // ✅ Update contact in user state
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Profile photo updated successfully");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update profile photo";
      toast.error(errorMessage);
    }
  };

  reader.readAsDataURL(file);
};


  const handleRemoveImage = async () => {
  try {
    const updatedData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      profileImage: null,
      contact: formData.contactNumber, // ✅ Include contact here
      profileComplete: true,
    };

    const token = localStorage.getItem("token");
    const response = await axios.put(`${server}/api/user/update-profile`, updatedData, {
      headers: {
        token,
        "Content-Type": "application/json",
      },
    });

    if (response.data.success) {
      setProfileImage(null);
      const updatedUser = { 
        ...user, 
        profileImage: null,
        contact: formData.contactNumber // ✅ Keep contact updated
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profile photo removed successfully");
    }
  } catch (error) {
    toast.error("Failed to remove profile photo");
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (isSubmitting || isLoggingOut) return;

  // ✅ Add validation
  if (!formData.contactNumber || formData.contactNumber.trim() === '') {
    toast.error("Contact number is required");
    return;
  }

  if (!/^\d{10}$/.test(formData.contactNumber)) {
    toast.error("Please enter a valid 10-digit contact number");
    return;
  }

  setIsSubmitting(true);
  
  const updatedData = {
    name: `${formData.firstName} ${formData.lastName}`.trim(),
    contact: formData.contactNumber.trim(), // ✅ This will now be handled by backend
    profileImage: profileImage,
    profileComplete: true,
  };


  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${server}/api/user/update-profile`, updatedData, {
      headers: {
        token,
        "Content-Type": "application/json",
      },
    });

    if (response.data.success) {
      const updatedUser = { 
        ...user, 
        name: updatedData.name, 
        contact: formData.contactNumber,
        profileImage: profileImage
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profile updated successfully");
      navigate("/profile");
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to update profile";
    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = async () => {
    if (isSubmitting || isLoggingOut) return; // Prevent logout if already submitting or logging out
    setIsLoggingOut(true);
    await logoutUser(navigate);
    setIsLoggingOut(false);
  };

  if (user?.role === "admin") {
    return (
  <Layout user={user} title="Profile Settings">
    <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-lg mx-auto my-12 animate-fade-in sm:m-40">
      <h1 className="text-2xl font-semibold text-center mb-6 text-indigo-800">Complete Your Profile</h1>

      {/* Profile Image */}
      <div className="flex flex-col items-center mb-6">
        <label htmlFor="profileImage" className="relative w-24 h-24 cursor-pointer group">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="rounded-full w-full h-full object-cover border-4 border-[#1E88E5] shadow-md"
            />
          ) : (
            <div className="flex items-center justify-center rounded-full w-full h-full bg-[#1E88E5] text-white text-2xl font-semibold shadow-md">
              {(formData.firstName.charAt(0) || "").toUpperCase()}
              {(formData.lastName.charAt(0) || "").toUpperCase()}
            </div>
          )}
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-sm">Upload</span>
          </div>
          <input type="file" id="profileImage" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
        {profileImage && (
          <button onClick={handleRemoveImage} className="text-red-500 text-sm mt-2 flex items-center hover:underline">
            <FaTrash className="mr-2" /> Remove Photo
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E88E5] outline-none transition"
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E88E5] outline-none transition"
        />
        <input
          type="email"
          value={formData.email}
          readOnly
          className="px-4 py-2 border bg-gray-100 text-gray-500 rounded-xl cursor-not-allowed"
        />
        <input
          type="text"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          placeholder="Contact Number"
          maxLength={10}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E88E5] outline-none transition"
        />

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || isLoggingOut}
            className={`w-full sm:w-auto px-5 py-2 bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-xl font-semibold transition-all duration-300 ${isSubmitting || isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleLogout}
            disabled={isSubmitting || isLoggingOut}
            className={`w-full sm:w-auto px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold flex items-center justify-center transition-all duration-300 ${isSubmitting || isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            <IoMdLogOut className="mr-2" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </form>
    </div>
  </Layout>
);

  }

  // For instructor and user

  return (
  <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
    {user?.role === "user" && <UserSidebar user={user} course={myCourses} />}
    {user?.role === "instructor" && <InstructorSidebar user={user} />}

    <main className="flex-grow flex justify-center items-center p-4 md:p-10">
      <div className="w-full max-w-xl p-8 bg-white rounded-3xl shadow-2xl border border-blue-100">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">
          Complete Your Profile
        </h1>

        {/* Profile Image Upload */}
        <div className="flex flex-col items-center mb-6">
          <label htmlFor="profileImage" className="relative w-24 h-24 cursor-pointer group">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="rounded-full w-full h-full object-cover border-4 border-[#1E88E5]"
              />
            ) : (
              <div className="flex items-center justify-center rounded-full w-full h-full bg-[#1E88E5] text-white text-2xl font-bold">
                {(formData.firstName.charAt(0) || "").toUpperCase()}
                {(formData.lastName.charAt(0) || "").toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <span className="text-white text-sm font-medium">Upload</span>
            </div>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>

          {profileImage && (
            <button
              onClick={handleRemoveImage}
              className="text-red-500 text-sm mt-2 flex items-center hover:underline"
            >
              <FaTrash className="mr-1" /> Remove Photo
            </button>
          )}
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E88E5] outline-none transition"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E88E5] outline-none transition"
          />
          <input
            type="email"
            value={formData.email}
            readOnly
            className="px-4 py-2 border bg-gray-100 text-gray-500 rounded-xl cursor-not-allowed"
          />
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber || ""}
            onChange={handleChange}
            placeholder="Contact Number"
            maxLength={10}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E88E5] outline-none transition"
          />

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isLoggingOut}
              className={`w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-[#1E88E5] to-[#1565C0] hover:from-blue-600 hover:to-blue-800 text-white rounded-xl font-semibold transition ${
                isSubmitting || isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleLogout}
              disabled={isSubmitting || isLoggingOut}
              className={`w-full sm:w-auto px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold flex items-center justify-center transition ${
                isSubmitting || isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <IoMdLogOut className="mr-2" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
);

};

export default ProfileSettings;