import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const API_ROOT = path.resolve(HERE, '../..');
const DB_FILE = process.env.DB_FILE || path.join(API_ROOT,'data','campus.db');
let db;
const SELECT = `SELECT r.id, u.name AS requesterName, r.request_type AS requestType, r.location, r.details, r.priority, r.status FROM requests r JOIN users u ON u.id = r.requester_id`;
export async function loadSeed() {
  if(db) db.close();
  db = new DatabaseSync(DB_FILE);
  db.exec('PRAGMA foreign_keys = ON');
  if (!db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='requests'").get()) db.exec(readFileSync(path.join(API_ROOT,'data','schema.sql'),'utf8'));
}
export function findAll({status}={}) { return status ? db.prepare(SELECT+' WHERE r.status = ? ORDER BY r.id').all(status) : db.prepare(SELECT+' ORDER BY r.id').all(); }
export function findById(id) { return db.prepare(SELECT+' WHERE r.id = ?').get(id) ?? null; }
export function create(input) {
  db.exec('BEGIN');
  try {
    const name=input.requesterName.trim();
    let user=db.prepare('SELECT id FROM users WHERE name = ?').get(name);
    if(!user){ const r=db.prepare('INSERT INTO users(name,department,email) VALUES(?,?,?)').run(name,'ทั่วไป',randomUUID()+'@student.local'); user={id:Number(r.lastInsertRowid)}; }
    const max=db.prepare("SELECT MAX(CAST(SUBSTR(id,5) AS INTEGER)) n FROM requests").get().n ?? 0;
    const id='REQ-'+String(max+1).padStart(3,'0');
    db.prepare('INSERT INTO requests(id,requester_id,request_type,location,details,priority,status) VALUES(?,?,?,?,?,?,?)').run(id,user.id,input.requestType,input.location.trim(),input.details.trim(),input.priority,'pending');
    db.exec('COMMIT'); return findById(id);
  } catch(err){db.exec('ROLLBACK');throw err;}
}
export function updateStatus(id,status){ if(!findById(id))return null; db.prepare('UPDATE requests SET status = ? WHERE id = ?').run(status,id); return findById(id); }
export function remove(id){return db.prepare('DELETE FROM requests WHERE id = ?').run(id).changes>0;}
export function findAllUsers(){return db.prepare('SELECT id,name,department,email FROM users ORDER BY id').all();}
export function getDbStatus(){try{return {connected:true,driver:'sqlite',tables:db.prepare("SELECT count(*) n FROM sqlite_master WHERE type='table'").get().n};}catch{return {connected:false,driver:'sqlite'};}}
