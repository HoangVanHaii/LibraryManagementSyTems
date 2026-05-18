import { docGiaPool } from '../configs/db';
import { IReaderBook } from '../interfaces/book'; 
import { AppError } from '../utils/appError';

export const getBooksForReader = async (): Promise<IReaderBook[]> => {
    try {
        const result = await docGiaPool.request()
            .query(`
                SELECT 
                    MaSach, 
                    TenSach, 
                    TacGia, 
                    TheLoai, 
                    NhaXuatBan, 
                    NamXuatBan, 
                    SoLuongTon, 
                    ViTriKe 
                FROM v_Sach
            `);

        return result.recordset as IReaderBook[];
    } catch (error: any) {
        if (error.message) {
            throw new AppError(error.message, 400);
        }
        throw error;
    }
};