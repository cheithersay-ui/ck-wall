const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Config
const CLOUD_NAME = process.env.CLOUD_NAME || 'ddmguyzb7';
const UPLOAD_PRESET = process.env.UPLOAD_PRESET || 'Confidential Kitchen';
const PORT = process.env.PORT || 3000;

// In-memory store of all doodled images (base64 data URLs)
// In production you could persist these, but for a single event this is fine
let gallery = [];

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '20mb' }));

// Get config (so frontend knows Cloudinary details)
app.get('/api/config', (req, res) => {
  res.json({ cloudName: CLOUD_NAME, uploadPreset: UPLOAD_PRESET });
});

// Get a random photo to doodle on (from Cloudinary uploads, not doodled ones)
// We store original upload URLs separately
let originals = [];

app.post('/api/uploaded', (req, res) => {
  const { url } = req.body;
  if (url) {
    originals.push(url);
    io.emit('original-count', originals.length);
  }
  res.json({ ok: true });
});

app.get('/api/random-photo', (req, res) => {
  if (originals.length === 0) {
    return res.json({ url: null });
  }
  const url = originals[Math.floor(Math.random() * originals.length)];
  res.json({ url });
});

// Submit a doodled image
app.post('/api/submit-doodle', (req, res) => {
  const { dataUrl } = req.body;
  if (dataUrl) {
    gallery.push({
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      dataUrl,
      timestamp: Date.now()
    });
    // Broadcast to all gallery viewers
    io.emit('new-doodle', gallery[gallery.length - 1]);
  }
  res.json({ ok: true });
});

// Get all gallery items (for initial load)
app.get('/api/gallery', (req, res) => {
  res.json(gallery);
});

// Socket.IO for real-time gallery updates
io.on('connection', (socket) => {
  socket.emit('original-count', originals.length);
});

server.listen(PORT, () => {
  console.log(`CK Wall running on port ${PORT}`);
});
