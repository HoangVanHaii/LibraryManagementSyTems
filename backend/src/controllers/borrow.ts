import { Request, Response, NextFunction } from 'express';
import { createReaderService } from '../services/reader';
import AppError from '../utils/appError'; 
import * as borrowService  from '../services/borrow';
import { CreateBorrowDTO } from '../interfaces/borrow';

export const createBorrowTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const borrowData: CreateBorrowDTO = req.body;
        const maNV = req.user!.id; 
        const role = req.user!.role;

        await borrowService.createBorrowTicketService(borrowData, maNV, role);

        res.status(201).json({
            success: true,
            message: `Lập thành công phiếu mượn ${borrowData.maPhieu} cho độc giả ${borrowData.maDG}.`
        });
    } catch (error) {
        next(error);
    }
};

export const returnBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const returnData:any = req.body;
        const role = req.user!.role;

        await borrowService.returnBookService(returnData, role);

        res.status(200).json({
            success: true,
            message: `Đã ghi nhận trả sách cho cuốn ${returnData.maSach} nằm trong phiếu mượn ${returnData.maPhieu}.`
        });
    } catch (error) {
        next(error);
    }
};