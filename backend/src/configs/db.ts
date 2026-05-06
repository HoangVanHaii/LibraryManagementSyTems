import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const baseConfig = {
    server: process.env.DB_SERVER || 'localhost',
    port: parseInt(process.env.DB_PORT || '1433'),
    options: {
        encrypt: true, // Sử dụng nếu kết nối Azure hoặc cần mã hóa đường truyền
        trustServerCertificate: true, // Quan trọng khi chạy local
    },

    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// 1. Connection Pool cho vùng xác thực (Account)
const accountConfig: sql.config = {
    ...baseConfig,
    user: process.env.DB_ACCOUNT_USER,
    password: process.env.DB_ACCOUNT_PASS,
    database: process.env.DB_ACCOUNT_NAME,
};

// 2. Connection Pool cho vùng nghiệp vụ (Nghệ vụ)
const nghiepVuConfig: sql.config = {
    ...baseConfig,
    user: process.env.DB_NGHIEPVU_USER,
    password: process.env.DB_NGHIEPVU_PASS,
    database: process.env.DB_NGHIEPVU_NAME,
};

// Tạo các Pool kết nối\\
export const accountPool = new sql.ConnectionPool(accountConfig);
export const nghiepVuPool = new sql.ConnectionPool(nghiepVuConfig);

export const connectDatabases = async () => {
    try {
        await Promise.all([
            accountPool.connect(),
            nghiepVuPool.connect()
        ]);
        console.log('Đã kết nối thành công 2 lớp Database (Account & Nghiệp vụ)');
    } catch (err) {
        console.error('Lỗi kết nối Cơ sở dữ liệu:', err);
        process.exit(1);
    }
};
