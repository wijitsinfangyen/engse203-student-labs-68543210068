import { readStoredRequests, writeStoredRequests, clearStoredRequests } from './requestStorage.js';
const waitForLabDelay = () => new Promise(resolve => setTimeout(resolve, 250));
async function fetchSeedRequests() {
  const response = await fetch((import.meta.env?.BASE_URL ?? './') + 'data/initialRequests.json');
  if (!response.ok) throw new Error('โหลดข้อมูลตัวอย่างไม่สำเร็จ (' + response.status + ')');
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error('ข้อมูลตัวอย่างต้องเป็น array');
  return structuredClone(data);
}
async function loadNormalRequests(onRecovery) {
  const stored = readStoredRequests();
  if (stored.status === 'valid') return stored.requests;
  if (stored.status === 'invalid') clearStoredRequests();
  const seed = await fetchSeedRequests();
  writeStoredRequests(seed);
  if (stored.status === 'invalid') onRecovery?.('กู้คืนข้อมูลตัวอย่างแล้ว: ' + stored.reason);
  return seed;
}
export async function getRequests(options = {}) {
  await waitForLabDelay();
  if (options.scenario === 'error') throw new Error('LAB scenario: จำลองการโหลดข้อมูลไม่สำเร็จ');
  if (options.scenario === 'empty') return [];
  return loadNormalRequests(options.onRecovery);
}
export async function getRequestById(id) { return (await getRequests()).find(r => r.id === id) ?? null; }
export async function addRequest(input) {
  const text = key => typeof input?.[key] === 'string' ? input[key].trim() : '';
  if (text('requesterName').length < 2 || !text('requestType') || !text('location') || text('details').length < 10 || !['normal','urgent'].includes(input?.priority)) throw new Error('ข้อมูลคำร้องไม่ถูกต้อง');
  const requests = await loadNormalRequests();
  const id = 'REQ-' + Date.now().toString(36).toUpperCase() + '-' + crypto.randomUUID().slice(0,8).toUpperCase();
  const result = { id, requesterName:text('requesterName'), requestType:text('requestType'), location:text('location'), details:text('details'), priority:input.priority, status:'pending' };
  writeStoredRequests([...requests, result]);
  return structuredClone(result);
}
export async function deleteRequest(id) { const next = (await loadNormalRequests()).filter(r => r.id !== id); writeStoredRequests(next); return next; }
export async function resetRequests() { clearStoredRequests(); const seed = await fetchSeedRequests(); writeStoredRequests(seed); return seed; }
