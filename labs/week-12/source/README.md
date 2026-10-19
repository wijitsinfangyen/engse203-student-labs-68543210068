# LAB 12 — Campus Service Full Stack
ผู้จัดทำ วิจิตรศิลป์ ฟังเย็น (Wijitsin Fangyen), 68543210068-1, SEC2

## สถาปัตยกรรม 3 ชั้น
Frontend React ส่ง HTTP ผ่าน service/apiClient ไป Express API แล้ว controller เรียก service ซึ่งใช้ SQLite ฐานข้อมูลมี users และ requests เชื่อม FOREIGN KEY; service JOIN ชื่อและแปลง camelCase ให้หน้าเว็บ ทำให้เปลี่ยนที่เก็บข้อมูลโดยรักษา API contract เดิมได้

## ติดตั้งและรัน
npm install --prefix api
npm install --prefix frontend
npm run db:setup --prefix api
เปิด API ด้วย npm run start --prefix api และ frontend ด้วย npm run dev --prefix frontend คนละ terminal; ใช้ .env จาก .env.example เฉพาะเครื่อง ไม่ commit

## จำลอง production
npm run build
ตั้ง NODE_ENV=production แล้ว npm start; เปิด http://localhost:3001 และ /api/health. ระบบเสิร์ฟ frontend/dist และ API บนพอร์ตเดียว หน้าเว็บ production เรียก /api แบบ relative
DB_FILE ใช้ฐานทดสอบแยกได้ SQLite ไฟล์ในเครื่องไม่รับประกันความถาวรบน cloud free tier

## ทดสอบและหลักฐาน
อ่าน evidence/TEST_RESULTS.md ซึ่งจะสร้างจากการรันจริงก่อนส่ง ใช้ checker ประจำสัปดาห์และ npm test ตาม package.json
DEMO.md เป็นลำดับสาธิตเพื่อให้เจ้าของงานอัดวิดีโอเอง ไม่ใช่วิดีโอที่บันทึกแล้ว

## การใช้ AI
Codex ช่วยอ่านโจทย์ เติม source จาก instructor starter ออกแบบ tests และตรวจผล ผู้จัดทำต้องศึกษาและอธิบายโค้ดเอง ไม่มีการสร้างประวัติเข้าชั้นเรียนหรืออ้างว่าอัดวิดีโอแล้ว
