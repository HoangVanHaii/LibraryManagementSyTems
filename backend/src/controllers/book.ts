// import { Request, Response } from 'express';
// import { fetchPublicBooks } from '../services/book';

// export const getPublicBooks = async (req: Request, res: Response): Promise<any> => {
//     try {
//         const books = await fetchPublicBooks();
//         if (books.length === 0) {
//             return res.status(404).json({ message: 'Hiện tại thư viện chưa có sách nào.' });
//         }

//         return res.status(200).json({
//             message: 'Lấy danh mục sách thành công',
//             books: books
//         });

//     } catch (err) {
//         console.error('Lỗi hệ thống tại API getPublicBooks:', err);
//         return res.status(500).json({ message: 'Lỗi hệ thống nội bộ!' });
//     }
// };