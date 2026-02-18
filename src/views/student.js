// ==========================================================================
// PAIDEIA — Student Join View
// El estudiante se une a una sesión con un código
// ==========================================================================

import { renderHeader } from '../components/header.js';
import { joinSession, setCurrentSession, setStudentName, getStudentId } from '../utils/session.js';

export function renderStudentJoin() {
  return `
    ${renderHeader()}
    <main class="page">
      <div class="tool-view">
        <div class="tool-view__header animate-fade-in">
          <div class="tool-view__greek-letter" style="font-size: var(--text-5xl);">Π</div>
          <h2 class="tool-view__name">Únete a una sesión</h2>
          <p class="tool-view__concept">Ingresa el código de tu clase</p>
        </div>

        <form id="join-form" class="animate-slide-up">
          <div class="input-group">
            <label for="code">Código de sesión</label>
            <input
              type="text"
              id="code"
              class="input"
              placeholder="Ej: ABCD"
              maxlength="4"
              style="text-align: center; font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;"
              required
              autocomplete="off"
            />
          </div>

          <div id="join-error" class="join-error" style="display: none;">
            <span class="join-error__icon">⚠</span>
            Sesión no encontrada. Verifica el código e intenta de nuevo.
          </div>

          <div class="input-group">
            <label for="student-name">Tu nombre (opcional)</label>
            <input type="text" id="student-name" class="input" placeholder="Anónimo" />
          </div>

          <button type="submit" class="btn btn--gold btn--lg btn--full">
            Entrar a la sesión
          </button>

          <div style="text-align: center; margin-top: var(--space-lg);">
            <a href="#/" class="btn btn--ghost">
              Volver al inicio
            </a>
          </div>
        </form>
      </div>
    </main>
  `;
}

export function initStudentJoin() {
  const form = document.getElementById('join-form');
  if (!form) return;

  // Auto-focus code input
  const codeInput = document.getElementById('code');
  if (codeInput) {
    codeInput.focus();
    // Auto-uppercase as they type
    codeInput.addEventListener('input', () => {
      codeInput.value = codeInput.value.toUpperCase();
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = document.getElementById('code').value.trim().toUpperCase();
    const name = document.getElementById('student-name').value.trim() || 'Anónimo';

    const session = joinSession(code);
    if (!session) {
      const errorEl = document.getElementById('join-error');
      errorEl.style.display = 'flex';
      // Shake animation
      errorEl.classList.remove('shake');
      void errorEl.offsetWidth; // trigger reflow
      errorEl.classList.add('shake');
      return;
    }

    document.getElementById('join-error').style.display = 'none';
    setCurrentSession(session, 'student');
    setStudentName(name);
    getStudentId(); // Generate student ID
    window.location.hash = `/session/${code}`;
  });
}
