// ==========================================================================
// PAIDEIA — Shared Layout & Navigation
// ==========================================================================

import { renderHeader } from '../components/header.js';
import { getCurrentSession, getStudentId, isTeacher } from '../utils/session.js';
import { getNextTool } from '../utils/flow.js';

/**
 * Renders the standardized tool layout with navigation
 * @param {object} tool - Tool definition object
 * @param {string} bodyHtml - Main content HTML
 * @returns {string} Full HTML
 */
export function renderToolLayout(tool, bodyHtml) {
  const session = getCurrentSession();
  const backHash = session ? `/session/${session.code}` : '/';

  // Navigation Flow (Student only)
  let navHtml = '';
  if (session && !isTeacher()) {
    const nextId = getNextTool(tool.id, session.activeTools || [], session.code, getStudentId());
    if (nextId) {
      const nextToolName = getToolName(nextId); // Helper needed
      navHtml = `
            <a href="#/tool/${nextId}" class="btn-flow animate-slide-up">
              <span>Siguiente: ${nextToolName}</span>
              <span class="btn-flow__arrow">→</span>
            </a>
          `;
    } else if (tool.id === 'gnosis') {
      // End of flow (specifically at Gnosis)
      navHtml = `
            <a href="#/session/${session.code}" class="btn-flow btn-flow--finish animate-slide-up" style="background: var(--olive); color: var(--marble);">
              <span>Finalizar Sesión</span>
              <span class="btn-flow__arrow">🏁</span>
            </a>
          `;
    }
  }

  return `
    ${renderHeader()}
    <main class="page">
      <div class="nav-bar">
          <a class="back-nav" href="#${backHash}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span class="back-nav__text">Volver</span>
          </a>
      </div>
      
      <div class="tool-view animate-fade-in">
        <div class="tool-view__header">
          <div class="tool-view__greek-letter">${tool.letter}</div>
          <h2 class="tool-view__name">${tool.name}</h2>
          <p class="tool-view__concept">${tool.greek} · ${tool.verb}</p>
        </div>
        <div class="tool-view__body">
          ${bodyHtml}
        </div>
      </div>
      
      ${navHtml}
    </main>
  `;
}

// Quick helper to get name (avoid circular dependency with toolCard if possible, 
// but we might need to duplicate or pass it in).
// For now, simple map or import.
import { TOOLS } from './toolCard.js';

function getToolName(id) {
  const t = TOOLS.find(x => x.id === id);
  return t ? t.name : 'Siguiente';
}
