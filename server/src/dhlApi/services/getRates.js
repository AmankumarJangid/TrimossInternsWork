import axios from 'axios';

const getRates = async (data) => {
  try {
    const {
      shipperPostalCode,
      shipperCity,
      shipperCountry,
      receiverPostalCode,
      receiverCity,
      receiverCountry,
      weight,
      length,
      width,
      height,
    } = data;

    const response = await axios.post(
      'https://api-mock.dhl.com/mydhlapi/rates',
      {
        customerDetails: {
          shipperDetails: {
            postalCode: shipperPostalCode,
            cityName: shipperCity,
            countryCode: shipperCountry,
          },
          receiverDetails: {
            postalCode: receiverPostalCode,
            cityName: receiverCity,
            countryCode: receiverCountry,
          },
        },
        plannedShippingDateAndTime: new Date().toISOString(),
        unitOfMeasurement: 'metric',
        declaredValue: 50,
        declaredValueCurrency: 'USD',
        packages: [
          {
            weight,
            dimensions: { length, width, height },
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'DHL-API-Key': process.env.DHL_API_KEY,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('❌ DHL API Error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.detail || 'Failed to fetch DHL rates'
    );
  }
};

export default getRates;
