// List of known CSV files in the vocab-sets directory
const availableSets = ['ARRL_Ham_Radio_General_License_Terms_Definitions.csv','ARRL_Ham_Radio_Extra_License_Terms_Definitions.csv','ARRL_Ham_Radio_Technician_License_Terms_Definitions.csv','Game_Development_Fundamentals-2_Terms_Definitions.csv', 'Game_Development_Fundamentals_1_Terms_Definitions.csv', 'utah_video_production_terms_Final.csv', 'Computer_Programming_2_Terms_Definitions.csv', 'Exploring_Computer_Science_Vocabulary.csv', 'advanced_computer_programming_vocab.csv','Digital_Media_2_Terms_and_Definitions.csv'];
let vocabSets = {};
let currentSet = null;
let currentQuestionIndex = 0;
let score = 0;
let answers = [];
let questions = [];
let missedTerms = [];
let questionMode = ''; // Default mode (empty until selected)

// Toggle between teacher and student pages
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('mode') === 'teacher') {
    document.getElementById('teacherPage').style.display = 'block';
    document.getElementById('studentPage').style.display = 'none';
} else {
    fetchVocabSets();
    // Add event listener for question mode selection to enable vocab set dropdown
    document.getElementById('questionMode').addEventListener('change', (e) => {
        questionMode = e.target.value;
        document.getElementById('vocabSet').disabled = false; // Enable vocab set dropdown
    });
}

// Teacher: Upload CSV (disabled for now)
function uploadCSV() {
    alert('Upload functionality is disabled. Vocab sets are preloaded.');
}

// Student: Populate dropdown with vocab sets
async function fetchVocabSets() {
    const select = document.getElementById('vocabSet');
    select.innerHTML = '<option value="">Select a set</option>';

    // Preload all CSV files
    for (const set of availableSets) {
        try {
            const response = await fetch(`/kappquiz/vocab-sets/${set}`);
            if (!response.ok) throw new Error(`Failed to fetch ${set}`);
            const csvData = await response.text();
            const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true }).data;
            vocabSets[set] = parsedData.map(item => ({
                term: item.term || '',
                definition: item.definition || '',
                strand: item.strand || ''
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

// Student: Load selected vocab set
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

    // Disable both dropdowns after selection
    document.getElementById('questionMode').disabled = true;
    document.getElementById('vocabSet').disabled = true;
}

// Start quiz with randomized questions, optionally using a specific dataset
function startQuiz(data = currentSet) {
    if (!questionMode) {
        alert('Please select a question mode before starting the quiz.');
        return;
    }
    questions = generateQuestions(data);
    console.log('Generated questions:', questions); // Debugging
    if (questions.length === 0) {
        document.getElementById('quizArea').innerHTML = '<p>Error: No valid questions generated. Please check the data format (requires term, definition, strand).</p>';
        document.getElementById('results').innerHTML = '';
        document.getElementById('progress').innerHTML = '';
        document.getElementById('nextBtn').disabled = true;
        document.getElementById('prevBtn').disabled = true;
        return;
    }
    currentQuestionIndex = 0;
    score = 0;
    answers = [];
    missedTerms = []; // Reset missed terms for new quiz
    document.getElementById('results').innerHTML = '';
    displayQuestion();
    updateProgress();
    document.getElementById('prevBtn').disabled = true;
    document.getElementById('nextBtn').disabled = true; // Ensure Next button is disabled at start
}

// Generate multiple-choice questions based on the selected mode
function generateQuestions(data) {
    const questions = [];
    if (!data || !Array.isArray(data)) return questions;
    data.forEach(item => {
        if (!item || !item.term || !item.definition) return;

        // Determine question type based on mode
        let questionType = questionMode;
        if (questionMode === 'mixed') {
            questionType = Math.random() > 0.5 ? 'termToDefinition' : 'definitionToTerm';
        }

        let prompt, correctAnswer, incorrectOptions, options;

        if (questionType === 'termToDefinition') {
            // Term to Definition: Show term, options are definitions
            prompt = item.term;
            correctAnswer = item.definition;
            incorrectOptions = [];
            while (incorrectOptions.length < 3) {
                const randomItem = data[Math.floor(Math.random() * data.length)];
                if (!randomItem || randomItem.definition === item.definition || incorrectOptions.includes(randomItem.definition)) continue;
                incorrectOptions.push(randomItem.definition);
            }
            if (incorrectOptions.length < 3) return; // Skip if not enough incorrect options
            options = [...incorrectOptions, item.definition].sort(() => Math.random() - 0.5);
        } else {
            // Definition to Term: Show definition, options are terms
            prompt = item.definition;
            correctAnswer = item.term;
            incorrectOptions = [];
            while (incorrectOptions.length < 3) {
                const randomItem = data[Math.floor(Math.random() * data.length)];
                if (!randomItem || randomItem.term === item.term || incorrectOptions.includes(randomItem.term)) continue;
                incorrectOptions.push(randomItem.term);
            }
            if (incorrectOptions.length < 3) return; // Skip if not enough incorrect options
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
    return questions.sort(() => Math.random() - 0.5);
}

// Display current question based on the question type
function displayQuestion() {
    const quizArea = document.getElementById('quizArea');
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    const question = questions[currentQuestionIndex];
    const questionText = question.type === 'termToDefinition'
        ? `What is the definition of "${question.prompt}"?`
        : `What term matches this definition: "${question.prompt}"?`;

    // Check if the question has already been answered
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

    // Ensure the Next button is disabled until an option is selected, unless it's the last question or already answered
    document.getElementById('nextBtn').disabled = !existingAnswer;
    document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
}

// Handle option selection and track missed terms
function selectOption(index) {
    const question = questions[currentQuestionIndex];
    // Prevent re-selection if the question has already been answered
    if (answers.find(answer => answer.term === question.term && answer.questionType === question.type)) return;

    const selected = question.options[index];
    const isCorrect = selected === question.correct;
    if (isCorrect) score++;
    else {
        // Add the missed term to missedTerms array
        missedTerms.push({
            term: question.term,
            definition: question.definition,
            strand: question.strand
        });
    }
    answers.push({ 
        term: question.term, 
        selected, 
        correct: question.correct, 
        isCorrect,
        questionType: question.type 
    });

    const options = document.querySelectorAll('.option');
    options.forEach((opt, i) => {
        opt.classList.add(question.options[i] === question.correct ? 'correct' : 'incorrect');
        opt.onclick = null;
    });

    updateProgress();

    // Enable the Next button after a selection is made
    if (currentQuestionIndex < questions.length - 1) {
        document.getElementById('nextBtn').disabled = false;
    } else {
        setTimeout(showResults, 500);
    }
}

// Update progress with running total and percentage
function updateProgress() {
    const percentage = Math.round((score / (currentQuestionIndex + 1)) * 100) || 0;
    const questionProgress = currentQuestionIndex < questions.length 
        ? `Question ${currentQuestionIndex + 1} of ${questions.length}` 
        : `Completed ${questions.length} of ${questions.length}`;
    document.getElementById('progress').innerHTML = `
        ${questionProgress} | Current Score: ${percentage}%
    `;
}

// Navigate to previous question
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
        document.getElementById('nextBtn').disabled = !answers.find(answer => answer.term === questions[currentQuestionIndex].term && answer.questionType === questions[currentQuestionIndex].type); // Disable Next button unless answered
        document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
    }
}

// Navigate to next question
function nextQuestion() {
    if (currentQuestionIndex < questions.length) {
        currentQuestionIndex++;
        displayQuestion();
        updateProgress();
        document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
        document.getElementById('nextBtn').disabled = !answers.find(answer => answer.term === questions[currentQuestionIndex]?.term && answer.questionType === questions[currentQuestionIndex]?.type); // Disable Next button unless answered
    }
}

// Show final results with retake option
function showResults() {
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

// Retake quiz with only missed terms
function retakeMissedTerms() {
    if (missedTerms.length === 0) return;
    startQuiz(missedTerms);
}

// Generate HTML report with state test readiness
function generateReport() {
    const studentName = document.getElementById('studentName').value || 'Student';
    const percentage = Math.round((score / questions.length) * 100);
    const isReady = percentage > 80;
    const readinessMessage = isReady 
        ? '<p style="color: green;"><strong>Congratulations!</strong> You are ready for the state test with a score above 80%.</p>'
        : '<p style="color: red;">Keep practicing! A score above 80% is recommended to be ready for the state test.</p>';

    const reportWindow = window.open('', '_blank');
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
            </style>
        </head>
        <body>
            <h1>Vocabulary Quiz Report</h1>
            <p><strong>Student:</strong> ${studentName}</p>
            <p><strong>Score:</strong> ${score}/${questions.length} (${percentage}%)</p>
            ${readinessMessage}
            <table>
                <tr>
                    <th>Term</th>
                    <th>Question Type</th>
                    <th>Your Answer</th>
                    <th>Correct Answer</th>
                    <th>Result</th>
                    <th>Strand</th>
                </tr>
                ${answers.map(answer => `
                    <tr>
                        <td>${answer.term}</td>
                        <td>${answer.questionType === 'termToDefinition' ? 'Term to Definition' : 'Definition to Term'}</td>
                        <td>${answer.selected}</td>
                        <td>${answer.correct}</td>
                        <td class="${answer.isCorrect ? 'correct' : 'incorrect'}">${answer.isCorrect ? 'Correct' : 'Incorrect'}</td>
                        <td>${questions.find(q => q.term === answer.term).strand}</td>
                    </tr>
                `).join('')}
            </table>
            <button onclick="window.print()">Print Report</button>
        </body>
        </html>
    `);
    reportWindow.document.close();
}

// Theme switching function
function changeTheme() {
    const theme = document.getElementById('themeSelect').value;
    document.body.className = theme;
    localStorage.setItem('theme', theme);
}

// Apply saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme;
    document.getElementById('themeSelect').value = savedTheme;
});