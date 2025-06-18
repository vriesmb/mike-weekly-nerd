// Thema toggle functie
function toggleTheme() {
    const body = document.documentElement;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Thema initialiseren bij load
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Accordion functionaliteit
function initAccordion() {
    document.querySelectorAll('details.accordion').forEach(details => {
        const summary = details.querySelector('summary');
        const content = details.querySelector('.content');

        details.removeAttribute('open');
        content.style.overflow = 'hidden';
        content.style.transition = 'max-height 0.4s ease';
        content.style.maxHeight = '0px';

        summary.addEventListener('click', e => {
            e.preventDefault();

            const isOpen = details.hasAttribute('open');

            if (isOpen) {
                content.style.maxHeight = content.scrollHeight + 'px';
                requestAnimationFrame(() => {
                    content.style.maxHeight = '0px';
                });
                setTimeout(() => {
                    details.removeAttribute('open');
                }, 400);
            } else {
                details.setAttribute('open', '');
                content.style.maxHeight = '0px';
                requestAnimationFrame(() => {
                    content.style.maxHeight = content.scrollHeight + 'px';
                });
            }
        });
    });
}

// Navigeren naar blogpost via ViewTransition API
async function navigateToPost(button) {
    const blogItem = button.closest('[data-blog-item]');
    const targetUrl = blogItem.getAttribute('data-blog-item');
    const fullUrl = `./blog-posts/${targetUrl}.html`;

    try {
        // Simuleer navigatie + animatie indien mogelijk
        if (document.startViewTransition) {
            const transition = document.startViewTransition(() => {
                // We laten de inhoud vervangen tijdens de overgang
                window.location.href = fullUrl; // Echte volledige paginaload
            });

            await transition.finished;
        } else {
            window.location.href = fullUrl; // fallback
        }
    } catch (error) {
        console.error('Navigation failed:', error);
        window.location.href = fullUrl; // fallback bij error
    }
}

// Browser navigatie (back/forward)
window.addEventListener('popstate', async (event) => {
    if (!document.startViewTransition) return;

    try {
        const url = event.state?.url || '/index.html';

        const transition = document.startViewTransition(async () => {
            const response = await fetch(url);
            const html = await response.text();

            const tempDoc = document.createElement('html');
            tempDoc.innerHTML = html;

            document.body.innerHTML = tempDoc.querySelector('body').innerHTML;

            initializeTheme();
            initAccordion();
        });

        await transition.finished;
    } catch (error) {
        console.error('Back navigation failed:', error);
    }
});

// Init bij page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initAccordion();
});