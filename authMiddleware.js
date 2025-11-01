import passport from '../config/passport.js';

export const jwtAuthMiddleware = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }
    req.user = user;
    return next();
  })(req, res, next);
};
