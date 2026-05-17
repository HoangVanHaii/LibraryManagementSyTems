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

export const returnBookService = async (data:any , role: string): Promise<void> => {
    const currentPool = getPoolByRole(role);

    const priceReq = currentPool.request();
    priceReq.input('MaSach', sql.VarChar(10), data.maSach);
    const bookResult = await priceReq.query('SELECT GiaBia FROM ThuVien_NGHIEPVU.dbo.SACH WHERE MaSach = @MaSach');
    
    if (!bookResult.recordset || bookResult.recordset.length === 0) {
        throw new AppError('Cuốn sách này không tồn tại trong kho hệ thống!', 404);
    }
    const giaBiaSach = bookResult.recordset[0].GiaBia;

    const request = currentPool.request();
    request.input('MaPhieu', sql.VarChar(15), data.maPhieu);
    request.input('MaSach', sql.VarChar(10), data.maSach);
    request.input('TinhTrang', sql.NVarChar(255), data.tinhTrang);
    request.input('GiaBiaSach', sql.Decimal(18, 2), giaBiaSach);

    await request.execute('ThuVien_NGHIEPVU.dbo.SP_GhiNhanTraSach');
};