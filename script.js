const vocabSetSelect = document.getElementById('vocab-set');
const startQuizButton = document.getElementById('start-quiz');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById('next');
const retakeButton = document.getElementById('retake');
const generateReportButton = document.getElementById('generate-report');
const resultsElement = document.getElementById('results');

let quizItems = [];
let currentQuestionIndex = 0;
let mode = 'mixed';
let questionCount = 10;

function populateVocabSets() {
    const availableSets = ['Short_Testing_Sample.csv', 'Web_Development_Terms_Definitions.csv','Music_Theory_Terms_Definitions.csv','ARRL_Ham_Radio_General_License_Terms_Definitions.csv', 'ARRL_Ham_Radio_Extra_License_Terms_Definitions.csv', 'ARRL_Ham_Radio_Technician_License_Terms_Definitions.csv', 'Game_Development_Fundamentals-2_Terms_Definitions.csv', 'Game_Development_Fundamentals_1_Terms_Definitions.csv', 'utah_video_production_terms_Final.csv', 'Utah_Computer_Programming_1_Terms_Definitions.csv','Computer_Programming_2_Terms_Definitions.csv', 'Exploring_Computer_Science_Vocabulary.csv', 'ECS_Hardware_OS_DataStorage_Terms_Definitions.csv','advanced_computer_programming_vocab.csv', 'Digital_Media_2_Terms_and_Definitions.csv'];

    vocabSets.forEach(set => {
        const option = document.createElement('option');
        option.value = set;
        option.textContent = set.replace('.csv', '').replace(/_/g, ' ');
        vocabSetSelect.appendChild(option);
    });
}

function fetchVocabSet(file) {
    fetch(`vocab-sets/${file}`)
        .then(response => response.text())
        .then(data => {
            const parsed = Papa.parse(data, { header: true, skipEmptyLines: true }).data;
            quizItems = parsed.map(item => ({
                term: item.term,
                definition: item.definition,
                strand: item.strand || item.category
            }));
            startQuiz();
        })
        .catch(error => console.error('Error loading CSV:', error));
}

function startQuiz() {
    clearQuizData();
    currentQuestionIndex = 0;
    quizItems = shuffleArray(quizItems).slice(0, Math.min(questionCount, quizItems.length));
    questionContainer.style.display = 'block';
    resultsElement.style.display = 'none';
    retakeButton.style.display = 'none';
    generateReportButton.style.display = 'none';
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestionIndex >= quizItems.length) {
        completeQuiz();
        return;
    }
    const item = quizItems[currentQuestionIndex];
    questionElement.textContent = mode === 'definition' ? item.term : `What is the definition of "${item.term}"?`;
    const options = generateOptions(item);
    optionsElement.innerHTML = '';
    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => selectOption(option, item.definition);
        optionsElement.appendChild(button);
    });
    nextButton.style.display = 'none';
}

function generateOptions(correctItem) {
    const options = [correctItem.definition];
    while (options.length < 4) {
        const randomItem = quizItems[Math.floor(Math.random() * quizItems.length)];
        if (!options.includes(randomItem.definition) && randomItem.definition !== correctItem.definition) {
            options.push(randomItem.definition);
        }
    }
    return shuffleArray(options);
}

function selectOption(selected, correct) {
    const item = quizItems[currentQuestionIndex];
    item.userAnswer = selected;
    optionsElement.querySelectorAll('button').forEach(button => {
        button.disabled = true;
        if (button.textContent === correct) {
            button.style.backgroundColor = '#28a745';
        } else if (button.textContent === selected && selected !== correct) {
            button.style.backgroundColor = '#dc3545';
        }
    });
    nextButton.style.display = 'block';
}

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

function completeQuiz() {
    questionContainer.style.display = 'none';
    resultsElement.style.display = 'block';
    resultsElement.textContent = `Quiz completed! You answered ${quizItems.filter(item => item.userAnswer === item.definition).length} out of ${quizItems.length} correctly.`;
    retakeButton.style.display = quizItems.some(item => item.userAnswer !== item.definition) ? 'block' : 'none';
    generateReportButton.style.display = 'block';
    
    let quizResults = quizItems.map(item => ({
        term: item.term,
        definition: item.definition,
        strand: item.strand,
        correct: item.userAnswer === item.definition
    }));
    localStorage.setItem('originalQuizResults', JSON.stringify(quizResults));
}

function startRetake() {
    const originalResults = JSON.parse(localStorage.getItem('originalQuizResults') || '[]');
    const incorrectItems = originalResults.filter(item => !item.correct);
    localStorage.setItem('retakeQuizResults', JSON.stringify(incorrectItems));
    quizItems = incorrectItems;
    currentQuestionIndex = 0;
    questionContainer.style.display = 'block';
    resultsElement.style.display = 'none';
    retakeButton.style.display = 'none';
    generateReportButton.style.display = 'none';
    loadQuestion();
}

function completeRetake() {
    let retakeResults = quizItems.map(item => ({
        term: item.term,
        definition: item.definition,
        strand: item.strand,
        correct: item.userAnswer === item.definition
    }));
    localStorage.setItem('retakeQuizResults', JSON.stringify(retakeResults));
    questionContainer.style.display = 'none';
    resultsElement.style.display = 'block';
    resultsElement.textContent = `Retake completed! You answered ${quizItems.filter(item => item.userAnswer === item.definition).length} out of ${quizItems.length} correctly.`;
    retakeButton.style.display = 'none';
    generateReportButton.style.display = 'block';
}

function generateReport() {
    const originalResults = JSON.parse(localStorage.getItem('originalQuizResults') || '[]');
    const retakeResults = JSON.parse(localStorage.getItem('retakeQuizResults') || '[]');
    const retakeMap = new Map(retakeResults.map(item => [item.term, item]));

    const combinedResults = originalResults.map(item => {
        const retakeItem = retakeMap.get(item.term);
        return {
            ...item,
            correct: retakeItem ? retakeItem.correct : item.correct,
            retaken: !!retakeItem
        };
    });

    const reportContainer = document.getElementById('report-container');
    reportContainer.innerHTML = '';
    
    const score = combinedResults.filter(item => item.correct).length;
    const total = combinedResults.length;
    const scoreText = document.createElement('p');
    scoreText.textContent = `Score: ${score}/${total}`;
    reportContainer.appendChild(scoreText);

    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Term</th>
            <th>Definition</th>
            <th>Strand/Category</th>
            <th>Correct</th>
            <th>Retaken</th>
        </tr>
    `;
    combinedResults.forEach(item => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${item.term}</td>
            <td>${item.definition}</td>
            <td>${item.strand}</td>
            <td>${item.correct ? 'Correct' : 'Incorrect'}</td>
            <td>${item.retaken ? 'Yes' : 'No'}</td>
        `;
    });
    reportContainer.appendChild(table);
}

function clearQuizData() {
    localStorage.removeItem('originalQuizResults');
    localStorage.removeItem('retakeQuizResults');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

startQuizButton.onclick = () => {
    const selectedSet = vocabSetSelect.value;
    if (selectedSet) {
        mode = document.getElementById('mode').value;
        questionCount = parseInt(document.getElementById('question-count').value) || 10;
        fetchVocabSet(selectedSet);
    }
};

nextButton.onclick = nextQuestion;
retakeButton.onclick = startRetake;
generateReportButton.onclick = generateReport;

document.getElementById('restart').onclick = () => {
    clearQuizData();
    questionContainer.style.display = 'none';
    resultsElement.style.display = 'none';
    vocabSetSelect.selectedIndex = 0;
};

populateVocabSets();
