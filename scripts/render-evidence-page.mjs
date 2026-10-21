import { escapeHtml } from './common.mjs';

export function renderEvidencePage({ week, metadata, repo, branch }) {
  const e = escapeHtml;
  const source = repo + '/tree/' + encodeURIComponent(branch) + '/labs/' + week + '/source';
  const evidence = repo + '/tree/' + encodeURIComponent(branch) + '/labs/' + week + '/evidence';
  const notes = {
    'week-01': 'Developer environment, student greeting, and repository setup evidence are present in this repository.',
    'week-06': 'Source and API test evidence are present in this repository.',
    'week-09': 'Schema, queries, data model, and SQLite database are present in this repository.',
  };
  const status = { ready: 'Published', submitted: 'Submitted', revision: 'Updated · pending review', draft: 'Draft' }[metadata.status] || metadata.status;
  return `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(week)} — ${e(metadata.title)}</title><style>
  *{box-sizing:border-box}body{margin:0;font:16px/1.65 Tahoma,Arial,sans-serif;color:#102b46;background:#eef5f9}main{max-width:1000px;margin:32px auto;padding:28px;background:white;border-radius:20px;box-shadow:0 16px 40px #0a27451c}a{color:#0666b5}.back{display:inline-block;margin:12px 0}.pill{display:table;border-radius:30px;padding:3px 12px;background:#e5f2fc;font-weight:bold;margin:0 0 22px}h1{font-size:clamp(26px,3.2vw,34px);line-height:1.3;margin:20px 0;overflow-wrap:anywhere}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.card{background:#f6f9fc;border:1px solid #c5d8e8;border-radius:13px;padding:16px;overflow-wrap:anywhere}.card h2{font-size:17px;margin:0 0 12px}.card p{margin:0 0 14px}.actions{display:flex;flex-wrap:wrap;gap:10px;margin:20px 0}.actions a{padding:9px 15px;border-radius:8px;text-decoration:none;background:#1265aa;color:white}.note{color:#526b82;margin:20px 0 8px}a:focus-visible{outline:3px solid #f6b73c;outline-offset:3px}@media(max-width:650px){main{margin:20px 14px;padding:24px}.grid{grid-template-columns:1fr}.card p{margin-bottom:0}}
  </style></head><body><main><a class="back" href="../../index.html">← LAB Portfolio</a><span class="pill">${e(status)}</span><h1>${e(week)} — ${e(metadata.title)}</h1><p>LAB นี้ใช้ evidence report แทน web application</p><div class="grid"><section class="card"><h2>Test Status</h2><p>${e(metadata.testStatus)}</p></section><section class="card"><h2>Submission</h2><p>${e(metadata.submissionTag || branch)}</p></section><section class="card"><h2>Original Commit</h2><p>${e(metadata.originalCommit || '—')}</p></section></div><div class="actions"><a href="${e(source)}">View Source</a><a href="${e(evidence)}">View Evidence</a></div><p class="note">${e(notes[week])}</p></main></body></html>`;
}
