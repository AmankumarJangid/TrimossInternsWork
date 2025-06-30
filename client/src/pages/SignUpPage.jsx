import React, { useState } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate()
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post("http://localhost:3000/api/users/register", {
          name: formData.username, // its name not username in the backend
          email: formData.email,
          password: formData.password
        });
        console.log("User registered:", response.data);
        alert("Signup successful!");
        navigate("/login"); // go to login page
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Signup failed!");
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="p-4 rounded-2xl">
      <div className=" h-[80vh] ml-16 rounded-2xl w-[90%] bg-black flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 relative min-h-[40vh] lg:min-h-full">
          <div>{/* image bg */}</div>

          <div className="absolute bottom-6 left-6 lg:bottom-12 lg:left-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
              Welcome!
            </h1>
          </div>
        </div>

        <div className="w-full mt-6 mr-4 lg:w-[454px] xl:w-[30rem]  h-11/12 rounded-2xl m-2 bg-white flex items-center justify-center p-4 lg:p-20">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl lg:text-3xl font-bold mt-8 text-gray-900 mb-6 lg:mb-8">
              Sign up
            </h2>
            {/* //full name field also changed name="username " from "Full Name"  */}

            <div className="space-y-4 lg:space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-3 py-3 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>

              {/* //email field  */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-3 py-3 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>


              {/* //password field   */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-10 py-3 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm"
                      className="w-full pl-10 pr-10 py-3 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-black text-white py-3 rounded-full  font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
              >
                Create Account
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <button onClick={() => navigate("/login")} className="w-full bg-gray-200 text-gray-900 py-3 rounded-full mb-8 font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]">
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
