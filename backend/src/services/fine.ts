import sql from 'mssql';
import { keToanPool } from '../configs/db'; 
import { IFineReader, IFineBookDetail } from '../interfaces/fine';
import { AppError } from '../utils/appError';
// --------------------------------------------------------------------------
// 1. SERVICE: LẤY DANH SÁCH CÔNG NỢ TỔNG QUAN (TỪ VIEW)
// --------------------------------------------------------------------------
export const getFinesList = async (): Promise<IFineReader[]> => {
    try {
        const result = await keToanPool.request()
            .query(`
                SELECT MaDG, HoTen, SDT, Email, CongNo 
                FROM v_KeToan_DanhSachThuPhat 
                ORDER BY CongNo DESC
            `);
        return result.recordset as IFineReader[];
    } catch (error: any) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message || 'Hệ thống không thể tải danh sách công nợ.', 500);
    }
};

// --------------------------------------------------------------------------
// 2. SERVICE: XEM CHI TIẾT SÁCH BỊ PHẠT CỦA 1 ĐỘC GIẢ (TỪ STORED PROCEDURE)
// --------------------------------------------------------------------------
export const getFineDetailByReader = async (maDG: string): Promise<IFineBookDetail[]> => {
    try {
        const result = await keToanPool.request()
            .input('MaDG', sql.VarChar(10), maDG)
            .execute('sp_KeToan_ChiTietPhieuPhat');
        return result.recordset as IFineBookDetail[];
    } catch (error: any) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message || 'Hệ thống không thể tải danh mục đầu sách vi phạm.', 500);
    }
};

// --------------------------------------------------------------------------
// 3. SERVICE: TIẾN HÀNH THU PHẠT - TRỪ NỢ (TỪ STORED PROCEDURE GIỚI HẠN)
// --------------------------------------------------------------------------
export const collectFinePayment = async (maDG: string, soTienThu: number): Promise<void> => {
    try {
        await keToanPool.request()
            .input('MaDG', sql.VarChar(10), maDG)
            .input('SoTienThu', sql.Decimal(18, 2), soTienThu)
            .execute('sp_KeToan_ThuTienPhat');
    } catch (error: any) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(error.message || 'Giao dịch khấu trừ công nợ thất bại.', 500);
    }
};