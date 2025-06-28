import express from 'express';
const router = express.Router();
// import fedexService from '../services/fedexService.js';
import { validateRateRequest, validateShipmentRequest, validateTrackingRequest } from '../middleware/validation.js';
import {
    getShippingRates,
    createShipment,
    trackShipment,
    validateAddress
} from '../controllers/fedexController.js';

// Get shipping rates
router.post('/rates', validateRateRequest,getShippingRates);

// Create shipment
router.post('/shipments', validateShipmentRequest, createShipment);

// Track shipment
router.get('/track/:trackingNumber', validateTrackingRequest, trackShipment);

// Validate address
router.post('/address/validate', validateAddress);

export default router;