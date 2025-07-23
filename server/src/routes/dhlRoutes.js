// server/src/dhl_api/dhlController.js
import dhlService from './dhlService.js';

export const getDhlRates = async (req, res, next) => {
  try {
    const rates = await dhlService.getRates(req.body);
    res.json({
      success: true,
      data: rates
    });
  } catch (error) {
    next(error);
  }
};