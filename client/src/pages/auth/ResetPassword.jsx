// pages/ResetPassword.jsx
import React, { useState } from 'react';
import api from '../../utils/axiosInterceptor';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye,EyeOff  } from 'lucide-react';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();

  

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      return alert("Please fill in both password fields.");
    }

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match.");
    }

    setLoading(true);
    try {
      await api.post(`/users/reset-password`, {
        email: state?.email,
        otp: state?.otp,
        newPassword
      });

      alert("Password reset successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>

      {/* New Password Field */}
      <div className="relative mb-4">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>

      </div>

       {/* Confirm Password Field */}
      <div className="relative mb-4">
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 pr-10 border rounded"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <button
        onClick={handleReset}
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors"
      >
        {loading ? "Resetting..." : "Set New Password"}
      </button>
    </div>
  );
}
