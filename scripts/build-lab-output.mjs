import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
let failures=0;
const jobs=[];
jobs.push(['01','labs/week-01/source','npm.cmd test','unit-tests']);
for(const n of ['02','03','04','05'])jobs.push([n,`labs/week-${n}/source`,'npm.cmd run build','build']);
for(const n of ['07','10','11','12','13'])jobs.push([n,`labs/week-${n}/source/frontend`,'npm.cmd run build','frontend-build']);
for(const n of ['07','10','11','12','13'])jobs.push([n,`labs/week-${n}/source/api`,'npm.cmd test','api-tests']);
for(const n of ['12','13'])jobs.push([n,`labs/week-${n}/source/frontend`,'npm.cmd test','frontend-tests']);
const selected=new Set(process.argv.slice(2).filter(arg=>/^\d{2}$/.test(arg)));
const buildOnly=process.argv.includes('--build-only');
for(const [n,cwd,command,label] of jobs){
 if(selected.size&&!selected.has(n))continue;
 if(buildOnly&&!label.endsWith('build'))continue;
 const r=spawnSync('cmd.exe',['/d','/s','/c',command],{cwd:path.join(root,cwd),windowsHide:true,encoding:'utf8',maxBuffer:8*1024*1024,env:{...process.env,NODE_NO_WARNINGS:'1'}});
 const output=(r.stdout||'')+(r.stderr||'');
 fs.writeFileSync(path.join(root,`labs/week-${n}/evidence/${label}.txt`),`Run: ${new Date().toISOString()}\nCommand: ${command}\nExit: ${r.status}\n\n${output.trimEnd()}\n`);
 console.log(`${r.status===0?'PASS':'FAIL'} week-${n} ${label}`);
 if(r.status!==0){failures++;console.log(output.slice(-3000));}
}
if(failures)process.exitCode=1;
