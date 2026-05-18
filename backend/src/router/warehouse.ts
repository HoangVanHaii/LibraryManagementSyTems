import { Router } from 'express';
import { getAllBooks, getLowStock, processImport, addBook, updateBookInfo, deleteBookById, getInventoryStatsDashboard} from '../controllers/warehouse';
import { authMiddleware } from '../middleware/auth';
const router = Router();

router.get('/books', authMiddleware, getAllBooks);
router.get('/low-stock', authMiddleware, getLowStock);
router.post('/import', authMiddleware, processImport);
router.post('/books', authMiddleware, addBook);                  // Thêm sách mới tinh
router.put('/books/:maSach', authMiddleware, updateBookInfo);     // Sửa thông tin sách cũ
router.delete('/books/:maSach', authMiddleware, deleteBookById);
router.get('/stats', authMiddleware, getInventoryStatsDashboard);
export default router;