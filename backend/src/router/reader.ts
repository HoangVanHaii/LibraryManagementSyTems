import { Router } from 'express';
import { getMyProfile, getReaderHistory, getReaderStats } from '../controllers/reader';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/history', authMiddleware, getReaderHistory);
router.get('/dashboard-stats', authMiddleware, getReaderStats);
router.get('/profile', authMiddleware, getMyProfile);

export default router;