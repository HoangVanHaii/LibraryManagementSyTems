import multer from 'multer';

const storage = multer.memoryStorage();

export const uploadImage = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Định dạng file không hợp lệ! Chỉ chấp nhận file ảnh.'));
        }
    }
});