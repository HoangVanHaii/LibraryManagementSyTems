import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError';
import jwt from 'jsonwebtoken';
import { authenticateUser } from '../services/auth'; // Bạn kiểm tra và điều chỉnh lại đường dẫn file authService cho đúng nhé

export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { username, password } = req.body;

    // 1. Kiểm tra dữ liệu đầu vào thô từ Client
    if (!username || !password) {
        throw new AppError('Vui lòng cung cấp đầy đủ tên đăng nhập và mật khẩu!', 400);
    }

    try {
        // 2. Trích xuất IP của Client để truyền xuống SQL Server ghi nhận nhật ký hệ thống (Audit Log)
        const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP') as string;

        // 3. Gọi hàm service thực hiện xác thực (Chạy bằng authPool gác cổng)
        const userInfo = await authenticateUser(username, password, clientIp);

        if (!userInfo) {
            throw new AppError('Thông tin đăng nhập không chính xác!', 401);
        }

        // 4. Đóng gói dữ liệu Payload cho Token (Sử dụng trực tiếp thuộc tính role định danh)
        const tokenPayload = {
            username: userInfo.username,
            maId: userInfo.maId,
            role: userInfo.role // Giá trị trả về chuẩn: 'DocGia', 'ThuThu', 'KeToan',... dùng cho Route Guard ở Frontend
        };

        // 5. Ký số cấp phát bộ đôi chuỗi Token bảo mật (Access Token & Refresh Token)
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
        // 6. Trả về phiên làm việc thành công cho Client
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