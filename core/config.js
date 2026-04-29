// ==========================================
//  USERS — เพิ่ม/แก้ไข user ที่นี่
//  สร้าง hash รหัสผ่านใหม่ได้ที่ tools/hash-gen.html
// ==========================================
const USERS = [
  {
    id: 'admin',
    username: 'admin',
    name: 'ผู้ดูแลระบบ',
    role: 'admin',
    // รหัสผ่าน: Admin@1234
    passwordHash: 'bc78e58d55cde1346e68f8e5fe588dedf62fa457aa646a500a53347faff6ee24'
  },
  {
    id: 'customer',
    username: 'customer',
    name: 'ลูกค้า',
    role: 'customer',
    // รหัสผ่าน: Guest@2024
    passwordHash: 'a5602915e8790ce659d1df95b581a206c37094348ef4c4b81ca69b7541b0f548'
  }
];

// ==========================================
//  APPS — เพิ่ม/ลบแอปที่นี่
//  active: false = ซ่อนแอปโดยไม่ต้องลบ
//  roles: ['admin'] = admin เท่านั้น
//  roles: ['admin','customer'] = ลูกค้าเห็นด้วย
// ==========================================
const APPS = [

  // --- แอปสำหรับลูกค้า + admin ---

  {
    id: 'postal-rates',
    name: 'อัตราค่าบริการไปรษณีย์',
    description: 'ตรวจสอบอัตราค่าบริการส่งพัสดุทุกประเภท',
    icon: '💰',
    color: '#059669',
    entry: 'apps/Post Rates/thailand-post-rates.html',
    roles: ['admin', 'customer'],
    active: true
  },
  {
    id: 'postal-rates-summary',
    name: 'ตารางราคาสรุป',
    description: 'ตารางอัตราค่าบริการแบบย่อ พิมพ์ได้',
    icon: '📊',
    color: '#0f766e',
    entry: 'apps/Post Rates/summary_price_list.html',
    roles: ['admin', 'customer'],
    active: true
  },
  {
    id: 'postal-label',
    name: 'ใบนำส่งไปรษณีย์',
    description: 'พิมพ์ใบนำส่งไปรษณียภัณฑ์ไม่มีจ่าหน้า',
    icon: '📮',
    color: '#2563eb',
    entry: 'apps/postal-label/index.html',
    roles: ['admin', 'customer'],
    active: true
  },
  {
    id: 'postal-data',
    name: 'ข้อมูลรหัสไปรษณีย์',
    description: 'ค้นหาและดูข้อมูลรหัสไปรษณีย์ทั่วประเทศ',
    icon: '📬',
    color: '#0891b2',
    entry: 'apps/postal-data/index.html',
    roles: ['admin', 'customer'],
    active: true
  },
  {
    id: 'thp-knowledge',
    name: 'ศูนย์ข้อมูลบริการ',
    description: 'ศูนย์ข้อมูลบริการไปรษณีย์ไทย',
    icon: '📚',
    color: '#4f46e5',
    entry: 'apps/thp-service-knowledge-center/index.html',
    roles: ['admin', 'customer'],
    active: true
  },
  {
    id: 'post-family-helper',
    name: 'POST Family Helper',
    description: 'ช่วยเหลือการสมัครสมาชิก POST Family',
    icon: '🤝',
    color: '#d97706',
    entry: 'apps/post-family-helper/index.html',
    roles: ['admin', 'customer'],
    active: true
  },

  // --- แอปเฉพาะ admin ---

  {
    id: 'postal-app',
    name: 'ระบบรับฝากพัสดุ',
    description: 'ระบบรับฝากพัสดุไปรษณีย์',
    icon: '📦',
    color: '#1d4ed8',
    entry: 'apps/postal_app/index.html',
    roles: ['admin'],
    active: true
  },
  {
    id: 'tracking-analyst',
    name: 'Tracking Analyst',
    description: 'วิเคราะห์และติดตามสถานะพัสดุ',
    icon: '🔍',
    color: '#7c3aed',
    entry: 'apps/TA/index.html',
    roles: ['admin'],
    active: true
  },
  {
    id: 'emp-equip',
    name: 'Employee & Equipment',
    description: 'จัดการข้อมูลพนักงานและอุปกรณ์',
    icon: '👥',
    color: '#0891b2',
    entry: 'apps/emp-equip-manager/index.html',
    roles: ['admin'],
    active: true
  },
  {
    id: 'postage-report',
    name: 'รายงานค่าไปรษณีย์',
    description: 'รายงานและสรุปค่าใช้จ่ายไปรษณีย์',
    icon: '📋',
    color: '#dc2626',
    entry: 'apps/postage-report-app/dist/index.html',
    roles: ['admin'],
    active: true
  },
  {
    id: 'thai-post-manifest',
    name: 'Thai Post Manifest',
    description: 'จัดการ Manifest มาตรฐาน GPO',
    icon: '📝',
    color: '#0f766e',
    entry: 'apps/thai-post-manifest/index.html',
    roles: ['admin'],
    active: true
  },
  {
    id: 'translator',
    name: 'แปลภาษา',
    description: 'เครื่องมือแปลภาษาอัตโนมัติ',
    icon: '🌐',
    color: '#be185d',
    entry: 'apps/translator-app/dist/index.html',
    roles: ['admin'],
    active: true
  }
];

// ==========================================
//  ROLES — กำหนดชื่อแสดงผลของแต่ละ role
// ==========================================
const ROLES = {
  admin:    { label: 'ผู้ดูแลระบบ', badge: '#7c3aed' },
  customer: { label: 'ลูกค้า',      badge: '#0891b2' }
};
