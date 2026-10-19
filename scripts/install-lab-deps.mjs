import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directories = [];
function visit(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist', 'publish', 'evidence'].includes(entry.name)) continue;
    const target = path.join(folder, entry.name);
    if (entry.isDirectory()) visit(target);
    else if (entry.name === 'package.json') directories.push(folder);
  }
}
visit(path.join(root, 'labs'));
let failures = 0;
async function install(folder) {
  const command = fs.existsSync(path.join(folder, 'package-lock.json')) ? 'npm.cmd ci --no-fund' : 'npm.cmd install --no-fund';
  const result = await new Promise(resolve => {
    const p = spawn('cmd.exe', ['/d', '/s', '/c', command], { cwd: folder, windowsHide: true });
    let output = '';
    p.stdout.on('data', chunk => { output += chunk; });
    p.stderr.on('data', chunk => { output += chunk; });
    p.on('error', err => resolve({ code: 1, output: err.message }));
    p.on('close', code => resolve({ code, output }));
  });
  console.log(`${result.code === 0 ? 'OK' : 'FAIL'} ${path.relative(root, folder)}`);
  if (result.code !== 0) { failures++; console.log(result.output.slice(-2500)); }
}
const queue = [...directories];
await Promise.all(Array.from({ length: 3 }, async () => { while (queue.length) await install(queue.shift()); }));
if (failures) process.exitCode = 1;
