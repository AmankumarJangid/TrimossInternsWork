import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import bcrypt from 'bcrypt'

// Register new user
export const registerUser = async (req, res) => {
  try {
    console.log("REQ.BODY =", req.body);
    const {
      name,
      email,
      password,
      address = [], role,
      userType = 'individual',
      ...rest

    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !userType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();


    // Check if user already exists
    const existingUser = await User.findByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Handle address normalization ( add label if missing)
    const normalizedAddresses = address.map((addr, idx) => ({
      ...addr,
      label: addr.label || `${addr.city}${addr.zipCode ? `-${addr.zipCode}` : ''}`,
      isDefault: idx === 0 ? true : !!addr.isDefault
    }));

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,
      userType,
      address: normalizedAddresses,
      ...rest
    });
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = user.generateTokens();
    await user.save(); // Save refresh token

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        accessToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findByEmail(normalizedEmail).select('+password');

    console.log("found user", user);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: `Invalid credentials at selecting user`
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials at comparePassword'
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = user.generateTokens();
    await user.save(); // Save refresh token

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        accessToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not found'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = user.generateTokens();
    await user.save();

    // Set new refresh token as cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      data: {
        accessToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

// Logout user
export const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.refreshToken = null;
    await user.save();

    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'avatar', 'address'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({
        success: false,
        message: 'Invalid updates'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findByEmail(req.body.email);
      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Normalize address if provided
    if (req.body.address) {
      let normalizedAddresses = req.body.address.map(addr => ({
        ...addr,
        label: addr.label || `${addr.city}${addr.zipCode ? ` - ${addr.zipCode}` : ''}`,
        isDefault: !!addr.isDefault
      }));

      // Ensure only one default
      const hasDefault = normalizedAddresses.some(addr => addr.isDefault);
      if (!hasDefault && normalizedAddresses.length > 0) {
        normalizedAddresses[0].isDefault = true;
      }

      user.address = normalizedAddresses;
    }

    // Apply other fields
    updates.forEach((key) => {
      if (key !== 'address') user[key] = req.body[key];
    });

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user by ID (admin only)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user (admin only)
export const updateUser = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'role', 'isActive'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({
        success: false,
        message: 'Invalid updates'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


// added OTP generator and sender 
/////////////////////////////////
/////////////////////////////////



export const sendForgotPasswordOTP = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "Enter a valid email, User not found " });

  const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
  const expiry = new Date(Date.now() + 10 * 60 * 1000);
  user.otp = otp;
  user.otpExpiresAt = expiry;

  await user.save();

  console.log(user.otp);

  // create the transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_EMAIL_PASSWORD
    }
  })

  ///// send to gmail to the entered email

  await transporter.sendMail({
    from: process.env.MY_EMAIL,
    to: email,
    subject: `Your OTP for password change is ${otp}`,
    text: `From Trimoss India , \n
            The otp for password Change is \n
            ${otp}\n
            This otp will valid for the next 10 minutes`
  });

  res.json({ message: "OTP is sent successfully" });

}


// ✅ Verifies OTP only, doesn't reset password
export const verifyOtp = async (req, res) => {

  const { email, otp } = req.body;
  console.log(otp);
  const user = await User.findOne({ email }).select('+otp +otpExpiresAt');

  if (!user) return res.status(404).json({ message: 'User not found' });

  if ((otp === user.otp) && (user.otpExpiresAt > Date.now())) {
    return res.status(200).json({ success: true });
  }

  // if (!user.otp || user.otp != otp || user.otpExpiresAt > Date.now()) 
  else {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }


};




// ✅ Reset password after otop validation
export const resetPasswordWithOTP = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || user.otp !== otp || user.otpExpiresAt < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }



  user.password = newPassword;
  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  console.log(user.password);

  res.json({ message: "Password is successfully changed" });


}