import { Request, Response, NextFunction } from 'express';
import * as warehouseService from '../services/warehouse';
import { AppError } from '../utils/appError';

export const getAllBooks = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if ((req as any).user?.role !== 'QuanLyKho') { 
            throw new AppError('Từ chối truy cập: Bạn không có quyền Quản lý kho!', 403);
        }
        const data = await warehouseService.getBooksInventory();
        return res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

export const getLowStock = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if ((req as any).user?.role !== 'QuanLyKho') throw new AppError('Từ chối truy cập!', 403);
        const data = await warehouseService.getLowStockBooks();
        return res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

export const processImport = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if ((req as any).user?.role !== 'QuanLyKho') throw new AppError('Từ chối truy cập!', 403);
        const { maSach, soLuongNhap } = req.body;

        if (!maSach || soLuongNhap === undefined) {
            throw new AppError('Thiếu thông tin Mã sách hoặc Số lượng nhập!', 400);
        }

        await warehouseService.importBookQuantity(maSach, Number(soLuongNhap));
        return res.status(200).json({ message: `Nhập kho thành công! Đã bổ sung số lượng cho đầu sách [${maSach}].` });
    } catch (error) {
        next(error);
    }
};

export const addBook = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if ((req as any).user?.role !== 'QuanLyKho') {
            throw new AppError('Từ chối đặc quyền: Chỉ vai trò Quản lý kho mới có quyền thêm sách!', 403);
        }

        const { MaSach, TenSach, GiaBia, ViTriKe } = req.body;
        if (!MaSach || !TenSach || GiaBia === undefined || !ViTriKe) {
            throw new AppError('Vui lòng cung cấp đầy đủ thông tin bắt buộc của cuốn sách!', 400);
        }

        await warehouseService.createNewBook(req.body);
        return res.status(201).json({
            message: `Khai báo thành công! Đầu sách [${TenSach}] đã được chèn vào danh mục kho.`
        });
    } catch (error) {
        next(error);
    }
};

export const updateBookInfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if ((req as any).user?.role !== 'QuanLyKho') {
            throw new AppError('Từ chối đặc quyền chỉnh sửa thông tin tài sản!', 403);
        }

        const { maSach } = req.params;
        const { TenSach, GiaBia, ViTriKe } = req.body;

        if (!TenSach || GiaBia === undefined || !ViTriKe) {
            throw new AppError('Thông tin chỉnh sửa sách không được phép để trống các trường cốt lõi!', 400);
        }

        await warehouseService.updateBookDetails({ ...req.body, MaSach: maSach });

        return res.status(200).json({
            message: `Cập nhật thành công! Hồ sơ mã sách [${maSach}] đã được đồng bộ lên CSDL.`
        });
    } catch (error) {
       next(error);
    }
};


export const deleteBookById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if ((req as any).user?.role !== 'QuanLyKho') {
            throw new AppError('Từ chối đặc quyền xóa tài liệu thư viện!', 403);
        }

        const { maSach } = req.params as { maSach: string };

        await warehouseService.deleteBookFromWarehouse(maSach);
        return res.status(200).json({
            message: `Đã xóa vĩnh viễn đầu sách mã [${maSach}] khỏi CSDL kho vật lý.`
        });
    } catch (error) {
        next(error);
    }
};

export const getInventoryStatsDashboard = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if ((req as any).user?.role !== 'QuanLyKho') {
            throw new AppError('Từ chối đặc quyền: Bạn không có quyền truy cập dữ liệu báo cáo kho tài sản!', 403);
        }

        const stats = await warehouseService.getInventoryStats();
        return res.status(200).json(stats);
    } catch (error) { next(error); }
};