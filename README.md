# SuperApp — แอปรวมการทำงานส่วนตัว

## โครงสร้างโฟลเดอร์

```
SuperApp/
├── core/           → ระบบกลาง: login, auth, user management, RBAC
├── apps/           → แต่ละแอปแยกโฟลเดอร์ของตัวเอง
│   ├── app-postal/ → ตัวอย่าง: แอปไปรษณีย์
│   └── ...
├── shared/         → component/utility ที่แชร์ระหว่างแอป
└── README.md
```

## แนวทาง

- เข้าด้วย username + password
- หน้า Dashboard แสดง icon เฉพาะแอปที่ user มีสิทธิ์
- ระบบ RBAC: กำหนด role และ permission ต่อ user
- แต่ละแอปเก่านำมาวางใน apps/ ได้เลย
