import { Router } from 'express';
import { getAllFines, getFineDetail, processFinePayment } from '../controllers/fine';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Gắn kết chặt chẽ các cổng giao tiếp HTTP công cộng với hàm xử lý
router.get('/accountant/fines', authMiddleware, getAllFines);
router.get('/accountant/fines/:maDG', authMiddleware, getFineDetail);
router.post('/accountant/collect-fine', authMiddleware, processFinePayment);

export default router;