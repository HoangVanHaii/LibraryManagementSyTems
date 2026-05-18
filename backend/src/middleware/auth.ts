import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Chưa cung cấp token', 401);
        }
        const token = authHeader.split(' ')[1];
         console.log('Token nhận được từ client:', token); 
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = {
            id: decoded.maId,
            role:
             decoded.role
        };
        next();
    } catch (error) {
        console.error('Lỗi xác thực token:', error); 
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token đã hết hạn' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Token không hợp lệ' });
        }
        next(error);
    }
};


export const checkRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        
        if (!req.user || !req.user.role) {
            return next(new AppError('Bạn chưa đăng nhập hoặc phiên làm việc không hợp lệ!', 401));
        }

        const currentUserRole = req.user.role;

        if (!allowedRoles.includes(currentUserRole)) {
            return next(new AppError('Truy cập bị từ chối! Bạn không có quyền thực hiện hành động này.', 403));
        }

        next();
    };
};
