// ==========================================================================
// PAIDEIA — Gnosis (Γνῶσις) — Autoconocimiento metacognitivo
// "¿Qué tan seguro te sientes con el tema?"
// ==========================================================================

import { renderHeader } from '../components/header.js';
import { getToolById } from '../components/toolCard.js';
import { getCurrentSession, isTeacher, getStudentId } from '../utils/session.js';
import { addToolEntry, getToolEntries, getToolEntriesAsync } from '../utils/storage.js';
import { showToast } from '../utils/ui.js';
import { renderToolLayout } from '../components/layout.js';
import { getNextTool } from '../utils/flow.js';

const tool = getToolById('gnosis');

export function renderGnosis() {
  const session = getCurrentSession();
  if (!session) return renderNoSession();

  const teacher = isTeacher();
  if (teacher) {
    return renderGnosisTeacher(session);
  }
  return renderGnosisStudent(session);
}

function renderGnosisStudent(session) {
  const code = session.code;
  const entries = getToolEntries(code, 'gnosis');
  const studentId = getStudentId();
  const hasAnswered = entries.some(e => e.phase === 'before' && e.studentId === studentId);
  const hasAnsweredAfter = entries.some(e => e.phase === 'after' && e.studentId === studentId);

  let bodyHtml = '';

  if (!hasAnswered) {
    bodyHtml = `
      <div class="tool-view__prompt">
        ¿Qué tan seguro te sientes sobre el tema de hoy?
      </div>
      <div class="slider-container">
        <div class="slider-labels">
          <span>😟 Nada seguro</span>
          <span>😎 Muy seguro</span>
        </div>
        <input type="range" class="slider" id="gnosis-slider" min="1" max="5" value="3" step="1" />
        <div class="slider-value" id="gnosis-value">3</div>
      </div>
      <button class="btn btn--gold btn--lg btn--full" id="gnosis-submit" style="margin-top: var(--space-lg);">
        Enviar mi percepción
      </button>
    `;
  } else if (!hasAnsweredAfter) {
    const before = entries.find(e => e.phase === 'before' && e.studentId === studentId);

    // Check if flow continues
    const nextToolId = getNextTool('gnosis', session.activeTools || [], code, studentId);

    bodyHtml = `
      <div class="card card--elevated" style="text-align: center; padding: var(--space-xl);">
        <p style="font-family: var(--font-display); font-size: var(--text-lg); color: var(--olive);">✓ Percepción inicial: <strong>${before.value}/5</strong></p>
        <p style="margin-top: var(--space-sm); color: var(--obsidian-soft); font-size: var(--text-sm);">Tu respuesta ha sido registrada.</p>
      </div>
    `;

    if (nextToolId) {
      // Flow continues: Do NOT show After form yet
      bodyHtml += `
        <div style="margin-top: var(--space-2xl); text-align: center;">
          <p style="margin-bottom: var(--space-md); color: var(--obsidian-soft);">Continúa con las actividades de la clase</p>
          <div class="animate-bounce-subtle">⬇</div>
        </div>
      `;
    } else {
      // End of flow: Show After form
      bodyHtml += `
      <div class="divider--short divider" style="margin: var(--space-xl) auto;"></div>
      <div class="tool-view__prompt">
        Ahora que terminó la clase, ¿qué tan seguro te sientes?
      </div>
      <div class="slider-container">
        <div class="slider-labels">
          <span>😟 Nada seguro</span>
          <span>😎 Muy seguro</span>
        </div>
        <input type="range" class="slider" id="gnosis-slider-after" min="1" max="5" value="3" step="1" />
        <div class="slider-value" id="gnosis-value-after">3</div>
      </div>
      <button class="btn btn--gold btn--lg btn--full" id="gnosis-submit-after" style="margin-top: var(--space-lg);">
        Enviar percepción final
      </button>
      `;
    }
  } else {
    const before = entries.find(e => e.phase === 'before' && e.studentId === studentId);
    const after = entries.find(e => e.phase === 'after' && e.studentId === studentId);
    const diff = after.value - before.value;
    const diffText = diff > 0 ? `+${diff}` : diff === 0 ? '=' : `${diff}`;
    const diffColor = diff > 0 ? 'var(--olive)' : diff < 0 ? 'var(--terracotta)' : 'var(--gold)';

    bodyHtml = `
      <div class="card card--elevated" style="text-align: center; padding: var(--space-2xl);">
        <p style="font-family: var(--font-display); font-size: var(--text-lg); color: var(--olive); margin-bottom: var(--space-lg);">✓ Reflexión completada</p>
        <div style="display: flex; justify-content: center; gap: var(--space-2xl); flex-wrap: wrap;">
          <div class="stat">
            <div class="stat__value">${before.value}</div>
            <div class="stat__label">Antes</div>
          </div>
          <div class="stat">
            <div class="stat__value" style="color: ${diffColor}; font-size: var(--text-4xl);">${diffText}</div>
            <div class="stat__label">Cambio</div>
          </div>
          <div class="stat">
            <div class="stat__value">${after.value}</div>
            <div class="stat__label">Después</div>
          </div>
        </div>
      </div>
    `;
  }

  return renderToolLayout(tool, bodyHtml);
}

function renderGnosisTeacher(session) {
  const code = session.code;
  const entries = getToolEntries(code, 'gnosis');

  const beforeEntries = entries.filter(e => e.phase === 'before');
  const afterEntries = entries.filter(e => e.phase === 'after');

  const avgBefore = beforeEntries.length > 0
    ? (beforeEntries.reduce((s, e) => s + e.value, 0) / beforeEntries.length).toFixed(1)
    : '—';
  const avgAfter = afterEntries.length > 0
    ? (afterEntries.reduce((s, e) => s + e.value, 0) / afterEntries.length).toFixed(1)
    : '—';

  const bodyHtml = `
    <div style="display: flex; justify-content: center; gap: var(--space-2xl); flex-wrap: wrap; margin-bottom: var(--space-2xl);">
      <div class="stat">
        <div class="stat__value">${beforeEntries.length}</div>
        <div class="stat__label">Respuestas</div>
      </div>
      <div class="stat">
        <div class="stat__value">${avgBefore}</div>
        <div class="stat__label">Promedio antes</div>
      </div>
      <div class="stat">
        <div class="stat__value">${avgAfter}</div>
        <div class="stat__label">Promedio después</div>
      </div>
    </div>

    ${beforeEntries.length > 0 ? `
    <div class="card" style="margin-bottom: var(--space-lg);">
      <h4 style="margin-bottom: var(--space-md);">Distribución — Antes</h4>
      ${renderDistribution(beforeEntries)}
    </div>
    ` : `
    <div class="empty-state">
      <div class="empty-state__icon">Γ</div>
      <p class="empty-state__text">Esperando respuestas de los estudiantes...</p>
    </div>
    `}

    ${afterEntries.length > 0 ? `
    <div class="card">
      <h4 style="margin-bottom: var(--space-md);">Distribución — Después</h4>
      ${renderDistribution(afterEntries)}
    </div>
    ` : ''}

    <button class="btn btn--ghost btn--full" id="gnosis-refresh" style="margin-top: var(--space-lg);">
      ↻ Actualizar datos
    </button>
  `;

  return renderToolLayout(tool, bodyHtml);
}

function renderDistribution(entries) {
  const counts = [0, 0, 0, 0, 0];
  entries.forEach(e => { counts[e.value - 1]++; });
  const max = Math.max(...counts, 1);
  const labels = ['1', '2', '3', '4', '5'];

  return `
    <div style="display: flex; align-items: flex-end; gap: var(--space-sm); height: 120px; padding: var(--space-sm);">
      ${counts.map((c, i) => `
        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: var(--space-xs);">
          <span style="font-size: var(--text-sm); font-weight: 600;">${c}</span>
          <div style="width: 100%; background: var(--gold); border-radius: var(--radius-sm); height: ${(c / max) * 80}px; min-height: 4px; transition: height 0.5s ease;"></div>
          <span style="font-size: var(--text-xs);">${labels[i]}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderNoSession() {
  return `
    ${renderHeader()}
    <main class="page">
      <div class="empty-state" style="min-height: 60vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <div class="empty-state__icon">⚠</div>
        <p class="empty-state__text">No estás en una sesión activa</p>
        <p style="color: var(--obsidian-soft); margin-top: var(--space-sm); font-size: var(--text-sm);">
          Crea una sesión o únete con un código para usar esta herramienta.
        </p>
        <a href="#/" class="btn btn--gold" style="margin-top: var(--space-lg);">
          Ir al inicio
        </a>
      </div>
    </main>
  `;
}



export function initGnosis() {
  // Before slider
  const slider = document.getElementById('gnosis-slider');
  const valueEl = document.getElementById('gnosis-value');
  if (slider && valueEl) {
    slider.addEventListener('input', () => { valueEl.textContent = slider.value; });
  }

  // Submit before
  const submitBtn = document.getElementById('gnosis-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const session = getCurrentSession();
      if (!session) return;
      const studentId = getStudentId();
      const student = localStorage.getItem('studentName');
      addToolEntry(session.code, 'gnosis', { phase: 'before', value: parseInt(slider.value), studentId, student });
      showToast('Percepción guardada', 'success');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  }

  // After slider
  const sliderAfter = document.getElementById('gnosis-slider-after');
  const valueAfterEl = document.getElementById('gnosis-value-after');
  if (sliderAfter && valueAfterEl) {
    sliderAfter.addEventListener('input', () => { valueAfterEl.textContent = sliderAfter.value; });
  }

  // Submit after
  const submitAfterBtn = document.getElementById('gnosis-submit-after');
  if (submitAfterBtn) {
    submitAfterBtn.addEventListener('click', () => {
      const session = getCurrentSession();
      if (!session) return;
      const studentId = getStudentId();
      const student = localStorage.getItem('studentName');
      addToolEntry(session.code, 'gnosis', { phase: 'after', value: parseInt(sliderAfter.value), studentId, student });
      showToast('Reflexión final guardada', 'success');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  }

  // Refresh button (teacher) — async Firebase fetch
  const refreshBtn = document.getElementById('gnosis-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.textContent = '⏳ Cargando...';
      refreshBtn.disabled = true;
      const session = getCurrentSession();
      if (session) {
        await getToolEntriesAsync(session.code, 'gnosis');
      }
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  }
}


