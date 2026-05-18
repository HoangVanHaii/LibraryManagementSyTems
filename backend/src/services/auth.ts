import sql from 'mssql';
import { authPool } from '../configs/db'; // Bạn nhớ điều chỉnh lại đường dẫn cho đúng với cấu trúc folder của mình nhé
import { AppError } from '../utils/appError';
/**
 * Hàm xác thực người dùng sử dụng Auth Pool riêng biệt
 * @param username Tên đăng nhập
 * @param passwordPlain Mật khẩu thô do người dùng nhập từ giao diện
 * @param clientIp Địa chỉ IP của máy khách để ghi nhật ký hệ thống
 */
export const authenticateUser = async (username: string, passwordPlain: string, clientIp: string) => {
    try {
        // 1. Sử dụng đúng authPool đã được cấu hình riêng để kết nối tới ThuVien_ACCOUNT
        const result = await authPool.request()
            .input('TenDangNhap', sql.VarChar(50), username)
            .input('MatKhauPlain', sql.VarChar(100), passwordPlain)
            .input('IP_Address', sql.VarChar(45), clientIp)
            .execute('sp_Account_Login');

        const rows = result.recordset;

        // Nếu Stored Procedure không trả về dữ liệu (Trường hợp hy hữu khi SP lỗi)
        if (!rows || rows.length === 0) {
            return null;
        }

        const user = rows[0];
        const maId = user.MaNV || user.MaDG;

        // 2. Trả về thông tin định danh sạch cho lớp Controller xử lý tạo mã JWT
        return {
            username: user.TenDangNhap,
            // Sẽ trả về chính xác chuỗi: 'DocGia', 'ThuThu', 'QuanLyKho', 'KeToan', hoặc 'GiamDoc'
            // Chuỗi này khớp 100% với các case trong hàm getPoolByRole(roleName) của bạn
            role: user.RoleName,
            maId: maId
        };

    } catch (error: any) {
        if (error.message) {
            throw new AppError(error.message, 400);
        }
        throw error;
    }
};