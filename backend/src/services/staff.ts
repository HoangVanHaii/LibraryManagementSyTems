import { keToanPool,getPoolByRole } from '../configs/db';
import { AppError } from '../utils/appError';
import { IStaffSalary, ISalaryPoolSummary } from '../interfaces/staff';

export const getStaffListWithSalary = async (): Promise<IStaffSalary[]> => {
    try {
        const result = await keToanPool.request().execute('sp_KeToan_DanhSachNhanVien');
        return result.recordset as IStaffSalary[];
    } catch (error: any) {
        if (error.message) {
            throw new AppError(error.message, 400);
        }
        throw error;
    }
};

export const getSalaryPoolSummary = async (): Promise<ISalaryPoolSummary> => {
    try {
        const result = await keToanPool.request().execute('sp_KeToan_TongQuyLuong');
        return result.recordset[0] as ISalaryPoolSummary;
    } catch (error: any) {
        if (error.message) {
            throw new AppError(error.message, 400);
        }
        throw error;
        
    }
};

export const getStaffProfile = async (maNV: string,role:string): Promise<any> => {
    try {
        const result = await getPoolByRole(role).request()
            .input('MaNV', maNV)
            .execute('sp_NhanVien_XemProfile');

        if (result.recordset.length === 0) {
            throw new AppError('Không tìm thấy hồ sơ cá nhân trên hệ thống!', 404);
        }

        return result.recordset[0];
    } catch (error: any) {
        if (error instanceof AppError) throw error;
        throw new AppError(error.message || 'Lỗi truy xuất CSDL', 500);
    }
};

export const updateStaffProfile = async (maNV: string,role: string, sdt: string, email: string, diaChi: string): Promise<any> => {
    try {
        await getPoolByRole(role).request()
            .input('MaNV', maNV)
            .input('SDT', sdt)
            .input('Email', email)
            .input('DiaChi', diaChi)
            .execute('sp_NhanVien_CapNhatProfile');

        return { message: 'Đã cập nhật hồ sơ cá nhân thành công!' };
    } catch (error: any) {
        throw new AppError(error.message || 'Lỗi cập nhật hồ sơ', 400);
    }
};