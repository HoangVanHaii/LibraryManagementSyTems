import crypto from 'crypto';
import sql from 'mssql';
import { accountPool } from '../configs/db';

export const authenticateUser = async (username: string, passwordTho: string, clientIp: string) => {
    const passwordHashBuffer = crypto.createHash('sha256').update(passwordTho).digest();

    const result = await accountPool.request()
        .input('username', sql.VarChar(50), username)
        .input('passwordHash', sql.VarBinary(sql.MAX), passwordHashBuffer)
        .input('ip_address', sql.VarChar(50), clientIp)
        .execute('sp_Login_CheckAccount');

    const rows = result.recordset;

    if (!rows || rows.length === 0 || rows[0].TenDangNhap === null) {
        return null; // Trả về null để Controller biết là sai pass/user
    }

    const user = rows[0];
    const permissions = rows.map(r => r.PermissionName).filter(p => p !== null);
    const role = user.MaNV ? 'NHAN_VIEN' : 'DOC_GIA';
    const maId = user.MaNV || user.MaDG;

    return {
        username: user.TenDangNhap,
        role: role,
        maId: maId,
        permissions: permissions
    };
};