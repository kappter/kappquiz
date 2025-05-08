let vocabSets = {};
let currentSet = null;
let currentQuestionIndex = 0;
let score = 0;
let answers = [];
let questions = [];

// Toggle between teacher and student pages
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('mode') === 'teacher') {
    document.getElementById('teacherPage').style.display = 'block';
    document.getElementById('studentPage').style.display = 'none';
} else {
    fetchVocabSets();
}

// Teacher: Upload CSV (client-side)
function uploadCSV() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a CSV file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const csvText = e.target.result;
        Papa.parse(csvText, {
            header: true,
            complete: (result) => {
                // Store vocab set in localStorage
                const setName = file.name;
                vocabSets[setName] = result.data;
                localStorage.setItem('vocabSets', JSON.stringify(Object.keys(vocabSets)));
                localStorage.setItem(setName, JSON.stringify(result.data));
                alert('CSV uploaded successfully!');
                fileInput.value = '';
            },
            error: (error) => {
                console.error('Parsing error:', error);
                alert('Failed to parse CSV.');
            }
        });
    };
    reader.readAsText(file);
}

// Student: Fetch available vocab sets from localStorage
function fetchVocabSets() {
    const storedSets = localStorage.getItem('vocabSets');
    if (storedSets) {
        const sets = JSON.parse(storedSets);
        const select = document.getElementById('vocabSet');
        select.innerHTML = '<option value="">Select a set</option>';
        sets.forEach(set => {
            const option = document.createElement('option');
            option.value = set;
            option.textContent = set.replace('.csv', '');
            select.appendChild(option);
        });
    }
}

// Student: Load selected vocab set from localStorage
function loadVocabSet() {
    const select = document.getElementById('vocabSet');
    const setName = select.value;
    if (!setName) {
        document.getElementById('quizArea').innerHTML = '';
        document.getElementById('progress').innerHTML = '';
        document.getElementById('results').innerHTML = '';
        return;
    }

    const storedData = localStorage.getItem(setName);
    if (storedData) {
        currentSet = JSON.parse(storedData);
        console.log('Loaded currentSet:', currentSet); // Debugging
        startQuiz();
    } else {
        alert('Error loading vocab set.');
    }
}

// Start quiz with randomized questions
function startQuiz() {
    questions = generateQuestions(currentSet);
    console.log('Generated questions:', questions); // Debugging
    if (questions.length === 0) {
        document.getElementById('quizArea').innerHTML = '<p>Error: No valid questions generated. Please check the CSV format (requires term, definition, strand columns).</p>';
        document.getElementById('results').innerHTML = '';
        document.getElementById('progress').innerHTML = '';
        document.getElementById('nextBtn').disabled = true;
        document.getElementById('prevBtn').disabled = true;
        return;
    }
    currentQuestionIndex = 0;
    score = 0;
    answers = [];
    document.getElementById('results').innerHTML = '';
    displayQuestion();
    updateProgress();
    document.getElementById('prevBtn').disabled = true;
    document.getElementById('nextBtn').disabled = false;
}

// Generate multiple-choice questions
function generateQuestions(data) {
    const questions = [];
    if (!data || !Array.isArray(data)) return questions;
    data.forEach(item => {
        if (!item || !item.term || !item.definition) return;
        const incorrect = [];
        while (incorrect.length < 3) {
            const randomItem = data[Math.floor(Math.random() * data.length)];
            if (!randomItem || randomItem.definition === item.definition || incorrect.includes(randomItem.definition)) continue;
            incorrect.push(randomItem.definition);
        }
        if (incorrect.length < 3) return; // Skip if not enough incorrect options
        const options = [...incorrect, item.definition].sort(() => Math.random() - 0.5);
        questions.push({
            term: item.term,
            correct: item.definition,
            options,
            strand: item.strand || ''
        });
    });
    return questions.sort(() => Math.random() - 0.5).slice(0, Math.min(data.length, 20)); // Dynamic number of questions, capped at 20
}

// Display current question
function displayQuestion() {
    const quizArea = document.getElementById('quizArea');
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    const question = questions[currentQuestionIndex];
    quizArea.innerHTML = `
        <div class="question">
            <h3>Question ${currentQuestionIndex + 1}: What is the definition of "${question.term}"?</h3>
            ${question.options.map((option, i) => `
                <div class="option" onclick="selectOption(${i})">${option}</div>
            `).join('')}
        </div>
    `;
}

// Handle option selection
function selectOption(index) {
    const question = questions[currentQuestionIndex];
    const selected = question.options[index];
    const isCorrect = selected === question.correct;
    if (isCorrect) score++;
    answers.push({ term: question.term, selected, correct: question.correct, isCorrect });

    const options = document.querySelectorAll('.option');
    options.forEach((opt, i) => {
        opt.classList.add(question.options[i] === question.correct ? 'correct' : 'incorrect');
        opt.onclick = null;
    });

    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            document.getElementById('nextBtn').disabled = false;
        } else {
            showResults();
        }
    }, 500);
}

// Update progress percentage
function updateProgress() {
    const percentage = Math.round((score / (currentQuestionIndex + 1)) * 100) || 0;
    document.getElementById('progress').innerHTML = `Current Score: ${percentage}%`;
}

// Navigate to previous question
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
        document.getElementById('nextBtn').disabled = false;
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
        document.getElementById('nextBtn').disabled = currentQuestionIndex >= questions.length;
    }
}

// Show final results and report generation
function showResults() {
    const percentage = Math.round((score / questions.length) * 100);
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Final Score: ${score}/${questions.length} (${percentage}%)</p>
        <input type="text" id="studentName" placeholder="Enter your name">
        <button onclick="generateReport()">Generate Report</button>
    `;
    document.getElementById('quizArea').innerHTML = '';
    document.getElementById('progress').innerHTML = '';
    document.getElementById('nextBtn').disabled = true;
}

// Generate HTML report
function generateReport() {
    const studentName = document.getElementById('studentName').value || 'Student';
    const percentage = Math.round((score / questions.length) * 100);
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
            <table>
                <tr>
                    <th>Term</th>
                    <th>Your Answer</th>
                    <th>Correct Answer</th>
                    <th>Result</th>
                    <th>Strand</th>
                </tr>
                ${answers.map(answer => `
                    <tr>
                        <td>${answer.term}</td>
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