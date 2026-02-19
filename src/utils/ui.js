// ==========================================================================
// PAIDEIA — UI Utilities
// Shared UI components and helpers
// ==========================================================================

/**
 * Shows a toast notification
 * @param {string} message 
 * @param {'success' | 'error' | 'info'} type 
 */
export function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container') || createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type} animate-slide-up`;
    toast.innerHTML = `
    <div class="toast__icon">${getIconForType(type)}</div>
    <div class="toast__message">${message}</div>
  `;

    container.appendChild(toast);

    // Remove after 3s
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container); // Append to body, not #app
    return container;
}

function getIconForType(type) {
    switch (type) {
        case 'success': return '✓';
        case 'error': return '✕';
        case 'info': return 'ℹ';
        default: return '•';
    }
}
