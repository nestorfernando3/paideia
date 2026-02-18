// ==========================================================================
// PAIDEIA — Firebase Configuration
// Conexión a Firebase Realtime Database
// ==========================================================================

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, update, onValue, child } from 'firebase/database';

// ── Firebase Config ───────────────────────────────────────────────────────
// IMPORTANT: Replace this config with your own Firebase project config.
// Go to https://console.firebase.google.com → Create project → 
// Project settings → Your apps → Web → Copy config
const firebaseConfig = {
    apiKey: "AIzaSyCibCoy1FVE_fvRF9PAhfCP2JqmYEfy-uA",
    authDomain: "paideia-app.firebaseapp.com",
    databaseURL: "https://paideia-app-default-rtdb.firebaseio.com",
    projectId: "paideia-app",
    storageBucket: "paideia-app.firebasestorage.app",
    messagingSenderId: "897054914699",
    appId: "1:897054914699:web:605e15818e82217fbe7c8e",
};

import { getAuth, signInAnonymously } from 'firebase/auth';

let app = null;
let db = null;
let auth = null;

try {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    auth = getAuth(app);

    // Auto sign-in anonymously
    signInAnonymously(auth).then(() => {
        console.log('Signed in anonymously to Firebase');
    }).catch((error) => {
        console.error('Error signing in anonymously:', error);
    });
} catch (err) {
    console.warn('Firebase not configured — using localStorage fallback', err);
}

export function isFirebaseReady() {
    return db !== null && !firebaseConfig.apiKey.startsWith('FIREBASE_');
}

export { db, auth, ref, set, get, update, onValue, child };
