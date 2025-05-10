// List of known CSV files in the vocab-sets directory
const availableSets = ['Short_Testing_Sample.csv','ARRL_Ham_Radio_General_License_Terms_Definitions.csv','ARRL_Ham_Radio_Extra_License_Terms_Definitions.csv','ARRL_Ham_Radio_Technician_License_Terms_Definitions.csv','Game_Development_Fundamentals-2_Terms_Definitions.csv', 'Game_Development_Fundamentals_1_Terms_Definitions.csv', 'utah_video_production_terms_Final.csv', 'Computer_Programming_2_Terms_Definitions.csv', 'Exploring_Computer_Science_Vocabulary.csv', 'advanced_computer_programming_vocab.csv','Digital_Media_2_Terms_and_Definitions.csv'];
let vocabSets = {};
let currentSet = null;
let currentQuestionIndex = 0;
let answers = [];
let questions = [];
let missedTerms = [];
let questionMode = '';

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('mode') === 'teacher') {
    document.getElementById('teacherPage').style.display = 'block';
    document.getElementById('studentPage').style.display = 'none';
} else {
    fetchVocabSets();
    document.getElementById('questionMode').addEventListener('change', (e) => {
        questionMode = e.target.value;
        document.getElementById('vocabSet').disabled = false;
    });
}

function uploadCSV() {
    alert('Upload functionality is disabled. Vocab sets are preloaded.');
}

async function fetchVocabSets() {
    const select = document.getElementById('vocabSet');
    select.innerHTML = '<option value="">Select a set</option>';

    for (const set of availableSets) {
        try {
            const response = await fetch(`/kappquiz/vocab-sets/${set}`);
            if (!response.ok) throw new Error(`Failed to fetch ${set}`);
            const csvData = await response.text();
            const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true }).data;
            vocabSets[set] = parsedData.map(item => ({
                term: item.term?.trim() || '',
                definition: item.definition?.trim() || '',
                strand: item.strand?.trim() || ''
            })).filter(item => item.term && item.definition);

            const option = document.createElement('option');
            option.value = set;
            option.textContent = set.replace('.csv', '');
            select.appendChild(option);
        } catch (error) {
            console.error(`Error loading ${set}:`, error);
            document.getElementById('quizArea').innerHTML = `<p>Error loading ${set}. Please check the file or repository.</p>`;
        }
    }

    if (Object.keys(vocabSets).length === 0) {
        document.getElementById('quizArea').innerHTML = '<p>Error: No vocab sets loaded. Please check the vocab-sets directory.</p>';
    }
}

function loadVocabSet() {
    const select = document.getElementById('vocabSet');
    const setName = select.value;
    if (!setName) {
        document.getElementById('quizArea').innerHTML = '';
        document.getElementById('progress').innerHTML = '';
        document.getElementById('results').innerHTML = '';
        return;
    }

    currentSet = vocabSets[setName];
    startQuiz();
    document.getElementById('questionMode').disabled = true;
    document.getElementById('vocabSet').disabled = true;
}

function startQuiz(data = currentSet) {
    console.log('Starting quiz with data:', data); // Debug log
    if (!questionMode) {
        alert('Please select a question mode before starting the quiz.');
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
        console.log('Generated questions:', questions); // Debug log
        if (questions.length === 0) {
            throw new Error('No valid questions could be generated from the data.');
        }

        currentQuestionIndex = 0;
        answers = [];
        missedTerms = [];
        document.getElementById('results').innerHTML = '';
        displayQuestion();
        updateProgress();
        document.getElementById('prevBtn').disabled = true;
        document.getElementById('nextBtn').disabled = true;
    } catch (error) {
        console.error('Error starting quiz:', error);
        document.getElementById('quizArea').innerHTML = `<p>Error: ${error.message} Please select a different set or try again.</p>`;
        document.getElementById('results').innerHTML = '';
        document.getElementById('progress').innerHTML = '';
        document.getElementById('nextBtn').disabled = true;
        document.getElementById('prevBtn').disabled = true;
    }
}

function generateQuestions(data) {
    console.log('Generating questions with data length:', data.length); // Debug log
    const questions = [];
    if (!data || !Array.isArray(data)) return questions;

    const maxAttempts = 50; // Reduced to prevent long loops
    data.forEach(item => {
        if (!item || !item.term?.trim() || !item.definition?.trim()) {
            console.log('Skipping invalid item:', item); // Debug log
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
                console.log('Failed to generate enough options for term:', item.term); // Debug log
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
                console.log('Failed to generate enough options for definition:', item.definition); // Debug log
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
            strand: item.strand || ''
        });
    });

    console.log('Questions generated:', questions.length); // Debug log
    return questions.sort(() => Math.random() - 0.5);
}

function displayQuestion() {
    console.log('Displaying question index:', currentQuestionIndex); // Debug log
    const quizArea = document.getElementById('quizArea');
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    const question = questions[currentQuestionIndex];
    const questionText = question.type === 'termToDefinition'
        ? `What is the definition of "${question.prompt}"?`
        : `What term matches this definition: "${question.prompt}"?`;

    const existingAnswer = answers.find(answer => answer.term === question.term && answer.questionType === question.type);

    quizArea.innerHTML = ''; // Clear before rendering to prevent stacking
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
    console.log('Selecting option index:', index); // Debug log
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

    if (currentQuestionIndex < questions.length - 1) {
        document.getElementById('nextBtn').disabled = false;
    } else {
        setTimeout(showResults, 500);
    }
}

function updateProgress() {
    const score = answers.filter((answer, index) => index <= currentQuestionIndex && answer.isCorrect).length;
    const totalQuestions = currentQuestionIndex + 1 <= questions.length ? currentQuestionIndex + 1 : questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const questionProgress = currentQuestionIndex < questions.length
        ? `Question ${currentQuestionIndex + 1} of ${questions.length}`
        : `Completed ${questions.length} of ${questions.length}`;
    document.getElementById('progress').innerHTML = `
        ${questionProgress} | Current Score: ${percentage}%
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
    const percentage = Math.round((score / questions.length) * 100);
    const resultsDiv = document.getElementById('results');
    const hasMissedTerms = missedTerms.length > 0;
    resultsDiv.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Final Score: ${score}/${questions.length} (${percentage}%)</p>
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
    document.getElementById('nextBtn').disabled = true;
}

function retakeMissedTerms() {
    console.log('Retaking missed terms:', missedTerms); // Debug log
    try {
        if (!missedTerms || !Array.isArray(missedTerms) || missedTerms.length === 0) {
            alert('No missed terms available to retake.');
            return;
        }

        // Validate and deduplicate missedTerms
        const validMissedTerms = [];
        const seen = new Set();
        for (const item of missedTerms) {
            if (item && item.term?.trim() && item.definition?.trim() && !seen.has(item.term + item.definition)) {
                validMissedTerms.push(item);
                seen.add(item.term + item.definition);
            }
        }

        console.log('Valid missed terms:', validMissedTerms); // Debug log
        if (validMissedTerms.length < 4) {
            alert('Not enough unique missed terms to generate a quiz (minimum 4 required).');
            return;
        }

        startQuiz(validMissedTerms);
    } catch (error) {
        console.error('Error retaking missed terms:', error);
        alert('An error occurred while retaking missed terms. Please try again.');
    }
}

function generateReport() {
    try {
        const studentName = document.getElementById('studentName').value || 'Student';
        const score = answers.filter(answer => answer.isCorrect).length;
        const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
        const isReady = percentage > 80;
        const readinessMessage = isReady
            ? '<p style="color: green;"><strong>Congratulations!</strong> You are ready for the state test with a score above 80%.</p>'
            : '<p style="color: red;">Keep practicing! A score above 80% is recommended to be ready for the state test.</p>';

        if (!answers.length || !questions.length) {
            alert('No quiz data available to generate a report.');
            return;
        }

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
                    th, td { border: 1px solid #ddd    --incorrect-bg: #f8d7da;
    --incorrect-border: #f5c6cb;
    --button-bg: #38938D;
    --button-hover-bg: #386B93;
    --link-color: #38938D;
}

body.dark {
    --background-color: #333;
    --container-bg: #444;
    --text-color: #f4f4f9;
    --option-bg: #2a6d5a;
    --option-border: #666;
    --option-hover-bg: #2a5d6e;
    --correct-bg: #1e5a43;
    --correct-border: #164d38;
    --incorrect-bg: #d32f2f;
    --incorrect-border: #b71c1c;
    --button-bg: #385493;
    --button-hover-bg: #4a69a5;
    --link-color: #66b0ff;
}

body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    padding-bottom: 60px;
    background-color: var(--background-color);
    color: var(--text-color);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    background: var(--container-bg);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    flex: 1 0 auto;
}

h1, h2 {
    text-align: center;
    color: var(--text-color);
}

select, input, button {
    padding: 10px;
    margin: 10px 0;
    width: 100%;
    box-sizing: border-box;
    background-color: var(--container-bg);
    color: var(--text-color);
    border: 1px solid var(--option-border);
}

.theme-selector {
    text-align: right;
}

.theme-selector select {
    width: auto;
    display: inline-block;
    padding: 8px;
}

.question-mode-selector {
    text-align: center;
    margin: 10px 0;
}

.question-mode-selector select {
    width: auto;
    display: inline-block;
    padding: 8px;
}

.instruction {
    font-size: 0.9em;
    color: var(--text-color);
    margin-bottom: 5px;
    text-align: center;
}

select:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
}

button {
    background-color: var(--button-bg);
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
}

button:hover {
    background-color: var(--button-hover-bg);
}

button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.button-group {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 10px;
}

.button-group button {
    width: auto;
    padding: 10px 20px;
}

#quizArea, #results {
    margin-top: 20px;
}

.question {
    margin-bottom: 20px;
}

.option {
    display: block;
    padding: 10px;
    margin: 5px 0;
    background: var(--option-bg);
    border: 1px solid var(--option-border);
    cursor: pointer;
    border-radius: 4px;
}

.option:hover {
    background: var(--option-hover-bg);
}

.correct {
    background: var(--correct-bg);
    border-color: var(--correct-border);
}

.incorrect {
    background: var(--incorrect-bg);
    border-color: var(--incorrect-border);
}

.pagination {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    gap: 10px;
}

#progress {
    text-align: center;
    font-weight: bold;
    margin-bottom: 20px;
}

footer {
    width: 100%;
    background: var(--container-bg);
    color: var(--text-color);
    text-align: center;
    padding: 10px 0;
    position: fixed;
    bottom: 0;
    left: 0;
    border-top: 1px solid var(--option-border);
}

footer a {
    color: var(--link-color);
    text-decoration: none;
}

footer a:hover {
    text-decoration: underline;
}

.donation-links {
    margin-top: 5px;
}

@media (max-width: 800px) {
    .container {
        padding: 15px;
        margin-bottom: 20px;
    }

    h1 {
        font-size: 1.5em;
    }

    h2 {
        font-size: 1.2em;
    }

    select, input, button {
        padding: 8px;
    }

    .button-group {
        flex-direction: column;
        gap: 5px;
    }

    .button-group button {
        width: 100%;
    }

    .donation-links {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .donation-links a {
        margin: 2px 0;
    }

    footer {
        position: static;
        border-top: none;
        padding: 10px;
    }

    .pagination {
        margin-bottom: 20px;
    }
}
