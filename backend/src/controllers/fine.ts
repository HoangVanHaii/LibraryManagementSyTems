import { Request, Response, NextFunction } from 'express';
import * as fineService from '../services/fine';
import { AppError } from '../utils/appError';

/**
 * API 1: Lấy danh sách tổng quan các độc giả dính nợ phạt
 * Endpoint: GET /api/accountant/fines
 */
export const getAllFines = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        // Gác cổng phân quyền ở tầng Backend ứng dụng
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

/**
 * API 2: Xem chi tiết các đầu sách bị phạt của một độc giả cụ thể
 * Endpoint: GET /api/accountant/fines/:maDG
 */
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

/**
 * API 3: Tiến hành thu tiền phạt và gạch nợ dưới DB
 * Endpoint: POST /api/accountant/collect-fine
 * Body: { maDG: 'DG001', soTienThu: 45000 }
 */
export const processFinePayment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if ((req as any).user?.role !== 'KeToan') {
            throw new AppError('Từ chối truy cập: Chỉ kế toán mới có quyền thực hiện giao dịch thu tiền phạt!', 403);
        }

        const { maDG, soTienThu } = req.body;

        if (!maDG || soTienThu === undefined) {
            throw new AppError('Thiếu thông tin Mã Độc giả hoặc Số tiền thu!', 400);
        }

        // Thực thi nghiệp vụ nộp tiền
        await fineService.collectFinePayment(maDG, Number(soTienThu));

        return res.status(200).json({
            message: `Lập phiếu thu thành công! Hệ thống đã trừ ${Number(soTienThu).toLocaleString('vi-VN')} VNĐ vào sổ công nợ của độc giả [${maDG}].`
        });
    } catch (error) {
        next(error);
    }
};