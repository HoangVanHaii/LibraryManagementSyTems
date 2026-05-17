import { Request, Response, NextFunction } from 'express';
import * as bookService from '../services/book';
import { AppError } from '../utils/appError';

/**
 * API Controller xử lý lấy danh sách sách cho Độc giả
 * Endpoint: GET /api/reader/books
 */
export const getReaderBooks = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        // Giả định middleware của bạn gán thông tin vào req.user
        if (req.user && req.user.role !== 'DocGia') {
            throw new AppError('Từ chối truy cập: Chỉ độc giả mới có quyền xem danh mục sách!', 403);
        }

        // Gọi tầng service để bốc dữ liệu từ SQL Server
        const books = await bookService.getBooksForReader();

        // Trả về HTTP 200 cùng mảng dữ liệu sạch cho Vue 3 render giao diện
        return res.status(200).json(books);

    } catch (error) {
        next(error);
    }
};