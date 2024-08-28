// src/config/passport.ts

import passport from 'passport';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { PrismaClient } from '@prisma/client';
import { linkedinConfig } from './linkedin';
import { generateUserProfile, scrapeLinkedInProfile } from '../services/profileGenerationService';

const prisma = new PrismaClient();

passport.use(new LinkedInStrategy({
  clientID: linkedinConfig.clientID,
  clientSecret: linkedinConfig.clientSecret,
  callbackURL: linkedinConfig.callbackURL,
  scope: linkedinConfig.scope
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await prisma.user.findUnique({ where: { linkedinId: profile.id } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          linkedinId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          linkedinUrl: profile._json.publicProfileUrl,
          profilePictureUrl: profile.photos[0].value,
          accessToken,
          refreshToken
        }
      });

      // Scrape LinkedIn profile and generate user profile data
      const linkedinData = await scrapeLinkedInProfile(profile._json.publicProfileUrl);
      await generateUserProfile(user.id, linkedinData);
    } else {
      // Update existing user data
      await prisma.user.update({
        where: { id: user.id },
        data: { accessToken, refreshToken }
      });
    }

    done(null, user);
  } catch (error) {
    done(error as Error);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;