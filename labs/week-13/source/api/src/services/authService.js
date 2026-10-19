import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { findUserByEmail } from './requestService.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

// used when the email does not exist, so both failures take similar time
const DUMMY_HASH = hashPassword('not-a-real-password');

export function login(email, password) {
  const user = findUserByEmail(email);
  const storedHash = user?.password_hash ?? user?.passwordHash ?? DUMMY_HASH;
  const passwordOk = verifyPassword(password, storedHash);

  if (!user || user.role !== 'staff' || !passwordOk) return null;

  const token = jwt.sign(
    { sub: String(user.id), name: user.name, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn },
  );
  return { token, user: { id: user.id, name: user.name, role: user.role } };
}

export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] });
}