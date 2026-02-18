// ==========================================================================
// PAIDEIA — Guía del Docente
// Manual interactivo para el profesor
// ==========================================================================

import { renderHeader } from '../components/header.js';
import { TOOLS } from '../components/toolCard.js';

export function renderGuiaDocente() {
    const toolGuides = TOOLS.map(tool => {
        const tips = TOOL_TIPS[tool.id] || {};
        return `
      <div class="guide-section" id="guide-${tool.id}">
        <div class="guide-section__header">
          <span class="guide-section__letter">${tool.letter}</span>
          <div>
            <h3 class="guide-section__title">${tool.name} <span class="text-greek">${tool.greek}</span></h3>
            <span class="badge badge--${PHASE_BADGES[tool.phase]}">${tool.phaseLabel}</span>
          </div>
        </div>
        <p class="guide-section__description">${tool.description}</p>
        
        <div class="guide-tip">
          <div class="guide-tip__icon">💡</div>
          <div>
            <strong>Para qué sirve:</strong>
            <p>${tips.purpose || ''}</p>
          </div>
        </div>

        <div class="guide-tip">
          <div class="guide-tip__icon">📋</div>
          <div>
            <strong>Cómo usarlo en clase:</strong>
            <p>${tips.howTo || ''}</p>
          </div>
        </div>

        <div class="guide-tip">
          <div class="guide-tip__icon">⏱</div>
          <div>
            <strong>Tiempo sugerido:</strong>
            <p>${tips.time || ''}</p>
          </div>
        </div>
      </div>
    `;
    }).join('');

    return `
    ${renderHeader()}
    <main class="page">
      <a class="back-nav" href="#/">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Volver al inicio
      </a>
      <div class="tool-view animate-fade-in">
        <div class="tool-view__header">
          <div class="tool-view__greek-letter">📖</div>
          <h2 class="tool-view__name">Guía del Docente</h2>
          <p class="tool-view__concept">Todo lo que necesitas para usar Paideia en tu aula</p>
        </div>

        <div class="tool-view__body">
          <!-- Quick Start -->
          <div class="card card--elevated" style="margin-bottom: var(--space-2xl); padding: var(--space-xl);">
            <h3 style="font-family: var(--font-display); margin-bottom: var(--space-md); color: var(--gold-dark);">
              🚀 Inicio Rápido
            </h3>
            <ol class="guide-steps">
              <li>
                <strong>Crea una sesión</strong> — Haz clic en «Crear sesión de clase» e ingresa el tema del día.
              </li>
              <li>
                <strong>Selecciona herramientas</strong> — Elige las herramientas que usarás (puedes activar todas o solo las que necesites).
              </li>
              <li>
                <strong>Comparte el código</strong> — Dale a tus estudiantes el código de 4 letras o muestra el QR.
              </li>
              <li>
                <strong>Los estudiantes se unen</strong> — Entran desde «Unirse como estudiante» e ingresan el código.
              </li>
              <li>
                <strong>Monitorea en tiempo real</strong> — Ve las respuestas de tus estudiantes en la vista de cada herramienta.
              </li>
              <li>
                <strong>Finaliza la sesión</strong> — Al terminar la clase, usa «Finalizar sesión».
              </li>
            </ol>
          </div>

          <!-- Pedagogical Flow -->
          <div class="card" style="margin-bottom: var(--space-2xl); padding: var(--space-xl);">
            <h3 style="font-family: var(--font-display); margin-bottom: var(--space-md); color: var(--gold-dark);">
              🔄 Flujo Pedagógico Recomendado
            </h3>
            <div class="flow-diagram">
              <div class="flow-step flow-step--before">
                <div class="flow-step__phase">Antes de la clase</div>
                <div class="flow-step__tools">Gnosis + Eikasia</div>
                <p class="flow-step__desc">Los estudiantes evalúan su conocimiento previo y formulan hipótesis.</p>
              </div>
              <div class="flow-arrow">→</div>
              <div class="flow-step flow-step--during">
                <div class="flow-step__phase">Durante la clase</div>
                <div class="flow-step__tools">Aporia + Noesis</div>
                <p class="flow-step__desc">Monitorea comprensión en tiempo real e identifica dudas.</p>
              </div>
              <div class="flow-arrow">→</div>
              <div class="flow-step flow-step--after">
                <div class="flow-step__phase">Después de la clase</div>
                <div class="flow-step__tools">Methexis + Logos + Anamnesis</div>
                <p class="flow-step__desc">Los estudiantes reflexionan, conectan y sintetizan.</p>
              </div>
            </div>
          </div>

          <!-- Tool Details -->
          <h3 style="font-family: var(--font-display); margin-bottom: var(--space-xl); text-align: center; color: var(--gold-dark);">
            Las 7 Herramientas
          </h3>

          ${toolGuides}

          <!-- Tips -->
          <div class="card card--elevated" style="margin-top: var(--space-2xl); padding: var(--space-xl);">
            <h3 style="font-family: var(--font-display); margin-bottom: var(--space-md); color: var(--gold-dark);">
              ✨ Consejos Prácticos
            </h3>
            <ul class="guide-tips-list">
              <li>No necesitas usar las 7 herramientas en cada clase. Empieza con 2-3 y ve incorporando más.</li>
              <li><strong>Gnosis es ideal</strong> para abrir y cerrar la clase: muestra cómo cambió la percepción de los estudiantes.</li>
              <li><strong>Aporia es poderosa</strong> durante la explicación: si ves que el nivel de confusión sube, haz una pausa.</li>
              <li><strong>Logos funciona excelente</strong> como actividad de cierre de 2 minutos.</li>
              <li>Los datos son anónimos para los estudiantes, lo que fomenta la honestidad.</li>
              <li>Usa el botón <strong>↻ Actualizar</strong> en cada herramienta para ver las respuestas más recientes.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  `;
}

export function initGuiaDocente() {
    // Smooth scroll to sections
    document.querySelectorAll('[data-scroll-to]').forEach(el => {
        el.addEventListener('click', () => {
            const target = document.getElementById(el.getAttribute('data-scroll-to'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

const PHASE_BADGES = {
    before: 'gold',
    during: 'terracotta',
    after: 'olive',
};

const TOOL_TIPS = {
    gnosis: {
        purpose: 'Mide la percepción de seguridad del estudiante antes y después de la clase. Permite ver el crecimiento metacognitivo: ¿cambiaron las percepciones después del aprendizaje?',
        howTo: 'Pide a los estudiantes que respondan al inicio de la clase (escala 1-5). Al final, pídeles que vuelvan a responder. Compara los promedios del grupo.',
        time: '2 minutos al inicio + 2 minutos al final',
    },
    eikasia: {
        purpose: 'Activa el pensamiento predictivo. Al formular hipótesis, los estudiantes se comprometen cognitivamente con el tema antes de la exposición.',
        howTo: 'Antes de comenzar tu explicación, pide que cada estudiante escriba su predicción o conjetura. Al final de la clase, revisa grupalmente las hipótesis.',
        time: '3-5 minutos al inicio de la clase',
    },
    aporia: {
        purpose: 'Da voz a las dudas de forma anónima. Reduce la barrera social de «parecer que no entiendo». El indicador de confusión te dice cuándo detenerte.',
        howTo: 'Activa Aporia durante tu explicación. Pide a los estudiantes que presionen «Voy bien» o «Me perdí» periódicamente. Si la confusión sube de 60%, haz una pausa y aclara.',
        time: 'Continuo durante la clase',
    },
    noesis: {
        purpose: 'Verificación instantánea de comprensión. Más rápido que preguntar al aire y más honesto porque es individual.',
        howTo: 'Después de explicar un concepto clave, pide que respondan. Si los «Más o menos» o «No entiendo» superan el 40%, explica el tema de otra forma.',
        time: '1 minuto por verificación',
    },
    methexis: {
        purpose: 'Fortalece el aprendizaje significativo al conectar el contenido con experiencias y conocimientos previos de los estudiantes.',
        howTo: 'Pide a los estudiantes que piensen en una materia, experiencia o situación donde el concepto aprendido también aplique. Comparte las conexiones más creativas con el grupo.',
        time: '5-7 minutos',
    },
    logos: {
        purpose: 'Obliga a la síntesis extrema. Elegir UNA palabra requiere procesar profundamente qué fue lo más importante de la clase.',
        howTo: 'Pide que piensen 30 segundos en silencio y luego escriban su palabra. La nube de palabras resultante revela qué conceptos quedaron más fuertes en el grupo.',
        time: '2-3 minutos',
    },
    anamnesis: {
        purpose: 'Estructura la reflexión en tres dimensiones: lo aprendido, lo que genera curiosidad, y las conexiones. Es el ticket de salida más completo.',
        howTo: 'Usa «Aprendí, Me pregunto, Lo conecté con» como actividad de cierre. Lee seleccionadas las reflexiones más interesantes al día siguiente para abrir la nueva clase.',
        time: '5-8 minutos al final de la clase',
    },
};
