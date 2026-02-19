// ==========================================================================
// PAIDEIA — Backend Adapter
// Abstracts Firebase vs Local Socket.io logic
// ==========================================================================

import { io } from "socket.io-client";
import { db, ref, get, set, update, onValue } from './firebase.js'; // Fallback to firebase imports

// Detection heuristic: 
// 1. Explicit ?mode=local param
// 2. Running on localhost:3000 (prod build served by server/index.mjs)
// 3. Running on local IP (LAN access)
const urlParams = new URLSearchParams(window.location.search);
const forceLocal = urlParams.get('mode') === 'local';

const isLocalServer =
    forceLocal ||
    (window.location.hostname === 'localhost' && window.location.port === '3000') ||
    window.location.hostname.startsWith('192.168.') ||
    window.location.hostname.startsWith('10.');

// Initialize Socket only if in local mode
let socket = null;
if (isLocalServer) {
    console.log('🔌 Paideia running in LOCAL LAN MODE');

    // If we are in dev mode (port 5173) but forced local, we need to connect to port 3000
    // Otherwise (port 3000 or IP), we connect to relative path (default)
    if (window.location.port === '5173') {
        socket = io("http://localhost:3000");
    } else {
        socket = io(); // Connect to same origin
    }

    socket.on('connect', () => {
        console.log('✅ Connected to Local Server', socket.id);
    });
}

// Network URL for QR codes (fetched from /api/info in Local Mode)
let _networkUrl = window.location.origin; // fallback

if (isLocalServer) {
    // Determine the base url of the server (same host, port 3000)
    const serverBase = window.location.port === '5173'
        ? 'http://localhost:3000'
        : window.location.origin;

    fetch(`${serverBase}/api/info`)
        .then(r => r.json())
        .then(info => {
            _networkUrl = info.networkUrl;
            console.log('📡 Network URL for QR:', _networkUrl);
        })
        .catch(() => {
            console.warn('Could not fetch /api/info, using origin as fallback');
        });
}

export const backend = {
    mode: isLocalServer ? 'LOCAL' : 'FIREBASE',

    // Network URL to use in QR codes (shows the real LAN IP, not localhost)
    get networkUrl() { return _networkUrl; },

    async get(path) {
        if (this.mode === 'FIREBASE') {
            try {
                const snapshot = await get(ref(db, path));
                return snapshot.exists() ? snapshot.val() : null;
            } catch (e) {
                console.error(e);
                return null;
            }
        } else {
            // Socket.io request-response pattern
            return new Promise((resolve) => {
                const requestId = Date.now() + Math.random();
                socket.emit('db:get', { path, requestId });
                socket.once(`db:get:response:${requestId}`, (data) => {
                    resolve(data);
                });
                // Timeout fallback?
                setTimeout(() => resolve(null), 2000);
            });
        }
    },

    async set(path, data) {
        if (this.mode === 'FIREBASE') {
            return set(ref(db, path), data);
        } else {
            socket.emit('db:set', { path, data });
            return Promise.resolve();
        }
    },

    async update(path, data) {
        if (this.mode === 'FIREBASE') {
            return update(ref(db, path), data);
        } else {
            // Reuse set logic for now, or implement specific update in server
            socket.emit('db:update', { path, updates: data });
            return Promise.resolve();
        }
    },

    // Subscription
    // Note: This is an abstraction of onValue
    subscribe(path, callback) {
        if (this.mode === 'FIREBASE') {
            return onValue(ref(db, path), (snapshot) => {
                callback(snapshot.exists() ? snapshot.val() : null);
            });
        } else {
            // Local mode subscription
            // 1. Join the session room if the path implies a session
            // Path format: sessions/CODE/...
            const parts = path.split('/');
            if (parts[0] === 'sessions' && parts[1]) {
                const code = parts[1];
                socket.emit('join-room', code);
            }

            // 2. Listener
            const listener = ({ path: updatePath, data }) => {
                // Check if update affects our subscribed path
                if (activePathsMatch(path, updatePath)) {
                    // In a real app we would traverse the data to find the exact node
                    // For now, we assume the server broadcasts the exact node changed or parent
                    // This is a naive implementation

                    // If exact match
                    if (path === updatePath) {
                        callback(data);
                    }
                    // If parent changed (e.g. sessions/ABCD changed, we want sessions/ABCD/tools)
                    else if (path.startsWith(updatePath)) {
                        // We need to re-fetch or extract. Re-fetching is safer for this prototype
                        this.get(path).then(callback);
                    }
                    // If child changed (e.g. sessions/ABCD/tools/gnosis changed, we want sessions/ABCD)
                    else if (updatePath.startsWith(path)) {
                        // Re-fetch whole object
                        this.get(path).then(callback);
                    }
                }
            };

            socket.on('db:update', listener);

            // Initial fetch
            this.get(path).then(callback);

            // Return unsubscribe function
            return () => socket.off('db:update', listener);
        }
    }
};

function activePathsMatch(d1, d2) {
    return d1.startsWith(d2) || d2.startsWith(d1);
}
