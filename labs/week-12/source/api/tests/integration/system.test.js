import { test, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/requestService.js';
import { AppError, asyncHandler, errorHandler } from '../../src/middleware/errorHandler.js';
const app=createApp();
beforeEach(async()=>{await loadSeed();});
test('health exposes usable database state',async()=>{
  const r=await request(app).get('/api/health').expect(200);expect(r.body.status).toBe('ok');
});
test('root and API describe service',async()=>{
  expect((await request(app).get('/').expect(200)).body.message).toBeTruthy();
  expect((await request(app).get('/api').expect(200)).body.version).toBeTruthy();
});
test('unknown route returns JSON 404',async()=>{
  const r=await request(app).get('/api/unknown').expect(404);expect(r.body.error).toContain('/api/unknown');
});
test('users and their requests share the seeded database',async()=>{
  const r=await request(app).get('/api/users').expect(200);expect(r.body.length).toBeGreaterThan(0);
  const rows=await request(app).get(`/api/users/${r.body[0].id}/requests`).expect(200);expect(Array.isArray(rows.body)).toBe(true);
});
test('invalid user identifier is rejected',async()=>{await request(app).get('/api/users/invalid/requests').expect(400);});
test('async route errors retain public 4xx message',async()=>{
  const errors=express();errors.get('/',asyncHandler(async()=>{throw new AppError('Invalid request',422);}));errors.use(errorHandler);
  const r=await request(errors).get('/').expect(422);expect(r.body.error).toBe('Invalid request');
});
test('internal errors hide private error message',async()=>{
  const quiet=vi.spyOn(console,'error').mockImplementation(()=>{});
  try {const errors=express();errors.get('/',asyncHandler(async()=>{throw new Error('private database detail');}));errors.use(errorHandler);
  const r=await request(errors).get('/').expect(500);expect(r.body.error).not.toContain('private');} finally {quiet.mockRestore();}
});
