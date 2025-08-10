// server/src/dhl_api/dhlService.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class DhlService {
  constructor() {
    this.baseURL = process.env.DHL_BASE_URL || 'https://express.api.dhl.com/mydhlapi';
    this.apiKey = process.env.DHL_API_KEY;
    this.apiSecret = process.env.DHL_API_SECRET;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const credentials = Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64');
      const response = await axios.post(
        `${this.baseURL}/auth/v1/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      // Set expiry with a 1-minute buffer for safety
      this.tokenExpiry = new Date(Date.now() + (response.data.expires_in * 1000) - 60000);
      return this.accessToken;
    } catch (error) {
      console.error("DHL Auth Error:", error.response ? error.response.data : error.message);
      throw new Error('DHL authentication failed.');
    }
  }

  async makeAuthenticatedRequest(config) {
    const token = await this.getAccessToken();
    return axios({
      ...config,
      headers: {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getRates(shipmentData) {
    try {
      console.log( shipmentData);
      const payload = {
        "customerDetails": {
          "shipperDetails": {
            "postalCode": "110017",
            "cityName": "DELHI",
            "addressLine1": "Blk 6 Lock Rd",
            "addressLine2": "02-10 Gillman Barracks",
            "addressLine3": "Barrack Street",
            "countryCode": "IN"
          },
          "receiverDetails": {
            "postalCode": "75001",
            "cityName": "HONG KONG",
            "addressLine1": "9",
            "addressLine2": "Rue Simart",
            "addressLine3": "test",
            "countryCode": "HK"
          }
        },
        "accounts": [
          {
            "typeCode": "shipper",
            "number": "539998704"
          }
        ],
        "productsAndServices": [
          {
            "productCode": "P",
            "localProductCode": "P"
          }
        ],
        "payerCountryCode": "IN",
        "plannedShippingDateAndTime": "2025-05-05T13:00:00GMT+05:30",
        "unitOfMeasurement": "metric",
        "isCustomsDeclarable": true,
        "monetaryAmount": [
          {
            "typeCode": "declaredValue",
            "value": 100,
            "currency": "INR"
          }
        ],
        "estimatedDeliveryDate": {
          "isRequested": true,
          "typeCode": "QDDC"
        },
        //  "getAdditionalInformation": [
        //    {
        //      "typeCode": "allValueAddedServices",
        //      "isRequested": true
        //    }
        //  ],
        //  "returnStandardProductsOnly": false,
        //  "nextBusinessDay": true,
        //  "productTypeCode": "all",
        "packages": [
          {
            //     "typeCode": "3BX",
            "weight": 0.5,
            "dimensions": {
              "length": 121,
              "width": 20,
              "height": 30
            }
          }
        ]
      };

  
      const payload2 = {
        shipperDetails: {
          postalCode: shipmentData.origin.postalCode,
          cityName: shipmentData.origin.city,
          countryCode: shipmentData.origin.countryCode,
        },
        receiverDetails: {
          postalCode: shipmentData.destination.postalCode,
          cityName: shipmentData.destination.city,
          countryCode: shipmentData.destination.countryCode,
        },
        packages: shipmentData.packages,
        isCustomsDeclarable: shipmentData.destination.countryCode !== shipmentData.origin.countryCode,
        unitOfMeasurement: "metric",
      };

      const response = await this.makeAuthenticatedRequest({
        method: 'POST',
        url: `${this.baseURL}/rates`,
        data: payload,
      });

      return response.data;
    } catch (error) {
      console.error("DHL Rate Error:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
      throw new Error(`DHL rate calculation failed: ${error.response?.data?.detail || error.message}`);
    }
  }
}

export default new DhlService();