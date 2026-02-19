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
    mainWindow.loadURL(`https://localhost:${PORT}/paideia/`);

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
