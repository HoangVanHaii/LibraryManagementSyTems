import sql from 'mssql';
import { docGiaPool,getPoolByRole } from '../configs/db';
import { IBorrowHistory, IDashboardStats } from '../interfaces/borrow';
import { IReaderProfile } from '../interfaces/reader';
import { AppError } from '../utils/appError';
import { CreateReaderDTO } from '../interfaces/reader';
import * as crypto from 'crypto';

export const getMyBorrowHistory = async (maDG: string): Promise<IBorrowHistory[]> => {
    try {
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

export const getReaderDashboardStats = async (maDG: string): Promise<IDashboardStats> => {
    try {
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
    const salt = crypto.randomBytes(16).toString('hex');
    const ngayHet = new Date();
    ngayHet.setFullYear(ngayHet.getFullYear() + 1);

    const reqNghiepVu = currentPool.request();
    reqNghiepVu.input('maDG', sql.VarChar(10), data.maDG);
    reqNghiepVu.input('hoTen', sql.NVarChar(100), data.hoTen);
    reqNghiepVu.input('ngaySinh', sql.Date, data.ngaySinh);
    reqNghiepVu.input('cccdRaw', sql.VarChar(12), data.cccd);
    reqNghiepVu.input('sdt', sql.VarChar(15), data.sdt);
    reqNghiepVu.input('email', sql.VarChar(100), data.email);
    reqNghiepVu.input('ngayHet', sql.Date, ngayHet);
    reqNghiepVu.input('maNVLap', sql.VarChar(10), maNVLap);

    try {
        
        await reqNghiepVu.execute('ThuVien_NGHIEPVU.dbo.SP_ThemDocGia');
    } catch (error: any) {
      
        if (error.number === 50000 || error.code === 'EREQUEST') {
            throw new AppError(error.message, 400);
        }
        throw error;
    }

  
    try {
        const reqAccount = currentPool.request();
        reqAccount.input('TenDangNhap', sql.VarChar(50), data.email); 
        reqAccount.input('MatKhauPlain', sql.VarChar(100), data.password); 
        reqAccount.input('Salt', sql.VarChar(50), salt);
        reqAccount.input('MaDG', sql.VarChar(10), data.maDG);

        await reqAccount.execute('ThuVien_ACCOUNT.dbo.SP_TaoTaiKhoan_DocGia');
        return; 
        
    } catch (error: any) {
        const cleanupReq = currentPool.request();
        cleanupReq.input('maDG', sql.VarChar(10), data.maDG);
        await cleanupReq.execute('ThuVien_NGHIEPVU.dbo.SP_HuyHoSoDocGia').catch(e => console.error('Lỗi dọn rác:', e));

        if (error.number === 50000 || error.code === 'EREQUEST') {
            throw new AppError(error.message, 400);
        }
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

export const getAllReadersService = async (role: string, search?: string, status?: string): Promise<any[]> => {
    const currentPool = getPoolByRole(role);
    const request = currentPool.request();

    request.input('Search', sql.NVarChar(100), search || null);
    request.input('Status', sql.VarChar(20), status || null);

    const result = await request.execute('ThuVien_NGHIEPVU.dbo.SP_LayDanhSachDocGia');
    return result.recordset;
};