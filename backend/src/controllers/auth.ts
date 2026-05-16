// import { Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import { authenticateUser } from '../services/auth';

// export const login = async (req: Request, res: Response): Promise<any> => {
//     const { username, password } = req.body;
//     if (!username || !password) {
//         return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ tên đăng nhập và mật khẩu.' });
//     }

//     try {
//         const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP') as string;

//         const userInfo = await authenticateUser(username, password, clientIp);

//         if (!userInfo) {
//             return res.status(401).json({ message: 'Thông tin đăng nhập không chính xác!' });
//         }

//         const tokenPayload = {
//             username: userInfo.username,
//             maId: userInfo.maId,
//             role: userInfo.role,
//             permissions: userInfo.permissions
//         };

//         const token = jwt.sign(
//             tokenPayload,
//             process.env.JWT_SECRET || 'THUVIEN_SECRET_KEY_2026',
//             { expiresIn: '1h' }
//         );

//         const refreshToken = jwt.sign(
//             tokenPayload,
//             process.env.JWT_REFRESH_SECRET || 'THUVIEN_REFRESH_SECRET_KEY_2026',
//             { expiresIn: '7d' }
//         );

//         return res.status(200).json({
//             message: 'Đăng nhập thành công',
//             token,
//             refreshToken,
//             user: userInfo
//         });

//     } catch (err) {
//         console.error('Lỗi hệ thống tại API Login:', err);
//         return res.status(500).json({ message: 'Lỗi hệ thống nội bộ!' });
//     }
// };