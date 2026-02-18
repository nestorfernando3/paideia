// ==========================================================================
// PAIDEIA — Home View
// Dashboard principal + acceso a guías + historial
// ==========================================================================

import { renderHeader } from '../components/header.js';
import { TOOLS, renderToolCard, getToolsByPhase } from '../components/toolCard.js';
import { staggerChildren } from '../utils/animations.js';
import { getSessions } from '../utils/storage.js';

function getRecentSessions() {
  try {
    const sessions = getSessions();
    if (!sessions) return [];
    return Object.values(sessions)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);
  } catch { return []; }
}

export function renderHome() {
  const phases = [
    { key: 'before', label: 'Antes de la clase', icon: '⏮' },
    { key: 'during', label: 'Durante la clase', icon: '⏯' },
    { key: 'after', label: 'Después de la clase', icon: '⏭' },
  ];

  let toolGridHtml = '';
  phases.forEach(phase => {
    const tools = getToolsByPhase(phase.key);
    toolGridHtml += `
      <div class="tool-grid--label">
        <span>${phase.icon} ${phase.label}</span>
      </div>
      ${tools.map(t => renderToolCard(t)).join('')}
    `;
  });

  // Recent sessions
  const recentSessions = getRecentSessions();
  let historyHtml = '';
  if (recentSessions.length > 0) {
    const items = recentSessions.map(s => {
      const date = s.createdAt ? new Date(s.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }) : '';
      const statusBadge = s.active
        ? '<span class="badge badge--live" style="font-size: 0.65rem;">● Activa</span>'
        : '<span class="badge badge--gold" style="font-size: 0.65rem;">Finalizada</span>';
      return `
        <a href="#/session/${s.code}" class="history-item">
          <div class="history-item__code">${s.code}</div>
          <div class="history-item__info">
            <span class="history-item__topic">${s.topic || 'Sin tema'}</span>
            <span class="history-item__date">${date} ${statusBadge}</span>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="history-item__arrow"><path d="M9 18l6-6-6-6"/></svg>
        </a>
      `;
    }).join('');

    historyHtml = `
      <section class="section" style="margin-top: var(--space-2xl);">
        <h3 class="section-title">
          <span>🕓</span> Sesiones recientes
        </h3>
        <div class="history-list">
          ${items}
        </div>
      </section>
    `;
  }

  return `
    ${renderHeader()}
    <main class="page">
      <div class="page-header animate-fade-in">
        <h1>✦ Paideia</h1>
        <p class="subtitle">Παιδεία · el camino hacia la formación integral</p>
      </div>

      <div class="content-container" style="margin-bottom: var(--space-2xl);">
        <div style="display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap;">
          <button class="btn btn--gold btn--lg" onclick="window.location.hash='/new-session'">
            Crear sesión de clase
          </button>
          <button class="btn btn--outline btn--lg" onclick="window.location.hash='/join'">
            Unirse como estudiante
          </button>
        </div>
        <div style="display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap; margin-top: var(--space-md);">
          <a href="#/guia-docente" class="btn btn--ghost btn--sm">
            📖 Guía del Docente
          </a>
          <a href="#/guia-estudiante" class="btn btn--ghost btn--sm">
            🎓 Guía del Estudiante
          </a>
        </div>
      </div>

      <div class="divider--short divider"></div>

      <section class="section">
        <div class="tool-grid" id="tool-grid">
          ${toolGridHtml}
        </div>
      </section>

      ${historyHtml}

      <div class="meander meander--subtle"></div>

      <footer class="footer">
        Eudaimonia · εὐδαιμονία · el florecimiento del ser a través del conocimiento
      </footer>
    </main>
  `;
}

export function initHome() {
  setTimeout(() => staggerChildren('#tool-grid .tool-card', 60), 100);
}
