// src/routes/auth.ts
import express from 'express';
import passport from 'passport';
import { login, register, linkedinCallback } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/linkedin', passport.authenticate('linkedin'));
router.get('/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), linkedinCallback);

export default router;