// import axios from 'axios';
// import dotenv from 'dotenv';
// dotenv.config();

// export const getDHLToken = async () => {
//   const credentials = Buffer.from(`${process.env.DHL_CLIENT_ID}:${process.env.DHL_CLIENT_SECRET}`).toString('base64');

//   const response = await axios.post(
//     'https://express.api.dhl.com/oauth/token',
//     null,
//     {
//       headers: {
//         Authorization: `Basic ${credentials}`,
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       params: {
//         grant_type: 'client_credentials',
//       },
//     }
//   );

//   return response.data.access_token;
// };
