// pages/VerifyOtp.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    try {
      const email = localStorage.getItem("resetEmail");
      await axios.post(`${import.meta.env.VITE_API_BASE}/users/verify-otp`, { email, otp });
      window.location.href = "/reset-password";
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Enter OTP</h2>
      <input
        type="text"
        placeholder="Enter the OTP sent to your email"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleVerify}
        className="w-full bg-black text-white py-2 rounded"
      >
        Verify OTP
      </button>
    </div>
  );
}
