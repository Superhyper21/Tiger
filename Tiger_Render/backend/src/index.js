
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 4000;
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

// Serve static web client
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Simple API routes
app.post('/api/pair', (req, res) => {
  const { deviceId, name } = req.body;
  if (!deviceId) return res.status(400).json({ error: 'deviceId required' });
  return res.json({ ok: true, deviceId, name });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  const deviceId = req.query.deviceId;
  if (!req.file) return res.status(400).json({ error: 'No file' });
  if (deviceId) io.to(deviceId).emit('file:uploaded', { deviceId, file: { name: req.file.filename, url: `/uploads/${req.file.filename}` }});
  res.json({ ok: true, file: { name: req.file.filename, path: `/uploads/${req.file.filename}` }});
});

app.post('/api/sms/send', (req, res) => {
  const { to, message, deviceId } = req.body;
  if (deviceId) io.to(deviceId).emit('sms:received', { to, message, deviceId, from: 'SIM-PLACEHOLDER' });
  res.json({ ok: true, queued: true });
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('pair', (data) => {
    if (data && data.deviceId) {
      socket.join(data.deviceId);
      console.log('Paired', data.deviceId);
    }
  });
  socket.on('notification', (payload) => {
    if (payload && payload.deviceId) io.to(payload.deviceId).emit('notification', payload);
  });
  socket.on('disconnect', ()=>{});
});

server.listen(PORT, ()=>console.log('Tiger single-app running on', PORT));
