import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/requestService.js';
import { STAFF, tokenFor } from '../helpers/auth.js';

const app = createApp();
beforeEach(async () => { await loadSeed(); });

async function staffToken() {
  const r = await request(app).post('/api/auth/login').send(STAFF);
  return r.body.token;
}

describe('POST /api/auth/login', () => {
  test('อีเมลและรหัสผ่านถูก → 200 พร้อม token', async () => {
    const r = await request(app).post('/api/auth/login').send(STAFF);
    expect(r.status).toBe(200);
    expect(r.body.token.split('.')).toHaveLength(3);
  });
  test('รหัสผ่านผิด → 401', async () => {
    const r = await request(app).post('/api/auth/login').send({ ...STAFF, password: 'nope1234' });
    expect(r.status).toBe(401);
  });
  test('อีเมลที่ไม่มี ได้ข้อความ error เดียวกับรหัสผ่านผิด', async () => {
    const wrongPass = await request(app).post('/api/auth/login').send({ ...STAFF, password: 'nope1234' });
    const noUser = await request(app).post('/api/auth/login').send({ email: 'nobody@rmutl.ac.th', password: 'nope1234' });
    expect(noUser.status).toBe(401);
    expect(noUser.body.error).toBe(wrongPass.body.error);
  });
});

describe('สิทธิ์ของ PUT / DELETE', () => {
  test('ไม่มี token → 401', async () => {
    const r = await request(app).put('/api/requests/REQ-001').send({ status: 'completed' });
    expect(r.status).toBe(401);
  });
  test('token ที่ไม่ใช่เจ้าหน้าที่ → 403', async () => {
    const r = await request(app).put('/api/requests/REQ-001')
      .set('Authorization', `Bearer ${tokenFor('requester')}`).send({ status: 'completed' });
    expect(r.status).toBe(403);
  });
  test('token ปลอม (secret อื่น) → 401', async () => {
    const r = await request(app).put('/api/requests/REQ-001')
      .set('Authorization', `Bearer ${tokenFor('staff', 'not-the-real-secret')}`).send({ status: 'completed' });
    expect(r.status).toBe(401);
  });
  test('เจ้าหน้าที่ → PUT 200 และ DELETE 204', async () => {
    const auth = `Bearer ${await staffToken()}`;
    const put = await request(app).put('/api/requests/REQ-001').set('Authorization', auth).send({ status: 'completed' });
    expect(put.status).toBe(200);
    await request(app).delete('/api/requests/REQ-002').set('Authorization', auth).expect(204);
  });
});