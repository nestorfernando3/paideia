// ==========================================================================
// PAIDEIA — Active Session View
// Vista de sesión activa (docente y estudiante)
// ==========================================================================

import { renderHeader } from '../components/header.js';
import { TOOLS, getToolById } from '../components/toolCard.js';
import { getCurrentSession, getCurrentRole, isTeacher, setCurrentSession, generateGreekCode, clearCurrentSession, endSession, getStudentName } from '../utils/session.js';
import { getSession, getAllToolEntriesAsync } from '../utils/storage.js';
import { staggerChildren } from '../utils/animations.js';
import { exportSessionPDF } from '../utils/pdf-exporter.js';

export function renderSession(code) {
  let session = getCurrentSession();

  // If no session in memory, load from storage
  if (!session || session.code !== code) {
    session = getSession(code);
    if (session) {
      const existingRole = getCurrentRole();
      setCurrentSession(session, existingRole || 'student');
    }
  }

  if (!session) {
    return `
      ${renderHeader()}
      <main class="page">
        <div class="empty-state" style="min-height: 60vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div class="empty-state__icon">Ω</div>
          <p class="empty-state__text">Sesión no encontrada</p>
          <p style="color: var(--obsidian-soft); margin-top: var(--space-sm); font-size: var(--text-sm);">
            El código <strong>${code}</strong> no corresponde a ninguna sesión activa.
          </p>
          <a href="#/" class="btn btn--outline" style="margin-top: var(--space-lg);">
            Volver al inicio
          </a>
        </div>
      </main>
    `;
  }

  if (!session.active) {
    return `
      ${renderHeader()}
      <main class="page">
        <div class="empty-state" style="min-height: 60vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div class="empty-state__icon">⏹</div>
          <p class="empty-state__text">Sesión finalizada</p>
          <p style="color: var(--obsidian-soft); margin-top: var(--space-sm); font-size: var(--text-sm);">
            La sesión «${session.topic}» ha terminado.
          </p>
          <a href="#/" class="btn btn--outline" style="margin-top: var(--space-lg);">
            Volver al inicio
          </a>
        </div>
      </main>
    `;
  }

  const greekCode = generateGreekCode(session.code);
  const activeTools = session.activeTools.map(id => getToolById(id)).filter(Boolean);
  const role = getCurrentRole();
  const studentName = role === 'student' ? getStudentName() : null;

  const toolCards = activeTools.map(tool => `
    <div class="tool-card" onclick="window.location.hash='/tool/${tool.id}'" style="cursor: pointer;">
      <div class="tool-card__letter">${tool.letter}</div>
      <div class="tool-card__name">${tool.name}</div>
      <div class="tool-card__verb">${tool.verb}</div>
    </div>
  `).join('');

  return `
    ${renderHeader()}
    <main class="page">
      <div class="tool-view">
        <div class="tool-view__header animate-fade-in">
          <div class="badge badge--gold" style="margin-bottom: var(--space-md);">
            <span class="live-badge__dot"></span>
            Sesión activa
          </div>
          <h2 class="tool-view__name">${session.topic || 'Sesión de clase'}</h2>
          ${role === 'student' && studentName ? `
            <p style="font-size: var(--text-sm); color: var(--obsidian-soft); margin-top: var(--space-xs);">
              👋 Hola, <strong>${studentName}</strong>
            </p>
          ` : ''}
          <div class="session-code-display">
            <span class="session-code-display__label">Código:</span>
            <span class="session-code-display__code">${session.code}</span>
            <span class="session-code-display__greek">(${greekCode})</span>
          </div>
          ${role === 'teacher' ? `
            <p style="font-size: var(--text-sm); color: var(--obsidian-soft); margin-top: var(--space-sm);">Comparte este código con tus estudiantes</p>
            
            <div style="display: flex; gap: var(--space-sm); justify-content: center; margin-top: var(--space-md); flex-wrap: wrap;">
              <button class="btn btn--ghost btn--sm" id="share-session-btn">
                📤 Compartir enlace
              </button>
              <button class="btn btn--ghost btn--sm" id="show-qr-btn">
                📱 Mostrar QR
              </button>
              <button class="btn btn--ghost btn--sm" id="export-pdf-btn">
                📄 Exportar PDF
              </button>
            </div>

            <div id="qr-container" style="display: none; margin-top: var(--space-lg); text-align: center;">
              <canvas id="qr-canvas"></canvas>
              <p style="font-size: var(--text-xs); color: var(--obsidian-soft); margin-top: var(--space-sm);">
                Los estudiantes escanean este código para unirse
              </p>
            </div>
          ` : ''}
        </div>

        <div class="divider--short divider"></div>

        <div class="tool-grid" style="margin-top: var(--space-xl);" id="session-tools">
          ${toolCards}
        </div>

        <div style="text-align: center; margin-top: var(--space-2xl); display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap;">
          ${role === 'teacher' ? `
            <button class="btn btn--ghost" id="end-session-btn" style="color: var(--terracotta);">
              ⏹ Finalizar sesión
            </button>
          ` : ''}
          <a href="#/" class="btn btn--ghost" id="leave-session-btn">
            ← Salir de la sesión
          </a>
        </div>
      </div>
    </main>
  `;
}

export function initSession() {
  staggerChildren('#session-tools .tool-card', 80);

  // End session (teacher only)
  const endBtn = document.getElementById('end-session-btn');
  if (endBtn) {
    endBtn.addEventListener('click', () => {
      const session = getCurrentSession();
      if (!session) return;
      if (confirm('¿Estás seguro de que deseas finalizar la sesión?')) {
        endSession(session.code);
        clearCurrentSession();
        window.location.hash = '/';
      }
    });
  }

  // Leave session
  const leaveBtn = document.getElementById('leave-session-btn');
  if (leaveBtn) {
    leaveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      clearCurrentSession();
      window.location.hash = '/';
    });
  }

  // Share session link
  const shareBtn = document.getElementById('share-session-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const session = getCurrentSession();
      if (!session) return;

      const url = `${window.location.origin}${window.location.pathname}#/join`;
      const text = `Únete a mi clase de Paideia con el código: ${session.code}\n${url}`;

      if (navigator.share) {
        try {
          await navigator.share({ title: 'Paideia — Únete a la sesión', text });
        } catch { /* user cancelled */ }
      } else {
        await navigator.clipboard.writeText(text);
        shareBtn.textContent = '✓ Copiado';
        setTimeout(() => { shareBtn.textContent = '📤 Compartir enlace'; }, 2000);
      }
    });
  }

  // QR Code
  const qrBtn = document.getElementById('show-qr-btn');
  if (qrBtn) {
    qrBtn.addEventListener('click', async () => {
      const container = document.getElementById('qr-container');
      const canvas = document.getElementById('qr-canvas');
      if (!container || !canvas) return;

      if (container.style.display === 'none') {
        container.style.display = 'block';
        qrBtn.textContent = '📱 Ocultar QR';

        try {
          const QRCode = (await import('qrcode')).default;
          const session = getCurrentSession();
          const url = `${window.location.origin}${window.location.pathname}#/join`;
          await QRCode.toCanvas(canvas, url, {
            width: 200,
            margin: 2,
            color: { dark: '#1A1A2E', light: '#F5F2EB' },
          });
        } catch (err) {
          container.innerHTML = `<p style="color: var(--terracotta); font-size: var(--text-sm);">No se pudo generar el QR</p>`;
        }
      } else {
        container.style.display = 'none';
        qrBtn.textContent = '📱 Mostrar QR';
      }
    });
  }

  // PDF Export
  const exportPdfBtn = document.getElementById('export-pdf-btn');
  if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', async () => {
      const session = getCurrentSession();
      if (!session) return;

      const originalText = exportPdfBtn.textContent;
      exportPdfBtn.textContent = '⏳ Generando...';
      exportPdfBtn.disabled = true;

      try {
        const toolsData = await getAllToolEntriesAsync(session.code);
        await exportSessionPDF(session, toolsData);
      } catch (err) {
        console.error('Error exporting PDF:', err);
        alert('Hubo un error al generar el PDF. Inténtalo de nuevo.');
      } finally {
        exportPdfBtn.textContent = originalText;
        exportPdfBtn.disabled = false;
      }
    });
  }
}
