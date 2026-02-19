// ==========================================================================
// PAIDEIA — Storage Utility
// Persistencia híbrida: Firebase (nube) + localStorage (fallback)
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
        // Update local cache
        const data = getLocal();
        data.sessions[code] = session;
        saveLocal(data);
        return session;
    }
    return getLocal().sessions[code] || null;
}

export function createSession(session) {
    // Save locally first (synchronous)
    const data = getLocal();
    data.sessions[session.code] = session;
    saveLocal(data);

    // Then sync to Backend (async, fire-and-forget)
    backend.set(`sessions/${session.code}`, session);

    return session;
}

export function updateSession(code, updates) {
    const data = getLocal();
    if (data.sessions[code]) {
        data.sessions[code] = { ...data.sessions[code], ...updates };
        saveLocal(data);
        backend.update(`sessions/${code}`, updates);
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

    // Sync to Backend
    // Note: We overwrite the array to ensure consistency
    backend.set(`sessions/${code}/tools/${toolName}`, session.tools[toolName]);

    return session.tools[toolName];
}

export function getToolEntries(code, toolName) {
    const session = getSession(code);
    if (!session || !session.tools) return [];
    return session.tools[toolName] || [];
}

// Async version that fetches from Backend
export async function getToolEntriesAsync(code, toolName) {
    const entries = await backend.get(`sessions/${code}/tools/${toolName}`);
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
    return getToolEntries(code, toolName);
}

export async function getAllToolEntriesAsync(code) {
    const toolsSnapshot = await backend.get(`sessions/${code}/tools`);
    if (toolsSnapshot) {
        // Update local cache for all tools
        const data = getLocal();
        if (data.sessions[code]) {
            data.sessions[code].tools = toolsSnapshot;
            saveLocal(data);
        }
        return toolsSnapshot;
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
        backend.set(`sessions/${code}/tools/${toolName}/${index}`, session.tools[toolName][index]);
    }
}

export function clearAll() {
    localStorage.removeItem(STORAGE_KEY);
}
