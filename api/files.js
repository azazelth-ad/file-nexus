// api/files.js
// ตั้งรหัสผ่าน Admin ตรงนี้ (หรือตั้งใน Vercel Environment Variables ก็ได้)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "1234";

// ตัวอย่างการเก็บข้อมูลชั่วคราว (หมายเหตุ: Vercel Function Serverless แบบฟรี ข้อมูลในหน่วยความจำอาจถูกรีเซ็ตได้ ควรเชื่อมกับ Vercel KV/Supabase/Firebase)
let filesDatabase = [];

export default async function handler(req, res) {
    // ให้ตอบกลับเป็น JSON เสมอเพื่อป้องกัน SyntaxError
    res.setHeader('Content-Type', 'application/json');

    try {
        if (req.method === 'GET') {
            return res.status(200).json(filesDatabase);
        }

        if (req.method === 'POST') {
            const { password, title, category, downloadUrl, audioUrl } = req.body;

            if (password !== ADMIN_PASSWORD) {
                return res.status(401).json({ error: 'รหัสผ่าน Admin ไม่ถูกต้อง' });
            }

            if (!title || !downloadUrl) {
                return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
            }

            const newFile = {
                id: Date.now().toString(),
                title,
                category: category || 'ทั่วไป',
                downloadUrl,
                audioUrl: audioUrl || '',
                createdAt: new Date().toISOString()
            };

            filesDatabase.unshift(newFile);
            return res.status(201).json({ success: true, file: newFile });
        }

        if (req.method === 'DELETE') {
            const { id, password } = req.body;

            if (password !== ADMIN_PASSWORD) {
                return res.status(401).json({ error: 'รหัสผ่าน Admin ไม่ถูกต้อง' });
            }

            filesDatabase = filesDatabase.filter(file => file.id !== id);
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method Not Allowed' });
    } catch (error) {
        return res.status(500).json({ error: 'Server Internal Error: ' + error.message });
    }
}
