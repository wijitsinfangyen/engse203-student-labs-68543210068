# Test Cases — POST /api/requests และ regression
| รหัส | กลุ่ม | ข้อมูล | คาดหวัง |
|---|---|---|---|
| TC-01 | valid | ครบทุกช่อง | ผ่าน |
| TC-02 | boundary | ชื่อ 1 ตัว | ไม่ผ่าน |
| TC-03 | boundary | ชื่อ 2 ตัว | ผ่าน |
| TC-04 | boundary | details 9 ตัว | ไม่ผ่าน |
| TC-05 | boundary | details 10 ตัว | ผ่าน |
| TC-06 | invalid | requestType ผิด enum | ไม่ผ่าน |
| TC-07 | invalid | location ว่าง | ไม่ผ่าน |
| TC-08 | invalid | priority ผิด enum | ไม่ผ่าน |
| TC-09 | invalid | body null | ไม่ผ่าน |
| TC-10 | regression | ลบ REQ-002 แล้วเพิ่ม | 201 |
| TC-11 | regression | PUT REQ-999 | 404 |
| TC-12 | regression | นับ in-progress | จำนวนตรง seed |
