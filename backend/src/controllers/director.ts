import { Request, Response, NextFunction } from 'express';
import * as directorService from '../services/director';
export const processCreateEmployee = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if ((req as any).user?.role !== 'GiamDoc') {
            return res.status(403).json({ message: 'Từ chối quyền truy cập: Đặc quyền thuộc về Giám đốc!' });
        }

        const { hoTen, ngaySinh, cccd, sdt, email, diaChi, role, matKhau, luong, phuCap } = req.body;

        if (!hoTen || !ngaySinh || !cccd || !sdt || !email || !diaChi || !role || !matKhau || luong === undefined || phuCap === undefined) {
            return res.status(400).json({ message: 'Yêu cầu không hợp lệ: Vui lòng điền đầy đủ thông tin hồ sơ và tài chính nhân viên!' });
        }

        const newMaNV = await directorService.createEmployeeAccountService({
            hoTen, ngaySinh, cccd, sdt, email, diaChi, role, matKhau,
            luong: Number(luong),
            phuCap: Number(phuCap)
        });

        return res.status(201).json({
            message: `Quy trình tuyển dụng thành công! Nhân viên [${hoTen}] đã được cấp mã số công tác: ${newMaNV}.`
        });
    } catch (error: any) {
        console.error('🚨 Lỗi trong quá trình tạo nhân viên:', error);
        
        next(error);
    }
};
export const fetchEmployees = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if ((req as any).user?.role !== 'GiamDoc') return res.status(403).json({ message: 'Từ chối truy cập!' });
        const data = await directorService.getEmployeeList();
        return res.status(200).json(data);
    } catch (error) { next(error); }
};

export const fetchEmployeeDetails = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if ((req as any).user?.role !== 'GiamDoc') return res.status(403).json({ message: 'Từ chối quyền giải mã!' });
        const { id } = req.params as { id: string };
        
        const details = await directorService.getEmployeeDetails(id);
        return res.status(200).json(details);
    } catch (error: any) {
        return res.status(400).json({ message: error.message || 'Lỗi bóc tách mật mã.' });
    }
};
export const toggleEmployeeStatus = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if ((req as any).user?.role !== 'GiamDoc') {
            return res.status(403).json({ message: 'Từ chối đặc quyền: Thao tác này thuộc thẩm quyền của Giám đốc!' });
        }

        const { maNV, hanhDong } = req.body;

        if (!maNV || !hanhDong || !['KHOA', 'MO_KHOA'].includes(hanhDong)) {
            return res.status(400).json({ message: 'Yêu cầu không hợp lệ: Thiếu Mã nhân viên hoặc sai Hành động!' });
        }
        await directorService.toggleEmployeeStatusService(maNV, hanhDong);

        const msgResponse = hanhDong === 'KHOA'
            ? `Thành công: Đã ĐÓNG BĂNG khẩn cấp tài khoản công tác của nhân viên [${maNV}].`
            : `Thành công: Đã KÍCH HOẠT lại trạng thái hoạt động cho nhân viên [${maNV}].`;

        return res.status(200).json({ message: msgResponse });
    } catch (error: any) {
        return res.status(400).json({ message: error.message || 'Tiến trình điều hướng tài khoản thất bại.' });
    }
};