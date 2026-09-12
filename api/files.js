// api/files.js
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "1234";

// ข้อมูลตั้งต้นชั่วคราว
if (!global.filesDatabase) {
    global.filesDatabase = [];
}

export default async function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');

    try {
        if (req.method === 'GET') {
            return res.status(200).json(global.filesDatabase);
        }

        if (req.method === 'POST') {
            const { password, title, category, downloadUrl, audioUrl, imageUrl } = req.body;

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
                imageUrl: imageUrl || '',
                createdAt: new Date().toISOString()
            };

            global.filesDatabase.unshift(newFile);
            return res.status(201).json({ success: true, file: newFile });
        }

        if (req.method === 'DELETE') {
            const { id, password } = req.body;

            if (password !== ADMIN_PASSWORD) {
                return res.status(401).json({ error: 'รหัสผ่าน Admin ไม่ถูกต้อง' });
            }

            global.filesDatabase = global.filesDatabase.filter(file => file.id !== id);
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method Not Allowed' });
    } catch (error) {
        return res.status(500).json({ error: 'Server Internal Error: ' + error.message });
    }
}
