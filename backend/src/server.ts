import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabases } from './configs/db';
import authRouter from './router/auth';
// import bookRouter from './router/book';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Kết nối cơ sở dữ liệu khi server khởi động
connectDatabases().then(() => {
    console.log('✅ Cơ sở dữ liệu đã được kết nối');
});

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
// app.use('/api/book', bookRouter);
app.get('/', (req, res) => {
    res.send('🚀 Backend đang chạy!');
    });

app.listen(PORT, () => {
    console.log(`🔥 Server running at http://localhost:${PORT}`);
});