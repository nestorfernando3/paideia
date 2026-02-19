import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import ip from 'ip';
import cors from 'cors';

// Basic setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

const app = express();
const httpServer = createServer(app);

// Enable CORS for development
app.use(cors());

// Serve static files from the dist directory under the build base path
const distPath = path.join(__dirname, '../dist');
app.use('/paideia', express.static(distPath));

// Redirect root to /paideia/
app.get('/', (req, res) => {
    res.redirect('/paideia/');
});

// API: Server info (used by the frontend in Local Mode to get the network URL for QR codes)
app.get('/api/info', (req, res) => {
    res.json({
        mode: 'LOCAL',
        ip: ip.address(),
        port: PORT,
        networkUrl: `http://${ip.address()}:${PORT}`
    });
});

// Socket.io setup
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173", "*"], // Allow connections from Vite dev server and others
        methods: ["GET", "POST"],
        credentials: true
    }
});

// In-memory database (ephemeral, resets on server restart)
const db = {
    sessions: {}
};

// Start server
httpServer.listen(PORT, '0.0.0.0', () => {
    const localIp = ip.address();
    console.log(`
  🚀 PAIDEIA LOCAL SERVER RUNNING!
  
  > Access locally:   http://localhost:${PORT}
  > Network access:   http://${localIp}:${PORT}
  
  Share the Network URL with your students so they can join!
  `);
});

// ── Socket.io Logic ────────────────────────────────────────────────────────
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a specific room (session code)
    socket.on('join-room', (room) => {
        socket.join(room);
        console.log(`Socket ${socket.id} joined room ${room}`);
    });

    // ── Database Operations (mimicking Firebase) ──

    // WRITES
    socket.on('db:set', ({ path, data }) => {
        // Simple path traversal: sessions/ABCD/tools/gnosis -> db.sessions.ABCD.tools.gnosis
        setDeep(db, path, data);

        // Broadcast update to everyone in the relevant session room
        // Extract session code from path (assumes path starts with "sessions/CODE/...")
        const parts = path.split('/');
        if (parts[0] === 'sessions' && parts[1]) {
            const code = parts[1];
            socket.to(code).emit('db:update', { path, data });
        }
    });

    socket.on('db:update', ({ path, updates }) => {
        const current = getDeep(db, path) || {};
        const newData = { ...current, ...updates };
        setDeep(db, path, newData);

        const parts = path.split('/');
        if (parts[0] === 'sessions' && parts[1]) {
            const code = parts[1];
            socket.to(code).emit('db:update', { path, data: newData });
        }
    });

    // READS
    socket.on('db:get', ({ path, requestId }) => {
        const data = getDeep(db, path);
        socket.emit(`db:get:response:${requestId}`, data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// ── Helpers ────────────────────────────────────────────────────────────────

function setDeep(obj, path, value) {
    const parts = path.split('/');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) current[part] = {};
        current = current[part];
    }
    current[parts[parts.length - 1]] = value;
}

function getDeep(obj, path) {
    const parts = path.split('/');
    let current = obj;
    for (const part of parts) {
        if (current === undefined || current === null) return null;
        current = current[part];
    }
    return current;
}
