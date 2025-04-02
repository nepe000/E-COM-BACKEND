"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.success = false;
        this.statusCode = statusCode;
        this.isOperational = true;
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        Error.captureStackTrace(this, CustomError);
    }
}
exports.default = CustomError;
