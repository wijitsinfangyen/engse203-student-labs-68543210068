import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const selected=new Set(process.argv.slice(2));
const jobs=[
 ['01','node src/hello.js'],
 ['02','npm.cmd run check'],
 ['03','npm.cmd run check'],
 ['04','npm.cmd run check'],
 ['05','npm.cmd run check'],
 ['06','npm.cmd run check'],
 ['07','node check-week07.mjs'],
 ['09','node --disable-warning=ExperimentalWarning check-week09.mjs'],
 ['10','node --disable-warning=ExperimentalWarning check-week10.mjs'],
 ['11','node --disable-warning=ExperimentalWarning check-week11.mjs'],
 ['12','node --disable-warning=ExperimentalWarning check-week12.mjs'],
 ['13','node --disable-warning=ExperimentalWarning check-week13.mjs'],
].filter(([number])=>!selected.size||selected.has(number));
const results=[];
for(const [number,command] of jobs){
 const week=`week-${number}`, cwd=path.join(root,'labs',week,'source');
 const result=await new Promise(resolve=>{
  const child=spawn('cmd.exe',['/d','/s','/c',command],{cwd,windowsHide:true,env:{...process.env,NODE_NO_WARNINGS:'1'}});
  let output='';child.stdout.on('data',b=>{output+=b;});child.stderr.on('data',b=>{output+=b;});
  child.on('error',e=>resolve({exitCode:1,output:e.message}));
  child.on('close',exitCode=>resolve({exitCode,output}));
 });
 const target=path.join(root,'labs',week,'evidence');fs.mkdirSync(target,{recursive:true});
 fs.writeFileSync(path.join(target,'checker-output.txt'),`Run: ${new Date().toISOString()}\nCommand: ${command}\nExit: ${result.exitCode}\n\n${result.output.trimEnd()}\n`);
 // Several instructor checkers exit 0 even when mandatory checkpoints are incomplete.
 const mandatoryTodo = result.output.split('\n').filter(line => /\[TODO\]/.test(line) && !/\[TODO\]\s+CHAL/.test(line));
 if (mandatoryTodo.length || /\[FAIL\]|^FAIL\b/m.test(result.output)) result.exitCode = 1;
 const relevant=result.output.split('\n').filter(l=>/\[TODO\]|\[FAIL\]|^FAIL|ผ่าน \d|passed|PASS|Error:|ERR_|Cannot|❌|✗/.test(l));
 console.log(`\n=== ${week} (exit ${result.exitCode}) ===\n${relevant.join('\n').slice(-6500) || result.output.slice(-500)}`);
 results.push({week,command,exitCode:result.exitCode,outputFile:`labs/${week}/evidence/checker-output.txt`});
}
fs.mkdirSync(path.join(root,'.lab-verification'),{recursive:true});
fs.writeFileSync(path.join(root,'.lab-verification','latest-checks.json'),JSON.stringify(results,null,2)+'\n');
if(results.some(r=>r.exitCode!==0))process.exitCode=1;
