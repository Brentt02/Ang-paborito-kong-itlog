// Initialize navigation after the HTML loads
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');

    // Mobile menu toggle
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            const open = nav.classList.toggle('open');

            toggle.setAttribute('aria-expanded', String(open));
            toggle.textContent = open ? '✕ Close' : '☰ Menu';
        });
    }

    // Highlight the current navigation link
    const current = location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-links a').forEach(a => {
        if (a.getAttribute('href') === current) {
            a.setAttribute('aria-current', 'page');
        }
    });
});

// Local Storage key for favorites
const FAVORITES_KEY = 'apk-itlog-favorites-v1';

// Get saved favorite dish IDs
function getFavorites() {
    try {
        return JSON.parse(
            localStorage.getItem(FAVORITES_KEY) || '[]'
        );
    } catch {
        return [];
    }
}

// Add or remove a dish from favorites
function saveFavorite(id) {
    const fav = getFavorites();

    const next = fav.includes(id)
        ? fav.filter(x => x !== id)
        : [...fav, id];

    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(next)
    );

    return next.includes(id);
}

// Escape HTML special characters
function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[c]));
}