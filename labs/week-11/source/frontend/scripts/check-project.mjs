// API LAB frontend contract: routing, service boundary, CRUD and error behavior.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const root=process.cwd();let count=0;
function check(name,fn){fn();count++;console.log(`PASS ${name}`);}
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
check('HashRouter entry',()=>assert.match(read('src/main.jsx'),/HashRouter/));
check('nested routes',()=>{const app=read('src/App.jsx');for(const route of ['requests/new','requests/:requestId','about','*'])assert.ok(app.includes(route));});
check('layout outlet',()=>assert.match(read('src/pages/AppLayout.jsx'),/<Outlet/));
check('detail route parameter',()=>assert.match(read('src/pages/RequestDetailPage.jsx'),/useParams/));
check('form navigation',()=>assert.match(read('src/pages/NewRequestPage.jsx'),/useNavigate/));
check('relative build base',()=>assert.match(read('vite.config.js'),/base:\s*['"]\.\/['"]/));
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
check('fetch only in API client and storage only in storage module',()=>{
 for(const file of walk(path.join(root,'src')).filter(f=>/\.(js|jsx)$/.test(f)&&!f.endsWith('.test.js'))){
  const code=fs.readFileSync(file,'utf8').replace(/\/\*[\s\S]*?\*\//g,'').replace(/(^|[^:])\/\/[^\n]*/g,'$1');
  if(!file.endsWith('apiClient.js'))assert.doesNotMatch(code,/\bfetch\s*\(/,file);
  if(!file.endsWith('requestStorage.js'))assert.doesNotMatch(code,/\blocalStorage\s*\./,file);
 }
});
const originalFetch=globalThis.fetch;const calls=[];let status=200,body=[],networkError=false,malformed=false;
globalThis.fetch=async(url,options)=>{calls.push({url,options});if(networkError)throw Error('offline');return {ok:status>=200&&status<300,status,json:async()=>{if(malformed)throw Error('invalid JSON');return body;}};};
try{
 const service=await import(pathToFileURL(path.join(root,'src/services/requestService.js')));
 const {apiFetch}=await import(pathToFileURL(path.join(root,'src/services/apiClient.js')));
 body=[{id:'REQ-001'}];assert.deepEqual(await service.getRequests(),body);count++;
 await service.getRequests({status:'in-progress'});assert.ok(calls.at(-1).url.endsWith('?status=in-progress'));count++;
 assert.deepEqual(await service.getRequests({scenario:'empty'}),[]);await assert.rejects(()=>service.getRequests({scenario:'error'}));count+=2;
 await service.getRequestById('REQ/001');assert.ok(calls.at(-1).url.endsWith('REQ%2F001'));count++;
 status=404;body={error:'missing'};assert.equal(await service.getRequestById('REQ-999'),null);count++;
 status=403;await assert.rejects(()=>service.getRequestById('REQ-001'),{status:403});count++;
 status=201;body={id:'REQ-002'};const input={requesterName:'Test',details:'Sample details'};await service.addRequest(input);assert.equal(calls.at(-1).options.method,'POST');assert.deepEqual(JSON.parse(calls.at(-1).options.body),input);count++;
 status=200;await service.updateRequestStatus('REQ-002','completed');assert.equal(calls.at(-1).options.method,'PUT');assert.deepEqual(JSON.parse(calls.at(-1).options.body),{status:'completed'});count++;
 await service.deleteRequest('REQ-002');assert.equal(calls.at(-2).options.method,'DELETE');assert.ok(calls.at(-1).url.endsWith('/api/requests'));count++;
 await service.resetRequests();assert.ok(calls.at(-1).url.endsWith('/api/requests'));count++;
 status=204;assert.equal(await apiFetch('/api/requests'),null);count++;
 status=400;body={error:'validation'};await assert.rejects(()=>apiFetch('/api/requests'),{status:400,message:'validation'});count++;
 malformed=true;await assert.rejects(()=>apiFetch('/api/requests'),e=>e.status===400);count++;malformed=false;
 networkError=true;await assert.rejects(()=>apiFetch('/api/requests'),{status:0});count++;
 console.log(`API frontend: PASS ${count} checks (mock HTTP; browser review still required)`);
}finally{globalThis.fetch=originalFetch;}
