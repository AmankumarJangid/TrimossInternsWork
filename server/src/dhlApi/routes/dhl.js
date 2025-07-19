import express from 'express';
import getRates from '../services/getRates.js';

const router = express.Router();

router.post('/rates', async (req, res) => {
  try {
    const rateData = await getRates(req.body); // assuming you pass body directly
    res.json(rateData);
  } catch (err) {
    console.error('DHL Route Error:', err);
    res.status(500).json({
      status: 500,
      title: 'Internal Server Error',
      detail: err.message || 'Something went wrong with DHL rate request.',
    });
  }
});

import createShipment from '../services/createShipment.js'; // ⬅️ Add this import

router.post('/shipment', async (req, res) => {
  try {
    const {
      shipper,
      recipient,
      packageDetails,
      productCode = 'P',
    } = req.body;

    const payload = {
      plannedShippingDateAndTime: new Date().toISOString(),
      productCode,
      payerCountryCode: shipper.address.countryCode,
      accounts: [
        {
          number: process.env.DHL_ACCOUNT_NUMBER,
          typeCode: 'shipper',
        },
      ],
      customerDetails: {
        shipperDetails: {
          postalAddress: {
            postalCode: shipper.address.postalCode,
            cityName: shipper.address.city,
            countryCode: shipper.address.countryCode,
            addressLine1: shipper.address.street,
          },
          contactInformation: {
            fullName: shipper.name,
            phone: shipper.phone,
            companyName: shipper.company,
          },
        },
        receiverDetails: {
          postalAddress: {
            postalCode: recipient.address.postalCode,
            cityName: recipient.address.city,
            countryCode: recipient.address.countryCode,
            addressLine1: recipient.address.street,
          },
          contactInformation: {
            fullName: recipient.name,
            phone: recipient.phone,
            companyName: recipient.company,
          },
        },
      },
      content: {
        packages: [
          {
            weight: packageDetails.weight,
            dimensions: {
              length: packageDetails.length,
              width: packageDetails.width,
              height: packageDetails.height,
            },
          },
        ],
      },
      labelFormat: 'PDF',
    };

    const shipmentResponse = await createShipment(payload);

    res.status(200).json(shipmentResponse);
  } catch (err) {
    console.error('DHL Shipment Error:', err?.response?.data || err.message);
    res.status(500).json({
      status: 500,
      title: 'Internal Server Error',
      detail: err?.response?.data || err.message || 'Failed to create shipment',
    });
  }
});

export default router; // ✅ ESM default export
