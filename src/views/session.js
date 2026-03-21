// ==========================================================================
// PAIDEIA — Active Session View
// Vista de sesión activa (docente y estudiante)
// ==========================================================================

import { renderHeader } from '../components/header.js';
import { getToolById } from '../components/toolCard.js';
import { getCurrentSession, getCurrentRole, isTeacher, setCurrentSession, generateGreekCode, clearCurrentSession, endSession, getStudentName } from '../utils/session.js';
import { getSession, getAllToolEntriesAsync } from '../utils/storage.js';
import { staggerChildren } from '../utils/animations.js';
import { backend } from '../utils/backend.js';
import { getOnlineSessionErrorMessage } from '../utils/online-errors.js';
import { initLiveSessionSync } from '../utils/live.js';

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



  const greekCode = generateGreekCode(session.code);
  const activeTools = session.activeTools.map(id => getToolById(id)).filter(Boolean);
  const role = getCurrentRole();
  const studentName = role === 'student' ? getStudentName() : null;
  const featuredTool = activeTools.find(tool => tool.id === 'gnosis') || activeTools[0] || null;
  const dashboardTools = featuredTool
    ? [featuredTool, ...activeTools.filter(tool => tool.id !== featuredTool.id)]
    : activeTools;
  const toolCards = dashboardTools.map((tool, index) => renderSessionModuleCard(tool, {
    featured: index === 0,
    dark: tool.id === 'logos',
    order: index + 1,
  })).join('');

  return `
    ${renderHeader()}
    <main class="page">
      <div class="session-dashboard animate-fade-in">
        <header class="session-dashboard__hero">
          <div class="session-dashboard__top">
            <div class="session-dashboard__eyebrow">
              <span class="badge ${session.active ? 'badge--gold' : 'badge--olive'}">
                ${session.active ? '<span class="live-badge__dot"></span> Sesión activa' : '<span>⏹</span> Sesión finalizada'}
              </span>
              ${role === 'teacher' ? `<span class="badge badge--aegean">Docente</span>` : `<span class="badge badge--aegean">Estudiante</span>`}
              <span class="session-dashboard__meta">Iniciada hace 14m</span>
            </div>

            <div class="session-code-display session-code-display--panel">
              <span class="session-code-display__label">Código de acceso</span>
              <span class="session-code-display__code">${session.code}</span>
              <span class="session-code-display__greek">${greekCode}</span>
            </div>
          </div>

          <div class="session-dashboard__content">
            <h1 class="session-dashboard__title">${session.topic || 'Sesión activa'}</h1>
            ${role === 'student' && studentName ? `
              <p class="session-dashboard__subtitle">👋 Hola, <strong>${studentName}</strong>. Avanza por el flujo de trabajo de la clase y vuelve a este panel cuando termines.</p>
            ` : `
              <p class="session-dashboard__subtitle">Comparte este código con tus estudiantes para que entren al flujo de trabajo y sigan la secuencia de módulos activos.</p>
            `}
          </div>

          <div class="session-dashboard__actions">
            ${role === 'teacher' ? `
              <button class="btn btn--ghost btn--sm" id="share-session-btn">
                Compartir enlace
              </button>
              <button class="btn btn--ghost btn--sm" id="show-qr-btn">
                Mostrar QR
              </button>
              <button class="btn btn--ghost btn--sm" id="export-pdf-btn">
                Exportar PDF
              </button>
            ` : ''}
          </div>

          ${role === 'teacher' ? `
            <div id="qr-container" class="session-dashboard__qr" style="${backend.mode === 'LOCAL' ? 'display: block' : 'display: none'};">
              <canvas id="qr-canvas"></canvas>
              ${backend.mode === 'LOCAL' ? `
                <p class="session-hero__helper">Tus estudiantes escanean este código para unirse</p>
                <p class="session-hero__micro">Sin internet - solo WiFi</p>
              ` : `
                <p class="session-hero__micro">Los estudiantes escanean este código para unirse</p>
              `}
            </div>
          ` : ''}
        </header>

        <section class="session-dashboard__modules">
          <div class="session-dashboard__label">
            <span>✦</span>
            <span>Módulos activos</span>
          </div>
          <div class="session-dashboard__grid" id="session-tools">
            ${toolCards}
          </div>
        </section>

        <section class="session-dashboard__waiting">
          <div class="session-dashboard__waiting-copy">
            <p class="session-dashboard__waiting-title">Esperando respuestas de los estudiantes...</p>
            <p class="session-dashboard__waiting-subtitle">${role === 'teacher' ? 'Actualiza la vista cuando quieras revisar el avance.' : 'Avanza por los módulos para volver con tu reflexión final.'}</p>
          </div>
          <div class="session-dashboard__avatars" aria-hidden="true">
            <span class="session-dashboard__avatar" style="background: linear-gradient(135deg, #ede6d6, #c1a35f);"></span>
            <span class="session-dashboard__avatar" style="background: linear-gradient(135deg, #f6f1e7, #d9c08a);"></span>
            <span class="session-dashboard__avatar" style="background: linear-gradient(135deg, #f7ede4, #a8893d);"></span>
            <span class="session-dashboard__avatar" style="background: linear-gradient(135deg, #f1ede3, #735b1e);"></span>
            <span class="session-dashboard__avatar--more">+18</span>
          </div>
        </section>

        <div class="session-actions">
          ${role === 'teacher' && session.active ? `
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

function renderSessionModuleCard(tool, { featured = false, dark = false, order = 1 } = {}) {
  const classes = [
    'session-module-card',
    featured ? 'session-module-card--featured' : '',
    dark ? 'session-module-card--dark' : '',
  ].filter(Boolean).join(' ');

  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][Math.max(0, order - 1)] || `${order}`;

  return `
    <a class="${classes}" href="#/tool/${tool.id}" aria-label="${tool.name} · ${tool.greek}">
      <span class="session-module-card__watermark" aria-hidden="true">${tool.letter}</span>
      <div class="session-module-card__meta">
        <span class="session-module-card__kicker">Módulo ${roman}</span>
        <h3 class="session-module-card__title">${tool.name}</h3>
        <span class="session-module-card__subtitle">${tool.greek}</span>
      </div>
      <p class="session-module-card__description">${tool.description}</p>
      <span class="session-module-card__cta">${tool.verb} →</span>
    </a>
  `;
}

export function initSession() {
  initLiveSessionSync();
  staggerChildren('#session-tools .session-module-card', 80);

  // Auto-generate QR in Local Mode (teacher)
  if (backend.mode === 'LOCAL' && isTeacher()) {
    const canvas = document.getElementById('qr-canvas');
    if (canvas) {
      import('qrcode').then(mod => {
        const QRCode = mod.default;
        const baseUrl = backend.networkUrl || window.location.origin;
        const url = `${baseUrl}${window.location.pathname}#/join`;
        QRCode.toCanvas(canvas, url, {
          width: 280,
          margin: 2,
          color: { dark: '#1A1A2E', light: '#F5F2EB' },
        }).catch(console.error);
      });
    }
  }

  // End session (teacher only)
  const endBtn = document.getElementById('end-session-btn');
  if (endBtn) {
    endBtn.addEventListener('click', async () => {
      const session = getCurrentSession();
      if (!session) return;
      if (confirm('¿Estás seguro de que deseas finalizar la sesión?')) {
        try {
          await endSession(session.code);
          clearCurrentSession();
          window.location.hash = '/';
        } catch (error) {
          console.error(error);
          alert(getOnlineSessionErrorMessage(error, 'finalizar la sesión en línea'));
        }
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

      const baseUrl = backend.networkUrl || window.location.origin;
      const url = `${baseUrl}${window.location.pathname}#/join`;
      const text = `Únete a mi clase de Paideia con el código: ${session.code}\n${url}`;

      if (navigator.share) {
        try {
          await navigator.share({ title: 'Paideia — Únete a la sesión', text });
        } catch { /* user cancelled */ }
      } else {
        await navigator.clipboard.writeText(text);
        shareBtn.textContent = '✓ Copiado';
        setTimeout(() => { shareBtn.textContent = 'Compartir enlace'; }, 2000);
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
        qrBtn.textContent = 'Ocultar QR';

        try {
          const QRCode = (await import('qrcode')).default;
          const session = getCurrentSession();
          const baseUrl = backend.networkUrl || window.location.origin;
          const url = `${baseUrl}${window.location.pathname}#/join`;
          const isLocal = backend.mode === 'LOCAL';
          await QRCode.toCanvas(canvas, url, {
            width: isLocal ? 280 : 200,
            margin: 2,
            color: { dark: '#1A1A2E', light: '#F5F2EB' },
          });
        } catch (err) {
          container.innerHTML = `<p style="color: var(--terracotta); font-size: var(--text-sm);">No se pudo generar el QR</p>`;
        }
      } else {
        container.style.display = 'none';
        qrBtn.textContent = 'Mostrar QR';
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
      exportPdfBtn.textContent = 'Generando PDF...';
      exportPdfBtn.disabled = true;

      try {
        const toolsData = await getAllToolEntriesAsync(session.code);
        const { exportSessionPDF } = await import('../utils/pdf-exporter.js');
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
