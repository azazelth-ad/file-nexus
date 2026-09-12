export default async function handler(req, res) {
    // เพิ่ม Header อนุญาต CORS และปิด Cache สำหรับมือถือ
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-store, max-age=0');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ... (โค้ดเดิมของ api/files.js ด้านล่างคงไว้เหมือนเดิม) ...
