import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabases } from './configs/db';
import authRouter from './router/auth';
import { errorHandler } from './middleware/errorHandler';
import bookRouter from './router/book';
import readerRouter from './router/reader';
import fineRouter from './router/fine';
import staffRouter from './router/staff';
import warehouseRouter from './router/warehouse';
import directorRouter from './router/director';

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
app.use('/api/book', bookRouter);
app.use('/api/reader', readerRouter);
app.use('/api/fine', fineRouter);
app.use('/api/staff', staffRouter);
app.use('/api/warehouse', warehouseRouter);
app.use('/api/director', directorRouter);

app.get('/', (req, res) => {
    res.send('🚀 Backend đang chạy!');
    });
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🔥 Server running at http://localhost:${PORT}`);
});