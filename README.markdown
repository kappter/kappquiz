# Vocabulary Quiz System

![Vocabulary Quiz System](screenshots/quiz-light-mode.png)

The **Vocabulary Quiz System** is an interactive web application designed to help students master vocabulary terms and definitions for various subjects. Built for educational use, it offers a dynamic, user-friendly interface for students to take quizzes and for teachers to manage vocabulary sets. The app is themed with school colors and packed with features like a quiz timer, dynamic titles, and detailed reports to enhance learning.

© 2025 Ken Kapptie | For educational use only | All rights reserved.

## Features

- **Flexible Question Modes**: Choose from:
  - *Term to Definition*: Match terms to their definitions.
  - *Definition to Term*: Match definitions to their terms.
  - *Mixed*: A combination of both for a comprehensive challenge.
- **Quiz Timer**: Tracks time elapsed during the quiz and displays total duration in results and reports.
- **Dynamic Page Title**: Updates the page title to reflect the selected vocabulary set (e.g., "Exploring Computer Science Vocabulary Quiz").
- **Preloaded Vocabulary Sets**: Includes sets like:
  - Exploring Computer Science
  - Game Development Fundamentals
  - ARRL Ham Radio Licenses
  - And more!
- **Retake Missed Terms**: Automatically generates a new quiz from terms answered incorrectly (requires at least 4 missed terms).
- **Detailed Reports**: Generates printable reports with:
  - Student name, score, and total time.
  - Per-question details (term, question type, answers, correctness, strand).
  - Readiness indicator (green for >80%, red for ≤80%).
- **School-Themed Design**: Uses official school colors (#155BEA, #EAA415, #BB8311) for buttons, options, and borders.
- **Light/Dark Mode**: Toggle between themes, with preferences saved via local storage.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **Teacher Dashboard**: View preloaded vocab sets (accessible via `?mode=teacher` URL parameter).
- **Progress Tracking**: Displays current question, total questions, and live score percentage.
- **Error Handling**: Robust checks for invalid data, missing files, or insufficient missed terms.

## Screenshots

- **Quiz Interface (Light Mode)**: [View](screenshots/quiz-light-mode.png)
- **Quiz Interface (Dark Mode)**: [View](screenshots/quiz-dark-mode.png)
- **Generated Report**: [View](screenshots/report.png)

*Note: Replace placeholder screenshot links with actual images hosted in your repository.*

## Setup Instructions

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, etc.).
- [Git](https://git-scm.com/) for cloning the repository.
- (Optional) A web server for local testing or GitHub Pages for deployment.

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/kappter/kappquiz.git
   cd kappquiz
   ```
2. Open `index.html` in a browser:
   - Double-click `index.html`, or
   - Serve via a local server (e.g., Python):
     ```bash
     python -m http.server 8000
     ```
     Then visit `http://localhost:8000`.
3. Ensure the `vocab-sets/` directory contains CSV files with columns: `term`, `definition`, `strand`.

### Deploy to GitHub Pages
1. Fork or push the repository to GitHub:
   ```bash
   git push origin main
   ```
2. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages.
   - Set Source to "Deploy from a branch" and select the `main` branch, `/ (root)` folder.
   - Save and wait for deployment (e.g., `https://kappter.github.io/kappquiz/`).
3. Clear cache if issues persist:
   ```bash
   git add index.html
   git commit -m "Force cache refresh"
   git push
   ```

### File Structure
```
kappquiz/
├── index.html         # Main HTML file
├── script.js          # JavaScript logic (quiz, timer, title, reports)
├── styles.css         # CSS with school colors and responsive design
├── vocab-sets/        # Directory for CSV vocabulary files
└── README.md          # Project documentation
```

## Usage

1. **Select a Question Mode**:
   - Choose "Term to Definition," "Definition to Term," or "Mixed" from the dropdown.
2. **Choose a Vocabulary Set**:
   - Select a set (e.g., "Short Testing Sample") to start the quiz.
   - The page title updates to reflect the set (e.g., "Short Testing Sample Quiz").
3. **Take the Quiz**:
   - Answer multiple-choice questions.
   - A timer displays elapsed time above the progress bar.
   - Navigate with "Previous" and "Next" buttons.
   - Progress shows current question and score percentage.
4. **View Results**:
   - See final score, percentage, and total time.
   - Enter your name for the report.
   - Retake missed terms if ≥4 terms were missed.
5. **Generate a Report**:
   - Click "Generate Report" to open a printable report with detailed results and total time.
6. **Toggle Theme**:
   - Switch between light and dark modes using the theme selector.
7. **Teacher Mode**:
   - Access via `https://kappter.github.io/kappquiz/?mode=teacher` to view preloaded sets.

## Tech Stack

- **HTML5**: Structure and layout.
- **CSS3**: Styling with school colors and responsive design.
- **JavaScript**: Core logic, quiz generation, timer, and report creation.
- **PapaParse**: CSV parsing for vocabulary sets.
- **Local Storage**: Theme preference persistence.

## Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit changes (`git commit -m "Add feature"`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

For custom versions or inquiries, visit [Ken Kapptie's Portfolio](https://kappter.github.io/portfolio/proposal.html).

## License

This project is for **educational use only**. All rights reserved.

© 2025 Ken Kapptie

---

*Explore more tools at [kappter.github.io/portfolio/#projects](https://kappter.github.io/portfolio/#projects) or learn about the app at [github.com/kappter/kappquiz](https://github.com/kappter/kappquiz/).*