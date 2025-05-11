# Vocabulary Quiz System

The **Vocabulary Quiz System** is an interactive web application designed to empower students to master vocabulary terms and definitions across various subjects. Tailored for educational environments, it offers a dynamic, accessible interface for students to take quizzes and for teachers to manage vocabulary sets. Themed with school colors and packed with features like a quiz timer, dynamic titles, and detailed reports, this app enhances learning and engagement.

Try it now at [https://kappter.github.io/kappquiz/](https://kappter.github.io/kappquiz/).

© 2025 Ken Kapptie | For educational use only | All rights reserved.

## Features

- **Flexible Question Modes**:
  - *Term to Definition*: Match terms to their definitions.
  - *Definition to Term*: Match definitions to their terms.
  - *Mixed*: Combines both for a comprehensive challenge.
- **Quiz Timer**: Tracks elapsed time during quizzes, displayed above the progress bar, and shows total duration in results and reports.
- **Dynamic Page Title**: Updates to reflect the selected vocabulary set (e.g., "Exploring Computer Science Vocabulary Quiz").
- **Preloaded Vocabulary Sets**: Includes diverse sets such as:
  - Exploring Computer Science
  - Game Development Fundamentals
  - ARRL Ham Radio Licenses (Technician, General, Extra)
  - Utah Video Production Terms
  - And more!
- **Retake Missed Terms**: Generates a new quiz from incorrectly answered terms (requires at least 4 unique missed terms).
- **Printable Reports**: Creates detailed, printable reports including:
  - Student name, score, percentage, and total time.
  - Per-question details (term, question type, answers, correctness, strand).
  - Readiness indicator (green for >80%, red for ≤80%).
- **School-Themed Design**: Uses official school colors:
  - Blue (`#155BEA`) for buttons and options.
  - Gold (`#EAA415`) for correct answers and footer links.
  - Bronze (`#BB8311`) for borders.
- **Light/Dark Mode**: Toggle between themes with saved preferences, featuring:
  - White text for multiple-choice options in light mode for readability.
  - Medium grey dropdown text in dark mode for contrast.
  - Gold footer links for prominence.
- **Responsive Design**: Optimized for desktop and mobile, with accessible navigation and clear text.
- **Teacher Dashboard**: View preloaded vocab sets via `?mode=teacher` URL parameter.
- **Progress Tracking**: Displays current question, total questions, and live score percentage.
- **Robust Error Handling**: Manages invalid data, missing files, or insufficient missed terms with clear alerts.

## Screenshots

- Quiz Interface (Light Mode): [Add quiz-light-mode.png]
- Quiz Interface (Dark Mode): [Add quiz-dark-mode.png]
- Generated Report: [Add report.png]

*Note: Add screenshot files to the `screenshots/` directory and update links.*

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
3. Ensure the `vocab-sets/` directory contains CSV files with `term`, `definition`, and `strand` columns.

### Deploy to GitHub Pages
1. Push the repository to GitHub:
   ```bash
   git push origin main
   ```
2. Enable GitHub Pages in repository settings:
   - Go to Settings → Pages.
   - Set Source to "Deploy from a branch," select `main` branch, `/ (root)` folder.
   - Save and access at `https://kappter.github.io/kappquiz/`.
3. Clear cache if needed:
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
   - The page title updates (e.g., "Short Testing Sample Quiz").
3. **Take the Quiz**:
   - Answer multiple-choice questions with clear, white-text options in light mode.
   - View elapsed time via the timer above the progress bar.
   - Navigate using "Previous" and "Next" buttons.
   - Track progress with question count and score percentage.
4. **View Results**:
   - See final score, percentage, and total time.
   - Enter a name for the report.
   - Retake missed terms if ≥4 terms were missed.
5. **Generate a Report**:
   - Click "Generate Report" for a printable summary with score, time, and per-question details.
6. **Toggle Theme**:
   - Switch between light and dark modes, with grey dropdown text in dark mode for readability.
7. **Explore Footer Links**:
   - Click gold-colored links for more info, portfolio, or custom app inquiries.
8. **Teacher Mode**:
   - Access via `https://kappter.github.io/kappquiz/?mode=teacher` to view preloaded sets.

## Tech Stack

- **HTML5**: Structure and layout.
- **CSS3**: Styling with school colors, responsive design, and accessibility tweaks.
- **JavaScript**: Quiz logic, timer, dynamic titles, and report generation.
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

*Discover more tools at [kappter.github.io/portfolio/#projects](https://kappter.github.io/portfolio/#projects) or learn about the app at [github.com/kappter/kappquiz](https://github.com/kappter/kappquiz/).*