import { Router } from 'express';
import { getMyProfile, getReaderHistory, getReaderStats } from '../controllers/reader';
import { authMiddleware, checkRole } from '../middleware/auth'; 
import * as readerController from '../controllers/reader';
import * as readerMiddleware from "../middleware/reader";
import { validateRequest } from '../middleware/validateRequest';
const router = Router();

router.get('/history', authMiddleware, getReaderHistory);
router.get('/dashboard-stats', authMiddleware, getReaderStats);
router.get('/profile', authMiddleware, getMyProfile);

router.get('/list', authMiddleware, checkRole(['ThuThu', 'ADMIN']), readerController.getAllReaders);
router.post('/create', authMiddleware, checkRole(['ThuThu', 'ADMIN']), readerMiddleware.validateCreateReaderRules, validateRequest, readerController.createReaderAccount);

router.put('/renew', authMiddleware, checkRole(['ThuThu']), readerMiddleware.validateRenewRules, validateRequest, readerController.renewReaderCard);


export default router;