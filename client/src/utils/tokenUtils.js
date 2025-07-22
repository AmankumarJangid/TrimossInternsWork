import axios from "axios";
import {jwtDecode }from "jwt-decode";
import { setCredentials, logout } from '../redux/slices/authSlice';



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
    try{
        const decoded = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000) ; // because Date.now() provided current time in milliseconds but jwt in seconds 
        return decoded.exp < now;
    }
    catch( e ){
        console.log( e.message());
        return false;  // if not valid 
    }
}

