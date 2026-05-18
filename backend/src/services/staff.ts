import { keToanPool } from '../configs/db';
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