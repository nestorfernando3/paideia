// ==========================================================================
// PAIDEIA — Noesis (Νόησις) — Comprensión rápida
// "¿Entendieron?" — Verificación instantánea
// ==========================================================================

import { renderHeader } from '../components/header.js';
import { getToolById } from '../components/toolCard.js';
import { getCurrentSession, isTeacher, getStudentId } from '../utils/session.js';
import { addToolEntry, getToolEntries, getToolEntriesAsync } from '../utils/storage.js';
import { renderToolLayout } from '../components/layout.js';

const tool = getToolById('noesis');

export function renderNoesis() {
  const session = getCurrentSession();
  if (!session) return renderNoSession();

  const teacher = isTeacher();
  const code = session.code;
  const entries = getToolEntries(code, 'noesis');
  const backHash = `/session/${session.code}`;
  const studentId = getStudentId();
  const hasAnswered = !teacher && entries.some(e => e.studentId === studentId);

  let bodyHtml = '';

  if (!teacher && !hasAnswered) {
    bodyHtml = `
      <div class="tool-view__prompt">
        ¿Comprendes lo que se acaba de explicar?
      </div>
      <div class="option-grid" id="noesis-options">
        <button class="option-btn" data-answer="yes">
          <span class="option-btn__letter" style="color: var(--olive);">✓</span>
          <span class="option-btn__text">Sí, entiendo</span>
        </button>
        <button class="option-btn" data-answer="partial">
          <span class="option-btn__letter" style="color: var(--gold);">~</span>
          <span class="option-btn__text">Más o menos</span>
        </button>
        <button class="option-btn" data-answer="no">
          <span class="option-btn__letter" style="color: var(--terracotta);">✗</span>
          <span class="option-btn__text">No entiendo</span>
        </button>
      </div>
    `;
  } else if (!teacher && hasAnswered) {
    const myAnswer = entries.find(e => e.studentId === studentId)?.answer;
    const labels = { yes: '✓ Sí, entiendo', partial: '~ Más o menos', no: '✗ No entiendo' };
    bodyHtml = `
      <div class="card card--elevated" style="text-align: center; padding: var(--space-xl);">
        <p style="font-family: var(--font-display); font-size: var(--text-lg); color: var(--olive);">✓ Respuesta registrada</p>
        <p style="margin-top: var(--space-sm); color: var(--obsidian-soft); font-size: var(--text-sm);">
          Tu respuesta: <strong>${labels[myAnswer] || myAnswer}</strong>
        </p>
      </div>
    `;
  } else {
    // Teacher view
    const yes = entries.filter(e => e.answer === 'yes').length;
    const partial = entries.filter(e => e.answer === 'partial').length;
    const no = entries.filter(e => e.answer === 'no').length;
    const total = yes + partial + no;
    const yesPct = total > 0 ? Math.round((yes / total) * 100) : 0;
    const partialPct = total > 0 ? Math.round((partial / total) * 100) : 0;
    const noPct = total > 0 ? Math.round((no / total) * 100) : 0;

    bodyHtml = total > 0 ? `
      <div style="display: flex; justify-content: center; gap: var(--space-2xl); flex-wrap: wrap; margin-bottom: var(--space-xl);">
        <div class="stat">
          <div class="stat__value">${total}</div>
          <div class="stat__label">Respuestas</div>
        </div>
      </div>

      <div class="card" style="margin-bottom: var(--space-md);">
        <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
          <span style="font-size: var(--text-lg); color: var(--olive);">✓</span>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-xs);">
              <span>Sí, entiendo</span>
              <span style="font-weight: 600; color: var(--olive);">${yesPct}% (${yes})</span>
            </div>
            <div class="progress-bar"><div class="progress-bar__fill progress-bar__fill--olive" style="width: ${yesPct}%;"></div></div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
          <span style="font-size: var(--text-lg); color: var(--gold);">~</span>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-xs);">
              <span>Más o menos</span>
              <span style="font-weight: 600; color: var(--gold);">${partialPct}% (${partial})</span>
            </div>
            <div class="progress-bar"><div class="progress-bar__fill progress-bar__fill--gold" style="width: ${partialPct}%;"></div></div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: var(--space-md);">
          <span style="font-size: var(--text-lg); color: var(--terracotta);">✗</span>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-xs);">
              <span>No entiendo</span>
              <span style="font-weight: 600; color: var(--terracotta);">${noPct}% (${no})</span>
            </div>
            <div class="progress-bar"><div class="progress-bar__fill progress-bar__fill--terracotta" style="width: ${noPct}%;"></div></div>
          </div>
        </div>
      </div>

      <button class="btn btn--ghost btn--full" id="noesis-refresh" style="margin-top: var(--space-lg);">
        ↻ Actualizar
      </button>
    ` : `
      <div class="empty-state">
        <div class="empty-state__icon">Ν</div>
        <p class="empty-state__text">Esperando respuestas...</p>
      </div>
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

export function initNoesis() {
  const session = getCurrentSession();
  if (!session) return;

  document.querySelectorAll('[data-answer]').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.getAttribute('data-answer');
      const studentId = getStudentId();
      const student = localStorage.getItem('studentName');
      addToolEntry(session.code, 'noesis', { answer, studentId, student });
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  });

  const refreshBtn = document.getElementById('noesis-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.textContent = '⏳ Cargando...';
      refreshBtn.disabled = true;
      const session = getCurrentSession();
      if (session) {
        await getToolEntriesAsync(session.code, 'noesis');
      }
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  }
}
