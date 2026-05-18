import sql from 'mssql';
import { khoPool } from '../configs/db'; 
import { IBookInventory, IBookInput } from '../interfaces/warehouse';
import { AppError } from '../utils/appError';

// Service 1: Lấy toàn bộ danh sách sách trong kho
export const getBooksInventory = async (): Promise<IBookInventory[]> => {
    try {
        // 🚀 Thay thế câu lệnh query thuần bằng thực thi Stored Procedure gác cổng
        const result = await khoPool.request().execute('sp_Kho_LayDanhSachSach');
        return result.recordset as IBookInventory[];
    } catch (error: any) {
        if (error.message) {
            throw new AppError(error.message, 400);
        }
        throw error;
    }
};

// Service 2: Lấy danh sách sách sắp hết (Từ View cảnh báo)
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

// Service 3: Thực thi nghiệp vụ nhập kho bổ sung số lượng
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

// 1. Thực thi SP khai báo thêm đầu sách mới tinh
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
            .execute('sp_Kho_ThemSachMoi'); // Gọi chính xác tên SP gác cổng
    } catch (error: any) {
        if (error.message) {
            throw new AppError(error.message, 400);
        }
        throw error;
    }
};

// 2. Thực thi SP cập nhật hồ sơ thông tin sách cũ
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

// 3. Thực thi SP xóa sách vật lý khỏi hệ thống kho
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
// Trích xuất dữ liệu phân tích kho tổng hợp đa tầng
export const getInventoryStats = async (): Promise<{ kpi: any, details: any[] }> => {
    try {
        const result: any= await khoPool.request()
            .execute('sp_Kho_LayThongKeNhapXuat');
        return {
            kpi: result.recordsets[0][0],      // Tập dữ liệu số 1 (KPI)
            details: result.recordsets[1]     // Tập dữ liệu số 2 (Mảng chi tiết)
        };
    } catch (error: any) {
        if (error.message) {
            throw new AppError(error.message, 400);
        }
        throw error;
    }
};