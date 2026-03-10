// ==========================================================================
// PAIDEIA — Anamnesis (Ἀνάμνησις) — Reflexión estructurada
// "Aprendí / Me pregunto / Conecté"
// ==========================================================================

import { renderHeader } from '../components/header.js';
import { getToolById } from '../components/toolCard.js';
import { getCurrentSession, isTeacher, getStudentId } from '../utils/session.js';
import { addToolEntry, getToolEntries, getToolEntriesAsync } from '../utils/storage.js';
import { renderToolLayout } from '../components/layout.js';
import { initTeacherToolLiveSync } from '../utils/live.js';

const tool = getToolById('anamnesis');

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function renderAnamnesis() {
  const session = getCurrentSession();
  if (!session) return renderNoSession();

  const teacher = isTeacher();
  const code = session.code;
  const entries = getToolEntries(code, 'anamnesis');
  const backHash = `/session/${session.code}`;
  const studentId = getStudentId();
  const hasAnswered = !teacher && entries.some(e => e.studentId === studentId);

  let bodyHtml = '';

  if (!teacher && !hasAnswered) {
    bodyHtml = `
      <div class="tool-view__prompt">
        Reflexiona sobre tu aprendizaje de hoy
      </div>
      <form id="anamnesis-form">
        <div class="input-group">
          <label for="anamnesis-learned">📖 Hoy aprendí...</label>
          <textarea id="anamnesis-learned" class="input" placeholder="¿Qué conocimiento nuevo te llevas?" required></textarea>
        </div>
        <div class="input-group">
          <label for="anamnesis-wonder">❓ Todavía me pregunto...</label>
          <textarea id="anamnesis-wonder" class="input" placeholder="¿Qué duda o curiosidad te queda?" required></textarea>
        </div>
        <div class="input-group">
          <label for="anamnesis-connected">🔗 Lo conecté con...</label>
          <textarea id="anamnesis-connected" class="input" placeholder="¿Con qué otra cosa se relaciona lo aprendido?" required></textarea>
        </div>
        <button type="submit" class="btn btn--gold btn--lg btn--full">
          Registrar reflexión
        </button>
      </form>
    `;
  } else if (!teacher && hasAnswered) {
    const myEntry = entries.find(e => e.studentId === studentId);
    bodyHtml = `
      <div class="card card--elevated" style="padding: var(--space-xl);">
        <p style="font-family: var(--font-display); font-size: var(--text-lg); color: var(--olive); margin-bottom: var(--space-lg); text-align: center;">✓ Reflexión registrada</p>
        <div style="margin-bottom: var(--space-md);">
          <strong style="color: var(--gold-dark);">📖 Aprendí:</strong>
          <p style="margin-top: var(--space-xs);">${escapeHtml(myEntry.learned)}</p>
        </div>
        <div style="margin-bottom: var(--space-md);">
          <strong style="color: var(--gold-dark);">❓ Me pregunto:</strong>
          <p style="margin-top: var(--space-xs);">${escapeHtml(myEntry.wonder)}</p>
        </div>
        <div>
          <strong style="color: var(--gold-dark);">🔗 Lo conecté con:</strong>
          <p style="margin-top: var(--space-xs);">${escapeHtml(myEntry.connected)}</p>
        </div>
      </div>
    `;
  } else {
    // Teacher view
    const reflections = entries.length > 0
      ? entries.map((e, i) => `
          <div class="card" style="margin-bottom: var(--space-md);">
            <div style="font-size: var(--text-xs); color: var(--obsidian-soft); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: var(--space-sm);">
              Reflexión ${i + 1}
            </div>
            <div style="margin-bottom: var(--space-sm);">
              <span style="color: var(--gold-dark); font-weight: 500;">📖</span>
              <span style="font-size: var(--text-sm);">${escapeHtml(e.learned)}</span>
            </div>
            <div style="margin-bottom: var(--space-sm);">
              <span style="color: var(--gold-dark); font-weight: 500;">❓</span>
              <span style="font-size: var(--text-sm);">${escapeHtml(e.wonder)}</span>
            </div>
            <div>
              <span style="color: var(--gold-dark); font-weight: 500;">🔗</span>
              <span style="font-size: var(--text-sm);">${escapeHtml(e.connected)}</span>
            </div>
          </div>
        `).join('')
      : `<div class="empty-state" style="padding: var(--space-xl);"><p class="empty-state__text">Esperando reflexiones...</p></div>`;

    bodyHtml = `
      <div style="display: flex; justify-content: center; margin-bottom: var(--space-xl);">
        <div class="stat">
          <div class="stat__value">${entries.length}</div>
          <div class="stat__label">Reflexiones recibidas</div>
        </div>
      </div>
      ${reflections}
      ${entries.length > 0 ? `
      <button class="btn btn--ghost btn--full" id="anamnesis-refresh" style="margin-top: var(--space-lg);">
        ↻ Actualizar
      </button>
      ` : ''}
    `;
  }

  return renderToolLayout(tool, bodyHtml);
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

export function initAnamnesis() {
  initTeacherToolLiveSync('anamnesis');
  const session = getCurrentSession();
  if (!session) return;

  const form = document.getElementById('anamnesis-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const learned = document.getElementById('anamnesis-learned').value.trim();
      const wonder = document.getElementById('anamnesis-wonder').value.trim();
      const connected = document.getElementById('anamnesis-connected').value.trim();

      if (!learned || !wonder || !connected) return;

      const studentId = getStudentId();
      const student = localStorage.getItem('studentName');
      addToolEntry(session.code, 'anamnesis', { learned, wonder, connected, studentId, student });
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  }

  const refreshBtn = document.getElementById('anamnesis-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.textContent = '⏳ Cargando...';
      refreshBtn.disabled = true;
      const session = getCurrentSession();
      if (session) {
        await getToolEntriesAsync(session.code, 'anamnesis');
      }
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  }
}
