// Vocabulary Quiz System - quiz.js (Version: 2025-06-01)
// Shared quiz logic for index.html and themes.html, with theme switching for index.html

const availableSets = [
    'Short_Testing_Sample.csv',
    'Web_Development_Terms_Definitions.csv',
    'Music_Theory_Terms_Definitions.csv',
    'ARRL_Ham_Radio_General_License_Terms_Definitions.csv',
    'ARRL_Ham_Radio_Extra_License_Terms_Definitions.csv',
    'ARRL_Ham_Radio_Technician_License_Terms_Definitions.csv',
    'Game_Development_Fundamentals-2_Terms_Definitions.csv',
    'Game_Development_Fundamentals_1_Terms_Definitions.csv',
    'utah_video_production_terms_Final.csv',
    'Utah_Computer_Programming_1_Terms_Definitions.csv',
    'Computer_Programming_2_Terms_Definitions.csv',
    'Exploring_Computer_Science_Vocabulary.csv',
    'ECS_Hardware_OS_DataStorage_Terms_Definitions.csv',
    'advanced_computer_programming_vocab.csv',
    'Digital_Media_2_Terms_and_Definitions.csv'
];
let vocabSets = {};
let currentSet = null;
let currentQuestionIndex = 0;
let answers = [];
let questions = [];
let missedTerms = [];
let questionMode = '';
let quizStartTime = null;
let timerInterval = null;
let totalDuration = 0;
let currentSetName = '';

fetchVocabSets();

// Theme switching for index.html
function applyIndexTheme(theme) {
    console.log('Applying index theme:', theme);
    document.body.className = ''; // Clear existing classes
    document.body.classList.add(theme);
    localStorage.setItem('indexTheme', theme); // Separate key for index.html
}

// Initialize theme on index.html
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/kappquiz/') {
        const savedTheme = localStorage.getItem('indexTheme') || 'light';
        applyIndexTheme(savedTheme);
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = savedTheme;
        }
    }
});

const questionModeSelect = document.getElementById('questionMode');
if (questionModeSelect) {
    questionModeSelect.addEventListener('change', (e) => {
        questionMode = e.target.value;
        const vocabSet = document.getElementById('vocabSet');
        if (vocabSet) vocabSet.disabled = false;
        console.log('Question mode selected:', questionMode);
    });
}

function uploadCSV() {
    alert('Upload functionality is disabled. Vocab sets are preloaded.');
}

async function fetchVocabSets() {
    const select = document.getElementById('vocabSet');
    if (!select) {
        console.error('Vocab set select element not found');
        return;
    }
    select.innerHTML = '<option value="">Select a set</option>';

    for (const set of availableSets) {
        try {
            const response = await fetch(`/kappquiz/vocab-sets/${set}`);
            if (!response.ok) throw new Error(`HTTP ${response.status} for ${set}`);
            const csvData = await response.text();
            if (!csvData.trim()) throw new Error(`Empty CSV data for ${set}`);
            const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true }).data;
            if (!parsedData || parsedData.length === 0) throw new Error(`No valid data parsed for ${set}`);
            vocabSets[set] = parsedData.map(item => ({
                term: item.term?.trim() || '',
                definition: item.definition?.trim() || '',
                strand: item.strand?.trim() || item.category?.trim() || ''
            })).filter(item => item.term && item.definition);

            if (vocabSets[set].length === 0) throw new Error(`No valid terms/definitions for ${set}`);

            const option = document.createElement('option');
            option.value = set;
            option.textContent = set.replace('.csv', '');
            select.appendChild(option);
        } catch (error) {
            console.error(`Error loading ${set}:`, error.message);
            const quizArea = document.getElementById('quizArea');
            if (quizArea) {
                quizArea.innerHTML = `<p>Error loading ${set}: ${error.message}. Please try another set.</p>`;
            }
        }
    }

    if (Object.keys(vocabSets).length === 0) {
        const quizArea = document.getElementById('quizArea');
        if (quizArea) {
            quizArea.innerHTML = '<p>Error: No vocab sets loaded. Please check the vocab-sets directory.</p>';
        }
    }
}

function formatSetName(setName) {
    return setName
        .replace('.csv', '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase()) + ' Quiz';
}

function loadVocabSet() {
    const select = document.getElementById('vocabSet');
    const pageTitle = document.getElementById('pageTitle');
    const timer = document.getElementById('timer');
    if (!select || !pageTitle || !timer) {
        console.error('Missing DOM elements:', { select, pageTitle, timer });
        return;
    }

    const setName = select.value;
    console.log('loadVocabSet:', setName);
    if (!setName) {
        document.getElementById('quizArea').innerHTML = '';
        document.getElementById('progress').innerHTML = '';
        document.getElementById('results').innerHTML = '';
        pageTitle.textContent = window.location.pathname.includes('themes.html') ? 'Student Vocabulary Quiz - Fun Themes' : 'Student Vocabulary Quiz';
        timer.style.display = 'none';
        currentSetName = '';
        return;
    }

    if (!vocabSets[setName]) {
        console.error(`Vocab set ${setName} not found in vocabSets`);
        document.getElementById('quizArea').innerHTML = `<p>Error: Vocab set ${setName} not loaded. Please try another set.</p>`;
        return;
    }

    currentSet = vocabSets[setName];
    currentSetName = formatSetName(setName);
    pageTitle.textContent = currentSetName;
    console.log('Setting title to:', currentSetName);
    startQuiz();
    document.getElementById('questionMode').disabled = true;
    select.disabled = true;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startTimer() {
    const timer = document.getElementById('timer');
    if (!timer) {
        console.error('Timer element not found');
        return;
    }
    if (timerInterval) clearInterval(timerInterval);
    quizStartTime = Date.now();
    timer.style.display = 'block';
    console.log('Starting timer');
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - quizStartTime) / 1000);
        timer.textContent = `Time Elapsed: ${formatTime(elapsed)}`;
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    const timer = document.getElementById('timer');
    if (timer) {
        totalDuration = Math.floor((Date.now() - quizStartTime) / 1000);
        timer.textContent = `Total Time: ${formatTime(totalDuration)}`;
        console.log('Stopped timer, total duration:', totalDuration);
    }
}

function startQuiz(data = currentSet) {
    console.log('startQuiz called with data:', data);
    if (!questionMode) {
        alert('Please select a question mode before starting the quiz.');
        return;
    }

    const quizArea = document.getElementById('quizArea');
    if (!quizArea) {
        console.error('Quiz area element not found');
        return;
    }

    try {
        if (!data || !Array.isArray(data) || data.length === 0) {
            throw new Error('Invalid or empty data provided for quiz.');
        }

        const validData = data.filter(item => item && item.term?.trim() && item.definition?.trim());
        if (validData.length === 0) {
            throw new Error('No valid terms with definitions found in the data.');
        }

        questions = generateQuestions(validData);
        console.log('Generated questions:', questions.length);
        if (questions.length === 0) {
            throw new Error('No valid questions could be generated from the data.');
        }

        currentQuestionIndex = 0;
        answers = [];
        missedTerms = [];
        document.getElementById('results').innerHTML = '';
        startTimer();
        displayQuestion();
        updateProgress();
        document.getElementById('prevBtn').disabled = true;
        document.getElementById('nextBtn').disabled = true;
    } catch (error) {
        console.error('Error starting quiz:', error.message);
        quizArea.innerHTML = `<p>Error: ${error.message} Please select a different set or try again.</p>`;
        document.getElementById('results').innerHTML = '';
        document.getElementById('progress').innerHTML = '';
        const timer = document.getElementById('timer');
        if (timer) timer.style.display = 'none';
        document.getElementById('nextBtn').disabled = true;
        document.getElementById('prevBtn').disabled = true;
    }
}

function generateQuestions(data) {
    console.log('Generating questions with data length:', data.length);
    const questions = [];
    if (!data || !Array.isArray(data)) return questions;

    const maxAttempts = 50;
    data.forEach(item => {
        if (!item || !item.term?.trim() || !item.definition?.trim()) {
            console.log('Skipping invalid item:', item);
            return;
        }

        let questionType = questionMode;
        if (questionMode === 'mixed') {
            questionType = Math.random() > 0.5 ? 'termToDefinition' : 'definitionToTerm';
        }

        let prompt, correctAnswer, incorrectOptions, options;
        let attempts = 0;

        if (questionType === 'termToDefinition') {
            prompt = item.term;
            correctAnswer = item.definition;
            incorrectOptions = [];
            while (incorrectOptions.length < 3 && attempts < maxAttempts) {
                const randomItem = data[Math.floor(Math.random() * data.length)];
                if (!randomItem || randomItem.definition === item.definition || incorrectOptions.includes(randomItem.definition)) {
                    attempts++;
                    continue;
                }
                incorrectOptions.push(randomItem.definition);
            }
            if (incorrectOptions.length < 3) {
                console.log('Failed to generate enough options for term:', item.term);
                return;
            }
            options = [...incorrectOptions, item.definition].sort(() => Math.random() - 0.5);
        } else {
            prompt = item.definition;
            correctAnswer = item.term;
            incorrectOptions = [];
            while (incorrectOptions.length < 3 && attempts < maxAttempts) {
                const randomItem = data[Math.floor(Math.random() * data.length)];
                if (!randomItem || randomItem.term === item.term || incorrectOptions.includes(randomItem.term)) {
                    attempts++;
                    continue;
                }
                incorrectOptions.push(randomItem.term);
            }
            if (incorrectOptions.length < 3) {
                console.log('Failed to generate enough options for definition:', item.definition);
                return;
            }
            options = [...incorrectOptions, item.term].sort(() => Math.random() - 0.5);
        }

        questions.push({
            type: questionType,
            prompt: prompt,
            correct: correctAnswer,
            options: options,
            term: item.term,
            definition: item.definition,
            strand: item.strand
        });
    });

    console.log('Questions generated:', questions.length);
    return questions.sort(() => Math.random() - 0.5);
}

function displayQuestion() {
    console.log('Displaying question index:', currentQuestionIndex);
    const quizArea = document.getElementById('quizArea');
    if (!quizArea) {
        console.error('Quiz area element not found');
        return;
    }
    if (currentQuestionIndex >= questions.length) {
        stopTimer();
        showResults();
        return;
    }

    const question = questions[currentQuestionIndex];
    const questionText = question.type === 'termToDefinition'
        ? `What is the definition of "${question.prompt}"?`
        : `What term matches this definition: "${question.prompt}"?`;

    const existingAnswer = answers.find(answer => answer.term === question.term && answer.questionType === question.type);

    quizArea.innerHTML = `
        <div class="question">
            <h3>Question ${currentQuestionIndex + 1}: ${questionText}</h3>
            ${question.options.map((option, i) => `
                <div class="option${existingAnswer ? (option === question.correct ? ' correct' : (option === existingAnswer.selected ? ' incorrect' : '')) : ''}" 
                     ${existingAnswer ? '' : `onclick="selectOption(${i})"`}>${option}</div>
            `).join('')}
        </div>
    `;

    document.getElementById('nextBtn').disabled = !existingAnswer;
    document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
}

function selectOption(index) {
    console.log('Selecting option index:', index);
    const question = questions[currentQuestionIndex];
    if (answers.find(answer => answer.term === question.term && answer.questionType === question.type)) return;

    const selected = question.options[index];
    const isCorrect = selected === question.correct;
    answers.push({
        term: question.term,
        selected,
        correct: question.correct,
        isCorrect,
        questionType: question.type
    });

    if (!isCorrect) {
        missedTerms.push({
            term: question.term,
            definition: question.definition,
            strand: question.strand
        });
    }

    const options = document.querySelectorAll('.option');
    options.forEach((opt, i) => {
        opt.classList.add(question.options[i] === question.correct ? 'correct' : 'incorrect');
        opt.onclick = null;
    });

    updateProgress();

    document.getElementById('nextBtn').disabled = false;

    if (currentQuestionIndex >= questions.length - 1) {
        stopTimer();
        setTimeout(showResults, 500);
    }
}

function updateProgress() {
    const progress = document.getElementById('progress');
    if (!progress) return;

    const score = answers.filter(answer => answer.isCorrect).length;
    const totalAnswered = answers.length;
    const percentage = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
    const questionProgress = currentQuestionIndex < questions.length
        ? `Question ${currentQuestionIndex + 1} of ${questions.length}`
        : `Completed ${questions.length} of ${questions.length}`;

    progress.innerHTML = `
        ${questionProgress} | Answered ${totalAnswered} of ${questions.length} | Score: ${percentage}%
    `;
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
        updateProgress();
        document.getElementById('nextBtn').disabled = !answers.find(answer => answer.term === questions[currentQuestionIndex].term && answer.questionType === questions[currentQuestionIndex].type);
        document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
    }
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length) {
        currentQuestionIndex++;
        displayQuestion();
        updateProgress();
        document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
        document.getElementById('nextBtn').disabled = !answers.find(answer => answer.term === questions[currentQuestionIndex]?.term && answer.questionType === questions[currentQuestionIndex]?.type);
    }
}

function showResults() {
    const score = answers.filter(answer => answer.isCorrect).length;
    const percentage = answers.length > 0 ? Math.round((score / answers.length) * 100) : 0;
    const resultsDiv = document.getElementById('results');
    if (!resultsDiv) {
        console.error('Results div not found');
        return;
    }
    const hasMissedTerms = missedTerms.length > 0;
    resultsDiv.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Final Score: ${score}/${answers.length} (${percentage}%)</p>
        <p>Total Time: ${formatTime(totalDuration)}</p>
        <input type="text" id="studentName" placeholder="Enter your name">
        <div class="button-group">
            <button onclick="generateReport()">Generate Report</button>
            <button id="retakeMissedBtn" onclick="retakeMissedTerms()" ${!hasMissedTerms ? 'disabled' : ''}>
                Retake Missed Terms (${missedTerms.length})
            </button>
        </div>
    `;
    document.getElementById('quizArea').innerHTML = '';
    document.getElementById('progress').innerHTML = '';
    const timer = document.getElementById('timer');
    if (timer) timer.style.display = 'none';
    document.getElementById('nextBtn').disabled = true;
}

function retakeMissedTerms() {
    console.log('Retaking missed terms:', missedTerms);
    try {
        if (!missedTerms || !Array.isArray(missedTerms) || missedTerms.length === 0) {
            alert('No missed terms available to retake.');
            return;
        }

        const validMissedTerms = [];
        const seen = new Set();
        for (const item of missedTerms) {
            if (item && item.term?.trim() && item.definition?.trim() && !seen.has(item.term + item.definition)) {
                validMissedTerms.push(item);
                seen.add(item.term + item.definition);
            }
        }

        console.log('Valid missed terms:', validMissedTerms);
        if (validMissedTerms.length < 4) {
            alert('Not enough unique missed terms to generate a quiz (minimum 4 required).');
            return;
        }

        localStorage.setItem('originalQuizResults', JSON.stringify(questions.map(q => ({
            term: q.term,
            definition: q.definition,
            strand: q.strand,
            correct: answers.find(a => a.term === q.term && a.questionType === q.type)?.isCorrect || false
        }))));

        startQuiz(validMissedTerms);
    } catch (error) {
        console.error('Error retaking missed terms:', error);
        alert('An error occurred while retaking missed terms. Please try again.');
    }
}

function generateReport() {
    try {
        const studentName = document.getElementById('studentName')?.value || 'Student';
        const score = answers.filter(answer => answer.isCorrect).length;
        const percentage = answers.length > 0 ? Math.round((score / answers.length) * 100) : 0;
        const isReady = percentage > 80;
        const readinessMessage = isReady
            ? '<p style="color: green;"><strong>Congratulations!</strong> You are ready for the state test with a score above 80%.</p>'
            : '<p style="color: red;">Keep practicing! A score above 80% is recommended to be ready for the state test.</p>';

        if (!answers.length || !questions.length) {
            alert('No quiz data available to generate a report.');
            return;
        }

        const originalResults = JSON.parse(localStorage.getItem('originalQuizResults') || '[]');
        const retakeResults = missedTerms.length > 0 ? answers.map(answer => ({
            term: answer.term,
            definition: questions.find(q => q.term === answer.term && q.type === answer.questionType)?.definition || '',
            strand: questions.find(q => q.term === answer.term && q.type === answer.questionType)?.strand || '',
            correct: answer.isCorrect
        })) : [];
        const retakeMap = new Map(retakeResults.map(item => [item.term, item]));

        const combinedResults = originalResults.map(item => {
            const retakeItem = retakeMap.get(item.term);
            return {
                ...item,
                correct: retakeItem ? retakeItem.correct : item.correct,
                retaken: !!retakeItem
            };
        });

        const reportWindow = window.open('', '_blank');
        if (!reportWindow) {
            alert('Failed to open report window. Please allow pop-ups.');
            return;
        }

        reportWindow.document.write(`
            <html>
            <head>
                <title>Quiz Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background: #f4f4f9; }
                    .correct { color: green; }
                    .incorrect { color: red; }
                    .copyright { text-align: center; margin-top: 20px; color: #333; font-size: 0.9em; }
                </style>
            </head>
            <body>
                <h1>${currentSetName || 'Vocabulary Quiz'} Report</h1>
                <p><strong>Student:</strong> ${studentName}</p>
                <p><strong>Score:</strong> ${score}/${answers.length} (${percentage}%)</p>
                <p><strong>Total Time:</strong> ${formatTime(totalDuration)}</p>
                ${readinessMessage}
                <table>
                    <tr>
                        <th>Term</th>
                        <th>Definition</th>
                        <th>Strand/Category</th>
                        <th>Correct</th>
                        <th>Retaken</th>
                    </tr>
                    ${combinedResults.map(item => `
                        <tr>
                            <td>${item.term || 'N/A'}</td>
                            <td>${item.definition || 'N/A'}</td>
                            <td>${item.strand || 'N/A'}</td>
                            <td class="${item.correct ? 'correct' : 'incorrect'}">${item.correct ? 'Correct' : 'Incorrect'}</td>
                            <td>${item.retaken ? 'Yes' : 'No'}</td>
                        </tr>
                    `).join('')}
                </table>
                <button onclick="window.print()">Print Report</button>
                <p class="copyright">© 2025 Ken Kapptie | For educational use only | All rights reserved.</p>
            </body>
            </html>
        `);
        reportWindow.document.close();
        clearQuizData();
    } catch (error) {
        console.error('Error generating report:', error);
        alert('An error occurred while generating the report. Please try again.');
    }
}

function clearQuizData() {
    localStorage.removeItem('originalQuizResults');
    localStorage.removeItem('retakeQuizResults');
}