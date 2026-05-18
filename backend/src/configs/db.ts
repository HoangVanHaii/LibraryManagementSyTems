import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const baseConfig: sql.config = {
    server: process.env.DB_SERVER || 'localhost',

    port: parseInt(process.env.DB_PORT || '1433'),

    options: {
        encrypt: true,
        trustServerCertificate: true,
        appName: 'Web_ThuVien_NodeJS_Secret'
    },

    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

export const authPool = new sql.ConnectionPool({
    ...baseConfig,

    user: process.env.DB_USER_AUTH,
    password: process.env.DB_PASS_AUTH,

    database: process.env.DB_ACCOUNT_NAME,
});


export const docGiaPool = new sql.ConnectionPool({
    ...baseConfig,

    user: process.env.DB_USER_DOCGIA,
    password: process.env.DB_PASS_DOCGIA,

    database: process.env.DB_NGHIEPVU_NAME,
});

export const thuThuPool = new sql.ConnectionPool({
    ...baseConfig,

    user: process.env.DB_USER_THUTHU,
    password: process.env.DB_PASS_THUTHU,

    database: process.env.DB_NGHIEPVU_NAME,
});

export const khoPool = new sql.ConnectionPool({
    ...baseConfig,

    user: process.env.DB_USER_KHO,
    password: process.env.DB_PASS_KHO,

    database: process.env.DB_NGHIEPVU_NAME,
});

export const keToanPool = new sql.ConnectionPool({
    ...baseConfig,

    user: process.env.DB_USER_KETOAN,
    password: process.env.DB_PASS_KETOAN,

    database: process.env.DB_NGHIEPVU_NAME,
});

export const giamDocPool = new sql.ConnectionPool({
    ...baseConfig,

    user: process.env.DB_USER_GIAMDOC,
    password: process.env.DB_PASS_GIAMDOC,

    database: process.env.DB_NGHIEPVU_NAME,
});


export const getPoolByRole = (roleName: string): sql.ConnectionPool => {

    switch (roleName) {

        case 'DocGia':
            return docGiaPool;

        case 'ThuThu':
            return thuThuPool;

        case 'QuanLyKho':
            return khoPool;

        case 'KeToan':
            return keToanPool;

        case 'GiamDoc':
            return giamDocPool;

        default:
            throw new Error(
                'Role không hợp lệ hoặc không có quyền truy cập Database!'
            );
    }
};


export const connectDatabases = async (): Promise<void> => {

    try {

        await Promise.all([
            authPool.connect(),
            docGiaPool.connect(),
            thuThuPool.connect(),
            khoPool.connect(),
            keToanPool.connect(),
            giamDocPool.connect()
        ]);

        console.log(
            '🚀 Đã mở toàn bộ 6 Connection Pool thành công'
        );

    } catch (err) {

        console.error(
            '❌ Lỗi khởi tạo Connection Pool:',
            err
        );

        process.exit(1);
    }
};
