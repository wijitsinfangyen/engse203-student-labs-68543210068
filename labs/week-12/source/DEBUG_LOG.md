# บันทึก Debug LAB12

เอกสารอธิบายกรณีบั๊กจากโครงการอ้างอิง ไม่ใช่บันทึกการ debug ส่วนตัวของผู้เรียน ผล regression tests ที่รันใหม่ดู ../evidence/

## BUG #0

- **อาการ:** details 10 ตัวถูกปฏิเสธ
- **วิธีทำซ้ำ:** POST ด้วย details 1234567890 หรือเรียก validateRequestInput โดยตรง
- **เครื่องมือ:** instructor checker + unit test ค่าขอบ
- **สาเหตุ:** requestValidator.js ใช้ length <= MIN_DETAILS จึงไม่ยอมรับ 10 ตัว
- **วิธีแก้:** ใช้ length < MIN_DETAILS
- **test ที่กัน:** tests/unit/requestValidator.test.js ทดสอบ details 10 ตัว

## BUG #1

- **อาการ:** ลบรายการกลางแล้วเพิ่มใหม่ได้ HTTP 500
- **วิธีทำซ้ำ:** DELETE REQ-002 ตามด้วย POST ข้อมูลถูกต้อง
- **เครื่องมือ:** instructor runtime checker และอ่าน requestService.js
- **สาเหตุ:** ใช้ COUNT(*) + 1 ทำให้ ID ซ้ำกับแถวที่ยังอยู่
- **วิธีแก้:** ใช้ MAX(CAST(SUBSTR(id,5) AS INTEGER)) + 1
- **test ที่กัน:** tests/integration/requests.api.test.js: regression BUG1 delete middle then create

## BUG #2

- **อาการ:** summary กำลังดำเนินการเป็น 0 ทั้งที่มีข้อมูล
- **วิธีทำซ้ำ:** ส่ง array ที่มี status in-progress ไป summarizeRequests
- **เครื่องมือ:** instructor checker และ frontend Vitest
- **สาเหตุ:** requestSummary.js เปรียบเทียบกับ in progress ซึ่งใช้ช่องว่าง
- **วิธีแก้:** ใช้ in-progress ให้ตรง API
- **test ที่กัน:** frontend/src/utils/requestSummary.test.js นับครบทุกสถานะ

## BUG #3

- **อาการ:** PUT รหัสที่ไม่มีอยู่ได้ HTTP 500 แทน 404
- **วิธีทำซ้ำ:** PUT /api/requests/REQ-999 พร้อม status completed
- **เครื่องมือ:** instructor HTTP checker และอ่าน requestController.js
- **สาเหตุ:** log อ่าน updated.id ก่อนตรวจ null เมื่อไม่พบคำร้อง
- **วิธีแก้:** ลบ log ที่อ่าน null แล้วให้ตรวจ !updated ก่อนตอบ
- **test ที่กัน:** tests/integration/requests.api.test.js: regression BUG3 missing update returns 404

ไม่ได้รัน baseline ก่อนแก้ในรอบนี้ ผลอัตโนมัติใหม่ดู ../evidence/
