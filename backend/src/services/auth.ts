import sql from 'mssql';
import { authPool } from '../configs/db'; 
import { AppError } from '../utils/appError';

export const authenticateUser = async (username: string, passwordPlain: string, clientIp: string) => {
    try {
        const result = await authPool.request()
            .input('TenDangNhap', sql.VarChar(50), username)
            .input('MatKhauPlain', sql.VarChar(100), passwordPlain)
            .input('IP_Address', sql.VarChar(45), clientIp)
            .execute('sp_Account_Login');

        const rows = result.recordset;

        if (!rows || rows.length === 0) {
            return null;
        }

        const user = rows[0];
        const maId = user.MaNV || user.MaDG;

        return {
            username: user.TenDangNhap,
          
            role: user.RoleName,
            maId: maId
        };

    } catch (error: any) {
        if (error.message) {
            throw new AppError(error.message, 400);
        }
        throw error;
    }
};