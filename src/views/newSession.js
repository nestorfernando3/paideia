// ==========================================================================
// PAIDEIA — New Session View
// El docente crea una sesión de clase
// ==========================================================================

import { renderHeader } from '../components/header.js';
import { TOOLS, renderToolCard } from '../components/toolCard.js';
import { startSession, setCurrentSession } from '../utils/session.js';

export function renderNewSession() {
    const toolCheckboxes = TOOLS.map(t => `
    <label class="tool-checkbox" data-tool="${t.id}">
      <input type="checkbox" value="${t.id}" checked />
      <span class="tool-checkbox__letter">${t.letter}</span>
      <span class="tool-checkbox__name">${t.name}</span>
      <span class="tool-checkbox__verb">${t.verb}</span>
    </label>
  `).join('');

    return `
    ${renderHeader()}
    <main class="page">
      <button class="back-nav" onclick="window.location.hash='/'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Volver
      </button>

      <div class="tool-view">
        <div class="tool-view__header animate-fade-in">
          <div class="tool-view__greek-letter">✦</div>
          <h2 class="tool-view__name">Nueva Sesión de Clase</h2>
          <p class="tool-view__concept">Crea un espacio de aprendizaje</p>
        </div>

        <form id="session-form" class="animate-slide-up">
          <div class="input-group">
            <label for="topic">Tema de la clase</label>
            <input type="text" id="topic" class="input" placeholder="Ej: La metáfora en la poesía barroca" required />
          </div>

          <div class="input-group">
            <label>Herramientas activas</label>
            <p class="hint">Selecciona las herramientas que usarás en esta sesión</p>
            <div class="tool-checkboxes" style="margin-top: var(--space-md);">
              ${toolCheckboxes}
            </div>
          </div>

          <button type="submit" class="btn btn--gold btn--lg btn--full" style="margin-top: var(--space-lg);">
            Crear sesión
          </button>
        </form>
      </div>
    </main>
  `;
}

export function initNewSession() {
    const form = document.getElementById('session-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const topic = document.getElementById('topic').value.trim();
        if (!topic) return;

        const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
        const activeTools = Array.from(checkboxes).map(cb => cb.value);

        if (activeTools.length === 0) {
            alert('Selecciona al menos una herramienta');
            return;
        }

        const session = startSession(topic, activeTools);
        setCurrentSession(session, 'teacher');
        window.location.hash = `/session/${session.code}`;
    });
}
