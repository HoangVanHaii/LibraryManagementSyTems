import { Request, Response, NextFunction } from 'express';
import * as staffService from '../services/staff';
import { AppError } from '../utils/appError';
export const getAllStaffWithSalary = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if ((req as any).user?.role !== 'KeToan') {
            throw new AppError('Từ chối đặc quyền: Bạn không có quyền truy cập thông tin nhân sự bí mật!', 403);
        }

        const staffList = await staffService.getStaffListWithSalary();
        return res.status(200).json(staffList);
    } catch (error) {
        next(error);
    }
};


export const getLibrarySalaryPool = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if ((req as any).user?.role !== 'KeToan') {
            throw new AppError('Từ chối đặc quyền truy cập dữ liệu ngân sách!', 403);
        }

        const summary = await staffService.getSalaryPoolSummary();
        return res.status(200).json(summary);
    } catch (error) {
        next(error);
    }
};