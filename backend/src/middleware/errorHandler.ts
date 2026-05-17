import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        if (!err.isOperational) {
            console.error("SYSTEM ERROR:", err);
        }
        return res.status(err.statusCode).json({
            success: false,
            message: err.isOperational ? err.message : "Lỗi hệ thống không xác định. Vui lòng thử lại sau!"
        });
    }
    console.error("UNEXPECTED ERROR:", err);

    return res.status(500).json({
        success: false,
        message: "Lỗi hệ thống không xác định. Vui lòng thử lại sau!"
    });
};