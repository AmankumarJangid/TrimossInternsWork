import express from 'express';
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  sendForgotPasswordOTP,
  resetPasswordWithOTP,
  verifyOtp
} from '../controllers/userController.js';
import { auth, admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', sendForgotPasswordOTP );
router.post('/verify-otp', verifyOtp);
router.post('/reset-password' , resetPasswordWithOTP);

// Protected routes (require authentication)
router.post('/logout', auth, logoutUser);
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);
router.put('/change-password', auth, changePassword);

// Admin routes (require admin role)
router.get('/all', auth, admin, getAllUsers);
router.get('/user/:id', auth, admin, getUserById);
router.put('/user/:id', auth, admin, updateUser);
router.delete('/user/:id', auth, admin, deleteUser);

export default router;