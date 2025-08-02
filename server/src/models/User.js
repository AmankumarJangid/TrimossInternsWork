import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'address' }, // e.g. 'Home', 'Office'
  addressLine1: { type: String },
  addressLine2: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  country: { type: String },
  isDefault: { type: Boolean, default: false }
}, { _id: false })

const businessProfileSchema = new mongoose.Schema({
  businessName: { type: String },
  businessType: {
    type: String,
    enum: ['Business', 'Designer', 'Distributor', 'Architect', 'Other'],
    default: 'Business'
  },
  businessWebsite: { type: String },
  natureOfBusiness: { type: String },
  numberOfEmployees: { type: String },
  yearOfEstablishment: { type: String },
  monthlyPurchaseVolume: { type: String },
  designation: { type: String }
}, { _id: false })

const userSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ['Individual', 'Business', 'Designer', 'Distributor', 'Architect', 'Other'],
    required: true
  },

  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
    index : true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ],
    index : true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  address: {
    type: [addressSchema],
    default: []
  },

  shippingAddress: {
    type: addressSchema,
    default: null
  },


  role: {
    type: String,
    enum: ['user', 'admin', 'seller'],
    default: 'user',
    index : true,
  },

  isActive: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String,
    default: null
  },
  refreshToken: {
    type: String,
    select: false,
    index : true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  otp: {
    type: String,
    select: true // should be yes because without it can't excess the otp in the db
  },
  otpExpiresAt: {
    type: Date,
    select: true
  }
});

// Index for better performance
// userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ "address.city": 1 });
userSchema.index({ "address.zipCode": 1 });
userSchema.index({ "address.isDefault": 1 });




userSchema.pre('save', async function (next) {
  try {
    // Update timestamp
    this.updatedAt = Date.now();

    // Hash password if modified
    if (this.isModified('password')) {
      const saltRounds = 12;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }

    // Set default shipping address if not provided
    if (!this.shippingAddress && Array.isArray(this.address) && this.address.length > 0) {
      const defaultAddress = this.address.find(addr => addr.isDefault);
      this.shippingAddress = defaultAddress || this.address[0];
    }

    // Auto-set label on addresses if not provided
    if (Array.isArray(this.address)) {
      this.address = this.address.map(addr => {
        if (!addr.label || addr.label === 'address') {
          const city = addr.city?.trim();
          const zip = addr.zipCode?.trim();
          return {
            ...addr.toObject?.() || addr, // ensure plain object
            label: city || zip || 'address'
          };
        }
        return addr;
      });
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Update the updatedAt field before updating
userSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});
// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Generate both tokens
userSchema.methods.generateTokens = function () {
  const accessToken = this.generateAccessToken();
  const refreshToken = this.generateRefreshToken();

  // Save refresh token to database
  this.refreshToken = refreshToken;

  return { accessToken, refreshToken };
};

// Remove sensitive data from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken;
  delete user.__v;
  return user;
};

// Static method to find user by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find active users
userSchema.statics.findActiveUsers = function () {
  return this.find({ isActive: true });
};

const User = mongoose.model('User', userSchema);

export default User;