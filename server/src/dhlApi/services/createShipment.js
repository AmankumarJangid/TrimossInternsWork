import axios from 'axios';

const createShipment = async (payload) => {
  const url = 'https://api-mock.dhl.com/mydhlapi/shipments'; // Replace with real endpoint if not using mock

  const response = await axios.post(url, payload, {
    headers: {
      'Content-Type': 'application/json',
      'DHL-API-Key': process.env.DHL_API_KEY,
    },
    auth: {
      username: process.env.DHL_USERNAME,
      password: process.env.DHL_PASSWORD,
    },
  });

  return response.data;
};

export default createShipment;
