// ==========================================================================
// PAIDEIA — Header Component
// ==========================================================================

import { getCurrentSession, getCurrentRole, generateGreekCode } from '../utils/session.js';

export function renderHeader() {
  const session = getCurrentSession();
  const role = getCurrentRole();

  let sessionHtml = '';
  if (session && session.active) {
    const greekCode = generateGreekCode(session.code);
    const roleLabel = role === 'teacher' ? 'Docente' : 'Estudiante';
    const roleBadgeClass = role === 'teacher' ? 'badge--gold' : 'badge--aegean';
    sessionHtml = `
      <div class="header__session">
        <span class="badge ${roleBadgeClass}" style="font-size: 0.6rem; padding: 2px 8px;">${roleLabel}</span>
        <span class="live-badge"><span class="live-badge__dot"></span> En sesión</span>
        <span class="header__session-code" title="${greekCode}">${session.code}</span>
      </div>
    `;
  }

  // Navigate to session if in one, otherwise home
  const homeHash = session && session.active ? `/session/${session.code}` : '/';

  return `
    <header class="header">
      <a class="header__brand" href="#${homeHash}">
        <span class="header__icon">✦</span>
        <span class="header__title">PAIDEIA</span>
        <span class="header__subtitle">Παιδεία · formación integral</span>
      </a>
      ${sessionHtml}
    </header>
  `;
}
