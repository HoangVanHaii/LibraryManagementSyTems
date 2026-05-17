import sql from 'mssql';
import { docGiaPool,getPoolByRole } from '../configs/db';
import { IBorrowHistory, IDashboardStats } from '../interfaces/borrow';
import { IReaderProfile } from '../interfaces/reader';
import { AppError } from '../utils/appError';
import { CreateReaderDTO } from '../interfaces/reader';
import * as crypto from 'crypto';
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


export const createReaderService = async (data: CreateReaderDTO, maNVLap: string, roleName: string) => {
    const currentPool = getPoolByRole(roleName); 
    
    // Vẫn giữ lại việc random Salt ở Backend để đảm bảo tính ngẫu nhiên
    const salt = crypto.randomBytes(16).toString('hex');
    
    // [ĐÃ XÓA] dòng const passwordHash = crypto.pbkdf2Sync...

    const ngayLap = new Date();
    const ngayHet = new Date();
    ngayHet.setFullYear(ngayLap.getFullYear() + 1);

    const reqNghiepVu = currentPool.request();
    reqNghiepVu.input('maDG', sql.VarChar(10), data.maDG);
    reqNghiepVu.input('hoTen', sql.NVarChar(100), data.hoTen);
    reqNghiepVu.input('ngaySinh', sql.Date, data.ngaySinh);
    reqNghiepVu.input('cccdRaw', sql.VarChar(12), data.cccd);
    reqNghiepVu.input('sdt', sql.VarChar(15), data.sdt);
    reqNghiepVu.input('email', sql.VarChar(100), data.email);
    reqNghiepVu.input('ngayLap', sql.Date, ngayLap);
    reqNghiepVu.input('ngayHet', sql.Date, ngayHet);
    reqNghiepVu.input('maNVLap', sql.VarChar(10), maNVLap);

    await reqNghiepVu.execute('ThuVien_NGHIEPVU.dbo.SP_ThemDocGia');

    try {
        const reqAccount = currentPool.request();
        reqAccount.input('TenDangNhap', sql.VarChar(50), data.email); 
        
        // [ĐÃ SỬA] Truyền thẳng mật khẩu gốc xuống với tên tham số là MatKhauPlain
        reqAccount.input('MatKhauPlain', sql.VarChar(100), data.password); 
        
        reqAccount.input('Salt', sql.VarChar(50), salt);
        reqAccount.input('MaDG', sql.VarChar(10), data.maDG);

        await reqAccount.execute('ThuVien_ACCOUNT.dbo.SP_TaoTaiKhoan_DocGia');
        
        return; 
        
    } catch (error: any) {
        const cleanupReq = currentPool.request();
        cleanupReq.input('maDG', sql.VarChar(10), data.maDG);
        await cleanupReq.execute('ThuVien_NGHIEPVU.dbo.SP_HuyHoSoDocGia').catch(e => console.error('Lỗi dọn rác:', e));

        throw error; 
    }
};

export const renewReaderCardService = async (maDG: string, soThangGiaHan: number, role: string): Promise<void> => {
    const currentPool = getPoolByRole(role);

    const request = currentPool.request();
    request.input('MaDG', sql.VarChar(10), maDG);
    request.input('SoThangGiaHan', sql.Int, soThangGiaHan);

    await request.execute('ThuVien_NGHIEPVU.dbo.SP_GiaHanTheDocGia');
};