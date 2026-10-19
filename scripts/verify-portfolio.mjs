import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { ROOT, readJson } from './common.mjs';

// The hub is reviewed separately from LAB source. Validate the published artifact;
// each LAB's own workflow verifies its code in its own PR.
const config = await readJson(path.join(ROOT, 'student-config.json'));
const summaries = await readJson(path.join(ROOT, 'docs/labs.json'));
const expected = ['01','02','03','04','05','06','07','09','10','11','12','13'].map(n=>`week-${n}`);
assert.deepEqual(summaries.map(lab=>lab.week).sort(), expected);
const index = await fs.readFile(path.join(ROOT, 'docs/index.html'), 'utf8');
assert.equal((index.match(/class="lab-card"/g)||[]).length, 12);
let assets = 0;
for (const lab of summaries) {
  assert.equal(lab.sourceRef, config.labSourceRefs[lab.week]);
  assert.equal(lab.pullRequestUrl, config.labPullRequests[lab.week]);
  // An unpublished ZIP has no PR. Validate a real repository PR when supplied.
  if (lab.pullRequestUrl) {
    assert.match(lab.pullRequestUrl, new RegExp(`^https://github\\.com/${config.githubUsername}/${config.repositoryName}/pull/[1-9]\\d*$`));
  } else {
    assert.notEqual(lab.status, 'submitted', 'A submitted LAB requires a real PR');
  }
  const page = path.join(ROOT, 'docs/labs', lab.week, 'index.html');
  const html = await fs.readFile(page, 'utf8');
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const ref = match[1];
    if (/^(?:[a-z]+:|#|\/\/)/i.test(ref)) continue;
    const clean = ref.split(/[?#]/)[0];
    if (!clean) continue;
    const target = path.resolve(path.dirname(page), decodeURIComponent(clean));
    const relative = path.relative(path.join(ROOT, 'docs'), target);
    assert.ok(!relative.startsWith('..') && !path.isAbsolute(relative), `Path outside docs: ${ref}`);
    await fs.access(target); assets++;
  }
}
console.log(`Portfolio PASS: 12 LAB cards, separate source/PR links, ${assets} local asset links`);
