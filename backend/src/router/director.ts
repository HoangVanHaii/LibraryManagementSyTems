import { Router } from 'express';
import { authMiddleware, checkRole } from '../middleware/auth'; 
import { fetchEmployeeDetails, fetchEmployees, processCreateEmployee, toggleEmployeeStatus,getDashboardStats } from '../controllers/director';
const router = Router();

router.post('/create-employee', authMiddleware, processCreateEmployee);
router.get('/employees', authMiddleware, fetchEmployees);
router.get('/employees/:id', authMiddleware, fetchEmployeeDetails);
router.post('/employees/toggle-status', authMiddleware, toggleEmployeeStatus);
router.get('/dashboard', authMiddleware, checkRole(['GiamDoc']), getDashboardStats);

export default router;