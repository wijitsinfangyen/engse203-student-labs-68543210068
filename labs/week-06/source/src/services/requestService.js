import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
const DATA_FILE = new URL('../../data/requests.json', import.meta.url);
const persist = () => writeFileSync(DATA_FILE, JSON.stringify(requests, null, 2));

const SEED_PATH = new URL('../../data/initialRequests.json', import.meta.url);

/** ข้อมูลอยู่ในหน่วยความจำของเซิร์ฟเวอร์ — หน่วย 4 จะเปลี่ยนเป็นฐานข้อมูล */
let requests = [];

export async function loadSeed() {
  const raw = await readFile(SEED_PATH, 'utf8');
  requests = existsSync(DATA_FILE) ? JSON.parse(readFileSync(DATA_FILE, 'utf8')) : JSON.parse(raw);
  return requests;
}

export function findAll({ status } = {}) {
  if (!status) return structuredClone(requests);
  return structuredClone(requests.filter((r) => r.status === status));
}

export function findById(id) {
  const found = requests.find((r) => r.id === id);
  return found ? structuredClone(found) : null;
}

function createId() {
  let id;
  do {
    const time = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    id = `REQ-${time}-${rand}`;
  } while (requests.some((r) => r.id === id));
  return id;
}

export function create(input) {
  const newRequest = {
    id: createId(),
    requesterName: input.requesterName.trim(),
    requestType: input.requestType,
    location: input.location.trim(),
    details: input.details.trim(),
    priority: input.priority,
    status: 'pending',
  };
  requests.push(newRequest);
  persist();
  return structuredClone(newRequest);
}

export function updateStatus(id, status) {
  const found = requests.find((r) => r.id === id);
  if (!found) return null;
  found.status = status;
  persist();
  return structuredClone(found);
}

export function remove(id) {
  const before = requests.length;
  requests = requests.filter((r) => r.id !== id);
  if (requests.length < before) persist();
  return requests.length < before;
}
