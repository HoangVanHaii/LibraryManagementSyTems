import { Request, Response, NextFunction } from 'express';
import * as bookService from '../services/book';
import { AppError } from '../utils/appError';

export const getReaderBooks = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if (req.user && req.user.role !== 'DocGia') {
            throw new AppError('Từ chối truy cập: Chỉ độc giả mới có quyền xem danh mục sách!', 403);
        }

        const books = await bookService.getBooksForReader();

        return res.status(200).json(books);

    } catch (error) {
        next(error);
    }
};