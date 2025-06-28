import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/fedex';

// Example 1: Get shipping rates
async function getShippingRates() {
  try {
    const response = await axios.post(`${API_BASE}/rates`, {
      origin: {
        postalCode: '38017',
        countryCode: 'US'
      },
      destination: {
        postalCode: '00501',
        countryCode: 'CA'
      },
      packages: [{
        weight: 5,
        dimensions: {
          length: 12,
          width: 8,
          height: 6
        }
      }]
    });
    console.log('Shipping Rates:', response.data);
  } catch (error) {
    console.error('Error getting rates:', error.response?.data || error.message);
  }
}

// Example 2: Create international shipment
async function createShipment() {
  try {
    const response = await axios.post(`${API_BASE}/shipments`, {
      shipper: {
        name: 'John Doe',
        company: 'Your Company',
        phone: '555-123-4567',
        address: {
          street: '123 Main St',
          city: 'Memphis',
          state: 'TN',
          postalCode: '38017',
          countryCode: 'US'
        }
      },
      recipient: {
        name: 'Jane Smith',
        company: 'Customer Company',
        phone: '555-987-6543',
        address: {
          street: '456 Queen St',
          city: 'Toronto',
          state: 'ON',
          postalCode: 'M5H 2N2',
          countryCode: 'CA',
          residential: false
        }
      },
      packages: [{
        weight: 5,
        dimensions: {
          length: 12,
          width: 8,
          height: 6
        }
      }],
      customsValue: {
        currency: 'USD',
        amount: 100.00
      },
      commodities: [{
        description: 'Electronics',
        countryOfManufacture: 'US',
        quantity: 1,
        quantityUnits: 'PCS',
        unitPrice: {
          currency: 'USD',
          amount: 100.00
        },
        customsValue: {
          currency: 'USD',
          amount: 100.00
        },
        weight: 5
      }]
    });
    
    console.log('Shipment Created:', response.data);
  } catch (error) {
    console.error('Error creating shipment:', error.response?.data || error.message);
  }
}

// Example 3: Track shipment
async function trackShipment(trackingNumber) {
  try {
    const response = await axios.get(`${API_BASE}/track/${trackingNumber}`);
    console.log('Tracking Info:', response.data);
  } catch (error) {
    console.error('Error tracking shipment:', error.response?.data || error.message);
  }
}

module.exports = {
  getShippingRates,
  createShipment,
  trackShipment
};
