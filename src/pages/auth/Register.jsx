

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import image from "../../assets/Regs.png";
// import { UserData } from '../../context/UserContext.jsx';

// const Register = () => {
//     const navigate = useNavigate();
//     const { btnLoading, registerUser } = UserData();
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [contact, setContact] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");

//     // Add contact validation
//     const validateContact = (contact) => {
//         const contactRegex = /^\d{10}$/;
//         return contactRegex.test(contact);
//     };

//     const submitHandler = async (e) => {
//         e.preventDefault();
//         setError("");

//         // Validate contact number
//         if (!validateContact(contact)) {
//             setError("Please enter a valid 10-digit contact number");
//             return;
//         }

//         try {
//             const user = await registerUser(name, email, password, contact, navigate);
//             if (user) {
//                 navigate('/dashboard');
//             }
//         } catch (err) {
//             setError(err.message || "Registration failed. Please try again.");
//         }
//     };

//     return (
//         <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
//             {/* Image Container - Responsive adjustments */}
//             <div className="w-full lg:w-1/2 flex justify-center mb-8 lg:mb-0 lg:mr-8 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
//                 <img 
//                     src={image} 
//                     alt="Registration illustration" 
//                     className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl object-contain"
//                 />
//             </div>

//             {/* Form Container */}
//             <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
//                 <h2 className="text-3xl font-bold text-center text-purple-700">
//                     Register
//                 </h2>
//                 <p className='text-gray-400'>Explore, learn, and grow with us. Enjoy a seamless and enriching educational journey. Let's begin!</p>
//                 <form className="mt-8 space-y-6" onSubmit={submitHandler}>
//                     {error && <p className="text-red-500 text-xs">{error}</p>}
//                     <div>
//                         <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                             Name
//                         </label>
//                         <input 
//                             type="text" 
//                             id="name" 
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             name="name" 
//                             required 
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
//                             placeholder="Your name"
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                             Email
//                         </label>
//                         <input 
//                             type="email" 
//                             id="email" 
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             name="email" 
//                             required 
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
//                             placeholder="Your email"
//                         />
//                     </div>
//                     {/* Contact number - Fixed */}
//                     <div>
//                         <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
//                             Contact Number
//                         </label>
//                         <input 
//                             type="tel" 
//                             id="contact" 
//                             value={contact}
//                             onChange={(e) => setContact(e.target.value)}
//                             name="contact" 
//                             required 
//                             maxLength="10"
//                             pattern="[0-9]{10}"
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
//                             placeholder="Your 10-digit contact number"
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                             Password
//                         </label>
//                         <input 
//                             type="password" 
//                             id="password" 
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             name="password" 
//                             required 
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
//                             placeholder="Your password"
//                         />
//                     </div>
//                     <div>
//                         <button 
//                             type='submit' 
//                             className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${btnLoading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'}`}
//                             disabled={btnLoading}
//                         >
//                             {btnLoading ? "Registering..." : "Register"}
//                         </button>
//                     </div>
//                 </form>
//                 <p className="text-center text-sm text-gray-600">
//                     Already have an account? <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">Login</Link>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default Register;



// ///////////////////////////////////////////////



import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import image from "../../assets/Regs.png";
import { UserData } from '../../context/UserContext.jsx';
const Register = () => {
    const navigate = useNavigate();
    const { btnLoading, registerUser } = UserData();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const validateContact = (contact) => /^\d{10}$/.test(contact);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateContact(contact)) {
            setError("Please enter a valid 10-digit contact number");
            return;
        }

        try {
            const user = await registerUser(name, email, password, contact, navigate);
            if (user) navigate('/dashboard');
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="flex items-start lg:items-center justify-center h-auto md:min-h-0 lg:min-h-screen bg-white px-4 py-6 md:py-10 lg:py-10">
            <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-3xl shadow-lg overflow-hidden border border-gray-100 bg-white">
                {/* Image Section */}
                <div className="md:w-1/2 bg-[#E3F2FD] flex items-center justify-center p-6 sm:p-8">
                    <img
                        src={image}
                        alt="Register illustration"
                        className="w-full max-w-xs sm:max-w-sm object-contain"
                    />
                </div>

                {/* Form Section */}
                <div className="md:w-1/2 px-6 sm:px-10 py-8 sm:py-12 flex flex-col justify-center bg-white">
                    <h2 className="text-3xl font-bold text-[#1E88E5] mb-1 text-center md:text-left">Create Account</h2>
                    <p className="text-sm text-gray-600 mb-6 text-center md:text-left">
                        Join our learning community and start your journey!
                    </p>

                    <form onSubmit={submitHandler} className="space-y-5">
                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <div>
                            <label className="text-sm text-gray-700 font-medium block mb-1">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-700 font-medium block mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-700 font-medium block mb-1">Contact Number</label>
                            <input
                                type="tel"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                placeholder="10-digit phone number"
                                maxLength="10"
                                pattern="[0-9]{10}"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-700 font-medium block mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a password"
                                    required
                                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-gray-500 hover:text-[#1E88E5]"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={btnLoading}
                            className={`w-full py-2 rounded-lg font-semibold text-white transition duration-200 ${btnLoading
                                    ? "bg-blue-300 cursor-not-allowed"
                                    : "bg-[#1E88E5] hover:bg-[#1565C0]"
                                }`}
                        >
                            {btnLoading ? "Registering..." : "Register"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#1E88E5] hover:underline">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
