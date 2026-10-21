# ENGSE203 LAB Portfolio

วิจิตรศิลป์ ฟังเย็น · Wijitsin Fangyen · 68543210068-1 · Section 2
GitHub: wijitsinfangyen · email: wijitsinfangyen@gmail.com

Repository: https://github.com/wijitsinfangyen/engse203-student-labs-68543210068
Pages: https://wijitsinfangyen.github.io/engse203-student-labs-68543210068/

12 LAB: 01–07 และ 09–13; Week08 สอบกลางภาค
ดัดแปลงจากโครงการอ้างอิงที่ได้รับอนุญาตและ starter ของผู้สอน ไม่อ้างว่าหลักฐานเดิมเป็นผลงานของผู้เรียน ดู STUDENT_NEXT_STEPS.md และ HOW_TO_RUN.md
ปุ่ม Pull Request เชื่อม PR จริงของ LAB01–06; LAB ที่ยังไม่มี PR เปิดรายการตาม branch และยังไม่ระบุหมายเลข PR

```powershell
node scripts/install-lab-deps.mjs
node scripts/build-lab-output.mjs
node scripts/check-package-scripts.mjs
node scripts/check-labs.mjs
node scripts/record-sql-evidence.mjs
node scripts/prepare-portfolio.mjs
npm.cmd run build:pages
npm.cmd run verify
```

เครดิตผู้สอน: https://github.com/se-rmutl/engse203-lab และ https://se-rmutl.github.io/engse203/
ตรวจและทดสอบส่วนตัว สาธิตและอธิบายโค้ดให้อาจารย์ตรวจแล้ว

## เปิดแอปที่ deploy แล้ว

- LAB07 และ LAB10: เปิด frontend บน Pages และใช้ API สาธิตของ LAB11
- [LAB11](https://engse203-lab11-68543210068.onrender.com/)
- [LAB12](https://engse203-lab12-68543210068.onrender.com/)
- [LAB13](https://engse203-lab13-68543210068.onrender.com/)

Render Free อาจพักแอปเมื่อไม่มีผู้ใช้ การเปิดครั้งแรกอาจต้องรอสักครู่ ข้อมูล SQLite เป็นข้อมูลสาธิตและอาจถูกตั้งต้นใหม่เมื่อบริการเริ่มใหม่
