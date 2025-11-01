import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import AppleStrategy from 'passport-apple';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  algorithms: ['HS256']
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findByPk(payload.sub);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.OAUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/oauth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ where: { oauthProvider: 'google', oauthId: profile.id } });
        if (!user) {
          user = await User.create({
            email: profile.emails[0].value,
            oauthProvider: 'google',
            oauthId: profile.id,
            roles: ['user']
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.use(
  new AppleStrategy(
    {
      clientID: process.env.OAUTH_APPLE_CLIENT_ID,
      teamID: process.env.OAUTH_APPLE_TEAM_ID,
      keyID: process.env.OAUTH_APPLE_KEY_ID,
      privateKeyString: process.env.OAUTH_APPLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      callbackURL: '/api/auth/oauth/apple/callback',
      passReqToCallback: false
    },
    async (accessToken, refreshToken, idToken, profile, done) => {
      try {
        const appleId = idToken.sub;
        let user = await User.findOne({ where: { oauthProvider: 'apple', oauthId: appleId } });
        if (!user) {
          user = await User.create({
            email: idToken.email,
            oauthProvider: 'apple',
            oauthId: appleId,
            roles: ['user']
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

export default passport;
