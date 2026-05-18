export interface CreateEmployeeDTO {
    hoTen: string;
    ngaySinh: string;
    cccd: string;
    sdt: string;
    email: string;
    diaChi: string;
    role: 'ThuThu' | 'KeToan' | 'QuanLyKho';
    matKhau: string;
    luong: number;
    phuCap: number;
}
export interface IDashboardOverview {
    TongTienPhat: number;
    DocGiaMoi: number;
    SoSachNhapKho: number;
}

export interface ITopBook {
    TenSach: string;
    SoLuotMuon: number;
}

export interface IMonthlyFlow {
    Thang: string;
    SoLuotMuon: number;
}

export interface IDashboardStatsResponse {
    tongQuan: IDashboardOverview;
    topSach: ITopBook[];
    luuLuong: IMonthlyFlow[];
}