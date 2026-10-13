document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedbackForm');
    const notice = document.getElementById('feedbackNotice');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!form.reportValidity()) {
            return;
        }

        notice.innerHTML = `
            <p class="notice" role="status">
                Salamat sa feedback! Demo submission lang ito—
                walang ipinadalang email o na-save sa server.
            </p>
        `;

        form.reset();
    });
});
