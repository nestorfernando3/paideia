// ==========================================================================
// PAIDEIA — Animation Utilities
// ==========================================================================

export function staggerChildren(parentSelector, delay = 80) {
    const parent = document.querySelector(parentSelector);
    if (!parent) return;

    Array.from(parent.children).forEach((child, i) => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(16px)';
        child.style.transition = `opacity 0.4s ease ${i * delay}ms, transform 0.4s ease ${i * delay}ms`;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            });
        });
    });
}

export function countUp(element, target, duration = 800) {
    let start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.round(eased * target);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

export function typeWriter(element, text, speed = 30) {
    element.textContent = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}
