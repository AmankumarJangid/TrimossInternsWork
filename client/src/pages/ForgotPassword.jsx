import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset link sent to:", email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-indigo-100">
      <div className="bg-white shadow-md rounded-lg p-8 flex flex-col md:flex-row w-full max-w-4xl">
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Forgot Password
          </h2>
          <p className="text-gray-600 mb-6">
            Enter your e-mail address, and we'll give you reset instruction.
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              required
              placeholder="Enter e-mail Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 cursor-pointer text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200"
            >
              Send New Password
            </button>
          </form>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 text-indigo-600 cursor-pointer hover:underline text-sm"
          >
            Back to Login
          </button>
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
          <div className="grid grid-cols-3 grid-rows-3 gap-4 text-4xl text-gray-500">
            <div className="col-start-2 row-start-1">?</div>
            <div className="col-start-2 row-start-2 text-indigo-600">✉️</div>
            <div className="col-start-3 row-start-3">📤</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
