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
// Bổ sung vào file src/services/borrowService.ts của bạn
export interface IDashboardStats {
    SoSachDangMuon: number;
    TongTienPhat: number;
}
