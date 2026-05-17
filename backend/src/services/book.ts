import { docGiaPool } from '../configs/db'; // Đường dẫn tới file db.ts quản lý các Connection Pool của nhóm bạn
import { IReaderBook } from '../interfaces/book'; // Đường dẫn tới file book.ts chứa các Interface định nghĩa cấu trúc dữ liệu sách cho Độc giả
import { AppError } from '../utils/appError'; // Đường dẫn tới file appError.ts chứa lớp AppError tùy chỉnh để xử lý lỗi có cấu trúc thống nhất trong toàn bộ backend của bạn

/**
 * Lấy danh sách sách dành cho phân hệ Độc giả (Role_DocGia)
 * Bảo mật: Truy vấn thông qua View v_Sach bằng tài khoản docGiaPool giới hạn quyền tối thiểu
 */
export const getBooksForReader = async (): Promise<IReaderBook[]> => {
    try {
        // Sử dụng docGiaPool (Login_App_DocGia) để đảm bảo tính an toàn hệ thống từ gốc kết nối
        // Câu lệnh SELECT tường minh các cột cần lấy từ View v_Sach (Ẩn cột GiaBia nhạy cảm)
        const result = await docGiaPool.request()
            .query(`
                SELECT 
                    MaSach, 
                    TenSach, 
                    TacGia, 
                    TheLoai, 
                    NhaXuatBan, 
                    NamXuatBan, 
                    SoLuongTon, 
                    ViTriKe 
                FROM v_Sach
            `);

        // Ép kiểu mảng dữ liệu recordset trả về theo Interface IReaderBook chuẩn sạch
        return result.recordset as IReaderBook[];
    } catch (error: any) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message || 'Hệ thống gặp sự cố khi lấy danh sách sách.', 500);
    }
};