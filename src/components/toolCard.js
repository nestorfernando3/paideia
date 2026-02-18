// ==========================================================================
// PAIDEIA — Tool Card Component
// ==========================================================================

export const TOOLS = [
    {
        id: 'gnosis',
        name: 'Gnosis',
        greek: 'Γνῶσις',
        letter: 'Γ',
        verb: 'conoce',
        description: 'Autoconocimiento: ¿qué tan seguro te sientes con el tema?',
        phase: 'before',
        phaseLabel: 'Antes de la clase',
    },
    {
        id: 'eikasia',
        name: 'Eikasia',
        greek: 'Εἰκασία',
        letter: 'Ε',
        verb: 'anticipa',
        description: 'Conjetura: formula una hipótesis antes de aprender.',
        phase: 'before',
        phaseLabel: 'Antes de la clase',
    },
    {
        id: 'aporia',
        name: 'Aporia',
        greek: 'Ἀπορία',
        letter: 'Α',
        verb: 'duda',
        description: 'Perplejidad: señala anónimamente dónde te pierdes.',
        phase: 'during',
        phaseLabel: 'Durante la clase',
    },
    {
        id: 'noesis',
        name: 'Noesis',
        greek: 'Νόησις',
        letter: 'Ν',
        verb: 'comprende',
        description: 'Comprensión: verificación rápida de entendimiento.',
        phase: 'during',
        phaseLabel: 'Durante la clase',
    },
    {
        id: 'methexis',
        name: 'Methexis',
        greek: 'Μέθεξις',
        letter: 'Μ',
        verb: 'conecta',
        description: 'Participación: conecta lo aprendido con tu mundo.',
        phase: 'after',
        phaseLabel: 'Después de la clase',
    },
    {
        id: 'logos',
        name: 'Logos',
        greek: 'Λόγος',
        letter: 'Λ',
        verb: 'cristaliza',
        description: 'Razón: resume toda la clase en una sola palabra.',
        phase: 'after',
        phaseLabel: 'Después de la clase',
    },
    {
        id: 'anamnesis',
        name: 'Anamnesis',
        greek: 'Ἀνάμνησις',
        letter: 'Α',
        verb: 'reflexiona',
        description: 'Reminiscencia: aprendí, me pregunto, conecté.',
        phase: 'after',
        phaseLabel: 'Después de la clase',
    },
];

export function renderToolCard(tool, opts = {}) {
    const { selectable = false, selected = false, disabled = false } = opts;

    const selectedClass = selected ? 'tool-card--selected' : '';
    const disabledClass = disabled ? 'tool-card--disabled' : '';

    const clickAttr = selectable
        ? `data-tool-select="${tool.id}"`
        : `onclick="window.location.hash='/tool/${tool.id}'"`;

    return `
    <div class="tool-card ${selectedClass} ${disabledClass}" ${clickAttr} id="card-${tool.id}">
      <div class="tool-card__letter">${tool.letter}</div>
      <div class="tool-card__name">${tool.name}</div>
      <div class="tool-card__verb">${tool.verb}</div>
      <div class="tool-card__description">${tool.description}</div>
    </div>
  `;
}

export function getToolById(id) {
    return TOOLS.find(t => t.id === id);
}

export function getToolsByPhase(phase) {
    return TOOLS.filter(t => t.phase === phase);
}
