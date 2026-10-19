# เปิด LAB แยกกันในเครื่อง (PowerShell)

ใช้ Node.js 24 ชุด ZIP นี้รวมทุก LAB อยู่แล้ว มี branch lab/week-NN สำหรับแต่ละ LAB; ลิงก์ PR ใช้เมื่อมี PR จริง

ตัวอย่าง LAB05:

~~~powershell
git fetch origin
git switch lab/week-05
Set-Location labs/week-05/source
npm.cmd ci
npm.cmd run dev
~~~

เปลี่ยนเลขเป็นสัปดาห์ที่ต้องการ แล้วอ่าน labs/week-NN/README.md ของ branch นั้น คำสั่งติดตั้งและทดสอบเฉพาะ LAB อยู่ในไฟล์ดังกล่าว

- LAB01: CLI และ node:test
- LAB02–05: npm run dev / check / build ใน source
- LAB06: Express API ใน source; npm start และ npm run check
- LAB07,10–13: npm ci ใน api/frontend และ root package ถ้ามี; ใช้คนละ terminal สำหรับ API/frontend
- LAB09: SQLite schema.sql, queries.sql และ check-week09.mjs

## API development

สร้าง .env จาก api/.env.example ในเครื่อง แล้วรัน npm run dev --prefix api; LAB13 ต้องใช้ JWT_SECRET ของเครื่องตนเอง ห้าม commit
LAB10–13 มี npm run db:setup --prefix api; คำสั่ง db:reset ล้างข้อมูลทดลอง ต้องตรวจว่าเป็นฐานของ LAB ก่อนใช้
เปิด frontend ด้วย npm run dev --prefix frontend

## LAB11 production / วิดีโอ

~~~powershell
Set-Location labs/week-11/source
npm.cmd ci
npm.cmd run build
$env:NODE_ENV='production'
npm.cmd start
~~~

เปิด http://localhost:3001 และ /api/health บนพอร์ตเดียวกัน; หลังหยุด server ให้ Remove-Item Env:NODE_ENV เมื่อต้องการกลับไป dev
สาธิตและอธิบายโค้ดให้อาจารย์ตรวจแล้ว

## Portfolio

รันคำสั่งรวมใน root README หลังติดตั้ง dependencies; GitHub Pages ใช้ main /docs และแสดง API/SQL เป็นรายงาน
