import { Router } from 'express';
import * as borrowController from '../controllers/borrow';
import * as borrowMiddleware from "../middleware/borrow";
import { authMiddleware, checkRole } from '../middleware/auth'; 
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.post('/create', authMiddleware, checkRole(['ThuThu', 'ADMIN']), borrowMiddleware.validateBorrowRules, validateRequest, borrowController.createBorrowTicket);

router.put('/return', authMiddleware, checkRole(['ThuThu']), borrowMiddleware.validateReturnRules, validateRequest, borrowController.returnBook);

export default router;