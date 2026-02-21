import { app, BrowserWindow, shell, session } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// Accept self-signed certificate from local server
app.commandLine.appendSwitch('ignore-certificate-errors');

// Import server to start it automatically
// Note: In production, we need to ensure this path resolves correctly
import '../server/index.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js') // Optional, good practice
        },
        title: "Paideia - Servidor Local",
        icon: path.join(__dirname, '../public/favicon.ico') // Attempt to load icon
    });

    // Load the local server URL
    // The server starts on port 3000 by default from server/index.mjs
    const PORT = process.env.PORT || 3000;
    const targetUrl = `https://localhost:${PORT}/paideia/`;

    // Wait for the server to be ready before loading the URL to avoid blank screens
    const MAX_RETRIES = 10;
    const RETRY_INTERVAL = 500; // ms
    let retries = 0;

    const checkServerAndLoad = () => {
        // Attempt to fetch the server info endpoint to see if it's alive
        // Using un-authenticated HTTPS fetch since it's self-signed
        const https = require('https');
        const req = https.get(`https://localhost:${PORT}/api/info`, { rejectUnauthorized: false }, (res) => {
            if (res.statusCode === 200) {
                console.log('✅ Local server is ready. Loading application UI...');
                mainWindow.loadURL(targetUrl);
            } else {
                retryLoad(); // Server answered but gave a weird status code
            }
        });

        req.on('error', (e) => {
            retryLoad(e);
        });

        req.end();
    };

    const retryLoad = (err) => {
        retries++;
        if (retries >= MAX_RETRIES) {
            console.error(`❌ FATAL: Local server failed to start after ${MAX_RETRIES} attempts. Error:`, err?.message || 'Unknown');
            mainWindow.loadURL(`data:text/html,<h2>Error: Local server could not start.</h2><p>Check the console for details.</p>`);
            return;
        }
        console.log(`⏱️ Server not ready yet. Retrying in ${RETRY_INTERVAL}ms (Attempt ${retries}/${MAX_RETRIES})...`);
        setTimeout(checkServerAndLoad, RETRY_INTERVAL);
    };

    // Begin check loop
    checkServerAndLoad();

    // Log load errors explicitly (vital for debugging blank screens in production)
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
        console.error(`❌ PAGE FAILED TO LOAD: ${validatedURL}`);
        console.error(`   Code: ${errorCode} | Description: ${errorDescription}`);
    });

    // Open external links in default browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http:') || url.startsWith('https:')) {
            shell.openExternal(url);
            return { action: 'deny' };
        }
        return { action: 'allow' };
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
