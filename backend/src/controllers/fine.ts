import { Request, Response, NextFunction } from 'express';
import * as fineService from '../services/fine';
import { AppError } from '../utils/appError';

export const getAllFines = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        console.log('Thông tin người dùng từ Auth Middleware:', (req as any).user);
        if ((req as any).user?.role !== 'KeToan') {
            console.log(403);
            throw new AppError('Từ chối truy cập: Chỉ kế toán mới có quyền xem danh sách công nợ!', 403);
        }

        console.log(1);
        const data = await fineService.getFinesList();
        return res.status(200).json(data);
    } catch (error: any) {
        next(error);
    }
};

export const getFineDetail = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if ((req as any).user?.role !== 'KeToan') {
            throw new AppError('Từ chối truy cập: Chỉ kế toán mới có quyền xem chi tiết công nợ!', 403);
        }

        const { maDG } = req.params as { maDG: string };
        if (!maDG) {
            throw new AppError('Thiếu tham số Mã độc giả cần tra cứu!', 400);
        }

        const details = await fineService.getFineDetailByReader(maDG);
        return res.status(200).json(details);
    } catch (error: any) {
        next(error);
    }
};


export const processFinePayment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if ((req as any).user?.role !== 'KeToan') {
            throw new AppError('Từ chối truy cập: Chỉ kế toán mới có quyền thực hiện giao dịch thu tiền phạt!', 403);
        }
        const maNV_KeToan = (req as any).user?.id; 
        
        if (!maNV_KeToan) {
            throw new AppError('Không tìm thấy danh tính Kế toán viên lập phiếu. Vui lòng đăng nhập lại!', 401);
        }

        const { maDG, soTienThu } = req.body;

        if (!maDG || soTienThu === undefined) {
            throw new AppError('Thiếu thông tin Mã Độc giả hoặc Số tiền thu!', 400);
        }

        await fineService.collectFinePayment(maDG, Number(soTienThu), maNV_KeToan);

        return res.status(200).json({
            message: `Lập phiếu thu thành công! Hệ thống đã trừ ${Number(soTienThu).toLocaleString('vi-VN')} VNĐ vào sổ công nợ của độc giả [${maDG}].`
        });
    } catch (error) {
        next(error);
    }
};

export const processDetailItemPayment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if ((req as any).user?.role !== 'KeToan') {
            throw new AppError('Từ chối truy cập: Chỉ vai trò Kế toán mới có quyền thực hiện giao dịch thu tiền phạt!', 403);
        }
        const maNV_KeToan = (req as any).user?.id;

        if (!maNV_KeToan) {
            throw new AppError('Không tìm thấy danh tính Kế toán viên lập phiếu thu lẻ. Vui lòng đăng nhập lại!', 401);
        }
        
        const { maPhieu, maSach } = req.body;
        if (!maPhieu || !maSach) {
            throw new AppError('Yêu cầu thiếu thông tin Mã phiếu mượn hoặc Mã sách để lập biên lai lẻ!', 400);
        }

        await fineService.collectDetailFinePayment(maPhieu, maSach, maNV_KeToan);

        return res.status(200).json({
            message: `Lập biên lai thu tiền thành công cho đầu sách [${maSach}] thuộc phiếu mượn [${maPhieu}]. Hệ thống đã gạch nợ thành công!`
        });
    } catch (error) {

        next(error);
    }
};

export const collectAllFines = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if ((req as any).user?.role !== 'KeToan') {
            throw new AppError('Từ chối đặc quyền: Chỉ kế toán viên mới có quyền lập biên lai tất toán!', 403);
        }

        const maNV_KeToan = (req as any).user?.id;
        const { maDG } = req.body;

        if (!maDG) {
            throw new AppError('Vui lòng cung cấp Mã độc giả để tiến hành tất toán gộp!', 400);
        }
        await fineService.collectAllFinesPayment(maDG, maNV_KeToan);

        return res.status(200).json({
            message: `Giao dịch hoàn tất! Hệ thống đã lập các biên lai thu tiền phạt tương ứng và xóa sạch công nợ cho độc giả [${maDG}].`
        });
    } catch (error: any) {
        return res.status(400).json({ message: error.message || 'Tất toán toàn bộ công nợ thất bại.' });
    }
};