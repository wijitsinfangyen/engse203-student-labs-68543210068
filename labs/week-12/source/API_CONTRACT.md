# API Contract — Campus Service Request
Base URL local http://localhost:3001. JSON request/response. React uses requesterName, requestType, location, details, priority, status and id.

| Method | Endpoint | Success | Errors |
|---|---|---|---|
| GET | /api/requests | 200 array | 500 internal |
| GET | /api/requests?status=pending | 200 filtered array | 500 internal |
| GET | /api/requests/:id | 200 object | 404 missing |
| POST | /api/requests | 201 new pending object | 400 validation with details |
| PUT | /api/requests/:id | 200 updated object | 400 bad enum, 404 missing |
| DELETE | /api/requests/:id | 204 empty body | 404 missing |

Valid POST: {"requesterName":"ทดสอบ ระบบ","requestType":"แจ้งซ่อม","location":"ห้อง 301","details":"รายละเอียดสำหรับการทดสอบระบบ","priority":"normal"}
ชื่ออย่างน้อย 2 ตัว, location ห้ามว่าง, details อย่างน้อย 10 ตัว, priority normal/urgent, requestType แจ้งซ่อม/บริการบัญชีผู้ใช้/ขอใช้อุปกรณ์/อื่น ๆ
PUT body: {"status":"in-progress"}; allowed pending/in-progress/completed. Errors are JSON {error, details?}; production never returns stack.
CORS origin defaults to http://localhost:5173. apiClient reads VITE_API_BASE_URL and sends JSON. No authentication is required in LAB07–12; LAB13 changes PUT/DELETE to require a JWT.
SQL service in LAB10+ uses JOIN and AS to preserve this contract; all external values are query parameters, including filters and names. SQL injection is tested through status and stored as data, never SQL.

## Data model / ฐานข้อมูล
users(id,name,department,email) หนึ่งต่อหลาย requests(id,requester_id,request_type,location,details,priority,status,created_at). requester_id เป็น FOREIGN KEY; service ใช้ JOIN และ AS เป็น requesterName และ parameterized query ทุกค่าที่มาจากภายนอก
