import { object, string, boolean, array, number } from 'joi';

const addressSchema = object({
  street: string().required(),
  city: string().required(),
  state: string().allow(''),
  postalCode: string().required(),
  countryCode: string().length(2).required(),
  residential: boolean().default(false)
});

const validateRateRequest = (req, res, next) => {
  const schema = object({
    origin: addressSchema.required(),
    destination: addressSchema.required(),
    packages: array().items(object({
      weight: number().positive().required(),
      dimensions: object({
        length: number().positive().required(),
        width: number().positive().required(),
        height: number().positive().required()
      }).required()
    })).min(1).required(),
    serviceType: string().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
};

const validateShipmentRequest = (req, res, next) => {
  const schema = object({
    shipper: object({
      name: string().required(),
      company: string().required(),
      phone: string().required(),
      address: addressSchema.required()
    }).required(),
    recipient: object({
      name: string().required(),
      company: string().allow(''),
      phone: string().required(),
      address: addressSchema.required()
    }).required(),
    packages: array().items(object({
      weight: number().positive().required(),
      dimensions: object({
        length: number().positive().required(),
        width: number().positive().required(),
        height: number().positive().required()
      }).required()
    })).min(1).required(),
    customsValue: object({
      currency: string().length(3).required(),
      amount: number().positive().required()
    }).required(),
    commodities: array().items(object({
      description: string().required(),
      countryOfManufacture: string().length(2).required(),
      quantity: number().positive().required(),
      quantityUnits: string().default('PCS'),
      unitPrice: object({
        currency: string().length(3).required(),
        amount: number().positive().required()
      }).required(),
      customsValue: object({
        currency: string().length(3).required(),
        amount: number().positive().required()
      }).required(),
      weight: number().positive().required()
    })).min(1).required(),
    serviceType: string().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
};

const validateTrackingRequest = (req, res, next) => {
  const trackingNumber = req.params.trackingNumber;
  if (!trackingNumber || trackingNumber.length < 10) {
    return res.status(400).json({
      success: false,
      error: 'Valid tracking number is required'
    });
  }
  next();
};

export default {
  validateRateRequest,
  validateShipmentRequest,
  validateTrackingRequest
};