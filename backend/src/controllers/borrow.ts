import { Request, Response, NextFunction } from 'express';
import { createReaderService } from '../services/reader';
// import AppError from '../utils/appError'; 
import * as borrowService  from '../services/borrow';
import { CreateBorrowDTO } from '../interfaces/borrow';

export const createBorrowTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const borrowData: CreateBorrowDTO = req.body;
        const maNV = (req as any).user?.id;
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
        const { maPhieu, maSach, tinhTrang } = req.body;
        const role = req.user!.role;

        const breakdown = await borrowService.returnBookService(role, maPhieu, maSach, tinhTrang);

        let thongBao = `Đã thu hồi sách ${maSach}. `;
        if (breakdown.TongTienPhat > 0) {
            thongBao += `Tổng phạt: ${breakdown.TongTienPhat} VNĐ (Trễ hạn: ${breakdown.TienPhatTreHan} VNĐ - Đền bù: ${breakdown.TienDenBuSach} VNĐ). Kế toán sẽ thu tiền.`;
        } else {
            thongBao += `Sách trả đúng hạn, tình trạng bình thường.`;
        }

        res.status(200).json({
            success: true,
            message: thongBao,
            data: breakdown 
        });
    } catch (error) {
        next(error);
    }
};

export const getBorrowList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const role = req.user!.role; 
        const searchQuery = req.query.search as string | undefined;
        const status = req.query.status as string | undefined;

        const data = await borrowService.getBorrowsListService(role, searchQuery, status);

        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        next(error);
    }
};