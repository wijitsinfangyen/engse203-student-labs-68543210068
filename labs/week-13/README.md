# LAB13 — Quality & Security: Authentication, Authorization and Hardening

วิจิตรศิลป์ ฟังเย็น · 68543210068-1 · SEC2

Branch ที่แนะนำ: `lab/week-13` (ยังไม่ได้สร้างหรือส่ง PR ในรอบนี้)

Source: [source/](source/) · Evidence: [evidence/](evidence/) · Output/report: [publish/](publish/)

## รันและตรวจ LAB นี้แยกต่างหาก

ใช้ Node.js 24 แล้วรันจาก repository root:

~~~powershell
Set-Location labs/week-13/source
npm.cmd ci
npm.cmd ci --prefix api
npm.cmd ci --prefix frontend
npm.cmd run build --prefix frontend
npm.cmd test --prefix api
npm.cmd test --prefix frontend
node --disable-warning=ExperimentalWarning check-week13.mjs --inclass
~~~

ดู source/README.md และ package.json สำหรับการเปิด dev/API; ใช้ .env.example สร้าง .env ในเครื่องเท่านั้น ห้าม commit secret

ผลใน evidence/ เป็นการรันใหม่บนโค้ดชุดนี้ด้วย Node.js 24.20.0 ไม่มีการรัน GitHub CI หรือส่งงานในรอบนี้ หลักฐานเดิมแยกออกโดยไม่แก้ไขชื่อ

แผนการเรียน: https://se-rmutl.github.io/engse203/#roadmap
โจทย์จริง: ดู starter ของสัปดาห์นี้ใน https://github.com/se-rmutl/engse203-lab/tree/main/labs

Portfolio รวมผลทั้ง 12 LAB; ลิงก์ PR เว้นว่างจนกว่าจะสร้างจริง
