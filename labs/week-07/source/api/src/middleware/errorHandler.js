import { config } from '../config.js';
export class AppError extends Error {
  constructor(message, status = 500) { super(message); this.status = status; }
}
export function asyncHandler(fn) { return (req,res,next) => Promise.resolve().then(() => fn(req,res,next)).catch(next); }
export function errorHandler(err,req,res,next) {
  const status=err.status ?? 500;
  res.status(status).json({error:status>=500?'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์':err.message,...(config.isProduction?{}:{stack:err.stack})});
}
export function notFound(req,res) { res.status(404).json({error:`ไม่พบเส้นทาง ${req.method} ${req.originalUrl}`}); }
