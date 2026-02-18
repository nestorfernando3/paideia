// ==========================================================================
// PAIDEIA — Logos (Λόγος) — Cristalización en una palabra
// "Resúmelo en UNA palabra"
// ==========================================================================

import { renderHeader } from '../components/header.js';
import { getToolById } from '../components/toolCard.js';
import { getCurrentSession, isTeacher, getStudentId } from '../utils/session.js';
import { addToolEntry, getToolEntries, getToolEntriesAsync } from '../utils/storage.js';

const tool = getToolById('logos');

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function renderLogos() {
  const session = getCurrentSession();
  if (!session) return renderNoSession();

  const teacher = isTeacher();
  const code = session.code;
  const entries = getToolEntries(code, 'logos');
  const backHash = `/session/${session.code}`;
  const studentId = getStudentId();
  const hasAnswered = !teacher && entries.some(e => e.studentId === studentId);

  let bodyHtml = '';

  if (!teacher && !hasAnswered) {
    bodyHtml = `
      <div class="tool-view__prompt">
        Si tuvieras que resumir todo lo aprendido hoy en <strong>una sola palabra</strong>, ¿cuál sería?
      </div>
      <form id="logos-form">
        <div class="input-group">
          <input
            type="text"
            id="logos-word"
            class="input"
            placeholder="Una palabra..."
            style="text-align: center; font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 600;"
            maxlength="30"
            required
            autocomplete="off"
          />
        </div>
        <button type="submit" class="btn btn--gold btn--lg btn--full">
          Cristalizar
        </button>
      </form>
    `;
  } else if (!teacher && hasAnswered) {
    const myWord = entries.find(e => e.studentId === studentId)?.word;
    bodyHtml = `
      <div class="card card--elevated" style="text-align: center; padding: var(--space-xl);">
        <p style="font-family: var(--font-display); font-size: var(--text-lg); color: var(--olive);">✓ Palabra registrada</p>
        <p style="font-family: var(--font-display); font-size: var(--text-3xl); font-weight: 700; color: var(--gold); margin-top: var(--space-md);">
          ${escapeHtml(myWord)}
        </p>
      </div>
      <div class="divider" style="margin: var(--space-xl) 0;"></div>
      <h4 style="margin-bottom: var(--space-md);">Nube del grupo</h4>
      ${renderWordCloud(entries)}
    `;
  } else {
    // Teacher view
    bodyHtml = `
      <div style="display: flex; justify-content: center; margin-bottom: var(--space-xl);">
        <div class="stat">
          <div class="stat__value">${entries.length}</div>
          <div class="stat__label">Palabras recibidas</div>
        </div>
      </div>
      ${entries.length > 0 ? renderWordCloud(entries) : `
        <div class="empty-state">
          <div class="empty-state__icon">Λ</div>
          <p class="empty-state__text">Esperando palabras...</p>
        </div>
      `}
      ${entries.length > 0 ? `
      <button class="btn btn--ghost btn--full" id="logos-refresh" style="margin-top: var(--space-lg);">
        ↻ Actualizar
      </button>
      ` : ''}
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
          <p class="tool-view__concept">${tool.greek} · razón</p>
        </div>
        <div class="tool-view__body">
          ${bodyHtml}
        </div>
      </div>
    </main>
  `;
}

function renderWordCloud(entries) {
  // Count word frequencies
  const freq = {};
  entries.forEach(e => {
    const word = (e.word || '').toLowerCase().trim();
    if (word) freq[word] = (freq[word] || 0) + 1;
  });

  const maxFreq = Math.max(...Object.values(freq), 1);
  // Deterministic colors based on word hash
  const colors = ['var(--aegean)', 'var(--gold)', 'var(--terracotta)', 'var(--olive)', 'var(--obsidian-soft)'];

  const words = Object.entries(freq).map(([word, count], i) => {
    const size = 1 + (count / maxFreq) * 2.5; // 1rem to 3.5rem
    const color = colors[i % colors.length]; // Deterministic color
    return `<span class="word-cloud__word" style="font-size: ${size}rem; color: ${color};" title="${count}×">${escapeHtml(word)}</span>`;
  });

  return `<div class="word-cloud">${words.join('')}</div>`;
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

export function initLogos() {
  const session = getCurrentSession();
  if (!session) return;

  const form = document.getElementById('logos-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const word = document.getElementById('logos-word').value.trim();
      if (!word) return;
      const studentId = getStudentId();
      const student = localStorage.getItem('studentName');
      addToolEntry(session.code, 'logos', { word, studentId, student });
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  }

  const refreshBtn = document.getElementById('logos-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.textContent = '⏳ Cargando...';
      refreshBtn.disabled = true;
      const session = getCurrentSession();
      if (session) {
        await getToolEntriesAsync(session.code, 'logos');
      }
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  }
}
