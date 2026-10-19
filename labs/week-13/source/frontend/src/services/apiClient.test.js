import { test, expect, afterEach, vi } from 'vitest';
import { apiFetch, setAccessToken } from './apiClient.js';
afterEach(()=>{setAccessToken();vi.unstubAllGlobals();});
test('authenticated calls preserve JSON and custom headers',async()=>{
  const fetch=vi.fn().mockResolvedValue({ok:true,status:200,json:async()=>({ok:true})});vi.stubGlobal('fetch',fetch);
  setAccessToken('sample-token');await apiFetch('/api/requests',{headers:{'X-Request-Id':'test'}});
  expect(fetch.mock.calls[0][1].headers).toEqual({'Content-Type':'application/json',Authorization:'Bearer sample-token','X-Request-Id':'test'});
});
test('logout clears authorization and 204 returns null',async()=>{
  const fetch=vi.fn().mockResolvedValue({ok:true,status:204});vi.stubGlobal('fetch',fetch);
  setAccessToken('sample-token');setAccessToken();expect(await apiFetch('/api/requests')).toBeNull();
  expect(fetch.mock.calls[0][1].headers).not.toHaveProperty('Authorization');
});
test('API error retains status and server message',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:false,status:403,json:async()=>({error:'Forbidden'})}));
  await expect(apiFetch('/api/requests')).rejects.toMatchObject({status:403,message:'Forbidden'});
});
