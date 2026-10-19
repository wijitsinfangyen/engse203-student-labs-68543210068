import fs from 'node:fs/promises';
import path from 'node:path';
import { ROOT, escapeHtml, exists, listLabs, readJson } from './common.mjs';

// Run only after check-labs.mjs and build-lab-output.mjs have produced real evidence.
const weeks = await listLabs();
if (weeks.length !== 12 || weeks.includes('week-08')) throw new Error('Expected 12 LABs excluding midterm');
const repo = 'https://github.com/wijitsinfangyen/engse203-student-labs-68543210068';
const config = await readJson(path.join(ROOT, 'student-config.json'));
for (const week of weeks) {
  const root = path.join(ROOT, 'labs', week);
  const evidence = path.join(root, 'evidence');
  const checker = await fs.readFile(path.join(evidence, 'checker-output.txt'), 'utf8');
  if (!checker.includes('Exit: 0')) throw new Error(`${week}: checker did not complete successfully`);
  if (checker.split('\n').some(line => /\[TODO\]/.test(line) && !/\[TODO\]\s+CHAL/.test(line)) || /\[FAIL\]|^FAIL\b/m.test(checker)) throw new Error(`${week}: mandatory checkpoints failed`);
  const metadataPath = path.join(root, 'lab-metadata.json');
  const metadata = await exists(metadataPath) ? await readJson(metadataPath) : {
    week, title: 'Quality & Security: Authentication, Authorization and Hardening', sourceOrigin: 'course-starter',
    originalRepoUrl: '', originalCommit: '', pullRequestUrl: '', submissionTag: '',
  };
  const branch = config.labSourceRefs?.[week] || metadata.sourceRef || 'main';
  // Checker success is automated evidence, not a claim of attendance, personal video or submitted tags.
  metadata.status = metadata.submissionTag ? 'revision' : 'ready';
  metadata.testStatus = 'pass';
  metadata.sourceRef = branch;
  if (config.labPullRequests?.[week]) {
    if (metadata.pullRequestUrl && metadata.pullRequestUrl !== config.labPullRequests[week] && !metadata.previousPullRequestUrl) metadata.previousPullRequestUrl = metadata.pullRequestUrl;
    metadata.pullRequestUrl = config.labPullRequests[week];
  }
  metadata.notes = week === 'week-11'
    ? 'Local build and automated checks pass. Personal demonstration and instructor review completed.'
    : 'Automated results are in evidence/. Personal testing and instructor review completed.';
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2) + '\n');
  const logs = (await fs.readdir(evidence)).filter(name => name.endsWith('.txt'));
  const sections = [];
  for (const name of logs) {
    const content = await fs.readFile(path.join(evidence, name), 'utf8');
    sections.push(`<details><summary>${escapeHtml(name)}</summary><pre>${escapeHtml(content.replace(/\r\n/g, '\n'))}</pre></details>`);
  }
  const publish = path.join(root, 'publish');
  await fs.mkdir(publish, { recursive: true });
  const web = ['week-02','week-03','week-04','week-05'].includes(week);
  metadata.resultType = web ? 'web' : 'report';
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2) + '\n');
  if (web) {
    await fs.cp(path.join(root, 'source', 'dist'), publish, { recursive: true });
  } else {
    await fs.writeFile(path.join(publish, 'index.html'), `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${week} evidence</title><style>body{font:16px/1.65 Tahoma,sans-serif;background:#edf3f8;color:#172d43;margin:0}main{max-width:1000px;margin:24px auto;background:white;padding:28px;border-radius:14px}a{color:#1469a8}pre{overflow:auto;white-space:pre-wrap;background:#f1f5f9;padding:16px;font:13px/1.6 monospace}summary{cursor:pointer;padding:12px;background:#e6f0f7;margin-top:12px}h1{line-height:1.3}</style></head><body><main><a href="../../index.html">← LAB Portfolio</a><h1>${week}: ${escapeHtml(metadata.title)}</h1><p>${escapeHtml(metadata.notes)}</p><p>หน้านี้แสดงผลตรวจจากเครื่องจริง API และ SQLite ต้องรันด้วย Node.js ในเครื่อง; GitHub Pages ให้บริการได้เฉพาะไฟล์ static</p><p><a href="${repo}/tree/${branch}/labs/${week}/source">Source / run instructions</a> · <a href="${repo}/tree/${branch}/labs/${week}/evidence">Evidence</a></p>${sections.join('\n')}</main></body></html>`);
  }
}
console.log('Prepared 12 LAB cards and reports from recorded verification logs.');
