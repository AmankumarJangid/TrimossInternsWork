import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import fedexRoutes from './routes/fedex.js';
import errorHandler from './middleware/errorHandler.js';
import { fileURLToPath } from 'url';
import {dirname} from 'path';

const _dirname =  dirname( fileURLToPath(import.meta.url));


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("../client"));
// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/fedex', fedexRoutes);



app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);





app.listen(PORT, () => {
  console.log(`FedEx API Integration Server running on port ${PORT}`);
});