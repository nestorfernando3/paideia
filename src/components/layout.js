// ==========================================================================
// PAIDEIA — Shared Layout & Navigation
// ==========================================================================

import { renderHeader } from '../components/header.js';
import { getCurrentSession, getStudentId, isTeacher } from '../utils/session.js';
import { getNextTool } from '../utils/flow.js';
import { TOOLS } from './toolCard.js';
import { getToolEntries } from '../utils/storage.js';

/**
 * Renders the standardized tool layout with navigation
 * @param {object} tool - Tool definition object
 * @param {string} bodyHtml - Main content HTML
 * @returns {string} Full HTML
 */
export function renderToolLayout(tool, bodyHtml) {
  const session = getCurrentSession();
  const backHash = session ? `/session/${session.code}` : '/';
  const student = session && !isTeacher();

  // Navigation Flow (Student only)
  let navHtml = '';
  let progressHtml = '';

  if (student) {
    const studentId = getStudentId();
    const activeTools = session.activeTools || [];
    const nextId = getNextTool(tool.id, activeTools, session.code, studentId);

    // Build progress indicator
    progressHtml = renderProgressSteps(tool.id, activeTools, session.code, studentId);

    if (nextId) {
      const nextToolName = getToolName(nextId);
      navHtml = `
            <a href="#/tool/${nextId}" class="btn-flow">
              <span>Siguiente: ${nextToolName}</span>
              <span class="btn-flow__arrow">→</span>
            </a>
          `;
    } else if (tool.id === 'gnosis') {
      // End of flow
      navHtml = `
            <a href="#/session/${session.code}" class="btn-flow btn-flow--finish">
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

      ${progressHtml}
      
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

function getToolName(id) {
  const t = TOOLS.find(x => x.id === id);
  return t ? t.name : 'Siguiente';
}

function getToolLetter(id) {
  const t = TOOLS.find(x => x.id === id);
  return t ? t.letter : '·';
}

/**
 * Renders a visual progress bar showing the student's position in the flow
 */
function renderProgressSteps(currentToolId, activeTools, sessionCode, studentId) {
  // Build the ordered list of active tools in flow order
  const middleTools = ['eikasia', 'noesis', 'aporia', 'methexis', 'logos', 'anamnesis'];
  const middleActive = middleTools.filter(t => activeTools.includes(t));

  // Full flow: Gnosis (start) → middle tools → Gnosis (end)
  const flowSteps = [];
  if (activeTools.includes('gnosis')) {
    flowSteps.push({ id: 'gnosis', label: 'Inicio', letter: 'Γ' });
  }
  middleActive.forEach(id => {
    flowSteps.push({ id, label: getToolName(id), letter: getToolLetter(id) });
  });
  if (activeTools.includes('gnosis') && middleActive.length > 0) {
    flowSteps.push({ id: 'gnosis-end', label: 'Cierre', letter: 'Γ' });
  }

  if (flowSteps.length <= 1) return '';

  // Determine which steps are done
  const gnosisEntries = getToolEntries(sessionCode, 'gnosis');
  const hasBefore = gnosisEntries.some(e => e.phase === 'before' && e.studentId === studentId);
  const hasAfter = gnosisEntries.some(e => e.phase === 'after' && e.studentId === studentId);

  const stepsHtml = flowSteps.map((step, i) => {
    let state = '';

    if (step.id === 'gnosis') {
      // Start gnosis
      if (hasBefore) state = 'progress-step--done';
      if (currentToolId === 'gnosis' && !hasBefore) state = 'progress-step--current';
    } else if (step.id === 'gnosis-end') {
      // End gnosis
      if (hasAfter) state = 'progress-step--done';
      if (currentToolId === 'gnosis' && hasBefore) state = 'progress-step--current';
    } else {
      // Middle tool
      const entries = getToolEntries(sessionCode, step.id);
      const hasEntry = entries.some(e => e.studentId === studentId);
      if (hasEntry) state = 'progress-step--done';
      if (currentToolId === step.id) state = 'progress-step--current';
    }

    const lineHtml = i < flowSteps.length - 1 ? '<div class="progress-step__line"></div>' : '';

    return `
          <div class="progress-step ${state}">
            ${lineHtml}
            <div class="progress-step__dot"></div>
            <span class="progress-step__label">${step.label}</span>
          </div>
        `;
  }).join('');

  return `<div class="progress-steps">${stepsHtml}</div>`;
}
