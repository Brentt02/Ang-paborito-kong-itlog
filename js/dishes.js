// Load dish data from the JSON file
async function loadDishes() {
    const r = await fetch('data/dishes.json');

    if (!r.ok) {
        throw new Error('Hindi mabasa ang dish data');
    }

    return r.json();
}

// Create a dish card
function dishCard(d) {
    const fav = getFavorites().includes(d.id);

    return `
        <article class="dish-card">
            <img
                class="dish-img"
                src="${d.image}"
                alt="Illustration ng ${d.name}"
                loading="lazy"
            >

            <div class="dish-body">
                <div class="dish-meta">
                    <span class="pill">${d.category}</span>
                    <span class="pill">${d.eggType}</span>
                </div>

                <h3>${d.name}</h3>
                <p>${d.description}</p>

                <div class="dish-actions">
                    <button
                        class="button secondary small"
                        data-detail="${d.id}"
                    >
                        Tingnan ang Detalye
                    </button>

                    <button
                        class="heart"
                        data-favorite="${d.id}"
                        aria-label="${fav ? 'Alisin sa' : 'Idagdag sa'} favorites: ${d.name}"
                        aria-pressed="${fav}"
                    >
                        ${fav ? '♥' : '♡'}
                    </button>
                </div>
            </div>
        </article>
    `;
}

// Initialize the dish gallery page
function initDishPage() {
    const grid = document.getElementById('dishGrid');

    if (!grid) {
        return;
    }

    const search = document.getElementById('dishSearch');
    const filter = document.getElementById('categoryFilter');
    const count = document.getElementById('resultCount');

    let all = [];

    // Render and filter dish cards
    const render = () => {
        const q = search.value.trim().toLowerCase();
        const cat = filter.value;

        const shown = all.filter(d =>
            (
                d.name.toLowerCase().includes(q) ||
                d.description.toLowerCase().includes(q) ||
                d.eggType.toLowerCase().includes(q)
            ) &&
            (
                cat === 'all' ||
                d.category.toLowerCase() === cat.toLowerCase()
            )
        );

        count.textContent =
            `${shown.length} dish${shown.length === 1 ? '' : 'es'} ang nakita`;

        grid.innerHTML = shown.length
            ? shown.map(dishCard).join('')
            : `
                <div class="empty-state">
                    <div class="emoji">🍳</div>
                    <h3>Walang nahanap na dish</h3>
                    <p>
                        Subukan ang ibang salita o i-clear ang filters.
                    </p>
                </div>
            `;
    };

    // Load dishes and set up event listeners
    loadDishes()
        .then(data => {
            all = data;
            render();

            grid.addEventListener('click', e => {
                const f = e.target.closest('[data-favorite]');
                const d = e.target.closest('[data-detail]');

                if (f) {
                    saveFavorite(f.dataset.favorite);
                    render();
                }

                if (d) {
                    openDish(
                        all.find(x => x.id === d.dataset.detail)
                    );
                }
            });

            search.addEventListener('input', render);
            filter.addEventListener('change', render);

            document
                .getElementById('clearFilters')
                .addEventListener('click', () => {
                    search.value = '';
                    filter.value = 'all';
                    render();
                });

            document
                .getElementById('closeModal')
                .addEventListener('click', closeDish);

            document
                .getElementById('dishModal')
                .addEventListener('click', e => {
                    if (e.target.id === 'dishModal') {
                        closeDish();
                    }
                });

            document.addEventListener('keydown', e => {
                if (e.key === 'Escape') {
                    closeDish();
                }
            });
        })
        .catch(() => {
            grid.innerHTML = `
                <div class="empty-state">
                    <h3>Hindi mabuksan ang dish data</h3>
                    <p>
                        Patakbuhin ang website gamit ang local server.
                        Tingnan ang README.
                    </p>
                </div>
            `;
        });
}

// Open the dish details modal
function openDish(d) {
    if (!d) {
        return;
    }

    const modal = document.getElementById('dishModal');

    document.getElementById('modalBody').innerHTML = `
        <img
            src="${d.image}"
            alt="Illustration ng ${d.name}"
        >

        <div class="dish-meta" style="margin-top: 18px">
            <span class="pill">${d.category}</span>
            <span class="pill">${d.subtitle}</span>
        </div>

        <h2 id="modalTitle">${d.name}</h2>

        <p>${d.description}</p>

        <p>
            <b>Uri ng itlog / sangkap:</b> ${d.eggType}
        </p>

        <p>
            <b>Pagkilala:</b> ${d.tagline}
        </p>

        <button
            class="button ${
                getFavorites().includes(d.id) ? 'primary' : 'secondary'
            }"
            id="modalFavorite"
        >
            ${
                getFavorites().includes(d.id)
                    ? '♥ Nasa favorites'
                    : '♡ Idagdag sa favorites'
            }
        </button>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    document.getElementById('modalFavorite').onclick = () => {
        saveFavorite(d.id);
        openDish(d);

        const grid = document.getElementById('dishGrid');

        if (grid) {
            initDishPage();
        }
    };
}

// Close the dish details modal
function closeDish() {
    const m = document.getElementById('dishModal');

    if (m) {
        m.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Initialize page features after the HTML loads
document.addEventListener('DOMContentLoaded', () => {
    initDishPage();

    // Load featured dishes on the homepage
    const featured = document.getElementById('featuredDishes');

    if (featured) {
        loadDishes()
            .then(ds => {
                featured.innerHTML = ds
                    .filter(d =>
                        [
                            'kwek-kwek',
                            'tortang-talong',
                            'itlog-na-may-kamatis'
                        ].includes(d.id)
                    )
                    .map(dishCard)
                    .join('');

                featured.addEventListener('click', e => {
                    const f = e.target.closest('[data-favorite]');
                    const d = e.target.closest('[data-detail]');

                    if (f) {
                        saveFavorite(f.dataset.favorite);

                        loadDishes().then(all => {
                            featured.innerHTML = all
                                .filter(x =>
                                    [
                                        'kwek-kwek',
                                        'tortang-talong',
                                        'itlog-na-may-kamatis'
                                    ].includes(x.id)
                                )
                                .map(dishCard)
                                .join('');
                        });
                    }

                    if (d) {
                        location.href = 'dishes.html';
                    }
                });
            })
            .catch(() => {});
    }
});