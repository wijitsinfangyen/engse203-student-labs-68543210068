import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { ROOT } from './common.mjs';
const lab = path.join(ROOT, 'labs/week-09');
const db = new DatabaseSync(':memory:');
db.exec(await fs.readFile(path.join(lab, 'source/schema.sql'), 'utf8'));
db.exec('PRAGMA foreign_keys = ON');
const lines = [`Run: ${new Date().toISOString()}`, 'Command: node --disable-warning=ExperimentalWarning scripts/record-sql-evidence.mjs', 'Database: isolated in-memory SQLite (schema identical to submitted source)'];
const sql = (await fs.readFile(path.join(lab, 'source/queries.sql'), 'utf8')).replace(/--[^\n]*/g, '');
for (const statement of sql.split(';').map(s=>s.trim()).filter(Boolean)) {
  if (!/^SELECT\b/i.test(statement)) continue;
  lines.push('\nSQL: ' + statement, JSON.stringify(db.prepare(statement).all(), null, 2));
}
for (const [label, sql, values] of [
  ['NOT NULL', 'INSERT INTO users(name,department,email) VALUES(?,?,?)', [null,'Test','null@example.org']],
  ['UNIQUE', 'INSERT INTO users(name,department,email) VALUES(?,?,?)', ['Duplicate','Test',db.prepare('SELECT email FROM users LIMIT 1').get().email]],
  ['FOREIGN KEY', 'INSERT INTO requests(id,requester_id,request_type,location,details,priority,status) VALUES(?,?,?,?,?,?,?)', ['REQ-999',999999,'แจ้งซ่อม','Test','Test details','normal','pending']],
]) {
  let error;
  try { db.prepare(sql).run(...values); } catch (caught) { error = caught; }
  assert.ok(error, `${label} must reject invalid data`);
  lines.push(`\nPASS ${label}: ${error.message}`);
}
assert.ok(db.prepare('SELECT count(*) n FROM users').get().n >= 4);
assert.ok(db.prepare('SELECT count(*) n FROM requests').get().n >= 8);
db.close();
await fs.writeFile(path.join(lab, 'evidence/sql-results.txt'), lines.join('\n')+'\n');
console.log('SQL queries and NOT NULL / UNIQUE / FOREIGN KEY constraints: PASS');
