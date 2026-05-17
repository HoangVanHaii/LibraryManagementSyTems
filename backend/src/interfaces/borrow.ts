export interface IBorrowHistory {
    MaPhieu: string;
    NgayMuon: Date;
    HanTra: Date;
    MaSach: string;
    TenSach: string;
    TacGia: string;
    NgayTraThucTe: Date | null;
    TinhTrangKhiTra: string | null;
    TienPhatKyNay: number;
}

export interface IDashboardStats {
    SoSachDangMuon: number;
    TongTienPhat: number;
}

export interface IBorrowTicket {
    maPhieu: string;
    maDG: string;
    maNV_ThuThu: string;
    ngayMuon: Date | string;
    hanTra: Date | string;
}

export interface IBorrowTicketDetail {
    maPhieu: string;
    maSach: string;
    ngayTraThucTe: Date | string | null;
    tinhTrangKhiTra: string | null;
    tienPhatKyNay: number;
}

export interface CreateBorrowDTO {
    maPhieu: string;
    maDG: string;
    maSach: string;
    soNgayMuon: number; 
}
