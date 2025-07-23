// server/src/routes/dhlRoutes.js
import express from 'express';
import { getDhlRates } from '../dhl_api/dhlController.js';
// You can add validation middleware here later if needed

const router = express.Router();

router.post('/rates', getDhlRates);

export default router;