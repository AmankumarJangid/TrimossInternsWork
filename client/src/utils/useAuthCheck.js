// src/hooks/useAuthCheck.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isTokenExpired, refreshAccessToken } from './tokenUtils';
import { logout } from '../redux/slices/authSlice';

const useAuthCheck = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      try {
        if (!token) {
          // No token present at all → logout
          dispatch(logout());
          return;
        }

        if (isTokenExpired(token)) {
          // Token is expired → try to refresh
          const refreshed = await refreshAccessToken(dispatch);
          if (!refreshed) {
            // If refresh failed → logout
            dispatch(logout());
          }
        }
      } catch (error) {
        // Any unexpected error → logout as a safety measure
        console.error("Auth check error:", error);
        dispatch(logout());
      }
    };

    checkAndRefreshToken();
  }, [token, dispatch]);
};

export default useAuthCheck;
