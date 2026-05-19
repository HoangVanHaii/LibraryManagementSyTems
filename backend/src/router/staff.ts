import { Router } from 'express';
import { getAllStaffWithSalary, getLibrarySalaryPool,getMyProfile, updateMyProfile } from '../controllers/staff';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/accountant/staff', authMiddleware, getAllStaffWithSalary);
router.get('/accountant/staff/salary-pool', authMiddleware, getLibrarySalaryPool);
router.get('/profile', authMiddleware, getMyProfile);
router.put('/profile', authMiddleware, updateMyProfile);
export default router;