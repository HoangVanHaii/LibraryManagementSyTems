import { Request, Response, NextFunction } from 'express';
import * as borrowService from '../services/reader';
import * as readerService from '../services/reader';
import { AppError } from '../utils/appError';
import { CreateReaderDTO } from '../interfaces/reader';

export const getReaderHistory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        // Giả định qua lớp Middleware xác thực (verifyToken), thông tin Token đã được giải mã 
        // và lưu vào đối tượng req.user dưới dạng: { username: 'haidocgia', maId: 'DG2604001', role: 'DocGia' }
        const currentReaderId = (req as any).user?.id;

        if (!currentReaderId) {
            throw new AppError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại!', 401);
        }

        // Truyền mã Độc giả hợp pháp xuống tầng Service
        const historyData = await borrowService.getMyBorrowHistory(currentReaderId);

        // Phản hồi dữ liệu dạng JSON về cho màn hình ReaderView (Reader.vue) render giao diện
        return res.status(200).json(historyData);
    } catch (error) {
        next(error);
    }
};


export const createReaderAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const readerData: CreateReaderDTO = req.body;
        const maNVLap = (req as any).user?.id;
        const currentRole = req.user!.role;

        await readerService.createReaderService(readerData, maNVLap as string, currentRole);

        res.status(201).json({
            success: true,
            message: 'Đã tạo thẻ và cấp tài khoản Độc giả thành công!'
        });

    } catch (error: any) {
        next(error);
    }
};

export const renewReaderCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { maDG, soThangGiaHan } = req.body;
        const role = req.user!.role;

        if (!maDG || !soThangGiaHan) {
            return next(new AppError('Vui lòng nhập đầy đủ mã Độc giả và số tháng cần gia hạn!', 400));
        }

        await readerService.renewReaderCardService(maDG, Number(soThangGiaHan), role);

        res.status(200).json({
            success: true,
            message: `Gia hạn thẻ cho độc giả ${maDG} thêm ${soThangGiaHan} tháng thành công.`
        });
    } catch (error) {
        next(error);
    }
};


export const getReaderStats = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const currentReaderId = (req as any).user?.id; // Lấy mã độc giả từ Auth Middleware giải mã JWT

        if (!currentReaderId) {
            throw new AppError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại!', 401);
        }

        const stats = await borrowService.getReaderDashboardStats(currentReaderId);

        // Trả kết quả JSON sạch về cho client
        return res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
};

export const getMyProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        // Trích xuất mã ID độc giả hợp pháp đã được Auth Middleware xác thực và gán vào ngữ cảnh req
        const currentReaderId = (req as any).user?.id;

        if (!currentReaderId) {
            throw new AppError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại!', 401);
        }

        // Gọi service xử lý giải mã dưới SQL Server
        const profile = await readerService.getProfileByReader(currentReaderId);

        if (!profile) {
            throw new AppError('Hồ sơ độc giả không tồn tại trên hệ thống.', 404);
        }

        // Trả về dữ liệu profile sạch kèm số CCCD đã được giải mã rõ ràng
        return res.status(200).json(profile);

    } catch (error) {
        next(error);
    }
};
