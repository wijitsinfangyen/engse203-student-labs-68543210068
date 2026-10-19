import { describe, test, expect } from 'vitest';
import {
  validateRequestInput, MAX_NAME, MAX_LOCATION, MAX_DETAILS,
} from '../../src/validators/requestValidator.js';

const base = {
  requesterName: 'สมชาย',
  requestType: 'แจ้งซ่อม',
  location: 'อาคาร 1',
  details: 'รายละเอียดครบถ้วนพอสมควร',
  priority: 'normal',
};

describe('ค่าขอบความยาวสูงสุด (CP48)', () => {
  test.each([
    ['requesterName', MAX_NAME],
    ['location', MAX_LOCATION],
    ['details', MAX_DETAILS],
  ])('%s ยาวพอดี %i → ผ่าน', (field, max) => {
    expect(validateRequestInput({ ...base, [field]: 'ก'.repeat(max) })).toEqual([]);
  });

  test.each([
    ['requesterName', MAX_NAME],
    ['location', MAX_LOCATION],
    ['details', MAX_DETAILS],
  ])('%s ยาว %i + 1 → ไม่ผ่าน', (field, max) => {
    expect(validateRequestInput({ ...base, [field]: 'ก'.repeat(max + 1) }).length).toBeGreaterThan(0);
  });

  test.each(['requesterName', 'location', 'details'])('%s เป็นตัวเลข → ต้องเป็นข้อความ', (field) => {
    expect(validateRequestInput({ ...base, [field]: 12345 }).join(' ')).toContain('ต้องเป็นข้อความ');
  });
});