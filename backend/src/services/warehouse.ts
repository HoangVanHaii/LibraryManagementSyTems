import sql from 'mssql';
import { khoPool } from '../configs/db'; 
import { IBookInventory, IBookInput } from '../interfaces/warehouse';
import { AppError } from '../utils/appError';

export const getBooksInventory = async (): Promise<IBookInventory[]> => {
    try {
        const result = await khoPool.request().execute('sp_Kho_LayDanhSachSach');
        return result.recordset as IBookInventory[];
    } catch (error: any) {
        if (error.message) {
            throw new AppError(error.message, 400);
        }
        throw error;
    }
};

export const getLowStockBooks = async (): Promise<Partial<IBookInventory>[]> => {
    try {
        const result = await khoPool.request().query('SELECT * FROM v_Kho_CanhBaoHetSach');
        return result.recordset;
    } catch (error: any) {
        if (error.message) {
            throw new AppError(error.message, 400);
        }
        throw error;
    }
};

export const importBookQuantity = async (maSach: string, soLuongNhap: number): Promise<void> => {
    try {
        await khoPool.request()
            .input('MaSach', sql.VarChar(10), maSach)
            .input('SoLuongNhap', sql.Int, soLuongNhap)
            .execute('sp_Kho_NhapHang');
    } catch (error: any) {
        if (error.message) {
            throw new AppError(error.message, 400);
        }
        throw error;
    }
};

export const createNewBook = async (book: IBookInput): Promise<void> => {
    try {
        await khoPool.request()
            .input('MaSach', sql.VarChar(10), book.MaSach)
            .input('TenSach', sql.NVarChar(255), book.TenSach)
            .input('TacGia', sql.NVarChar(100), book.TacGia || null)
            .input('TheLoai', sql.NVarChar(50), book.TheLoai || null)
            .input('NhaXuatBan', sql.NVarChar(100), book.NhaXuatBan || null)
            .input('NamXuatBan', sql.Int, book.NamXuatBan || null)
            .input('GiaBia', sql.Decimal(18, 2), book.GiaBia)
            .input('SoLuongTon', sql.Int, book.SoLuongTon || 0)
            .input('ViTriKe', sql.NVarChar(50), book.ViTriKe)
            .execute('sp_Kho_ThemSachMoi'); 
    } catch (error: any) {
        if (error.message) {
            throw new AppError(error.message, 400);
        }
        throw error;
    }
};

export const updateBookDetails = async (book: Omit<IBookInput, 'SoLuongTon'>): Promise<void> => {
    try {
        await khoPool.request()
            .input('MaSach', sql.VarChar(10), book.MaSach)
            .input('TenSach', sql.NVarChar(255), book.TenSach)
            .input('TacGia', sql.NVarChar(100), book.TacGia || null)
            .input('TheLoai', sql.NVarChar(50), book.TheLoai || null)
            .input('NhaXuatBan', sql.NVarChar(100), book.NhaXuatBan || null)
            .input('NamXuatBan', sql.Int, book.NamXuatBan || null)
            .input('GiaBia', sql.Decimal(18, 2), book.GiaBia)
            .input('ViTriKe', sql.NVarChar(50), book.ViTriKe)
            .execute('sp_Kho_CapNhatSach');
    } catch (error: any) {
        if (error.message) {
            throw new AppError(error.message, 400);
        }
        throw error;
    }
};

export const deleteBookFromWarehouse = async (maSach: string): Promise<void> => {
    try {
        await khoPool.request()
            .input('MaSach', sql.VarChar(10), maSach)
            .execute('sp_Kho_XoaSach');
    } catch (error: any) {
        if (error.message) {
            throw new AppError(error.message, 400);
        }
        throw error;
    }
};

export const getInventoryStats = async (): Promise<{ kpi: any, details: any[] }> => {
    try {
        const result: any= await khoPool.request()
            .execute('sp_Kho_LayThongKeNhapXuat');
        return {
            kpi: result.recordsets[0][0],      
            details: result.recordsets[1]     
        };
    } catch (error: any) {
        if (error.message) {
            throw new AppError(error.message, 400);
        }
        throw error;
    }
};