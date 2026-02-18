// ==========================================================================
// PAIDEIA — Aporia (Ἀπορία) — Dudas anónimas
// "Me perdí" — Señala dónde se oscurece la comprensión
// ==========================================================================

import { renderHeader } from '../components/header.js';
import { getToolById } from '../components/toolCard.js';
import { getCurrentSession, isTeacher, getStudentId } from '../utils/session.js';
import { addToolEntry, getToolEntries, updateToolEntry, getToolEntriesAsync } from '../utils/storage.js';

const tool = getToolById('aporia');

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function renderAporia() {
  const session = getCurrentSession();
  if (!session) return renderNoSession();

  const teacher = isTeacher();
  const code = session.code;
  const entries = getToolEntries(code, 'aporia');
  const backHash = `/session/${session.code}`;
  const studentId = getStudentId();

  // Calculate confusion level
  const statusEntries = entries.filter(e => e.type === 'status');
  const lostCount = statusEntries.filter(e => e.status === 'lost').length;
  const okCount = statusEntries.filter(e => e.status === 'ok').length;
  const total = lostCount + okCount;
  const confusionPct = total > 0 ? Math.round((lostCount / total) * 100) : 0;

  // Check if student already voted status
  const hasVotedStatus = !teacher && statusEntries.some(e => e.studentId === studentId);

  // Doubts
  const doubts = entries.filter(e => e.type === 'doubt');
  doubts.sort((a, b) => (b.votes || 0) - (a.votes || 0));

  let confusionColor = 'var(--olive)';
  if (confusionPct > 60) confusionColor = 'var(--terracotta)';
  if (confusionPct > 80) confusionColor = '#C0392B';

  const doubtsHtml = doubts.length > 0
    ? doubts.map((d, i) => `
        <div class="doubt-item">
          <div class="doubt-item__vote">
            <button class="doubt-item__vote-btn" data-vote-idx="${i}" title="También tengo esta duda">▲</button>
            <span class="doubt-item__vote-count">${d.votes || 0}</span>
          </div>
          <div class="doubt-item__text">${escapeHtml(d.text)}</div>
        </div>
      `).join('')
    : `<div class="empty-state" style="padding: var(--space-xl);"><p class="empty-state__text">Aún no hay dudas registradas</p></div>`;

  const bodyHtml = `
    ${!teacher ? `
    <div style="display: flex; gap: var(--space-md); justify-content: center; margin-bottom: var(--space-xl);">
      <button class="btn btn--success btn--lg ${hasVotedStatus ? 'btn--disabled' : ''}" id="aporia-ok" style="flex: 1; max-width: 200px;" ${hasVotedStatus ? 'disabled' : ''}>
        🟢 Voy bien
      </button>
      <button class="btn btn--danger btn--lg ${hasVotedStatus ? 'btn--disabled' : ''}" id="aporia-lost" style="flex: 1; max-width: 200px;" ${hasVotedStatus ? 'disabled' : ''}>
        🔴 Me perdí
      </button>
    </div>
    ${hasVotedStatus ? `<p style="text-align: center; font-size: var(--text-sm); color: var(--olive); margin-bottom: var(--space-md);">✓ Tu estado ha sido registrado</p>` : ''}

    <div class="input-group">
      <label for="aporia-text">¿Qué no entiendes? (opcional, anónimo)</label>
      <div style="display: flex; gap: var(--space-sm);">
        <input type="text" id="aporia-text" class="input" placeholder="Escribe tu duda aquí..." style="flex: 1;" />
        <button class="btn btn--gold" id="aporia-send">Enviar</button>
      </div>
    </div>

    <div class="divider"></div>
    ` : ''}

    ${total > 0 ? `
    <div class="pulse-indicator" style="margin-bottom: var(--space-lg);">
      <div class="pulse-dot ${confusionPct > 60 ? (confusionPct > 80 ? 'pulse-dot--danger' : 'pulse-dot--warning') : ''}"></div>
      <div style="flex: 1;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xs);">
          <span style="font-weight: 500;">Nivel de confusión</span>
          <span style="font-family: var(--font-display); font-weight: 700; font-size: var(--text-xl); color: ${confusionColor};">${confusionPct}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar__fill progress-bar__fill--terracotta" style="width: ${confusionPct}%;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: var(--text-xs); color: var(--obsidian-soft); margin-top: var(--space-xs);">
          <span>🟢 ${okCount} van bien</span>
          <span>🔴 ${lostCount} se perdieron</span>
        </div>
      </div>
    </div>
    ` : ''}

    <h4 style="margin-bottom: var(--space-md);">Dudas del grupo</h4>
    <div id="doubts-list">
      ${doubtsHtml}
    </div>
    
    ${teacher ? `
    <button class="btn btn--ghost btn--full" id="aporia-refresh" style="margin-top: var(--space-lg);">
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
          <p class="tool-view__concept">${tool.greek} · perplejidad</p>
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

export function initAporia() {
  const session = getCurrentSession();
  if (!session) return;
  const studentId = getStudentId();

  // OK button
  const okBtn = document.getElementById('aporia-ok');
  if (okBtn && !okBtn.disabled) {
    okBtn.addEventListener('click', () => {
      addToolEntry(session.code, 'aporia', { type: 'status', status: 'ok', studentId });
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  }

  // Lost button
  const lostBtn = document.getElementById('aporia-lost');
  if (lostBtn && !lostBtn.disabled) {
    lostBtn.addEventListener('click', () => {
      addToolEntry(session.code, 'aporia', { type: 'status', status: 'lost', studentId });
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  }

  // Send doubt
  const sendBtn = document.getElementById('aporia-send');
  const textInput = document.getElementById('aporia-text');
  if (sendBtn && textInput) {
    const submitDoubt = () => {
      const text = textInput.value.trim();
      if (!text) return;
      addToolEntry(session.code, 'aporia', { type: 'doubt', text, votes: 0, studentId });
      textInput.value = '';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    };
    sendBtn.addEventListener('click', submitDoubt);
    textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); submitDoubt(); }
    });
  }

  // Vote buttons — use updateToolEntry instead of direct localStorage access
  document.querySelectorAll('[data-vote-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      const doubtDisplayIdx = parseInt(btn.getAttribute('data-vote-idx'));
      const entries = getToolEntries(session.code, 'aporia');
      const doubts = entries.filter(e => e.type === 'doubt');
      // Sort to match display order
      doubts.sort((a, b) => (b.votes || 0) - (a.votes || 0));

      if (doubts[doubtDisplayIdx]) {
        // Find the actual index in the full entries array
        const targetDoubt = doubts[doubtDisplayIdx];
        const realIdx = entries.indexOf(targetDoubt);
        if (realIdx >= 0) {
          updateToolEntry(session.code, 'aporia', realIdx, { votes: (targetDoubt.votes || 0) + 1 });
          window.dispatchEvent(new HashChangeEvent('hashchange'));
        }
      }
    });
  });

  // Refresh (teacher)
  const refreshBtn = document.getElementById('aporia-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.textContent = '⏳ Cargando...';
      refreshBtn.disabled = true;
      const session = getCurrentSession();
      if (session) {
        await getToolEntriesAsync(session.code, 'aporia');
      }
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  }
}
