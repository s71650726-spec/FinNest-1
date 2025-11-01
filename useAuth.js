import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem('finnest_token'));
  const [user, setUser] = useState(null);
  const [biometricReady, setBiometricReady] = useState(false);

  // Decode JWT to get user info - simplified
  const decodeToken = (jwt) => {
    try {
      const base64Payload = jwt.split('.')[1];
      const payload = JSON.parse(atob(base64Payload));
      return payload;
    } catch {
      return null;
    }
  };

  const onLoginSuccess = useCallback(
    (jwtToken) => {
      localStorage.setItem('finnest_token', jwtToken);
      setToken(jwtToken);
      const payload = decodeToken(jwtToken);
      setUser(payload);
    },
    [setToken, setUser]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('finnest_token');
    setToken(null);
    setUser(null);
  }, []);

  // Token refresh logic every 5 minutes
  useEffect(() => {
    let intervalId;
    if (token) {
      intervalId = setInterval(async () => {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { token });
          if (res.data.token) {
            onLoginSuccess(res.data.token);
          }
        } catch {
          logout();
        }
      }, 300000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [token, onLoginSuccess, logout]);

  // Check biometric readiness - mock demo
  useEffect(() => {
    // For demo, assume biometric is ready if WebAuthn is supported
    setBiometricReady(typeof window.PublicKeyCredential !== 'undefined');
  }, []);

  return {
    token,
    user,
    isAuthenticated: !!token,
    onLoginSuccess,
    logout,
    biometricReady
  };
}

export default useAuth;
