import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError';
import jwt from 'jsonwebtoken';
import { authenticateUser } from '../services/auth'; 

export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new AppError('Vui lòng cung cấp đầy đủ tên đăng nhập và mật khẩu!', 400);
    }

    try {
        const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP') as string;

        const userInfo = await authenticateUser(username, password, clientIp);

        if (!userInfo) {
            throw new AppError('Thông tin đăng nhập không chính xác!', 401);
        }

        const tokenPayload = {
            username: userInfo.username,
            maId: userInfo.maId,
            role: userInfo.role 
        };

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET || 'THUVIEN_SECRET_KEY_2026',
            { expiresIn: '5h' }
        );

        const refreshToken = jwt.sign(
            tokenPayload,
            process.env.JWT_REFRESH_SECRET || 'THUVIEN_REFRESH_SECRET_KEY_2026',
            { expiresIn: '7d' }
        );
        console.log(tokenPayload);
        return res.status(200).json({
            message: 'Đăng nhập thành công',
            token,
            refreshToken,
            user: userInfo
        });

    } catch (err) {   
        next(err);
    }
};