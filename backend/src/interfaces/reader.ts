export interface IReaderProfile {
    MaDG: string;
    HoTen: string;
    NgaySinh: Date;
    CCCD: string; 
    SDT: string;
    Email: string;
    NgayLapThe: Date;
    NgayHetHan: Date;
    CongNo: number;
}
export interface IReader {
    maDG: string;
    hoTen: string;
    ngaySinh: Date | string;
    cccd: Buffer | string; 
    sdt: string;
    email: string;
    ngayLapThe: Date | string;
    ngayHetHan: Date | string;
    congNo: number;
    maNVLap: string | null;
}

export interface CreateReaderDTO {
    maDG: string;
    hoTen: string;
    ngaySinh: string; 
    cccd: string;     
    sdt: string;
    email: string;
    password: string; 
}