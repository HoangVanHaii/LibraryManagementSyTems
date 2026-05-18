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
        if (error.message) {
            throw new AppError(error.message, 400);
        }
        throw error;
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
        if (error.message) {
            throw new AppError(error.message, 400);
        }
        throw error;
    }
};

// --------------------------------------------------------------------------
// 3. SERVICE: TIẾN HÀNH THU PHẠT - TRỪ NỢ (TỪ STORED PROCEDURE GIỚI HẠN)
// --------------------------------------------------------------------------
export const collectFinePayment = async (maDG: string, soTienThu: number, maNVKeToan: string): Promise<void> => {
    try {
        await keToanPool.request()
            .input('MaDG', sql.VarChar(10), maDG)
            .input('SoTienThu', sql.Decimal(18, 2), soTienThu)
            .input('MaNV_KeToan', sql.VarChar(10), maNVKeToan) 
            .execute('sp_KeToan_ThuTienPhat');
    } catch (error: any) {
        if (error.message) {
            throw new AppError(error.message, 400);
        }
        throw error;
    }
};
// Thực thi thanh toán phạt lẻ cho một đầu sách cụ thể trong chi tiết phiếu mượn
export const collectDetailFinePayment = async (maPhieu: string, maSach: string, maNVKeToan: string): Promise<void> => {
    try {
        await keToanPool.request()
            .input('MaPhieu', sql.VarChar(15), maPhieu)
            .input('MaSach', sql.VarChar(10), maSach)
            .input('MaNV_KeToan', sql.VarChar(10), maNVKeToan)
            .execute('sp_KeToan_ThuTienPhatChiTiet');
    } catch (error: any) {
        console.log(error);
        if (error.message) {
            throw new AppError(error.message, 400);
        }
        throw error;
    }
};
// Thực thi tất toán toàn bộ công nợ phạt của độc giả
export const collectAllFinesPayment = async (maDG: string, maNVKeToan: string): Promise<void> => {
    try {
        await keToanPool.request()
            .input('MaDG', sql.VarChar(10), maDG)
            .input('MaNV_KeToan', sql.VarChar(10), maNVKeToan)
            .execute('sp_KeToan_ThuTienPhatToanBo'); // Gọi đích danh SP xử lý gộp con trỏ
    } catch (error: any) {
        if (error.message) {
            throw new AppError(error.message, 400);
        }
        throw error;
    }
};