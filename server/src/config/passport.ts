// server/src/config/passport.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User';
import Business from '../models/Business';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails?.[0].value });

        if (!user) {
          // Create new user
          user = await User.create({
            email: profile.emails?.[0].value,
            fullName: profile.displayName,
            passwordHash: Math.random().toString(36).slice(-8) + 'G00gle!', // Random password for OAuth users
            googleId: profile.id,
          });

          // Create associated business
          await Business.create({
            user: user._id,
            name: `${profile.displayName}'s Business`,
            address: '',
            gstin: '',
            pan: '',
            contact: '',
          });
        } else if (!user.googleId) {
          // Link existing account to Google
          user.googleId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

export default passport;
