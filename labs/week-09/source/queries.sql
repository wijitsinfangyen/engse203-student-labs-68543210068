-- 1: all requests
SELECT * FROM requests ORDER BY id;
-- 2: pending
SELECT * FROM requests WHERE status = 'pending' ORDER BY id;
-- 3: urgent and unfinished
SELECT * FROM requests WHERE priority = 'urgent' AND status <> 'completed';
-- 4: text search
SELECT * FROM requests WHERE details LIKE '%เครื่อง%';
-- 5: join requester names
SELECT r.id, u.name AS requesterName, r.request_type, r.status FROM requests r JOIN users u ON u.id = r.requester_id ORDER BY r.id;
-- 6: department requests
SELECT r.*, u.department FROM requests r JOIN users u ON u.id = r.requester_id WHERE u.department = 'วิศวกรรมซอฟต์แวร์';
-- 7: distinct requester names
SELECT DISTINCT u.name FROM users u JOIN requests r ON r.requester_id = u.id ORDER BY u.name;
-- 8: three latest
SELECT * FROM requests ORDER BY created_at DESC, id DESC LIMIT 3;
-- 9: status totals
SELECT status, COUNT(*) AS total FROM requests GROUP BY status ORDER BY total DESC;
-- 10: all users including those without requests
SELECT u.name, COUNT(r.id) AS total FROM users u LEFT JOIN requests r ON r.requester_id = u.id GROUP BY u.id ORDER BY total DESC, u.name;
-- 11: useful indexes
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_requester ON requests(requester_id);
