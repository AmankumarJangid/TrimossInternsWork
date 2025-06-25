import joi from 'joi';
// const { object, string, boolean, array, number } = pkg;

const addressSchema = joi.object({
  street: joi.string().required(),
  city: joi.string().required(),
  state: joi.string().allow(''),
  postalCode: joi.string().required(),
  countryCode: joi.string().length(2).required(),
  residential: joi.boolean().default(false)
});

export const validateRateRequest = (req, res, next) => {
  const schema = joi.object({
    origin: addressSchema.required(),
    destination: addressSchema.required(),
    packages: joi.array().items(joi.object({
      weight: joi.number().positive().required(),
      dimensions: joi.object({
        length: joi.number().positive().required(),
        width: joi.number().positive().required(),
        height: joi.number().positive().required()
      }).required()
    })).min(1).required(),
    serviceType: joi.string().optional()
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

export const validateShipmentRequest = (req, res, next) => {
  const schema = joi.object({
    shipper: joi.object({
      name: joi.string().required(),
      company: joi.string().required(),
      phone: joi.string().required(),
      address: addressSchema.required()
    }).required(),
    recipient: joi.object({
      name: joi.string().required(),
      company: joi.string().allow(''),
      phone: joi.string().required(),
      address: addressSchema.required()
    }).required(),
    packages: joi.array().items(joi.object({
      weight: joi.number().positive().required(),
      dimensions: joi.object({
        length: joi.number().positive().required(),
        width: joi.number().positive().required(),
        height: joi.number().positive().required()
      }).required()
    })).min(1).required(),
    customsValue: joi.object({
      currency: joi.string().length(3).required(),
      amount: joi.number().positive().required()
    }).required(),
    commodities: joi.array().items(joi.object({
      description: joi.string().required(),
      countryOfManufacture: joi.string().length(2).required(),
      quantity: joi.number().positive().required(),
      quantityUnits: joi.string().default('PCS'),
      unitPrice: joi.object({
        currency: joi.string().length(3).required(),
        amount: joi.number().positive().required()
      }).required(),
      customsValue: joi.object({
        currency: joi.string().length(3).required(),
        amount: joi.number().positive().required()
      }).required(),
      weight: joi.number().positive().required()
    })).min(1).required(),
    serviceType: joi.string().optional()
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

export const validateTrackingRequest = (req, res, next) => {
  const trackingNumber = req.params.trackingNumber;
  if (!trackingNumber || trackingNumber.length < 10) {
    return res.status(400).json({
      success: false,
      error: 'Valid tracking number is required'
    });
  }
  next();
};

export default{
  validateRateRequest,
  validateShipmentRequest,
  validateTrackingRequest
};