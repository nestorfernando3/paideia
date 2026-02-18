// ==========================================================================
// PAIDEIA — Guía del Estudiante
// Manual interactivo para el alumno
// ==========================================================================

import { renderHeader } from '../components/header.js';
import { TOOLS } from '../components/toolCard.js';

export function renderGuiaEstudiante() {
    const toolExplanations = TOOLS.map(tool => {
        const info = TOOL_INFO[tool.id] || {};
        return `
      <div class="guide-student-card">
        <div class="guide-student-card__header">
          <span class="guide-student-card__letter">${tool.letter}</span>
          <div>
            <strong>${tool.name}</strong>
            <span class="guide-student-card__phase">${tool.phaseLabel}</span>
          </div>
        </div>
        <p class="guide-student-card__what">${info.what}</p>
        <div class="guide-student-card__example">
          <span>💬</span> <em>${info.example}</em>
        </div>
      </div>
    `;
    }).join('');

    return `
    ${renderHeader()}
    <main class="page">
      <a class="back-nav" href="#/">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Volver
      </a>
      <div class="tool-view animate-fade-in">
        <div class="tool-view__header">
          <div class="tool-view__greek-letter">🎓</div>
          <h2 class="tool-view__name">Guía del Estudiante</h2>
          <p class="tool-view__concept">Cómo usar Paideia en tu clase</p>
        </div>

        <div class="tool-view__body">
          <!-- How to Join -->
          <div class="card card--elevated" style="margin-bottom: var(--space-2xl); padding: var(--space-xl);">
            <h3 style="font-family: var(--font-display); margin-bottom: var(--space-md); color: var(--gold-dark);">
              🚀 ¿Cómo me uno a una sesión?
            </h3>
            <ol class="guide-steps">
              <li>
                Abre <strong>Paideia</strong> en tu celular o computador.
              </li>
              <li>
                Haz clic en <strong>«Unirse como estudiante»</strong>.
              </li>
              <li>
                Escribe el <strong>código de 4 letras</strong> que tu profesor comparte (ej: ABGD).
              </li>
              <li>
                Opcionalmente, escribe tu nombre (o quédate como <em>Anónimo</em>).
              </li>
              <li>
                ¡Listo! Ya estás dentro de la sesión. Verás las herramientas que tu profesor activó.
              </li>
            </ol>
          </div>

          <!-- What is Paideia -->
          <div class="card" style="margin-bottom: var(--space-2xl); padding: var(--space-xl);">
            <h3 style="font-family: var(--font-display); margin-bottom: var(--space-md); color: var(--gold-dark);">
              🤔 ¿Qué es Paideia?
            </h3>
            <p style="line-height: 1.7; color: var(--obsidian-soft);">
              <strong>Paideia</strong> (Παιδεία) es una palabra griega que significa <em>formación integral</em>. 
              Es una app que tu profesor usa para hacer la clase más interactiva. 
              Con ella puedes decir si entiendes o no, hacer preguntas anónimas, 
              formular hipótesis y reflexionar sobre lo aprendido.
            </p>
            <p style="line-height: 1.7; color: var(--obsidian-soft); margin-top: var(--space-sm);">
              <strong>Tus respuestas son anónimas</strong> — nadie sabrá quién dijo qué. 
              Así que sé honesto: si no entiendes algo, ¡dilo! Eso ayuda a que la clase mejore para todos.
            </p>
          </div>

          <!-- Tools Explained -->
          <h3 style="font-family: var(--font-display); margin-bottom: var(--space-xl); text-align: center; color: var(--gold-dark);">
            Las herramientas, explicadas simple
          </h3>

          <div class="guide-student-grid">
            ${toolExplanations}
          </div>

          <!-- FAQ -->
          <div class="card card--elevated" style="margin-top: var(--space-2xl); padding: var(--space-xl);">
            <h3 style="font-family: var(--font-display); margin-bottom: var(--space-md); color: var(--gold-dark);">
              ❓ Preguntas Frecuentes
            </h3>
            <div class="faq-item">
              <strong>¿Mi profesor ve mi nombre?</strong>
              <p>No. Todas tus respuestas aparecen como anónimas para el profesor.</p>
            </div>
            <div class="faq-item">
              <strong>¿Puedo cambiar mi respuesta?</strong>
              <p>Una vez enviada, no se puede cambiar. Pero en Gnosis (antes/después) puedes responder dos veces: una al inicio y otra al final.</p>
            </div>
            <div class="faq-item">
              <strong>¿Necesito descargar algo?</strong>
              <p>No. Paideia funciona directamente en el navegador de tu celular o computador. No necesitas instalar nada.</p>
            </div>
            <div class="faq-item">
              <strong>¿Qué pasa si se me cierra la página?</strong>
              <p>Puedes volver a entrar con el mismo código. Sin embargo, tus respuestas anteriores no se recuperarán y podrás enviar nuevas.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}

export function initGuiaEstudiante() {
    // No special initialization needed
}

const TOOL_INFO = {
    gnosis: {
        what: 'Tu profesor te pregunta "¿qué tan seguro te sientes sobre el tema?" Mueves un slider del 1 al 5. Al final de la clase, respondes de nuevo.',
        example: 'Antes de clase: 2/5 (no sé mucho). Después: 4/5 (ahora entiendo mejor).',
    },
    eikasia: {
        what: 'Antes de que empiece la clase, escribes qué crees que vas a aprender o qué predices sobre el tema. Es como apostar qué va a pasar.',
        example: '"Creo que la metáfora es cuando dices algo que no es literal, como decir que alguien es un sol."',
    },
    aporia: {
        what: 'Durante la clase, puedes decir si vas bien o si estás perdido. También puedes escribir dudas anónimas y votar por las dudas de otros.',
        example: 'Presionas 🔴 "Me perdí" cuando el profe explica algo confuso. También escribes "¿por qué se llama metáfora?"',
    },
    noesis: {
        what: 'Tu profesor pregunta "¿entendieron?" y tú respondes: Sí, Más o menos, o No. Es rapidísimo.',
        example: 'Responder toma 2 segundos. Es más fácil que levantar la mano.',
    },
    methexis: {
        what: 'Conectas algo que aprendiste con algo fuera de la clase. ¿En qué otra materia o situación de la vida aplica lo que aprendiste?',
        example: '"La metáfora se conecta con la publicidad, porque los comerciales usan imágenes para decir algo más profundo."',
    },
    logos: {
        what: 'Resumes TODO lo que aprendiste en una sola palabra. Solo una. Eso te obliga a pensar qué fue lo más importante.',
        example: 'Tu palabra podría ser "lenguaje", "imaginación" o "conexión".',
    },
    anamnesis: {
        what: 'Escribes tres cosas: qué aprendiste hoy, qué duda te queda, y con qué lo conectaste. Es tu reflexión de cierre.',
        example: '"Aprendí que una metáfora no solo embellece, sino que cambia cómo pensamos. Me pregunto si hay metáforas en matemáticas."',
    },
};
