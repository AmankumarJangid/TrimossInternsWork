import axios from 'axios';
import { setCredentials, logout } from '../redux/authSlice';

export const refreshAccessToken = async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
      { withCredentials: true }
    );

    const { accessToken } = response.data.data;

    const user = JSON.parse(localStorage.getItem("userDetails"));

    dispatch(setCredentials({ user, token: accessToken }));
    return accessToken;
  } catch (error) {
    dispatch(logout());
    console.error('Token refresh failed:', error.response?.data || error.message);
    return null;
  }
};


export function isTokenExpired(token){
    if( !token ) return true;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry =  payload.exp;
    const now = Math.floor( Date.now() / 1000);

    return now >= expiry;
}