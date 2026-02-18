// ==========================================================================
// PAIDEIA — Storage Utility
// Persistencia en localStorage
// ==========================================================================

const STORAGE_KEY = 'paideia_data';

function getAll() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : { sessions: {} };
    } catch {
        return { sessions: {} };
    }
}

function saveAll(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getSessions() {
    return getAll().sessions;
}

export function getSession(code) {
    return getAll().sessions[code] || null;
}

export function createSession(session) {
    const data = getAll();
    data.sessions[session.code] = session;
    saveAll(data);
    return session;
}

export function updateSession(code, updates) {
    const data = getAll();
    if (data.sessions[code]) {
        data.sessions[code] = { ...data.sessions[code], ...updates };
        saveAll(data);
    }
    return data.sessions[code];
}

export function addToolEntry(code, toolName, entry) {
    const data = getAll();
    const session = data.sessions[code];
    if (!session) return;

    if (!session.tools) session.tools = {};
    if (!session.tools[toolName]) session.tools[toolName] = [];

    session.tools[toolName].push({
        ...entry,
        timestamp: new Date().toISOString(),
    });

    saveAll(data);
    return session.tools[toolName];
}

export function getToolEntries(code, toolName) {
    const session = getSession(code);
    if (!session || !session.tools) return [];
    return session.tools[toolName] || [];
}

// Update a specific entry in a tool's data by index
export function updateToolEntry(code, toolName, index, updates) {
    const data = getAll();
    const session = data.sessions[code];
    if (!session || !session.tools || !session.tools[toolName]) return;

    if (session.tools[toolName][index]) {
        session.tools[toolName][index] = {
            ...session.tools[toolName][index],
            ...updates,
        };
        saveAll(data);
    }
}

export function clearAll() {
    localStorage.removeItem(STORAGE_KEY);
}
