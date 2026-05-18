import { Router } from 'express';
import { getAllStaffWithSalary, getLibrarySalaryPool } from '../controllers/staff';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/accountant/staff', authMiddleware, getAllStaffWithSalary);
router.get('/accountant/staff/salary-pool', authMiddleware, getLibrarySalaryPool);
export default router;