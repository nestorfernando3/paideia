// ==========================================================================
// PAIDEIA — Storage Utility
// Persistencia híbrida: Supabase (nube) + localStorage (fallback)
// ==========================================================================

import { backend } from './backend.js';

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

// ── Public API (all functions work both sync and async) ───────────────────

export function getSessions() {
    return getLocal().sessions;
}

export function getSession(code) {
    return getLocal().sessions[code] || null;
}

// Async version that checks Backend first, then falls back to local
export async function getSessionAsync(code) {
    const session = await backend.get(`sessions/${code}`);
    if (session) {
        cacheSession(code, session);
        return session;
    }
    return getLocal().sessions[code] || null;
}

export async function createSession(session) {
    await backend.set(`sessions/${session.code}`, session);

    cacheSession(session.code, session);

    return session;
}

export async function updateSession(code, updates) {
    const data = getLocal();
    const currentSession = data.sessions[code];

    if (currentSession) {
        const nextSession = { ...currentSession, ...updates };
        await backend.update(`sessions/${code}`, updates);
        cacheSession(code, nextSession);
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

    const insertedIndex = session.tools[toolName].length - 1;

    backend.insertToolEntry(code, toolName, fullEntry).then((remoteEntry) => {
        const freshData = getLocal();
        const freshSession = freshData.sessions[code];
        if (!freshSession?.tools?.[toolName]?.[insertedIndex]) return;
        freshSession.tools[toolName][insertedIndex] = remoteEntry;
        saveLocal(freshData);
    }).catch((error) => {
        console.error('Error syncing tool entries:', error);
    });

    return session.tools[toolName];
}

export function getToolEntries(code, toolName) {
    const session = getSession(code);
    if (!session || !session.tools) return [];
    return session.tools[toolName] || [];
}

// Async version that fetches from Backend
export async function getToolEntriesAsync(code, toolName) {
    const entries = await backend.listToolEntries(code, toolName);
    if (entries) {
        cacheToolEntries(code, toolName, Array.isArray(entries) ? entries : Object.values(entries));
        return Array.isArray(entries) ? entries : Object.values(entries);
    }
    return getToolEntries(code, toolName);
}

export async function getAllToolEntriesAsync(code) {
    const toolsSnapshot = await backend.listAllToolEntries(code);
    if (toolsSnapshot) {
        cacheAllToolEntries(code, toolsSnapshot);
        return toolsSnapshot;
    }
    return getSession(code)?.tools || {};
}

export function updateToolEntry(code, toolName, index, updates) {
    const data = getLocal();
    const session = data.sessions[code];
    if (!session || !session.tools || !session.tools[toolName]) return;

    if (session.tools[toolName][index]) {
        const currentEntry = session.tools[toolName][index];
        session.tools[toolName][index] = {
            ...currentEntry,
            ...updates,
        };
        saveLocal(data);

        if (!currentEntry._rowId) {
            return;
        }

        backend.updateToolEntry(code, toolName, currentEntry._rowId, updates).then((remoteEntry) => {
            const freshData = getLocal();
            const freshSession = freshData.sessions[code];
            if (!freshSession?.tools?.[toolName]?.[index]) return;
            freshSession.tools[toolName][index] = remoteEntry;
            saveLocal(freshData);
        }).catch((error) => {
            console.error('Error syncing tool entry:', error);
        });
    }
}

export function subscribeSession(code, callback) {
    return backend.subscribe(`sessions/${code}`, (session) => {
        if (session) {
            cacheSession(code, session);
        }
        callback(session);
    });
}

export function subscribeToolEntries(code, toolName, callback) {
    return backend.subscribe(`sessions/${code}/tools/${toolName}`, (entries) => {
        const normalizedEntries = Array.isArray(entries) ? entries : [];
        cacheToolEntries(code, toolName, normalizedEntries);
        callback(normalizedEntries);
    });
}

export function clearAll() {
    localStorage.removeItem(STORAGE_KEY);
}

function cacheSession(code, session) {
    const data = getLocal();
    const previousTools = data.sessions[code]?.tools || {};
    data.sessions[code] = {
        ...session,
        tools: session.tools && Object.keys(session.tools).length > 0 ? session.tools : previousTools,
    };
    saveLocal(data);
}

function cacheToolEntries(code, toolName, entries) {
    const data = getLocal();
    if (!data.sessions[code]) {
        data.sessions[code] = {
            code,
            topic: '',
            activeTools: [],
            createdAt: new Date().toISOString(),
            active: true,
            tools: {},
        };
    }

    if (!data.sessions[code].tools) {
        data.sessions[code].tools = {};
    }

    data.sessions[code].tools[toolName] = entries;
    saveLocal(data);
}

function cacheAllToolEntries(code, toolsSnapshot) {
    const data = getLocal();
    if (!data.sessions[code]) {
        data.sessions[code] = {
            code,
            topic: '',
            activeTools: [],
            createdAt: new Date().toISOString(),
            active: true,
            tools: {},
        };
    }

    data.sessions[code].tools = toolsSnapshot;
    saveLocal(data);
}
