import { getPoolByRole } from '../configs/db';
import sql from 'mssql';
import { CreateBorrowDTO } from '../interfaces/borrow';
import { AppError } from '../utils/appError';
export const createBorrowTicketService = async (data: CreateBorrowDTO, maNV: string, role: string): Promise<void> => {
    const currentPool = getPoolByRole(role);

    const hanTra = new Date();
    hanTra.setDate(hanTra.getDate() + Number(data.soNgayMuon));

    const request = currentPool.request();
    request.input('MaPhieu', sql.VarChar(15), data.maPhieu);
    request.input('MaDG', sql.VarChar(10), data.maDG);
    request.input('MaNV', sql.VarChar(10), maNV);
    request.input('HanTra', sql.Date, hanTra);
    request.input('MaSach', sql.VarChar(10), data.maSach);

    await request.execute('ThuVien_NGHIEPVU.dbo.SP_LapPhieuMuon');
};

export const returnBookService = async (role: string, maPhieu: string, maSach: string, tinhTrang: string) => {
    const currentPool = getPoolByRole(role);
    const request = currentPool.request();

    request.input('MaPhieu', sql.VarChar(20), maPhieu);
    request.input('MaSach', sql.VarChar(20), maSach);
    request.input('TinhTrang', sql.NVarChar(50), tinhTrang);

    const result = await request.execute('ThuVien_NGHIEPVU.dbo.SP_GhiNhanTraSach');
    
    return result.recordset[0]; 
};

export const getBorrowsListService = async (role: string, searchQuery?: string, status?: string) => {
    const currentPool = getPoolByRole(role);
    const request = currentPool.request();
    
    if (searchQuery) {
        request.input('SearchTerm', sql.NVarChar(50), searchQuery);
    } else {
        request.input('SearchTerm', sql.NVarChar(50), null);
    }

    if (status) {
        request.input('Status', sql.VarChar(20), status);
    } else {
        request.input('Status', sql.VarChar(20), null);
    }
    const result = await request.execute('ThuVien_NGHIEPVU.dbo.SP_LayDanhSachPhieuMuon');
    
    return result.recordset;
};