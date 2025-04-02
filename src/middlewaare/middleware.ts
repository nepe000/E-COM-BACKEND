class CustomError extends Error {
  success: boolean;
  statusCode: number;
  status: string;
  isOperational: boolean;
  constructor(message: string, statusCode: number) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    Error.captureStackTrace(this, CustomError);
  }
}
export default CustomError;
