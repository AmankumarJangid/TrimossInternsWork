import axios from "axios";
import store from "../redux/store" // your Redux store
import { setCredentials , logout} from "../redux/slices/authSlice";
import { refreshAccessToken , isTokenExpired } from "./tokenUtils";

const api = axios.create({
    baseURL : import.meta.env.VITE_API_BASE || "/api", 
    withCredentials : true, // Needed to send cookies like refreshToken
});

// Add request interceptor
api.interceptors.request.use(
  async (config) => {
    const state = store.getState();
    const token = state.auth.token;

   
    if (token && isTokenExpired(token)) {   // Check if token is present and expired
      try {
        const newAccessToken = await refreshAccessToken(store.dispatch);

        if (newAccessToken) {
          
          store.dispatch(setCredentials({ user: state.auth.user, token: newAccessToken })); // Update token in Redux

          
          config.headers.Authorization = `Bearer ${newAccessToken}`; // Update the token in the request headers
        }
      } catch (err) {
       
        store.dispatch(logout()); // If refresh fails, logout user
        return Promise.reject(err);
      }
    } else if (token) {
    
      config.headers.Authorization = `Bearer ${token}`;  // If token exists and not expired, attach it
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;