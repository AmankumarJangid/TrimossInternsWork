import express from 'express';
import { getRates } from './controller.js';

const router = express.Router();

router.post('/rates', getRates); // POST /api/dhl/rates

export default router;
