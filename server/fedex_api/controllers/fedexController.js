import express from 'express';
const router = express.Router();
import fedexService from '../services/fedexService.js';


export const getShippingRates = async (req, res, next) => {
  try {
    const rates = await fedexService.getRates(req.body);
    res.json({
      success: true,
      data: rates
    });
  } catch (error) {
    next(error);
  }
}

export const createShipment = async (req, res, next) => {
  try {
    const shipment = await fedexService.createShipment(req.body);
    res.json({
      success: true,
      data: shipment
    });
  } catch (error) {
    next(error);
  }
}

export const trackShipment = async (req, res, next) => {
  try {
    const tracking = await fedexService.trackShipment(req.params.trackingNumber);
    res.json({
      success: true,
      data: tracking
    });
  } catch (error) {
    next(error);
  }
}

export const validateAddress = async (req, res, next) => {
  try {
    const validation = await fedexService.validateAddress(req.body);
    res.json({
      success: true,
      data: validation
    });
  } catch (error) {
    next(error);
  }
}

