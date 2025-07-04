// import axios from "axios";
// import { createContext, useContext, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { server } from "../main";



// const UserContext = createContext();

// export const UserContextProvider = ({children}) => { 

//     const [user, setUser] = useState([]);
//     const [isAuth, setIsAuth] = useState(false);
//     const [btnLoading, setBtnLoading] = useState(false);
//     const [loading, setLoading] = useState(false);

//    async function loginUser(email,password,navigate,fetchMyCourse){
//       setBtnLoading(true);
//       try{
//         const {data } =  await axios.post(`${server}/api/user/login`, {email,password});

//         toast.success(data.message);
//         localStorage.setItem("token",data.token);
//         setUser(data.user);
//         setIsAuth(true);
//         setBtnLoading(false);
//         navigate("/");
//         fetchMyCourse();

//       }
//       catch(error){
//          setBtnLoading(false);
//          setIsAuth(false);
//          toast.error(error.response.data.message);
//       }
//     }
// //////////////////////////////////register user/////////////////////////////////////////////////////////////////////////////////

// async function registerUser(name , email,password,navigate){
//   setBtnLoading(true);
//   try{
//     const {data } =  await axios.post(`${server}/api/user/register`,
//        {
//         name,
//         email,
//         password});

//     toast.success(data.message);
//     localStorage.setItem("activationToken",data.activationToken);

//     setBtnLoading(false);
//     navigate("/verify");

//   }
//   catch(error){
//     setBtnLoading(false);
//      toast.error(error.response.data.message);
//   }
// }




// /////////////////////////////////verifyOtp////////////////////////////////////////////////////$
//  async function verifyOtp(otp,navigate){
   
//     const activationToken = localStorage.getItem("activationToken");
//   try{
//     const {data} = await axios.post(`${server}/api/user/verify`,
//     {
//       otp,
//       activationToken,
//     });
//     toast.success(data.message);

//     navigate("/login");
//     localStorage.clear();
//   }
//   catch(error){
    
//     toast.error(error.response.data.message);
//   }
 
// }



// //////////////////////////////////////////////////////////////////////////////////////////////////

//   // async function fetchUser(){ 
//   //  try{
//   //    const {data} = await axios.get(`${server}/api/user/me`,{
//   //      headers:{
//   //       token : localStorage.getItem("token"),
//   //      },

//   //    });
//   //    setIsAuth(true);
//   //    setUser(data.user);
//   //    setLoading(false);
//   //   }
//   //    catch(error){
//   // console.log(error);
//   // setLoading(false);
     
//   //  }

//   // }

//   // useEffect(()=>{
//   //   fetchUser();
//   // }, [])








//   async function fetchUser() { 
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("No token found in localStorage.");
//       }
      
//       const { data } = await axios.get(`${server}/api/user/me`, {
//         headers: { token },
//       });
  
//       setIsAuth(true);
//       setUser(data.user);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error in fetchUser:", error.response?.data?.message || error.message);
//       setIsAuth(false);
//       setUser(null);
//       setLoading(false);
//     }
//   }
  
//   async function updateProfile(profileData, navigate) {
//     try {
//         const token = localStorage.getItem("token");
//         const { data } = await axios.put(
//             `${server}/api/user/update-profile`,
//             profileData,
//             {
//                 headers: { token }
//             }
//         );

//         setUser(data.user);
//         toast.success("Profile updated successfully");
//         navigate("/");
//     } catch (error) {
//         toast.error(error.response?.data?.message || "Error updating profile");
//     }
// }


// // Update the fetchPayoutData function in UserContext.jsx
// const fetchPayoutData = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const { data: summaryData } = await axios.get(`${server}/api/summary`, {
//       headers: { token }
//     });
//     const { data: historyData } = await axios.get(`${server}/api/history`, {
//       headers: { token }
//     });
    
//     return {
//       summary: summaryData,
//       history: historyData
//     };
//   } catch (error) {
//     toast.error("Failed to fetch payout data");
//     return null;
//   }
// };



//     return (
//         <UserContext.Provider value={{ user,updateProfile, setUser, isAuth, setIsAuth, btnLoading, setBtnLoading, loginUser,loading ,registerUser,fetchUser,verifyOtp,fetchPayoutData}}>
//             {children}
//             <Toaster />
//         </UserContext.Provider>
//     )
// }

// export const UserData = () => useContext(UserContext);


import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { server } from "../main";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Changed to null for consistency
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true); // Start as true to show loading initially

  // Login user
  async function loginUser(email, password, navigate, fetchMyCourse) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, { email, password });

      toast.success(data.message);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
      fetchMyCourse();
    } catch (error) {
      setBtnLoading(false);
      setIsAuth(false);
      toast.error(error.response?.data?.message || "Login failed");
    }
  }

  // Register user
  async function registerUser(name, email, password,contact, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/register`, {
        name,
        email,
        password,
        contact,
      });

      toast.success(data.message);
      localStorage.setItem("activationToken", data.activationToken);
      setBtnLoading(false);
      navigate("/verify");
    } catch (error) {
      setBtnLoading(false);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  }

  // Verify OTP
  async function verifyOtp(otp, navigate) {
     const activationToken = localStorage.getItem("activationToken");
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        otp,
        activationToken,
      });
      toast.success(data.message);
      navigate("/login");
      localStorage.removeItem("activationToken"); // Clear activation token
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  }

  // Fetch user profile
  async function fetchUser() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: { token },
      });

      setUser(data.user);
      setIsAuth(true);
    } catch (error) {
      console.error("Error in fetchUser:", error.response?.data?.message || error.message);
      setUser(null);
      setIsAuth(false);
      localStorage.removeItem("token"); // Clear invalid/expired token
    } finally {
      setLoading(false);
    }
  }

  // Logout user
  async function logoutUser(navigate) {
    try {
      await axios.post(`${server}/api/user/logout`, {}, {
        headers: { token: localStorage.getItem("token") },
      });
      localStorage.removeItem("token");
      setUser(null);
      setIsAuth(false);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      // Clear state even if the API call fails
      localStorage.removeItem("token");
      setUser(null);
      setIsAuth(false);
      navigate("/login");
    }
  }

  // Update profile
  async function updateProfile(profileData, navigate) {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${server}/api/user/update-profile`,
        profileData,
        {
          headers: { token },
        }
      );

      setUser(data.user);
      toast.success("Profile updated successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile");
    }
  }

  // Fetch payout data
  async function fetchPayoutData() {
    try {
      const token = localStorage.getItem("token");
      const { data: summaryData } = await axios.get(`${server}/api/summary`, {
        headers: { token },
      });
      const { data: historyData } = await axios.get(`${server}/api/history`, {
        headers: { token },
      });

      return {
        summary: summaryData,
        history: historyData,
      };
    } catch (error) {
      toast.error("Failed to fetch payout data");
      return null;
    }
  }

  // Run fetchUser on mount
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        updateProfile,
        setUser,
        isAuth,
        setIsAuth,
        btnLoading,
        setBtnLoading,
        loginUser,
        loading,
        registerUser,
        fetchUser,
        verifyOtp,
        logoutUser, // Add logoutUser to context
        fetchPayoutData,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);