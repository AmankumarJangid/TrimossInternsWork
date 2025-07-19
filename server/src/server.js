import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import productRoutes from './routes/productRoutes.js';
import paypalRoutes from './routes/paypalRoutes.js';
import razorpayRoutes from './routes/razopayRoutes.js';
import orderRoutes from "./routes/orderRoutes.js";
import fedexRoutes from './fedexApi/routes/fedex.js';
import errorHandler from './fedexApi/middleware/errorHandler.js';
// import dhlApiRoutes from './dhlApi/index.js';
//DHL imports
import dhlRoutes from './dhlApi/routes/dhl.js';

// Load environment variables
dotenv.config();



//Fedex imports 
// import fedexRoutes from './routes/fedex.js';
// import errorHandler from './middleware/errorHandler.js';
// import { fileURLToPath } from 'url';
// import {dirname} from 'path';

// const _dirname =  dirname( fileURLToPath(import.meta.url));

// Connect to database
connectDB();

const app = express();

// app.use("/api", dhlApiRoutes);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
console.log("CORS ALLOWED ORIGIN =", process.env.CLIENT_URL); 
// app.use(cors({
//   origin: process.env.CLIENT_URL,
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

//new cors
// app.use(cors({
//   origin: function (origin, callback) {
//     console.log("Incoming Origin:", origin);
//     if (!origin || origin === process.env.CLIENT_URL) {
//       callback(null, true);
//     } else {
//       callback(new Error("CORS policy doesn't allow access from this origin."));
//     }
//   },
//   credentials: true,
// }));

app.use(cors({
  origin: [process.env.CLIENT_URL, "http://127.0.0.1:3001"],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
// Error handling
app.use(errorHandler);


// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/razorpay', razorpayRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/fedex', fedexRoutes);
app.use('/api/dhl', dhlRoutes);  // ✅ This is your DHL API proxy



// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'User API is running!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// app.use("/api", dhlApiRoutes);  // Already correct
