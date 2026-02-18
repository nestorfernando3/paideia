// ==========================================================================
// PAIDEIA — Teacher Join View
// El docente se une a una sesión existente con clave
// ==========================================================================

import { renderHeader } from '../components/header.js';
import { joinSessionAsync, setCurrentSession } from '../utils/session.js';

export function renderTeacherJoin() {
    return `
    ${renderHeader()}
    <main class="page">
      <button class="back-nav" onclick="window.location.hash='/'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Volver
      </button>

      <div class="tool-view">
        <div class="tool-view__header animate-fade-in">
          <div class="tool-view__greek-letter">Ω</div>
          <h2 class="tool-view__name">Acceso Docente</h2>
          <p class="tool-view__concept">Reingresar a una sesión activa</p>
        </div>

        <form id="teacher-join-form" class="animate-slide-up">
          <div class="input-group">
            <label for="session-code">Código de sesión</label>
            <input 
              type="text" 
              id="session-code" 
              class="input code-input" 
              placeholder="ABCD" 
              maxlength="4" 
              pattern="[A-Za-z]{4}"
              autocomplete="off"
              required 
            />
          </div>

          <div class="input-group">
            <label for="teacher-password">Clave de docente</label>
            <input 
              type="password" 
              id="teacher-password" 
              class="input" 
              placeholder="Clave maestra" 
              required 
            />
          </div>

          <button type="submit" class="btn btn--gold btn--lg btn--full" id="teacher-join-btn" style="margin-top: var(--space-lg);">
            Entrar al panel
          </button>
        </form>
      </div>
    </main>
  `;
}

export function initTeacherJoin() {
    const form = document.getElementById('teacher-join-form');
    const btn = document.getElementById('teacher-join-btn');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const codeInput = document.getElementById('session-code');
            const passwordInput = document.getElementById('teacher-password');

            const code = codeInput.value.trim().toUpperCase();
            const password = passwordInput.value.trim();

            if (code.length !== 4) {
                alert('El código debe tener 4 letras');
                return;
            }

            if (password !== 'paideia') {
                alert('⛔ Clave incorrecta');
                return;
            }

            // Disabled button
            if (btn) {
                btn.disabled = true;
                btn.textContent = '⏳ Verificando...';
            }

            try {
                const session = await joinSessionAsync(code);
                if (session) {
                    // Success! Set as teacher
                    setCurrentSession(session, 'teacher');
                    window.location.hash = `/session/${code}`;
                } else {
                    alert('Sesión no encontrada en la nube');
                    if (btn) {
                        btn.disabled = false;
                        btn.textContent = 'Entrar al panel';
                    }
                }
            } catch (err) {
                console.error(err);
                alert('Error conectando con la base de datos');
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = 'Entrar al panel';
                }
            }
        });
    }
}
