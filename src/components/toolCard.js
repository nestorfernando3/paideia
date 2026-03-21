// ==========================================================================
// PAIDEIA — Tool Card Component
// ==========================================================================

export const TOOLS = [
    {
        id: 'gnosis',
        name: 'Autoevaluación',
        greek: 'Γνῶσις',
        letter: 'Γ',
        verb: 'conoce',
        description: 'Autoevaluación: ¿qué tan seguro te sientes con el tema?',
        phase: 'before',
        phaseLabel: 'Antes de la clase',
    },
    {
        id: 'eikasia',
        name: 'Hipótesis',
        greek: 'Εἰκασία',
        letter: 'Ε',
        verb: 'anticipa',
        description: 'Hipótesis: formula una predicción antes de aprender.',
        phase: 'before',
        phaseLabel: 'Antes de la clase',
    },
    {
        id: 'aporia',
        name: 'Dudas',
        greek: 'Ἀπορία',
        letter: 'Α',
        verb: 'duda',
        description: 'Dudas: señala anónimamente dónde te pierdes.',
        phase: 'during',
        phaseLabel: 'Durante la clase',
    },
    {
        id: 'noesis',
        name: 'Comprensión',
        greek: 'Νόησις',
        letter: 'Ν',
        verb: 'comprende',
        description: 'Comprensión: verificación rápida de entendimiento.',
        phase: 'during',
        phaseLabel: 'Durante la clase',
    },
    {
        id: 'methexis',
        name: 'Conexión',
        greek: 'Μέθεξις',
        letter: 'Μ',
        verb: 'conecta',
        description: 'Conexión: conecta lo aprendido con tu mundo.',
        phase: 'after',
        phaseLabel: 'Después de la clase',
    },
    {
        id: 'logos',
        name: 'Síntesis',
        greek: 'Λόγος',
        letter: 'Λ',
        verb: 'cristaliza',
        description: 'Síntesis: resume toda la clase en una sola palabra.',
        phase: 'after',
        phaseLabel: 'Después de la clase',
    },
    {
        id: 'anamnesis',
        name: 'Reflexión',
        greek: 'Ἀνάμνησις',
        letter: 'Α',
        verb: 'reflexiona',
        description: 'Reflexión: aprendí, me pregunto, conecté.',
        phase: 'after',
        phaseLabel: 'Después de la clase',
    },
];

export function renderToolIdentity(tool, opts = {}) {
    const {
        showLetter = true,
        showVerb = true,
        compact = false,
        className = '',
    } = opts;

    const classes = [
        'tool-identity',
        compact ? 'tool-identity--compact' : '',
        className,
    ].filter(Boolean).join(' ');

    return `
      <div class="${classes}">
        ${showLetter ? `<div class="tool-identity__letter">${tool.letter}</div>` : ''}
        <div class="tool-identity__body">
          <div class="tool-identity__name">${tool.name}</div>
          <div class="tool-identity__greek">${tool.greek}</div>
          ${showVerb ? `<div class="tool-identity__verb">${tool.verb}</div>` : ''}
        </div>
      </div>
    `;
}

export function renderToolCard(tool, opts = {}) {
    const { selectable = false, selected = false, disabled = false } = opts;

    const selectedClass = selected ? 'tool-card--selected' : '';
    const disabledClass = disabled ? 'tool-card--disabled' : '';

    const identity = renderToolIdentity(tool, {
        showLetter: true,
        showVerb: true,
        compact: true,
    });

    if (selectable) {
        return `
        <button
          type="button"
          class="tool-card ${selectedClass} ${disabledClass}"
          data-tool-select="${tool.id}"
          aria-pressed="${selected ? 'true' : 'false'}"
          ${disabled ? 'disabled' : ''}
          id="card-${tool.id}"
        >
          ${identity}
          <div class="tool-card__description">${tool.description}</div>
        </button>
      `;
    }

    return `
    <a class="tool-card ${selectedClass} ${disabledClass}" href="#/tool/${tool.id}" id="card-${tool.id}" aria-label="${tool.name} · ${tool.greek}">
      ${identity}
      <div class="tool-card__description">${tool.description}</div>
    </a>
  `;
}

export function getToolById(id) {
    return TOOLS.find(t => t.id === id);
}

export function getToolsByPhase(phase) {
    return TOOLS.filter(t => t.phase === phase);
}
