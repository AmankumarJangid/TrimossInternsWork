import React, { useState } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch , useSelector } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function LoginPage() {

  const {user, token} =  useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "email is required";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/users/login`, {
        email: formData.email,
        password: formData.password,
      });
      if( !response.data ) alert( "Login Successfully");
      console.log("✅ Login successful:", response.data);

      const userData = response.data.data.user;

      /// updates in user credentials storage
      console.log("user Data " , userData);
      
      dispatch(setCredentials({ user: userData, token: response.data.data.accessToken }));

      localStorage.setItem("userToken", response.data.data.accessToken);
      localStorage.setItem("userDetail" , response.data.data.user);

      navigate("/");
    } catch (error) {
      alert("Login failed: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <div className="min-h-screen sm:min-h-[80vh] mx-auto w-full max-w-7xl rounded-2xl bg-black flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 relative min-h-[30vh] sm:min-h-[35vh] lg:min-h-full flex items-end p-6 lg:p-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Welcome Back!
          </h1>
        </div>

        <div className="w-full lg:w-[454px] xl:w-[28rem] mt-4 sm:mt-6 mb-6 mr-6 sm:mb-8 lg:my-8 mx-auto rounded-2xl bg-white flex items-center justify-center p-4 sm:p-6 lg:p-10">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">
              Log in
            </h2>

            <div className="space-y-4 lg:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="email"
                    placeholder="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-3 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember Me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                  onClick={() => alert("Forgot password functionality would go here")}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
              >
                Log in
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/signup")}
                type="button"
                className="w-full bg-gray-200 text-gray-900 py-3 rounded-full font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}