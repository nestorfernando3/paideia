// ==========================================================================
// PAIDEIA — Methexis (Μέθεξις) — Conexión interdisciplinaria
// "Conecta lo aprendido con tu mundo"
// ==========================================================================

import { renderHeader } from '../components/header.js';
import { getToolById } from '../components/toolCard.js';
import { getCurrentSession, isTeacher, getStudentId } from '../utils/session.js';
import { addToolEntry, getToolEntries, getToolEntriesAsync } from '../utils/storage.js';

const tool = getToolById('methexis');

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function renderMethexis() {
  const session = getCurrentSession();
  if (!session) return renderNoSession();

  const teacher = isTeacher();
  const code = session.code;
  const entries = getToolEntries(code, 'methexis');
  const backHash = `/session/${session.code}`;
  const studentId = getStudentId();
  const hasAnswered = !teacher && entries.some(e => e.studentId === studentId);

  const connectionsHtml = entries.length > 0
    ? entries.map(e => `
        <div class="connection-card">
          <div class="connection-card__concept">
            <span style="color: var(--gold);">⟡</span> 
            ${escapeHtml(e.concept)} <span style="color: var(--obsidian-soft);">↔</span> ${escapeHtml(e.connection)}
          </div>
          <div class="connection-card__text">Porque ${escapeHtml(e.reason)}</div>
        </div>
      `).join('')
    : `<div class="empty-state" style="padding: var(--space-xl);"><p class="empty-state__text">Aún no hay conexiones</p></div>`;

  let bodyHtml = '';

  if (!teacher && !hasAnswered) {
    bodyHtml = `
      <div class="tool-view__prompt">
        Conecta lo que aprendiste hoy con algo fuera de esta clase
      </div>
      <form id="methexis-form">
        <div class="input-group">
          <label for="methexis-concept">Concepto aprendido</label>
          <input type="text" id="methexis-concept" class="input" placeholder="Ej: La metáfora" required />
        </div>
        <div class="input-group">
          <label for="methexis-connection">Se conecta con...</label>
          <input type="text" id="methexis-connection" class="input" placeholder="Ej: La publicidad en televisión" required />
        </div>
        <div class="input-group">
          <label for="methexis-reason">Porque...</label>
          <textarea id="methexis-reason" class="input" placeholder="Ej: Ambas usan imágenes para transmitir un significado más profundo" required></textarea>
        </div>
        <button type="submit" class="btn btn--gold btn--lg btn--full">
          Crear conexión
        </button>
      </form>
      <div class="divider" style="margin-top: var(--space-xl);"></div>
    `;
  } else if (!teacher && hasAnswered) {
    const myEntry = entries.find(e => e.studentId === studentId);
    bodyHtml = `
      <div class="card card--elevated" style="padding: var(--space-xl);">
        <p style="font-family: var(--font-display); font-size: var(--text-lg); color: var(--olive); text-align: center; margin-bottom: var(--space-md);">✓ Conexión registrada</p>
        <div class="connection-card__concept" style="text-align: center;">
          ${escapeHtml(myEntry.concept)} ↔ ${escapeHtml(myEntry.connection)}
        </div>
        <p style="text-align: center; color: var(--obsidian-soft); font-size: var(--text-sm); margin-top: var(--space-sm);">
          Porque ${escapeHtml(myEntry.reason)}
        </p>
      </div>
      <div class="divider" style="margin-top: var(--space-xl);"></div>
    `;
  }

  bodyHtml += `
    <h4 style="margin-bottom: var(--space-md); margin-top: var(--space-lg);">
      Conexiones del grupo
      <span class="badge badge--gold" style="margin-left: var(--space-sm);">${entries.length}</span>
    </h4>
    <div id="connections-list">
      ${connectionsHtml}
    </div>
    ${teacher ? `
    <button class="btn btn--ghost btn--full" id="methexis-refresh" style="margin-top: var(--space-lg);">
      ↻ Actualizar
    </button>
    ` : ''}
  `;

  return `
    ${renderHeader()}
    <main class="page">
      <a class="back-nav" href="#${backHash}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Volver
      </a>
      <div class="tool-view animate-fade-in">
        <div class="tool-view__header">
          <div class="tool-view__greek-letter">${tool.letter}</div>
          <h2 class="tool-view__name">${tool.name}</h2>
          <p class="tool-view__concept">${tool.greek} · participación</p>
        </div>
        <div class="tool-view__body">
          ${bodyHtml}
        </div>
      </div>
    </main>
  `;
}

function renderNoSession() {
  return `
    ${renderHeader()}
    <main class="page">
      <div class="empty-state" style="min-height: 60vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <div class="empty-state__icon">⚠</div>
        <p class="empty-state__text">No estás en una sesión activa</p>
        <a href="#/" class="btn btn--gold" style="margin-top: var(--space-lg);">Ir al inicio</a>
      </div>
    </main>
  `;
}

export function initMethexis() {
  const session = getCurrentSession();
  if (!session) return;

  const form = document.getElementById('methexis-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const concept = document.getElementById('methexis-concept').value.trim();
      const connection = document.getElementById('methexis-connection').value.trim();
      const reason = document.getElementById('methexis-reason').value.trim();

      if (!concept || !connection || !reason) return;

      const studentId = getStudentId();
      const student = localStorage.getItem('studentName');
      addToolEntry(session.code, 'methexis', { concept, connection, reason, studentId, student });
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  }

  const refreshBtn = document.getElementById('methexis-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.textContent = '⏳ Cargando...';
      refreshBtn.disabled = true;
      const session = getCurrentSession();
      if (session) {
        await getToolEntriesAsync(session.code, 'methexis');
      }
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  }
}
