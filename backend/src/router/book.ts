import { Router } from 'express';
import { getReaderBooks } from '../controllers/book';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/reader', authMiddleware, getReaderBooks);  

export default router;