export interface IFineReader {
    MaDG: string;
    HoTen: string;
    SDT: string;
    Email: string;
    CongNo: number;
}

export interface IFineBookDetail {
    MaPhieu: string;
    MaSach: string;
    TenSach: string;
    NgayMuon: Date;
    HanTra: Date;
    NgayTraThucTe: Date | null;
    TienPhatKyNay: number;
    LyDoPhat: string;
}
