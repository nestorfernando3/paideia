// ==========================================================================
// PAIDEIA — Eikasia (Εἰκασία) — Conjetura / Hipótesis
// "¿Qué crees que pasará?"
// ==========================================================================

import { renderHeader } from '../components/header.js';
import { getToolById } from '../components/toolCard.js';
import { getCurrentSession, isTeacher, getStudentId } from '../utils/session.js';
import { addToolEntry, getToolEntries, getToolEntriesAsync } from '../utils/storage.js';

const tool = getToolById('eikasia');

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function renderEikasia() {
  const session = getCurrentSession();
  if (!session) return renderNoSession();

  const teacher = isTeacher();
  const code = session.code;
  const entries = getToolEntries(code, 'eikasia');
  const backHash = `/session/${session.code}`;
  const studentId = getStudentId();
  const hasAnswered = !teacher && entries.some(e => e.studentId === studentId);

  let bodyHtml = '';

  if (!teacher && !hasAnswered) {
    bodyHtml = `
      <div class="tool-view__prompt">
        Antes de la clase, formula tu conjetura sobre el tema de hoy
      </div>
      <form id="eikasia-form">
        <div class="input-group">
          <label for="eikasia-hypothesis">Mi hipótesis es...</label>
          <textarea id="eikasia-hypothesis" class="input" placeholder="¿Qué crees que vas a aprender? ¿Qué predices sobre el tema?" required></textarea>
        </div>
        <button type="submit" class="btn btn--gold btn--lg btn--full">
          Formular conjetura
        </button>
      </form>
    `;
  } else if (!teacher && hasAnswered) {
    const myEntry = entries.find(e => e.studentId === studentId);
    bodyHtml = `
      <div class="card card--elevated" style="text-align: center; padding: var(--space-xl);">
        <p style="font-family: var(--font-display); font-size: var(--text-lg); color: var(--olive);">✓ Conjetura registrada</p>
        <p style="margin-top: var(--space-md); color: var(--obsidian-soft); font-size: var(--text-sm); font-style: italic;">
          «${escapeHtml(myEntry.hypothesis)}»
        </p>
        <p style="margin-top: var(--space-md); color: var(--obsidian-soft); font-size: var(--text-sm);">
          Al final de la clase, tu profesor revelará las conjeturas del grupo.
        </p>
      </div>
    `;
  } else {
    // Teacher view
    const hypotheses = entries.length > 0
      ? entries.map(e => `
          <div class="connection-card">
            <div class="connection-card__text">"${escapeHtml(e.hypothesis)}"</div>
          </div>
        `).join('')
      : `<div class="empty-state" style="padding: var(--space-xl);"><p class="empty-state__text">Esperando conjeturas...</p></div>`;

    bodyHtml = `
      <div style="display: flex; justify-content: center; margin-bottom: var(--space-xl);">
        <div class="stat">
          <div class="stat__value">${entries.length}</div>
          <div class="stat__label">Conjeturas recibidas</div>
        </div>
      </div>
      <h4 style="margin-bottom: var(--space-md);">Conjeturas del grupo</h4>
      ${hypotheses}
      <button class="btn btn--ghost btn--full" id="eikasia-refresh" style="margin-top: var(--space-lg);">
        ↻ Actualizar
      </button>
    `;
  }

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
          <p class="tool-view__concept">${tool.greek} · conjetura</p>
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

export function initEikasia() {
  const session = getCurrentSession();
  if (!session) return;

  const form = document.getElementById('eikasia-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const hypothesis = document.getElementById('eikasia-hypothesis').value.trim();
      if (!hypothesis) return;
      const studentId = getStudentId();
      addToolEntry(session.code, 'eikasia', { hypothesis, studentId });
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  }

  const refreshBtn = document.getElementById('eikasia-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.textContent = '⏳ Cargando...';
      refreshBtn.disabled = true;
      const session = getCurrentSession();
      if (session) {
        await getToolEntriesAsync(session.code, 'eikasia');
      }
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  }
}
