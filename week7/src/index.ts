import express from 'express';
import { prisma } from './lib/prisma';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// GET / — health check
app.get('/', (req, res) => {
    res.send('Hello from Prisma API!');
});

// GET /docs — Interactive API Documentation
app.get('/docs', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CE385 Week7 — API Docs</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',sans-serif;background:#0f172a;color:#e2e8f0;padding:24px}
    h1{color:#38bdf8;font-size:1.6rem;margin-bottom:4px}
    .subtitle{color:#64748b;font-size:.9rem;margin-bottom:28px}
    .group{margin-bottom:32px}
    .group-title{font-size:1.1rem;font-weight:700;color:#94a3b8;border-bottom:1px solid #1e293b;padding-bottom:8px;margin-bottom:14px}
    .card{background:#1e293b;border:1px solid #334155;border-radius:10px;padding:16px 20px;margin-bottom:12px}
    .row{display:flex;align-items:center;gap:12px;margin-bottom:10px}
    .badge{padding:4px 10px;border-radius:6px;font-size:.78rem;font-weight:700;min-width:70px;text-align:center}
    .GET{background:#064e3b;color:#34d399}.POST{background:#1e3a5f;color:#60a5fa}
    .PUT{background:#451a03;color:#fb923c}.DELETE{background:#4c0519;color:#f87171}
    .url{font-family:monospace;font-size:.92rem;color:#e2e8f0}
    .desc{color:#94a3b8;font-size:.85rem}
    .body-box{background:#0f172a;border:1px solid #334155;border-radius:6px;padding:10px 14px;font-family:monospace;font-size:.82rem;color:#86efac;margin-top:8px;white-space:pre}
    .label{font-size:.75rem;color:#64748b;margin-bottom:4px}
    a.btn{display:inline-block;margin-top:10px;padding:6px 14px;border-radius:6px;background:#0ea5e9;color:#fff;font-size:.82rem;text-decoration:none;font-weight:600}
    a.btn:hover{background:#0284c7}
    .note{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 16px;color:#94a3b8;font-size:.85rem;margin-bottom:24px}
    .note b{color:#fbbf24}
  </style>
</head>
<body>
  <h1>📘 CE385 Week7 — API Documentation</h1>
  <p class="subtitle">Workshop 7: User & Post CRUD API ด้วย Prisma + Express</p>

  <div class="note">
    <b>💡 วิธีใช้:</b> คัดลอก <b>Userid</b> จาก POST /user แล้วนำไปใส่ใน authorId ตอนสร้าง Post<br/>
    Base URL: <b>http://localhost:${port}</b>
  </div>

  <div class="group">
    <div class="group-title">👤 USER</div>

    <div class="card">
      <div class="row"><span class="badge POST">POST</span><span class="url">/user</span></div>
      <div class="desc">สร้าง user ใหม่</div>
      <div class="label">Request Body:</div>
      <div class="body-box">{ "name": "สมชาย", "email": "somchai@dpu.ac.th" }</div>
      <a class="btn" href="http://localhost:${port}/users" target="_blank">ทดสอบ GET /users</a>
    </div>

    <div class="card">
      <div class="row"><span class="badge GET">GET</span><span class="url">/users</span></div>
      <div class="desc">ดึงข้อมูล user ทั้งหมด</div>
      <a class="btn" href="http://localhost:${port}/users" target="_blank">เปิดใน Browser</a>
    </div>

    <div class="card">
      <div class="row"><span class="badge GET">GET</span><span class="url">/users/email/:email</span></div>
      <div class="desc">ดึงข้อมูลผู้ใช้จาก email</div>
      <div class="label">ตัวอย่าง:</div>
      <div class="body-box">GET /users/email/somchai@dpu.ac.th</div>
      <a class="btn" href="http://localhost:${port}/users/email/somchai@dpu.ac.th" target="_blank">ทดสอบ</a>
    </div>

    <div class="card">
      <div class="row"><span class="badge PUT">PUT</span><span class="url">/user/:id</span></div>
      <div class="desc">แก้ไขข้อมูล user ตาม Userid</div>
      <div class="label">Request Body:</div>
      <div class="body-box">{ "name": "สมชาย ใหม่", "email": "new@dpu.ac.th" }</div>
    </div>

    <div class="card">
      <div class="row"><span class="badge DELETE">DELETE</span><span class="url">/users/:id</span></div>
      <div class="desc">ลบข้อมูลผู้ใช้ตาม Userid</div>
    </div>
  </div>

  <div class="group">
    <div class="group-title">📝 POST</div>

    <div class="card">
      <div class="row"><span class="badge POST">POST</span><span class="url">/posts</span></div>
      <div class="desc">สร้างโพสต์ใหม่ (ต้องมี authorId ของ User)</div>
      <div class="label">Request Body:</div>
      <div class="body-box">{ "title": "หัวข้อ", "content": "เนื้อหา", "authorId": "&lt;Userid&gt;" }</div>
    </div>

    <div class="card">
      <div class="row"><span class="badge GET">GET</span><span class="url">/posts</span></div>
      <div class="desc">ดึงข้อมูลโพสต์ทั้งหมด (รวมข้อมูล author)</div>
      <a class="btn" href="http://localhost:${port}/posts" target="_blank">เปิดใน Browser</a>
    </div>

    <div class="card">
      <div class="row"><span class="badge GET">GET</span><span class="url">/posts/:id</span></div>
      <div class="desc">ดึงข้อมูลโพสต์รายการเดียวจาก postId</div>
      <div class="label">ตัวอย่าง:</div>
      <div class="body-box">GET /posts/&lt;postId&gt;</div>
    </div>

    <div class="card">
      <div class="row"><span class="badge PUT">PUT</span><span class="url">/posts/:id</span></div>
      <div class="desc">อัปเดตข้อมูลโพสต์ตาม postId</div>
      <div class="label">Request Body:</div>
      <div class="body-box">{ "title": "แก้ไข", "content": "ใหม่", "published": true }</div>
    </div>

    <div class="card">
      <div class="row"><span class="badge DELETE">DELETE</span><span class="url">/posts/:id</span></div>
      <div class="desc">ลบข้อมูลโพสต์ตาม postId</div>
    </div>
  </div>
</body>
</html>`);
});

// ==================== USER ====================

// POST /user — สร้าง user ใหม่
app.post('/user', async (req, res) => {
    const { name, email } = req.body;
    try {
        const user = await prisma.user.create({
            data: { name, email },
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// GET /users — ดึงข้อมูล users ทั้งหมด
app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// GET /users/email/:email — ดึงข้อมูลผู้ใช้จาก email (Workshop 7)
app.get('/users/email/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// PUT /user/:id — แก้ไขข้อมูล user
app.put('/user/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const user = await prisma.user.update({
            where: { Userid: id },
            data: { name, email },
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// DELETE /users/:id — ลบข้อมูลผู้ใช้ตาม id (Workshop 7)
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({
            where: { Userid: id },
        });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// ==================== POST ====================

// POST /posts — สร้างโพสต์ใหม่ (Workshop 7)
app.post('/posts', async (req, res) => {
    const { title, content, authorId } = req.body;
    try {
        const post = await prisma.post.create({
            data: { title, content, authorId },
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// GET /posts — ดึงข้อมูลโพสต์ทั้งหมด (Workshop 7)
app.get('/posts', async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: { author: true }, // รวมข้อมูล user ของแต่ละ post
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// GET /posts/:id — ดึงข้อมูลโพสต์รายการเดียวจาก id (Workshop 7)
app.get('/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const post = await prisma.post.findUnique({
            where: { postId: id },
            include: { author: true },
        });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

// PUT /posts/:id — อัปเดตข้อมูลโพสต์ตาม id (Workshop 7)
app.put('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, published } = req.body;
    try {
        const post = await prisma.post.update({
            where: { postId: id },
            data: { title, content, published },
        });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
    }
});

// DELETE /posts/:id — ลบข้อมูลโพสต์ตาม id (Workshop 7)
app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.post.delete({
            where: { postId: id },
        });
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
