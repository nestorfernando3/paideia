// ==========================================================================
// PAIDEIA — Storage Utility
// Persistencia híbrida: Firebase (nube) + localStorage (fallback)
// ==========================================================================

import { isFirebaseReady, db, ref, set, get, update, child } from './firebase.js';

const STORAGE_KEY = 'paideia_data';

// ── Local Storage helpers ─────────────────────────────────────────────────
function getLocal() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : { sessions: {} };
    } catch {
        return { sessions: {} };
    }
}

function saveLocal(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ── Firebase helpers ──────────────────────────────────────────────────────
async function fbGet(path) {
    try {
        const snapshot = await get(ref(db, path));
        return snapshot.exists() ? snapshot.val() : null;
    } catch (err) {
        console.warn('Firebase read failed:', err);
        return null;
    }
}

async function fbSet(path, value) {
    try {
        await set(ref(db, path), value);
    } catch (err) {
        console.warn('Firebase write failed:', err);
    }
}

async function fbUpdate(path, updates) {
    try {
        await update(ref(db, path), updates);
    } catch (err) {
        console.warn('Firebase update failed:', err);
    }
}

// ── Public API (all functions work both sync and async) ───────────────────

export function getSessions() {
    return getLocal().sessions;
}

export function getSession(code) {
    return getLocal().sessions[code] || null;
}

// Async version that checks Firebase first, then falls back to local
export async function getSessionAsync(code) {
    if (isFirebaseReady()) {
        const session = await fbGet(`sessions/${code}`);
        if (session) {
            // Update local cache
            const data = getLocal();
            data.sessions[code] = session;
            saveLocal(data);
            return session;
        }
    }
    return getLocal().sessions[code] || null;
}

export function createSession(session) {
    // Save locally first (synchronous)
    const data = getLocal();
    data.sessions[session.code] = session;
    saveLocal(data);

    // Then sync to Firebase (async, fire-and-forget)
    if (isFirebaseReady()) {
        fbSet(`sessions/${session.code}`, session);
    }

    return session;
}

export function updateSession(code, updates) {
    const data = getLocal();
    if (data.sessions[code]) {
        data.sessions[code] = { ...data.sessions[code], ...updates };
        saveLocal(data);

        if (isFirebaseReady()) {
            fbUpdate(`sessions/${code}`, updates);
        }
    }
    return data.sessions[code];
}

export function addToolEntry(code, toolName, entry) {
    const data = getLocal();
    const session = data.sessions[code];
    if (!session) return;

    if (!session.tools) session.tools = {};
    if (!session.tools[toolName]) session.tools[toolName] = [];

    const fullEntry = {
        ...entry,
        timestamp: new Date().toISOString(),
    };

    session.tools[toolName].push(fullEntry);
    saveLocal(data);

    // Sync to Firebase
    if (isFirebaseReady()) {
        fbSet(`sessions/${code}/tools/${toolName}`, session.tools[toolName]);
    }

    return session.tools[toolName];
}

export function getToolEntries(code, toolName) {
    const session = getSession(code);
    if (!session || !session.tools) return [];
    return session.tools[toolName] || [];
}

// Async version that fetches from Firebase
export async function getToolEntriesAsync(code, toolName) {
    if (isFirebaseReady()) {
        const entries = await fbGet(`sessions/${code}/tools/${toolName}`);
        if (entries) {
            // Update local cache
            const data = getLocal();
            if (data.sessions[code]) {
                if (!data.sessions[code].tools) data.sessions[code].tools = {};
                data.sessions[code].tools[toolName] = entries;
                saveLocal(data);
            }
            return Array.isArray(entries) ? entries : Object.values(entries);
        }
    }
    return getToolEntries(code, toolName);
}

export async function getAllToolEntriesAsync(code) {
    if (isFirebaseReady()) {
        const toolsSnapshot = await fbGet(`sessions/${code}/tools`);
        if (toolsSnapshot) {
            // Update local cache for all tools
            const data = getLocal();
            if (data.sessions[code]) {
                data.sessions[code].tools = toolsSnapshot;
                saveLocal(data);
            }
            return toolsSnapshot;
        }
    }
    return getSession(code)?.tools || {};
}

export function updateToolEntry(code, toolName, index, updates) {
    const data = getLocal();
    const session = data.sessions[code];
    if (!session || !session.tools || !session.tools[toolName]) return;

    if (session.tools[toolName][index]) {
        session.tools[toolName][index] = {
            ...session.tools[toolName][index],
            ...updates,
        };
        saveLocal(data);

        if (isFirebaseReady()) {
            fbSet(`sessions/${code}/tools/${toolName}/${index}`, session.tools[toolName][index]);
        }
    }
}

export function clearAll() {
    localStorage.removeItem(STORAGE_KEY);
}
