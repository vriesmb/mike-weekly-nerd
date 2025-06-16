function toggleTheme() {
    const body = document.documentElement;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    
    // Save preference
    localStorage.setItem('theme', newTheme);
}

// Add theme initialization
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Call initialize when the page loads
document.addEventListener('DOMContentLoaded', initializeTheme);

async function navigateToPost(button) {
    if (!document.startViewTransition) return;

    const blogItem = button.closest('[data-blog-item]');
    const targetUrl = blogItem.getAttribute('data-blog-item');
    const fullUrl = `/blog-posts/${targetUrl}.html`;

    try {
        // Add the current card's transition name to the state
        window.history.pushState({
            url: fullUrl,
            transitionName: `card-container-${targetUrl}`
        }, '', fullUrl);

        const transition = document.startViewTransition(async () => {
            // Ensure the element exists before transition starts
            const response = await fetch(fullUrl);
            const html = await response.text();

            // Wait for both old and new content to be present
            await Promise.resolve();
            document.documentElement.innerHTML = html;
        });

        await transition.finished;
    } catch (error) {
        console.error('Navigation failed:', error);
    }
}

// Handle back/forward navigation
window.addEventListener('popstate', async (event) => {
    if (!document.startViewTransition) {
        return;
    }

    try {
        const url = event.state?.url || '/index.html'; // Fallback to index if no state

        const transition = document.startViewTransition(async () => {
            const response = await fetch(url);
            const html = await response.text();
            document.documentElement.innerHTML = html;
        });

        await transition.finished;
    } catch (error) {
        console.error('Back navigation failed:', error);
    }
});