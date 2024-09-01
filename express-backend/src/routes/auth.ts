import express from 'express';
import cors from 'cors';
import passport from 'passport';
import { login, register, linkedinCallback, handleOptions } from '../controllers/authController';

const router = express.Router();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
  optionsSuccessStatus: 200
};

router.use(cors(corsOptions));

router.options('*', handleOptions);
router.post('/login', login);
router.post('/register', register);
router.get('/linkedin', passport.authenticate('linkedin'));
router.get('/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), linkedinCallback);

export default router;