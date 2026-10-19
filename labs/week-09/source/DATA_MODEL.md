# แบบจำลองข้อมูล Campus Service

users (1) ──< requests (หลาย)
ผู้ใช้หนึ่งคนส่งคำร้องได้หลายรายการ แต่คำร้องแต่ละรายการอ้างผู้ใช้หนึ่งคนผ่าน requester_id

## ทำไมแยกตาราง
หากเก็บชื่อและอีเมลซ้ำทุกคำร้อง เมื่อเปลี่ยนชื่อจะต้องแก้หลายแถวและเสี่ยงข้อมูลไม่ตรงกัน การแยก users ทำให้แก้ข้อมูลผู้ใช้ที่เดียว ใช้ foreign key ป้องกันคำร้องที่ไม่มีเจ้าของ และ JOIN คืนชื่อให้ API โดย frontend ไม่ต้องรู้ว่าจัดเก็บกี่ตาราง

## ตารางและข้อกำหนด
| ตาราง | คอลัมน์ | ชนิด/ข้อกำหนด | เหตุผล |
|---|---|---|---|
| users | id | INTEGER PRIMARY KEY AUTOINCREMENT | ใช้เลขภายในสร้างอัตโนมัติ |
| users | name, department | TEXT NOT NULL | ต้องมีชื่อและหน่วยงาน |
| users | email | TEXT NOT NULL UNIQUE | ไม่ให้อีเมลซ้ำ |
| requests | id | TEXT PRIMARY KEY | ต้องแสดงรูป REQ-001 ต่อผู้ใช้ |
| requests | requester_id | INTEGER NOT NULL REFERENCES users(id) | เชื่อมความสัมพันธ์อย่างถูกต้อง |
| requests | request_type, location, details | TEXT NOT NULL | เนื้อหาคำร้อง |
| requests | priority | TEXT DEFAULT normal + CHECK | จำกัด normal/urgent |
| requests | status | TEXT DEFAULT pending + CHECK | จำกัดสามสถานะ |
| requests | created_at | TEXT พร้อมค่าเริ่มต้น datetime | เวลาเพื่อเรียงรายการ |

## JOIN
SELECT r.id, u.name AS requesterName, r.status FROM requests r JOIN users u ON u.id=r.requester_id ORDER BY r.id;
ผลตั้งต้นมี 8 แถว เช่น REQ-001/สมชาย ใจดี/pending และ REQ-006/วิจิตรศิลป์ ฟังเย็น/pending
JSON ของ Week07 ใช้ requesterName เช่นกัน ดังนั้น Week10 ให้ service แปลง snake_case เป็น camelCase ผ่าน AS โดย controller ไม่ต้องเปลี่ยน

## ป้องกันข้อมูลผิดหลายชั้น
API validation ช่วยส่งข้อความที่อ่านเข้าใจ แต่ CHECK/NOT NULL/UNIQUE/FK ยังจำเป็นสำหรับการแก้ฐานข้อมูลตรงหรือโปรแกรมอื่น ทุก connection ต้อง PRAGMA foreign_keys=ON
schema.sql ใช้ DROP TABLE IF EXISTS โดยลบ requests ก่อน users จึงรันซ้ำได้; คำสั่งนี้ล้างข้อมูล ควรใช้สร้างฐานทดลองเท่านั้น
queries.sql มีการกรอง LIKE, DISTINCT, ORDER BY/LIMIT, JOIN, GROUP BY และ LEFT JOIN; สร้าง indexes ที่ status และ requester_id ตามเส้นทางค้นหา
