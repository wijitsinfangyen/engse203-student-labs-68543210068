import { test, expect, beforeEach, vi, afterEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/requestService.js';
import { resetLoginLimiter } from '../../src/routes/authRoutes.js';
import { STAFF } from '../helpers/auth.js';
const app = createApp();
beforeEach(async () => { resetLoginLimiter(); await loadSeed(); });
afterEach(() => vi.restoreAllMocks());
test('all API responses prevent MIME sniffing', async () => {
  const r = await request(app).get('/api/health');
  expect(r.headers['x-content-type-options']).toBe('nosniff');
});
test('five wrong passwords block a sixth attempt including correct credentials', async () => {
  for (let i=0;i<5;i++) await request(app).post('/api/auth/login').send({...STAFF,password:'wrong-password'}).expect(401);
  const r=await request(app).post('/api/auth/login').send(STAFF).expect(429);
  expect(Number(r.headers['retry-after'])).toBeGreaterThan(0);
});
test('lock expires after fifteen minutes', async () => {
  const now=Date.now(); const clock=vi.spyOn(Date,'now').mockReturnValue(now);
  for(let i=0;i<5;i++) await request(app).post('/api/auth/login').send({...STAFF,password:'wrong-password'}).expect(401);
  clock.mockReturnValue(now+15*60*1000+1);
  await request(app).post('/api/auth/login').send(STAFF).expect(200);
});
test('successful login resets earlier failed attempts', async () => {
  for(let i=0;i<4;i++) await request(app).post('/api/auth/login').send({...STAFF,password:'wrong-password'}).expect(401);
  await request(app).post('/api/auth/login').send(STAFF).expect(200);
  await request(app).post('/api/auth/login').send({...STAFF,password:'wrong-password'}).expect(401);
});
