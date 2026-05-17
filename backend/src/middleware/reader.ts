import { body } from 'express-validator';

// Luật xác thực khi tạo mới Độc giả và Tài khoản
export const validateCreateReaderRules = [
    body("maDG")
        .notEmpty().withMessage("Mã Độc giả là bắt buộc"),
    
    body("hoTen")
        .notEmpty().withMessage("Họ tên là bắt buộc"),
    
    body("cccd")
        .notEmpty().withMessage("CCCD là bắt buộc")
        .matches(/^\d{12}$/).withMessage("CCCD phải bao gồm đúng 12 chữ số"),
    
    body("sdt")
        .notEmpty().withMessage("Số điện thoại là bắt buộc")
        .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/).withMessage("Số điện thoại Việt Nam không hợp lệ"),
    
    body("email")
        .notEmpty().withMessage("Email là bắt buộc")
        .isEmail().withMessage("Email không đúng định dạng"),
    
    body("password")
        .notEmpty().withMessage("Mật khẩu là bắt buộc")
        .isLength({ min: 6 }).withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
    
    body("ngaySinh")
        .optional({ checkFalsy: true })
        .isDate({ format: 'YYYY-MM-DD' }).withMessage("Ngày sinh phải có định dạng YYYY-MM-DD")
];

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

// Luật xác thực khi Gia hạn thẻ Độc giả
export const validateRenewRules = [
    body("maDG")
        .notEmpty().withMessage("Mã Độc giả cần gia hạn thẻ là bắt buộc"),
        
    body("soThangGiaHan")
        .notEmpty().withMessage("Số tháng xin gia hạn thêm là bắt buộc")
        .isInt({ min: 1, max: 12 }).withMessage("Thời gian xin gia hạn thẻ dao động từ 1 đến 12 tháng")
];