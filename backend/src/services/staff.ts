import { keToanPool } from '../configs/db';
import { AppError } from '../utils/appError';
import { IStaffSalary, ISalaryPoolSummary } from '../interfaces/staff';

// Service 1: Lấy danh sách nhân viên đã giải mã lương kèm phụ cấp
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

// Service 2: Tính tổng quỹ chi trả ngân sách lương của thư viện
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