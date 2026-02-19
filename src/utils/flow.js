// ==========================================================================
// PAIDEIA — Flow Logic
// Guided navigation for students
// ==========================================================================

import { getToolEntries } from './storage.js';

// Canonical order of tools in the flow
export const TOOL_ORDER = [
    'gnosis',    // Initial check-in (Phase: before)
    'eikasia',   // Hypothesis
    'noesis',    // Understanding check
    'aporia',    // Doubts
    'methexis',  // Participation
    'logos',     // Summary word
    'anamnesis', // Reflection
    'gnosis'     // Final check-in (Phase: after) - Logic handles re-entry
];

/**
 * Determines the next tool in the flow for a given session and current tool.
 * @param {string} currentToolId 
 * @param {string[]} activeTools - List of tool IDs active in the session
 * @param {string} sessionCode
 * @param {string} studentId
 * @returns {string|null} ID of the next tool or null if end of flow
 */
export function getNextTool(currentToolId, activeTools, sessionCode, studentId) {
    if (!activeTools || activeTools.length === 0) return null;

    // Filter canonical order to include only active tools
    // Note: 'gnosis' appears in TOOL_ORDER twice implicitly via logic below?
    // No, let's make it explicit in the filtered list.

    let flow = [];

    // 1. Gnosis Start (if active)
    if (activeTools.includes('gnosis')) {
        flow.push('gnosis');
    }

    // 2. Middle Tools
    const middleTools = ['eikasia', 'noesis', 'aporia', 'methexis', 'logos', 'anamnesis'];
    middleTools.forEach(t => {
        if (activeTools.includes(t)) flow.push(t);
    });

    // 3. Gnosis End (if active) — we represent this as 'gnosis-end' conceptually, 
    // but the ID is 'gnosis'. We need to know if we are currently at 'gnosis' start or end.
    // Actually, simpler: just ordered list logic.

    // If we are at 'gnosis', check if it's the "before" or "after" phase? 
    // The view handles the phase. But navigation needs to know where to go next.

    // Revised Strategy:
    // If current is 'gnosis' AND we haven't visited middle tools -> Go to first middle tool.
    // If current is last middle tool -> Go to 'gnosis' (end).

    // Let's rely on index in the filtered flow list, handling special case for Gnosis repeat.

    // Construct user flow
    let userFlow = [];
    if (activeTools.includes('gnosis')) userFlow.push('gnosis'); // Start

    middleTools.forEach(t => {
        if (activeTools.includes(t)) userFlow.push(t);
    });

    if (activeTools.includes('gnosis')) userFlow.push('gnosis'); // End

    // Remove duplicates if only Gnosis is active? [gnosis, gnosis] is valid (start -> end).

    // Find current index
    // If currentTool is 'gnosis', are we at start or end?
    // We can infer from context? No, strictly from ID it's ambiguous.
    // BUT:
    // If I am at 'gnosis', and I click "Next", I should go to the next tool in `userFlow`.

    // Problem: `indexOf` will always return 0 for first 'gnosis'.
    // If we are fully done with 'before' phase, 'gnosis' effectively becomes the last step.

    // To solve this: we check if the student has completed the "before" phase of Gnosis?
    // Or simpler: we assume if they are navigating FROM Gnosis, they are done with whatever step displayed.

    // This function is called by the "Next" button on a specific page.
    // If I am on `gnosis` page, and I urge "Next", where do I go?
    // It depends on if there are other tools.

    // Simplification:
    // If current is 'gnosis' and there are middle tools active -> go to first middle tool.
    // If current is 'gnosis' and NO middle tools -> null (stay/finish).
    // If current is a middle tool:
    //    - If there is another middle tool -> go to it.
    //    - If no more middle tools -> go to 'gnosis' (end).

    const middleActive = middleTools.filter(t => activeTools.includes(t));

    if (currentToolId === 'gnosis') {
        if (middleActive.length > 0) {
            // If we are technically at the "end" gnosis, we stop.
            // How to distinguish?
            // We can check if `entries` has 'before' data? 
            // Let's assume the button appears.
            // If I am at Gnosis Start, next is `middleActive[0]`.
            // If I am at Gnosis End, next is null.

            // Let's look at the student entries to decide?
            const entries = getToolEntries(sessionCode, 'gnosis');
            const hasBefore = entries.some(e => e.phase === 'before' && e.studentId === studentId);
            const hasAfter = entries.some(e => e.phase === 'after' && e.studentId === studentId);

            if (!hasBefore) return middleActive[0]; // Should do Gnosis -> Next

            // Heuristic: If we are back at Gnosis and have participated in middle tools, we are at End.
            // If we have NOT participated, force loop to middle.

            let hasMiddleParticipation = false;
            // Need to check entries for participation
            for (const midId of middleActive) {
                const midEntries = getToolEntries(sessionCode, midId);
                if (midEntries.some(e => e.studentId === studentId)) {
                    hasMiddleParticipation = true;
                    break;
                }
            }

            if (!hasMiddleParticipation && middleActive.length > 0) {
                return middleActive[0];
            }

            if (!hasAfter) return null; // Allow After form

            return null; // Done with everything
        } else {
            return null;
        }
    }

    // Current is a middle tool
    const currentIndex = middleActive.indexOf(currentToolId);
    if (currentIndex === -1) return null; // Should not happen

    if (currentIndex < middleActive.length - 1) {
        return middleActive[currentIndex + 1];
    } else {
        // Last middle tool -> Gnosis (End)
        return activeTools.includes('gnosis') ? 'gnosis' : null;
    }
}
