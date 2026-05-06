import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sql from 'mssql';
import { accountPool } from '../configs/db';

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const result = await accountPool.request()
            .input('username', sql.VarChar, username)
            .query('SELECT TenDangNhap, MatKhauHash, MaNV, MaDG, TrangThai FROM TAI_KHOAN WHERE TenDangNhap = @username');

        const user = result.recordset[0];

        if (!user || user.TrangThai === false) {
            return res.status(401).json({ message: 'Thông tin đăng nhập không chính xác!' });
        }

        // 4. So sánh mật khẩu thô với mã Hash trong DB bằng Bcrypt
        // Bcrypt sẽ tự động xử lý Salt đã được nhúng trong chuỗi MatKhauHash
        const isMatch = await bcrypt.compare(password, user.MatKhauHash);

        if (!isMatch) {
            // Ghi log đăng nhập thất bại vào bảng Audit của DB Account
            await recordLoginLog(username, 'Thất bại - Sai mật khẩu', req.ip);
            return res.status(401).json({ message: 'Thông tin đăng nhập không chính xác!' });
        }

        // 5. Ghi log đăng nhập thành công
        await recordLoginLog(username, 'Thành công', req.ip);

        // 6. Tạo JWT chứa các ID liên kết (MaNV/MaDG) để phục vụ RLS sau này[cite: 1]
        const token = jwt.sign(
            {
                username: user.TenDangNhap,
                maId: user.MaNV || user.MaDG,
                role: user.MaNV ? 'NHAN_VIEN' : 'DOC_GIA'
            },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            {
                username: user.TenDangNhap,
                maId: user.MaNV || user.MaDG,
                role: user.MaNV ? 'NHAN_VIEN' : 'DOC_GIA'
            },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Đăng nhập thành công',
            token,
            refreshToken,
            user: {
                username: user.TenDangNhap,
                role: user.MaNV ? 'NHAN_VIEN' : 'DOC_GIA'
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi hệ thống!' });
    }
};

// Hàm phụ   ghi log Audit đăng nhập[cite: 1]
async function recordLoginLog(username: string, status: string, ip: any) {
    await accountPool.request()
        .input('user', sql.VarChar, username)
        .input('ip', sql.VarChar, ip)
        .input('status', sql.NVarChar, status)
        .query('INSERT INTO LICH_SU_DANG_NHAP (TenDangNhap, IP_Address, TrangThai) VALUES (@user, @ip, @status)');
}