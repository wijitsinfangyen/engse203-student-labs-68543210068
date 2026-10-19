import { Router } from 'express';
import * as authService from '../services/authService.js';
import { validateLoginInput } from '../validators/requestValidator.js';

// route ให้มาแล้ว — งานหลักอยู่ใน services/authService.js (CP50)
const router = Router();
const failedLogins = new Map();
const WINDOW_MS = 15 * 60 * 1000;
export function resetLoginLimiter() { failedLogins.clear(); }

router.post('/login', (req, res) => {
  const errors = validateLoginInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง', details: errors });
  }
  const key = String(req.body.email).trim().toLowerCase();
  const now = Date.now();
  for (const [email, entry] of failedLogins) {
    if (entry.until <= now) failedLogins.delete(email);
  }
  const entry = failedLogins.get(key);
  if (entry?.count >= 5) {
    res.setHeader('Retry-After', String(Math.ceil((entry.until - now) / 1000)));
    return res.status(429).json({ error: 'ลองเข้าสู่ระบบมากเกินไป กรุณารอสักครู่' });
  }
  const result = authService.login(req.body.email, req.body.password);
  if (!result) {
    failedLogins.set(key, { count: (entry?.count ?? 0) + 1, until: entry?.until ?? now + WINDOW_MS });
    return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
  }
  failedLogins.delete(key);
  res.status(200).json(result);
});

export default router;
