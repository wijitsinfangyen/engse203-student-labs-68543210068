import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT } from './common.mjs';
const results=[];
function visit(folder){
 for(const entry of fs.readdirSync(folder,{withFileTypes:true})){
  if(['node_modules','dist','publish','evidence','coverage','.git'].includes(entry.name))continue;
  const target=path.join(folder,entry.name);
  if(entry.isDirectory())visit(target);
  else if(entry.name==='package.json'){
   const pkg=JSON.parse(fs.readFileSync(target,'utf8'));
   // Instructor checkers are run by check-labs.mjs. Run additional package checks here.
   if(pkg.scripts?.check&&!/check-week/.test(pkg.scripts.check)){
    const r=spawnSync('cmd.exe',['/d','/s','/c','npm.cmd run check'],{cwd:folder,encoding:'utf8',windowsHide:true});
    const relative=path.relative(ROOT,folder).replaceAll('\\','/');
    const week=relative.match(/week-\d+/)[0];
    const log=`Run: ${new Date().toISOString()}\nCommand: npm.cmd run check\nDirectory: ${relative}\nExit: ${r.status}\n\n${r.stdout||''}${r.stderr||''}`;
    fs.writeFileSync(path.join(ROOT,'labs',week,'evidence',`package-check-${relative.endsWith('/source')?'source':path.basename(folder)}.txt`),log);
    results.push({directory:relative,exitCode:r.status});console.log(`${r.status===0?'PASS':'FAIL'} ${relative}`);
   }
  }
 }
}
visit(path.join(ROOT,'labs'));
fs.mkdirSync(path.join(ROOT,'.lab-verification'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'.lab-verification','package-checks.json'),JSON.stringify(results,null,2)+'\n');
if(results.some(r=>r.exitCode!==0))process.exitCode=1;
