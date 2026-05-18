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