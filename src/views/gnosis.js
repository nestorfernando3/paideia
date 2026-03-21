// ==========================================================================
// PAIDEIA — Gnosis (Γνῶσις) — Autoconocimiento metacognitivo
// "¿Qué tan seguro te sientes con el tema?"
// ==========================================================================

import { renderHeader } from '../components/header.js';
import { getToolById } from '../components/toolCard.js';
import { getCurrentSession, isTeacher, getStudentId, getStudentName } from '../utils/session.js';
import { addToolEntry, getToolEntries, getToolEntriesAsync } from '../utils/storage.js';
import { showToast } from '../utils/ui.js';
import { renderToolLayout } from '../components/layout.js';
import { getNextTool } from '../utils/flow.js';
import { initTeacherToolLiveSync } from '../utils/live.js';

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
  const totalResponses = beforeEntries.length + afterEntries.length;

  const avgBeforeValue = beforeEntries.length > 0
    ? beforeEntries.reduce((s, e) => s + e.value, 0) / beforeEntries.length
    : null;
  const avgAfterValue = afterEntries.length > 0
    ? afterEntries.reduce((s, e) => s + e.value, 0) / afterEntries.length
    : null;
  const avgBefore = avgBeforeValue ? avgBeforeValue.toFixed(1) : '—';
  const avgAfter = avgAfterValue ? avgAfterValue.toFixed(1) : '—';
  const avgDelta = avgBeforeValue !== null && avgAfterValue !== null
    ? (avgAfterValue - avgBeforeValue).toFixed(1)
    : '—';
  const deltaColor = avgBeforeValue !== null && avgAfterValue !== null
    ? (avgAfterValue - avgBeforeValue) > 0 ? 'var(--olive)' : (avgAfterValue - avgBeforeValue) < 0 ? 'var(--terracotta)' : 'var(--gold)'
    : 'var(--gold-dark)';
  const coverage = beforeEntries.length > 0
    ? Math.max(0, Math.min(100, Math.round((afterEntries.length / beforeEntries.length) * 100)))
    : 65;
  const beforeFill = avgBeforeValue !== null ? Math.max(0, Math.min(100, (avgBeforeValue / 5) * 100)) : 0;
  const afterFill = avgAfterValue !== null ? Math.max(0, Math.min(100, (avgAfterValue / 5) * 100)) : 0;

  const bodyHtml = `
    <div class="module-analytics">
      <section class="module-analytics__hero">
        <div class="module-analytics__eyebrow badge badge--gold">Análisis del módulo</div>

        <div class="module-analytics__identity">
          <div class="module-analytics__glyph" aria-hidden="true">${tool.letter}</div>
          <div class="module-analytics__identity-copy">
            <h3 class="module-analytics__title">${tool.name}</h3>
            <p class="module-analytics__subtitle">${tool.greek} · ${tool.verb}</p>
          </div>
        </div>

        <div class="module-analytics__overview">
          <article class="module-analytics__ring" style="--coverage: ${coverage};">
            <div class="module-analytics__ring-core">
              <span class="module-analytics__ring-label">Respuestas totales</span>
              <strong class="module-analytics__ring-value">${totalResponses}</strong>
              <span class="module-analytics__ring-caption">${coverage}% cobertura</span>
            </div>
          </article>

          <div class="module-analytics__bars">
            <article class="module-analytics__bar-card">
              <div class="module-analytics__bar-head">
                <span class="module-analytics__bar-label">Promedio antes</span>
                <span class="module-analytics__bar-value">${avgBefore}</span>
              </div>
              <div class="module-analytics__bar-track">
                <div class="module-analytics__bar-fill" style="width: ${beforeFill}%;"></div>
              </div>
            </article>

            <article class="module-analytics__bar-card">
              <div class="module-analytics__bar-head">
                <span class="module-analytics__bar-label">Promedio después</span>
                <span class="module-analytics__bar-value" style="color: ${deltaColor};">${avgAfter}</span>
              </div>
              <div class="module-analytics__bar-track">
                <div class="module-analytics__bar-fill module-analytics__bar-fill--accent" style="width: ${afterFill}%;"></div>
              </div>
            </article>

            <article class="module-analytics__delta card">
              <span class="module-analytics__delta-label">Cambio</span>
              <span class="module-analytics__delta-value" style="color: ${deltaColor};">${avgDelta}</span>
              <span class="module-analytics__delta-helper">Comparativa entre antes y después</span>
            </article>
          </div>
        </div>
      </section>

      ${beforeEntries.length > 0 ? `
      <div class="module-analytics__panels">
        <section class="analytics-panel card">
          <div class="analytics-panel__header">
            <h4>Distribución antes</h4>
            <span class="analytics-panel__count">${beforeEntries.length} respuestas</span>
          </div>
          ${renderDistribution(beforeEntries)}
        </section>

        ${afterEntries.length > 0 ? `
        <section class="analytics-panel card">
          <div class="analytics-panel__header">
            <h4>Distribución después</h4>
            <span class="analytics-panel__count">${afterEntries.length} respuestas</span>
          </div>
          ${renderDistribution(afterEntries)}
        </section>
        ` : `
        <section class="analytics-panel card">
          <div class="empty-state">
            <div class="empty-state__icon">Γ</div>
            <p class="empty-state__text">Esperando respuestas del cierre...</p>
          </div>
        </section>
        `}
      </div>
      ` : `
      <div class="empty-state card card--elevated">
        <div class="empty-state__icon">Γ</div>
        <p class="empty-state__text">Esperando respuestas de los estudiantes...</p>
      </div>
      `}
    </div>

    <div class="module-analytics__footer">
      <p class="module-analytics__footer-copy">Esperando respuestas de los estudiantes...</p>
      <button class="btn btn--ghost" id="gnosis-refresh">
        ↻ Actualizar datos
      </button>
    </div>
  `;

  return renderToolLayout(tool, bodyHtml);
}

function renderDistribution(entries) {
  const counts = [0, 0, 0, 0, 0];
  entries.forEach(e => { counts[e.value - 1]++; });
  const max = Math.max(...counts, 1);
  const labels = ['1', '2', '3', '4', '5'];

  return `
    <div class="analytics-chart">
      ${counts.map((c, i) => `
        <div class="analytics-chart__item">
          <span class="analytics-chart__count">${c}</span>
          <div class="analytics-chart__track">
            <div class="analytics-chart__bar" style="height: ${(c / max) * 100}%;"></div>
          </div>
          <span class="analytics-chart__label">${labels[i]}</span>
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
  initTeacherToolLiveSync('gnosis');
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
      const student = getStudentName();
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
      const student = getStudentName();
      addToolEntry(session.code, 'gnosis', { phase: 'after', value: parseInt(sliderAfter.value), studentId, student });
      showToast('Reflexión final guardada', 'success');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  }

  // Refresh button (teacher) — async cloud fetch
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
