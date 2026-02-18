// ==========================================================================
// PAIDEIA — Modal Component
// ==========================================================================

export function showModal(title, contentHtml, opts = {}) {
    const { onClose } = opts;

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
    <div class="modal">
      <div class="modal__header">
        <h3 class="modal__title">${title}</h3>
      </div>
      <div class="modal__body">
        ${contentHtml}
      </div>
    </div>
  `;

    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
            closeModal(backdrop, onClose);
        }
    });

    document.body.appendChild(backdrop);
    return backdrop;
}

export function closeModal(backdrop, callback) {
    if (backdrop) {
        backdrop.style.opacity = '0';
        backdrop.style.transition = 'opacity 0.2s ease';
        setTimeout(() => {
            backdrop.remove();
            if (callback) callback();
        }, 200);
    }
}
