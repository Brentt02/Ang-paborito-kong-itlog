// Quiz questions and answer choices
const quizQuestions = [
    {
        q: 'Anong itlog ang karaniwang ginagamit sa kwek-kwek?',
        a: [
            'Itlog ng pugo',
            'Itlog ng ostrich',
            'Itlog ng isda',
            'Itlog ng pagong'
        ],
        c: 0
    },
    {
        q: 'Ano ang pangunahing gulay sa tortang talong?',
        a: [
            'Ampalaya',
            'Talong',
            'Sayote',
            'Kalabasa'
        ],
        c: 1
    },
    {
        q: 'Ano ang karaniwang kasama ng itlog na pula sa isang simpleng side dish?',
        a: [
            'Saging',
            'Kamatis',
            'Pipino lamang',
            'Mangga na hilaw lamang'
        ],
        c: 1
    },
    {
        q: 'Ano ang balut?',
        a: [
            'Pritong manok',
            'Fertilized duck egg na pinakuluan',
            'Tinapay na may itlog',
            'Matamis na leche flan'
        ],
        c: 1
    },
    {
        q: 'Anong paraan ng pagluluto ang ginagamit sa nilagang itlog?',
        a: [
            'Pag-iihaw',
            'Pagpapasingaw lamang',
            'Pagpapakulo sa tubig',
            'Pagbe-bake ng tinapay'
        ],
        c: 2
    },
    {
        q: 'Ano ang karaniwang sangkap sa tortang giniling?',
        a: [
            'Giniling na karne at itlog',
            'Isda at gata lamang',
            'Saging at harina',
            'Tokwa at tsokolate'
        ],
        c: 0
    },
    {
        q: 'Ano ang nagbibigay ng kulay kahel sa batter ng kwek-kwek?',
        a: [
            'Kape',
            'Annatto o food coloring',
            'Ube',
            'Pandan'
        ],
        c: 1
    },
    {
        q: 'Alin ang simpleng ulam na gawa sa itlog at kamatis?',
        a: [
            'Itlog na may kamatis',
            'Halo-halo',
            'Bibingka',
            'Puto bumbong'
        ],
        c: 0
    },
    {
        q: 'Ano ang penoy sa karaniwang gamit sa Pilipinas?',
        a: [
            'Pinakuluang itlog ng pato na walang nabuong embryo',
            'Pritong quail egg',
            'Itlog na maalat na may kamatis',
            'Omelet na may talong'
        ],
        c: 0
    },
    {
        q: 'Ano ang mahalagang paalala sa pagluluto ng itlog?',
        a: [
            'Ihain kahit hilaw palagi',
            'Huwag hugasan ang kamay',
            'Lutuin nang maigi at panatilihing malinis ang kagamitan',
            'Iwan ang leftovers sa init buong araw'
        ],
        c: 2
    }
];

// Quiz state
let qi = 0;
let answers = Array(quizQuestions.length).fill(null);

// Render the quiz
function renderQuiz() {
    const el = document.getElementById('quizContent');

    // Show results when all questions are answered
    if (qi >= quizQuestions.length) {
        const score = answers.reduce(
            (s, a, i) => s + (a === quizQuestions[i].c ? 1 : 0),
            0
        );

        const pct = Math.round(
            score / quizQuestions.length * 100
        );

        // Save the latest quiz score
        localStorage.setItem(
            'apk-itlog-last-quiz-score',
            JSON.stringify({
                score,
                total: quizQuestions.length,
                percentage: pct,
                date: new Date().toISOString()
            })
        );

        // Determine the result message
        let msg;

        if (pct < 40) {
            msg = 'Itlog Beginner — Tara, may bago ka pang matututunan!';
        } else if (pct < 80) {
            msg = 'Itlog Lover — Ang dami mo nang alam!';
        } else {
            msg = 'Itlog Expert — Certified itlog enthusiast!';
        }

        el.innerHTML = `
            <div class="center">
                <span class="eyebrow">Quiz complete!</span>

                <h2 style="margin: 22px 0">
                    Ang galing sa pagsagot!
                </h2>

                <div class="result-score">
                    ${pct}%
                </div>

                <p style="font-size: 1.2rem">
                    <b>
                        ${score} sa ${quizQuestions.length} tamang sagot
                    </b>
                </p>

                <h3>${msg}</h3>

                <p class="muted">
                    Na-save ang pinakahuling score sa browser na ito.
                </p>

                <button class="button primary" id="restartQuiz">
                    ↻ Subukan Ulit
                </button>
            </div>
        `;

        // Restart the quiz
        document.getElementById('restartQuiz').onclick = () => {
            qi = 0;
            answers = Array(quizQuestions.length).fill(null);
            renderQuiz();
        };

        return;
    }

    // Get the current question
    const q = quizQuestions[qi];

    el.innerHTML = `
        <div>
            <div style="display: flex; justify-content: space-between; gap: 12px">
                <span class="eyebrow">
                    Tanong ${qi + 1} sa ${quizQuestions.length}
                </span>

                <span class="muted">
                    ${Math.round(qi / quizQuestions.length * 100)}% complete
                </span>
            </div>

            <!-- Progress Bar -->
            <div class="quiz-progress">
                <span style="width: ${qi / quizQuestions.length * 100}%"></span>
            </div>

            <!-- Question -->
            <h2 style="font-size: clamp(1.5rem, 4vw, 2.2rem)">
                ${q.q}
            </h2>

            <!-- Answer Choices -->
            <div class="quiz-options">
                ${q.a.map((a, i) => `
                    <button
                        class="quiz-option ${answers[qi] === i ? 'selected' : ''}"
                        data-answer="${i}"
                        aria-pressed="${answers[qi] === i}"
                    >
                        <b>${String.fromCharCode(65 + i)}.</b>
                        ${a}
                    </button>
                `).join('')}
            </div>

            <!-- Validation Message -->
            <div
                id="quizNotice"
                class="muted"
                aria-live="polite"
            ></div>

            <!-- Quiz Navigation -->
            <div class="quiz-bottom">
                <span class="muted">
                    Pumili ng isang sagot.
                </span>

                <button class="button primary" id="nextQuestion">
                    ${
                        qi === quizQuestions.length - 1
                            ? 'Tingnan ang score'
                            : 'Next Question →'
                    }
                </button>
            </div>
        </div>
    `;

    // Handle answer selection
    el.querySelectorAll('[data-answer]').forEach(b => {
        b.onclick = () => {
            answers[qi] = Number(b.dataset.answer);
            renderQuiz();
        };
    });

    // Move to the next question or show results
    document.getElementById('nextQuestion').onclick = () => {
        if (answers[qi] === null) {
            document.getElementById('quizNotice').textContent =
                'Pumili muna ng sagot bago magpatuloy.';

            return;
        }

        qi++;
        renderQuiz();
    };
}

// Start the quiz after the page loads
document.addEventListener('DOMContentLoaded', renderQuiz);
