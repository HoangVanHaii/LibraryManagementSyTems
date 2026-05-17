import sql from 'mssql';
import { docGiaPool } from '../configs/db';
import { IBorrowHistory, IDashboardStats } from '../interfaces/borrow';
import { IReaderProfile } from '../interfaces/reader';
import { AppError } from '../utils/appError';
/**
 * Gọi Stored Procedure lấy lịch sử mượn sách kết hợp cơ chế kích hoạt RLS
 * @param maDG Mã độc giả lấy từ Token session sau khi đăng nhập thành công
 */
export const getMyBorrowHistory = async (maDG: string): Promise<IBorrowHistory[]> => {
    try {
        // Thực thi SP bằng tài khoản kết nối tối thiểu của Độc giả
        const result = await docGiaPool.request()
            .input('MaDG', sql.VarChar(10), maDG)
            .execute('sp_DocGia_XemLichSuMuon');

        return result.recordset as IBorrowHistory[];
    } catch (error: any) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message || 'Hệ thống không thể tải lịch sử mượn sách của bạn.', 500);
    }
};

/**
 * Gọi Stored Procedure lấy dữ liệu tổng hợp Dashboard kết hợp cơ chế bẫy RLS
 * @param maDG Mã độc giả lấy từ chuỗi mã hóa an toàn của Token
 */
export const getReaderDashboardStats = async (maDG: string): Promise<IDashboardStats> => {
    try {
        // Chạy dưới quyền hạn tối thiểu của tài khoản độc giả kết nối CSDL
        const result = await docGiaPool.request()
            .input('MaDG', sql.VarChar(10), maDG)
            .execute('sp_DocGia_LayThongKeDashboard');

        return result.recordset[0] as IDashboardStats;
    } catch (error: any) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message || 'Hệ thống không thể tải số liệu thống kê cá nhân.', 500);
    }
};
/**
 * Gọi Stored Procedure bốc tách và giải mã thông tin hồ sơ độc giả
 * @param maDG Mã độc giả sở hữu phiên làm việc lấy từ JWT Token
 */
export const getProfileByReader = async (maDG: string): Promise<IReaderProfile | null> => {
    try {
        const result = await docGiaPool.request()
            .input('MaDG', sql.VarChar(10), maDG)
            .execute('sp_DocGia_XemProfile');

        if (!result.recordset || result.recordset.length === 0) {
            return null;
        }

        return result.recordset[0] as IReaderProfile;
    } catch (error: any) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message || 'Hệ thống gặp sự cố khi giải mã thông tin hồ sơ cá nhân.', 500);
    }
};