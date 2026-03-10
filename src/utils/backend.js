// ==========================================================================
// PAIDEIA — Backend Adapter
// Abstracts Supabase vs Local Socket.io logic
// ==========================================================================

import { io } from "socket.io-client";
import { supabase, waitForSupabaseAuth, getSupabaseAuthError } from './supabase.js';

// Detection heuristic: 
// 1. Explicit ?mode=local param
// 2. Running on localhost:3000 (prod build served by server/index.mjs)
// 3. Running on local IP (LAN access)
const urlParams = new URLSearchParams(window.location.search);
const forceLocal = urlParams.get('mode') === 'local';

// Se deshabilita la detección automática de red local para asegurar
// que toda la aplicación se conecte siempre a la nube (Supabase).
const isLocalServer = forceLocal;

// Initialize Socket only if in local mode
let socket = null;
if (isLocalServer) {
    console.log('🔌 Paideia running in LOCAL LAN MODE');

    // If we are in dev mode (port 5173) but forced local, we need to connect to port 3000
    // Otherwise (port 3000 or IP), we connect to relative path (default)
    if (window.location.port === '5173') {
        socket = io("https://localhost:3000", {
            rejectUnauthorized: false  // Accept self-signed cert
        });
    } else {
        socket = io(); // Connect to same origin (https://)
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
        ? 'https://localhost:3000'
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
    mode: isLocalServer ? 'LOCAL' : 'SUPABASE',

    // Network URL to use in QR codes (shows the real LAN IP, not localhost)
    get networkUrl() { return _networkUrl; },

    async get(path) {
        if (this.mode === 'SUPABASE') {
            await ensureCloudAuth();
            return getSupabasePath(path);
        } else {
            // Socket.io request-response pattern
            return new Promise((resolve) => {
                const requestId = Date.now() + Math.random();

                const timeoutId = setTimeout(() => {
                    console.warn(`Timeout waiting for db:get response for path: ${path}`);
                    resolve(null);
                }, 5000);

                socket.emit('db:get', { path, requestId });
                socket.once(`db:get:response:${requestId}`, (data) => {
                    clearTimeout(timeoutId);
                    resolve(data);
                });
            });
        }
    },

    async set(path, data) {
        if (this.mode === 'SUPABASE') {
            await ensureCloudAuth();
            return setSupabasePath(path, data);
        } else {
            socket.emit('db:set', { path, data });
            return Promise.resolve();
        }
    },

    async update(path, data) {
        if (this.mode === 'SUPABASE') {
            await ensureCloudAuth();
            return updateSupabasePath(path, data);
        } else {
            // Reuse set logic for now, or implement specific update in server
            socket.emit('db:update', { path, updates: data });
            return Promise.resolve();
        }
    },

    // Subscription
    // Note: This is an abstraction of onValue
    subscribe(path, callback) {
        if (this.mode === 'SUPABASE') {
            let unsubscribe = () => {};
            let isActive = true;

            ensureCloudAuth()
                .then(async () => {
                    if (!isActive) return;

                    callback(await getSupabasePath(path));

                    const descriptor = parseSupabasePath(path);
                    if (!descriptor.code) return;

                    const channels = [];
                    const notify = async () => {
                        if (!isActive) return;
                        callback(await getSupabasePath(path));
                    };

                    if (descriptor.kind === 'session') {
                        channels.push(
                            supabase
                                .channel(`session:${descriptor.code}:${Math.random().toString(36).slice(2, 8)}`)
                                .on(
                                    'postgres_changes',
                                    {
                                        event: '*',
                                        schema: 'public',
                                        table: 'sessions',
                                        filter: `code=eq.${descriptor.code}`,
                                    },
                                    notify
                                )
                                .subscribe()
                        );
                    } else if (descriptor.kind === 'tools') {
                        channels.push(
                            supabase
                                .channel(`tools:${descriptor.code}:${Math.random().toString(36).slice(2, 8)}`)
                                .on(
                                    'postgres_changes',
                                    {
                                        event: '*',
                                        schema: 'public',
                                        table: 'tool_entries',
                                        filter: `session_code=eq.${descriptor.code}`,
                                    },
                                    notify
                                )
                                .subscribe()
                        );
                    } else {
                        channels.push(
                            supabase
                                .channel(`tool:${descriptor.code}:${descriptor.toolName}:${Math.random().toString(36).slice(2, 8)}`)
                                .on(
                                    'postgres_changes',
                                    {
                                        event: '*',
                                        schema: 'public',
                                        table: 'tool_entries',
                                        filter: `session_code=eq.${descriptor.code}`,
                                    },
                                    async (payload) => {
                                        if (payload.new?.tool_name && payload.new.tool_name !== descriptor.toolName) return;
                                        if (payload.old?.tool_name && payload.old.tool_name !== descriptor.toolName) return;
                                        await notify();
                                    }
                                )
                                .subscribe()
                        );
                    }

                    unsubscribe = async () => {
                        await Promise.all(channels.map((channel) => supabase.removeChannel(channel)));
                    };
                })
                .catch((error) => {
                    console.error(error);
                });

            return () => {
                isActive = false;
                void unsubscribe();
            };
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
    ,

    async insertToolEntry(code, toolName, entry) {
        if (this.mode === 'SUPABASE') {
            await ensureCloudAuth();
            return insertSupabaseToolEntry(code, toolName, entry);
        }

        socket.emit('db:set', { path: `sessions/${code}/tools/${toolName}`, data: entry });
        return Promise.resolve(entry);
    },

    async updateToolEntry(code, toolName, entryId, updates) {
        if (this.mode === 'SUPABASE') {
            await ensureCloudAuth();
            return updateSupabaseToolEntry(code, toolName, entryId, updates);
        }

        socket.emit('db:update', { path: `sessions/${code}/tools/${toolName}/${entryId}`, updates });
        return Promise.resolve(updates);
    },

    async listToolEntries(code, toolName) {
        if (this.mode === 'SUPABASE') {
            await ensureCloudAuth();
            return fetchToolEntries(code, toolName);
        }

        return this.get(`sessions/${code}/tools/${toolName}`);
    },

    async listAllToolEntries(code) {
        if (this.mode === 'SUPABASE') {
            await ensureCloudAuth();
            return fetchAllToolEntries(code);
        }

        return this.get(`sessions/${code}/tools`);
    }
};

function activePathsMatch(d1, d2) {
    return d1.startsWith(d2) || d2.startsWith(d1);
}

async function ensureCloudAuth() {
    const isAuthenticated = await waitForSupabaseAuth();
    if (isAuthenticated) return;

    const authError = getSupabaseAuthError();
    if (authError) throw authError;
    throw new Error('Supabase authentication is not ready');
}

async function getSupabasePath(path) {
    const descriptor = parseSupabasePath(path);
    const session = await fetchSessionRow(descriptor.code);

    if (!session) return null;

    if (descriptor.kind === 'session') return session;
    if (descriptor.kind === 'tools') return fetchAllToolEntries(descriptor.code);

    const entries = await fetchToolEntries(descriptor.code, descriptor.toolName);
    if (descriptor.kind === 'toolEntries') {
        return entries;
    }

    return entries[descriptor.index] || null;
}

async function setSupabasePath(path, data) {
    const descriptor = parseSupabasePath(path);

    if (descriptor.kind === 'session') {
        const row = mapSessionToRow(data);
        const { error } = await supabase.from('sessions').upsert(row, { onConflict: 'code' });
        if (error) throw error;
        return data;
    }
    throw new Error(`Unsupported set path in Supabase backend: ${path}`);
}

async function updateSupabasePath(path, data) {
    const descriptor = parseSupabasePath(path);

    if (descriptor.kind !== 'session') {
        return setSupabasePath(path, data);
    }

    const { error } = await supabase
        .from('sessions')
        .update(mapPartialSessionToRow(data))
        .eq('code', descriptor.code);
    if (error) throw error;

    return data;
}

function parseSupabasePath(path) {
    const parts = path.split('/').filter(Boolean);
    if (parts[0] !== 'sessions' || !parts[1]) {
        throw new Error(`Unsupported backend path: ${path}`);
    }

    const descriptor = {
        code: parts[1].toUpperCase(),
        kind: 'session',
        toolName: null,
        index: null,
    };

    if (!parts[2]) {
        return descriptor;
    }

    if (parts[2] !== 'tools') {
        throw new Error(`Unsupported backend path: ${path}`);
    }

    descriptor.kind = 'tools';
    if (!parts[3]) {
        return descriptor;
    }

    descriptor.toolName = parts[3];
    descriptor.kind = 'toolEntries';

    if (parts[4] === undefined) {
        return descriptor;
    }

    descriptor.index = Number(parts[4]);
    descriptor.kind = 'toolEntry';
    return descriptor;
}

async function fetchSessionRow(code) {
    const { data, error } = await supabase
        .from('sessions')
        .select('code, topic, active_tools, created_at, active, ended_at')
        .eq('code', code)
        .maybeSingle();

    if (error) throw error;
    return data ? mapRowToSession(data) : null;
}

function mapRowToSession(row) {
    return {
        code: row.code,
        topic: row.topic,
        activeTools: Array.isArray(row.active_tools) ? row.active_tools : [],
        createdAt: row.created_at,
        active: row.active,
        endedAt: row.ended_at || undefined,
        tools: {},
    };
}

function mapSessionToRow(session) {
    return {
        code: session.code,
        topic: session.topic,
        active_tools: session.activeTools || [],
        created_at: session.createdAt,
        active: session.active,
        ended_at: session.endedAt || null,
    };
}

function mapPartialSessionToRow(session) {
    const updates = {};

    if ('topic' in session) updates.topic = session.topic;
    if ('activeTools' in session) updates.active_tools = session.activeTools || [];
    if ('createdAt' in session) updates.created_at = session.createdAt;
    if ('active' in session) updates.active = session.active;
    if ('endedAt' in session) updates.ended_at = session.endedAt || null;

    return updates;
}

async function insertSupabaseToolEntry(code, toolName, entry) {
    const { data, error } = await supabase
        .from('tool_entries')
        .insert({
            session_code: code,
            tool_name: toolName,
            entry,
        })
        .select('id, entry, created_at')
        .single();

    if (error) throw error;
    return mapToolEntryRow(data);
}

async function updateSupabaseToolEntry(code, toolName, entryId, updates) {
    const { data: existing, error: existingError } = await supabase
        .from('tool_entries')
        .select('id, session_code, tool_name, entry, created_at')
        .eq('id', entryId)
        .eq('session_code', code)
        .eq('tool_name', toolName)
        .single();

    if (existingError) throw existingError;

    const mergedEntry = {
        ...(existing.entry || {}),
        ...updates,
    };

    const { data, error } = await supabase
        .from('tool_entries')
        .update({ entry: mergedEntry })
        .eq('id', entryId)
        .eq('session_code', code)
        .eq('tool_name', toolName)
        .select('id, entry, created_at')
        .single();

    if (error) throw error;
    return mapToolEntryRow(data);
}

async function fetchToolEntries(code, toolName) {
    const { data, error } = await supabase
        .from('tool_entries')
        .select('id, entry, created_at')
        .eq('session_code', code)
        .eq('tool_name', toolName)
        .order('created_at', { ascending: true })
        .order('id', { ascending: true });

    if (error) throw error;
    return Array.isArray(data) ? data.map(mapToolEntryRow) : [];
}

async function fetchAllToolEntries(code) {
    const { data, error } = await supabase
        .from('tool_entries')
        .select('id, tool_name, entry, created_at')
        .eq('session_code', code)
        .order('created_at', { ascending: true })
        .order('id', { ascending: true });

    if (error) throw error;

    const grouped = {};
    for (const row of data || []) {
        if (!grouped[row.tool_name]) {
            grouped[row.tool_name] = [];
        }
        grouped[row.tool_name].push(mapToolEntryRow(row));
    }

    return grouped;
}

function mapToolEntryRow(row) {
    return {
        ...(row.entry || {}),
        timestamp: row.entry?.timestamp || row.created_at,
        _rowId: row.id,
    };
}
