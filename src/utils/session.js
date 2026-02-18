// ==========================================================================
// PAIDEIA — Session Manager
// Gestión de sesiones de clase
// ==========================================================================

import { createSession, getSession, updateSession } from './storage.js';

// Generate a 4-letter Greek-themed code
const GREEK_LETTERS = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ';
const LATIN_MAP = 'ABGDEZHTIKLMNXOPRSTYFCQW';

export function generateCode() {
    let code = '';
    for (let i = 0; i < 4; i++) {
        const idx = Math.floor(Math.random() * LATIN_MAP.length);
        code += LATIN_MAP[idx];
    }
    return code;
}

export function generateGreekCode(latinCode) {
    return latinCode.split('').map(char => {
        const idx = LATIN_MAP.indexOf(char);
        return idx >= 0 ? GREEK_LETTERS[idx] : char;
    }).join('');
}

export function startSession(topic, activeTools) {
    const code = generateCode();
    const session = {
        code,
        topic,
        activeTools,
        createdAt: new Date().toISOString(),
        active: true,
        tools: {},
    };
    return createSession(session);
}

export function joinSession(code) {
    const session = getSession(code.toUpperCase());
    if (!session || !session.active) return null;
    return session;
}

export function endSession(code) {
    return updateSession(code, { active: false, endedAt: new Date().toISOString() });
}

// ── Persistent session state ──────────────────────────────────────────────
// Use sessionStorage so it survives page refresh but not tab close

const SESSION_KEY = 'paideia_current_session';
const ROLE_KEY = 'paideia_current_role';
const STUDENT_NAME_KEY = 'paideia_student_name';
const STUDENT_ID_KEY = 'paideia_student_id';

export function setCurrentSession(session, role) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    sessionStorage.setItem(ROLE_KEY, role);
}

export function getCurrentSession() {
    try {
        const data = sessionStorage.getItem(SESSION_KEY);
        if (!data) return null;
        const session = JSON.parse(data);
        // Always refresh from localStorage for latest data
        const fresh = getSession(session.code);
        if (fresh) {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(fresh));
            return fresh;
        }
        return session;
    } catch {
        return null;
    }
}

export function getCurrentRole() {
    return sessionStorage.getItem(ROLE_KEY) || null;
}

export function isTeacher() {
    return getCurrentRole() === 'teacher';
}

export function clearCurrentSession() {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(ROLE_KEY);
    sessionStorage.removeItem(STUDENT_NAME_KEY);
    sessionStorage.removeItem(STUDENT_ID_KEY);
}

// ── Student identity ──────────────────────────────────────────────────────
export function setStudentName(name) {
    sessionStorage.setItem(STUDENT_NAME_KEY, name);
}

export function getStudentName() {
    return sessionStorage.getItem(STUDENT_NAME_KEY) || 'Anónimo';
}

// Generate a unique student ID per session tab
export function getStudentId() {
    let id = sessionStorage.getItem(STUDENT_ID_KEY);
    if (!id) {
        id = 'stu_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
        sessionStorage.setItem(STUDENT_ID_KEY, id);
    }
    return id;
}
