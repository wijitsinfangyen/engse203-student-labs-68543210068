export function notFound(req,res) { res.status(404).json({error:'ไม่พบเส้นทาง ' + req.method + ' ' + req.originalUrl}); }
export function errorHandler(err,req,res,next) { const status = err.status ?? 500; res.status(status).json({error: status >= 500 ? 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' : err.message}); }
