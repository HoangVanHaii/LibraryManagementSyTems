import { giamDocPool,getPoolByRole } from '../configs/db'; 
import sql from 'mssql';
import { CreateEmployeeDTO } from '../interfaces/director';
import { AppError } from '../utils/appError';
import crypto from 'crypto';
import { IDashboardStatsResponse } from '../interfaces/director';

export const createEmployeeAccountService = async (data: CreateEmployeeDTO): Promise<string> => {
    const salt = crypto.randomBytes(16).toString('hex');
    let generatedMaNV = '';

    const reqNghiepVu = giamDocPool.request();
    reqNghiepVu.input('hoTen', sql.NVarChar(100), data.hoTen);
    reqNghiepVu.input('ngaySinh', sql.Date, data.ngaySinh);
    reqNghiepVu.input('cccdRaw', sql.VarChar(12), data.cccd);
    reqNghiepVu.input('sdt', sql.VarChar(15), data.sdt);
    reqNghiepVu.input('email', sql.VarChar(100), data.email);
    reqNghiepVu.input('diaChi', sql.NVarChar(255), data.diaChi);
    reqNghiepVu.input('role', sql.VarChar(20), data.role);
    reqNghiepVu.input('luongRaw', sql.Decimal(18, 2), data.luong);
    reqNghiepVu.input('phuCapRaw', sql.Decimal(18, 2), data.phuCap);

    const resultNghiepVu = await reqNghiepVu.execute('ThuVien_NGHIEPVU.dbo.SP_ThemNhanVien');
    generatedMaNV = resultNghiepVu.recordset[0].MaNV;
    
    try {
        const reqAccount = giamDocPool.request();
        reqAccount.input('TenDangNhap', sql.VarChar(50), data.email);
        reqAccount.input('MatKhauPlain', sql.VarChar(100), data.matKhau);
        reqAccount.input('Salt', sql.VarChar(50), salt);
        reqAccount.input('MaNV', sql.VarChar(10), generatedMaNV);
        reqAccount.input('RoleName', sql.VarChar(50), data.role);

        await reqAccount.execute('ThuVien_ACCOUNT.dbo.SP_TaoTaiKhoan_NhanVien');
        return generatedMaNV;

    } catch (error: any) {
        console.error(`🚨 Lỗi đồng bộ tài khoản mật mã cho [${generatedMaNV}]. Tiến hành dọn rác nghiệp vụ...`);

        const cleanupReq = giamDocPool.request();
        cleanupReq.input('maNV', sql.VarChar(10), generatedMaNV);
        await cleanupReq.execute('ThuVien_NGHIEPVU.dbo.SP_HuyHoSoNhanVien').catch(e => console.error('Lỗi dọn rác lý lịch:', e));

        if (error.message) {
            throw new AppError(error.message, 400);
        }
        throw error;
    }
};

export const getEmployeeList = async (): Promise<any[]> => {
    try {
        const result = await giamDocPool.request().execute('sp_GiamDoc_LayDanhSachNhanVien');
        return result.recordset;
    } catch (error: any) { throw error; }
};

export const getEmployeeDetails = async (maNV: string): Promise<any> => {
    try {
        const result = await giamDocPool.request()
            .input('MaNV', sql.VarChar(10), maNV)
            .execute('sp_GiamDoc_XemChiTietNhanVien');
        return result.recordset[0];
    } catch (error: any) { throw error; }
};

export const toggleEmployeeStatusService = async (maNV: string, hanhDong: 'KHOA' | 'MO_KHOA'): Promise<void> => {
    try {
        const req = giamDocPool.request();
        req.input('MaNV', sql.VarChar(10), maNV);
        req.input('HanhDong', sql.VarChar(20), hanhDong);

        await req.execute('ThuVien_ACCOUNT.dbo.sp_GiamDoc_ThayDoiTrangThaiTaiKhoan');
    } catch (error: any) {
        throw error;
    }
};


export const getDashboardStatsService = async (
    roleName: string, 
    tuNgay?: string, 
    denNgay?: string
): Promise<IDashboardStatsResponse> => {
    
    const currentPool = getPoolByRole(roleName);
    const request = currentPool.request();

    if (tuNgay) request.input('TuNgay', sql.Date, new Date(tuNgay));
    if (denNgay) request.input('DenNgay', sql.Date, new Date(denNgay));

    const result = await request.execute('ThuVien_NGHIEPVU.dbo.SP_GiamDoc_ThongKeTongQuan');
    const recordsets = result.recordsets as any[][];

    return {
        tongQuan: recordsets[0][0],
        topSach: recordsets[1],     
        luuLuong: recordsets[2]     
    };
};