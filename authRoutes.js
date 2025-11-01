import express from 'express';
import jwt from 'jsonwebtoken';
import passport from '../config/passport.js';
import { User } from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY_SECONDS = 3600 * 6; // 6 hours

function generateToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      roles: user.roles
    },
    JWT_SECRET,
    {
      expiresIn: TOKEN_EXPIRY_SECONDS,
      algorithm: 'HS256'
    }
  );
}

// POST /api/auth/login - email/password login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password are required and must be strings' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await user.validatePassword(password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.json({ token, expiresIn: TOKEN_EXPIRY_SECONDS });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/oauth/google - initiate Google OAuth login
router.get(
  '/oauth/google',
  passport.authenticate('google', { scope: ['email', 'profile'], session: false })
);

// GET /api/auth/oauth/google/callback - Google OAuth callback
router.get(
  '/oauth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    const token = generateToken(req.user);
    // Redirect or respond with token
    res.json({ token, expiresIn: TOKEN_EXPIRY_SECONDS });
  }
);

// POST /api/auth/oauth/apple - initiate Apple OAuth login
router.get(
  '/oauth/apple',
  passport.authenticate('apple', { scope: ['email'], session: false })
);

// POST /api/auth/oauth/apple/callback - Apple OAuth callback
router.post(
  '/oauth/apple/callback',
  passport.authenticate('apple', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    res.json({ token, expiresIn: TOKEN_EXPIRY_SECONDS });
  }
);

// POST /api/auth/biometric-login - biometric login token validation
router.post('/biometric-login', async (req, res, next) => {
  try {
    const { biometricToken } = req.body;
    if (!biometricToken || typeof biometricToken !== 'string') {
      return res.status(400).json({ error: 'biometricToken is required' });
    }
    // Here implement biometric token validation logic (mocked for demo)
    // For production, integrate with biometric provider SDK or verify JWT with biometric claims

    // For demo, decode JWT and find user
    let payload;
    try {
      payload = jwt.verify(biometricToken, JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Invalid biometric token' });
    }
    const user = await User.findByPk(payload.sub);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    // Issue new token
    const token = generateToken(user);
    res.json({ token, expiresIn: TOKEN_EXPIRY_SECONDS });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/refresh-token
router.post('/refresh-token', (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }, (err, decoded) => {
      if (err) return res.status(401).json({ error: 'Invalid token' });
      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp > now) {
        // Token not expired yet - issue new token with extended expiry
        const newToken = jwt.sign(
          {
            sub: decoded.sub,
            roles: decoded.roles
          },
          JWT_SECRET,
          {
            expiresIn: TOKEN_EXPIRY_SECONDS,
            algorithm: 'HS256'
          }
        );
        return res.json({ token: newToken, expiresIn: TOKEN_EXPIRY_SECONDS });
      }
      return res.status(401).json({ error: 'Token expired, please login again' });
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout - client should delete token, server can blacklist tokens if implemented
router.post('/logout', (req, res) => {
  // For stateless JWT, logout is handled client side by deleting token.
  // Optionally implement token blacklist here.
  res.json({ message: 'Logged out successfully' });
});

export default router;
