export interface IBookInventory {
    MaSach: string;
    TenSach: string;
    TacGia?: string;
    TheLoai?: string;
    NhaXuatBan?: string;
    NamXuatBan?: number;
    GiaBia: number;
    SoLuongTon: number;
    ViTriKe?: string;
}
export interface IBookInput {
    MaSach: string;
    TenSach: string;
    TacGia?: string;
    TheLoai?: string;
    NhaXuatBan?: string;
    NamXuatBan?: number;
    GiaBia: number;
    SoLuongTon?: number;
    ViTriKe: string;
}
