import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { token } = response.data;
      localStorage.setItem('finnest_token', token);
      onLoginSuccess(token);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    const oauthUrl = `${API_BASE_URL}/auth/oauth/${provider}`;
    window.location.href = oauthUrl;
  };

  const handleBiometricLogin = async () => {
    // For demo, simulate biometric login token
    const biometricToken = localStorage.getItem('finnest_biometric_token');
    if (!biometricToken) {
      setError('Biometric login not available');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/biometric-login`, { biometricToken });
      const { token } = response.data;
      localStorage.setItem('finnest_token', token);
      onLoginSuccess(token);
    } catch (err) {
      setError(err.response?.data?.error || 'Biometric login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white bg-opacity-10 rounded-lg p-6 glass-effect-dark shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Login to FinNest</h2>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <hr className="my-6 border-gray-400" />
      <div className="flex flex-col space-y-3">
        <button
          type="button"
          onClick={() => handleOAuthLogin('google')}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded"
        >
          Sign in with Google
        </button>
        <button
          type="button"
          onClick={() => handleOAuthLogin('apple')}
          className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-2 rounded"
        >
          Sign in with Apple
        </button>
        <button
          type="button"
          onClick={handleBiometricLogin}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
        >
          Biometric Login
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
