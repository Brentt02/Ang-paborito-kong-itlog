// Load recipes after the page has finished loading
document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('recipeGrid');

    try {
        // Fetch recipe data from the JSON file
        const recipes = await (
            await fetch('data/recipes.json')
        ).json();

        // Display all recipe cards
        grid.innerHTML = recipes.map(r => `
            <article class="recipe-card">
                <img
                    class="dish-img"
                    src="${r.image}"
                    alt="Illustration ng ${r.title}"
                    loading="lazy"
                >

                <div class="recipe-content">
                    <span class="eyebrow">
                        Beginner-friendly
                    </span>

                    <h2 style="font-size: 1.8rem; margin: 14px 0 8px">
                        ${r.title}
                    </h2>

                    <p>${r.intro}</p>

                    <!-- Recipe preparation information -->
                    <div class="recipe-stats">
                        <span>⏱ Prep: ${r.prep}</span>
                        <span>🍳 Luto: ${r.cook}</span>
                        <span>🍽 ${r.serves} servings</span>
                    </div>

                    <div class="recipe-details">
                        <!-- Ingredients checklist -->
                        <h3>Mga sangkap</h3>

                        <ul class="ingredient-list">
                            ${r.ingredients.map((i, n) => `
                                <li>
                                    <label>
                                        <input
                                            type="checkbox"
                                            data-recipe="${r.id}"
                                            data-index="${n}"
                                        >
                                        <span>${i}</span>
                                    </label>
                                </li>
                            `).join('')}
                        </ul>

                        <!-- Cooking instructions -->
                        <h3>Paraan ng pagluluto</h3>

                        <ol class="steps">
                            ${r.steps.map(s => `
                                <li>${s}</li>
                            `).join('')}
                        </ol>

                        <!-- Food safety reminder -->
                        <p class="safety-note">
                            Lutuin nang maigi ang itlog at iba pang sangkap.
                            Iwasan ang cross-contamination at palamigin agad
                            ang leftovers.
                        </p>

                        <!-- Favorite recipe button -->
                        <button
                            class="button secondary small recipe-fav"
                            data-fav="${r.id}"
                            aria-pressed="${getFavorites().includes(r.id)}"
                        >
                            ${
                                getFavorites().includes(r.id)
                                    ? '♥ Favorite'
                                    : '♡ I-favorite ang recipe'
                            }
                        </button>
                    </div>
                </div>
            </article>
        `).join('');

        // Save ingredient checklist changes
        grid.addEventListener('change', e => {
            const cb = e.target;

            if (cb.matches('input[type=checkbox][data-recipe]')) {
                const key = 'apk-recipe-checks-' + cb.dataset.recipe;

                let state = {};

                try {
                    state = JSON.parse(
                        localStorage.getItem(key) || '{}'
                    );
                } catch {}

                state[cb.dataset.index] = cb.checked;

                localStorage.setItem(
                    key,
                    JSON.stringify(state)
                );
            }
        });

        // Restore previously checked ingredients
        grid.querySelectorAll(
            'input[type=checkbox][data-recipe]'
        ).forEach(cb => {
            try {
                const state = JSON.parse(
                    localStorage.getItem(
                        'apk-recipe-checks-' + cb.dataset.recipe
                    ) || '{}'
                );

                cb.checked = !!state[cb.dataset.index];
            } catch {}
        });

        // Handle favorite recipe button clicks
        grid.addEventListener('click', e => {
            const b = e.target.closest('[data-fav]');

            if (b) {
                const yes = saveFavorite(b.dataset.fav);

                b.setAttribute(
                    'aria-pressed',
                    String(yes)
                );

                b.textContent = yes
                    ? '♥ Favorite'
                    : '♡ I-favorite ang recipe';
            }
        });

    } catch (e) {
        // Show an error if recipes cannot be loaded
        grid.innerHTML = `
            <div class="empty-state">
                <h3>Hindi mabuksan ang recipes</h3>
                <p>
                    Patakbuhin ang website gamit ang local server;
                    tingnan ang README.
                </p>
            </div>
        `;
    }
});
