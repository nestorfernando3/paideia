// ==========================================================================
// PAIDEIA — Backend Adapter
// Abstracts Firebase vs Local Socket.io logic
// ==========================================================================

import { io } from "socket.io-client";
import { db, ref, get, set, update, onValue } from './firebase.js'; // Fallback to firebase imports

// Detection heuristic: 
// If running on localhost:3000 (production build served locally) -> LOCAL MODE
// If running on localhost:5173 (dev) -> FIREBASE MODE (usually)
// If running on github.io -> FIREBASE MODE

const isLocalServer =
    window.location.hostname === 'localhost' && window.location.port !== '5173' ||
    window.location.hostname.startsWith('192.168.') ||
    window.location.hostname.startsWith('10.');

// Initialize Socket only if in local mode
let socket = null;
if (isLocalServer) {
    console.log('🔌 Paideia running in LOCAL LAN MODE');
    socket = io(); // Connect to same origin

    socket.on('connect', () => {
        console.log('✅ Connected to Local Server', socket.id);
    });
}

export const backend = {
    mode: isLocalServer ? 'LOCAL' : 'FIREBASE',

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
