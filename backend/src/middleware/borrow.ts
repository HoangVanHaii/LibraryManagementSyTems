import { body } from 'express-validator';
// Luật xác thực khi Lập phiếu mượn sách
export const validateBorrowRules = [
    body("maPhieu")
        .notEmpty().withMessage("Mã phiếu mượn bắt buộc phải điền"),
        
    body("maDG")
        .notEmpty().withMessage("Mã độc giả mượn sách bắt buộc phải điền"),
        
    body("maSach")
        .notEmpty().withMessage("Mã sách mượn bắt buộc phải điền"),
        
    body("soNgayMuon")
        .notEmpty().withMessage("Số ngày đăng ký mượn là bắt buộc")
        .isInt({ min: 1, max: 30 }).withMessage("Số ngày mượn sách nằm trong khoảng hợp lệ từ 1 đến 30 ngày")
];

// Luật xác thực khi Ghi nhận trả sách
export const validateReturnRules = [
    body("maPhieu")
        .notEmpty().withMessage("Mã phiếu mượn trả sách bắt buộc phải điền"),
        
    body("maSach")
        .notEmpty().withMessage("Mã sách trả bắt buộc phải điền"),
        
    body("tinhTrang")
        .notEmpty().withMessage("Tình trạng thực tế lúc trả sách không được để trống")
        .isIn(['Bình thường', 'Hỏng nhẹ', 'Hỏng nặng', 'Mất']).withMessage("Tình trạng sách trả không nằm trong danh mục kiểm duyệt")
];