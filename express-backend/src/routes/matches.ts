import express from 'express';
import { findMatches } from '../controllers/matchController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/find', authMiddleware, findMatches);

export default router;