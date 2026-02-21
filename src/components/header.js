// ==========================================================================
// PAIDEIA — Header Component
// ==========================================================================

import { getCurrentSession, getCurrentRole, generateGreekCode } from '../utils/session.js';

import { backend } from '../utils/backend.js';

export function renderHeader() {
  const session = getCurrentSession();
  const role = getCurrentRole();

  let sessionHtml = '';
  if (session) {
    const greekCode = generateGreekCode(session.code);
    const roleLabel = role === 'teacher' ? 'Docente' : 'Estudiante';
    const roleBadgeClass = role === 'teacher' ? 'badge--gold' : 'badge--aegean';
    sessionHtml = `
      <div class="header__session">
        <span class="badge ${roleBadgeClass}" style="font-size: 0.6rem; padding: 2px 8px;">${roleLabel}</span>
        ${session.active ?
        '<span class="live-badge"><span class="live-badge__dot"></span> En sesión</span>' :
        '<span class="badge badge--olive" style="font-size: 0.6rem; padding: 2px 8px;">Finalizada</span>'}
        <span class="header__session-code" title="${greekCode}">${session.code}</span>
      </div>
    `;
  }

  // Local Mode Indicator
  let modeHtml = '';
  if (backend.mode === 'LOCAL') {
    modeHtml = `<span class="badge badge--olive" style="font-size: 0.6rem; padding: 2px 6px; margin-right: var(--space-sm);">📡 MODO LOCAL</span>`;
  }

  // Navigate to session if in one, otherwise home
  const homeHash = session ? `/session/${session.code}` : '/';

  return `
    <header class="header">
      <a class="header__brand" href="#${homeHash}">
        <span class="header__icon">✦</span>
        <div style="display: flex; flex-direction: column;">
            <div>
                <span class="header__title">PAIDEIA</span>
                ${modeHtml}
            </div>
            <span class="header__subtitle">Παιδεία · formación integral</span>
        </div>
      </a>
      ${sessionHtml}
    </header>
  `;
}
