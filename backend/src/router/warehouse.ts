import { Router } from 'express';
import { getAllBooks, getLowStock, processImport, addBook, updateBookInfo, deleteBookById, getInventoryStatsDashboard} from '../controllers/warehouse';
import { authMiddleware } from '../middleware/auth';
import { uploadImage } from '../middleware/upload';
const router = Router();

router.get('/books', authMiddleware, getAllBooks);
router.get('/low-stock', authMiddleware, getLowStock);
router.post('/import', authMiddleware, processImport);
router.post('/books', authMiddleware, uploadImage.single('image'), addBook);
router.put('/books/:maSach', authMiddleware, uploadImage.single('image'), updateBookInfo);
router.delete('/books/:maSach', authMiddleware, deleteBookById);
router.get('/stats', authMiddleware, getInventoryStatsDashboard);
export default router;