/**
 * requestValidator.js - pure validation rules for request input
 * validateRequestInput(input) -> [] if valid, ['error message', ...] otherwise
 */

export const REQUEST_TYPES = ['แจ้งซ่อม', 'บริการบัญชีผู้ใช้', 'ขอใช้อุปกรณ์', 'อื่น ๆ'];
export const PRIORITIES = ['normal', 'urgent'];
export const STATUSES = ['pending', 'in-progress', 'completed'];

export const MIN_NAME = 2;
export const MIN_DETAILS = 10;
export const MAX_NAME = 100;
export const MAX_LOCATION = 100;
export const MAX_DETAILS = 1000;

function readText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

// undefined/null = field missing (handled by the length rules); anything else must be a string
function isWrongType(value) {
  return value !== undefined && value !== null && typeof value !== 'string';
}

export function validateRequestInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return ['ต้องส่งข้อมูลคำร้องมาด้วย'];
  }

  const errors = [];

  if (isWrongType(input.requesterName)) {
    errors.push('ชื่อผู้แจ้งต้องเป็นข้อความ');
  } else {
    const len = readText(input.requesterName).length;
    if (len < MIN_NAME) errors.push(`ชื่อผู้แจ้งต้องมีอย่างน้อย ${MIN_NAME} ตัวอักษร`);
    else if (len > MAX_NAME) errors.push(`ชื่อผู้แจ้งต้องไม่เกิน ${MAX_NAME} ตัวอักษร`);
  }

  if (!REQUEST_TYPES.includes(input.requestType)) {
    errors.push('ประเภทคำร้องไม่ถูกต้อง');
  }

  if (isWrongType(input.location)) {
    errors.push('สถานที่ต้องเป็นข้อความ');
  } else {
    const len = readText(input.location).length;
    if (len === 0) errors.push('กรุณาระบุสถานที่');
    else if (len > MAX_LOCATION) errors.push(`สถานที่ต้องไม่เกิน ${MAX_LOCATION} ตัวอักษร`);
  }

  if (isWrongType(input.details)) {
    errors.push('รายละเอียดต้องเป็นข้อความ');
  } else {
    const len = readText(input.details).length;
    if (len < MIN_DETAILS) errors.push(`รายละเอียดต้องมีอย่างน้อย ${MIN_DETAILS} ตัวอักษร`);
    else if (len > MAX_DETAILS) errors.push(`รายละเอียดต้องไม่เกิน ${MAX_DETAILS} ตัวอักษร`);
  }

  if (!PRIORITIES.includes(input.priority)) {
    errors.push('ความเร่งด่วนต้องเป็น normal หรือ urgent');
  }
  return errors;
}

/** statuses accepted by PUT /api/requests/:id */
export function isValidStatus(status) {
  return STATUSES.includes(status);
}

/** Week 13 - login input shape only; authService decides right or wrong */
export function validateLoginInput(input) {
  if (!input || typeof input !== 'object') return ['ต้องส่งอีเมลและรหัสผ่าน'];
  const errors = [];
  if (typeof input.email !== 'string' || !input.email.includes('@') || input.email.length > 254) {
    errors.push('รูปแบบอีเมลไม่ถูกต้อง');
  }
  if (typeof input.password !== 'string' || input.password.length === 0 || input.password.length > 200) {
    errors.push('กรุณาระบุรหัสผ่าน');
  }
  return errors;
}