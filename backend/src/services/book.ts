// import sql from 'mssql';
// import { nghiepVuPool } from '../configs/db';

// export const fetchPublicBooks = async () => {
//     const result = await nghiepVuPool.request()
//         .query('SELECT MaSach, TenSach, TacGia, SoLuongTon FROM viewSachCongKhai');

//     const rows = result.recordset;

//     if (!rows || rows.length === 0) {
//         return [];
//     }

//     return rows;
// };