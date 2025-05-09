# Vocabulary Quiz System

The Vocabulary Quiz System is a web-based application designed to help students practice and master vocabulary terms for educational purposes. It provides an interactive platform for taking quizzes from preloaded vocabulary sets, tracking progress, and generating detailed reports to assess readiness for state tests.

## Features

- **Preloaded Vocabulary Sets**:
  - Includes multiple preloaded sets (e.g., `utah_video_production_terms_Final.csv`, `Exploring_Computer_Science_Vocabulary.csv`, and others) for immediate use.
  - Supports `.csv` files with term, definition, and strand columns.
- **Question Mode Selection**:
  - Offers three question modes: "Term to Definition," "Definition to Term," or "Mixed (Both)."
  - Users must select a mode before choosing a vocabulary set, ensuring the mode impacts the quiz format.
- **Interactive Quiz**:
  - Multiple-choice questions with four options per question.
  - "Next" button is disabled until an option is selected, preventing accidental skips.
  - Answers are locked after selection; users cannot change responses when navigating back to previous questions using the "Previous" button.
  - Visual feedback for correct/incorrect answers with color-coded options (teal for correct, red for incorrect).
  - Navigation between questions using "Previous" and "Next" buttons.
  - Progress tracking with a running score percentage displayed during the quiz.
- **Missed Terms Retake**:
  - Tracks terms answered incorrectly during the quiz.
  - Provides a "Retake Missed Terms" option to practice only missed terms, enhancing targeted learning.
- **Report Generation**:
  - Generates a detailed HTML report including the student's name, score, and state test readiness (based on a score above 80%).
  - Includes a table detailing each question's term, question type, user's answer, correct answer, result, and strand.
  - Offers a print option for the report directly from the browser.
- **Theme Switching**:
  - Supports light and dark themes, persisted across sessions using `localStorage`.
  - Uses a custom color swatch (`#389377`, `#38938D`, `#388293`, `#386B93`, `#385493`) for buttons, options, and correct answers, ensuring a cohesive design.
- **Responsive Design**:
  - Optimized for desktop and mobile devices.
  - Buttons stack vertically on smaller screens for improved usability.
  - Footer links adjust to a vertical layout on mobile devices.
- **Teacher Dashboard** (Placeholder):
  - Accessible via `?mode=teacher` URL parameter.
  - Displays a message indicating that vocab sets are preloaded, with upload functionality disabled.

## Usage Instructions

1. **Access the App**:
   - Visit [https://kappter.github.io/kappquiz/](https://kappter.github.io/kappquiz/) to use the app.
2. **Select a Question Mode**:
   - Choose a mode ("Term to Definition," "Definition to Term," or "Mixed") to enable the vocabulary set dropdown.
3. **Select a Vocabulary Set**:
   - Choose a set from the dropdown to start the quiz.
4. **Take the Quiz**:
   - Answer questions by selecting one of four options.
   - Navigate using "Previous" and "Next" buttons; answers are locked after selection.
   - Track progress with the score percentage displayed.
5. **View Results**:
   - View final score and percentage upon quiz completion.
   - Enter your name to personalize the report.
   - Click "Generate Report" for a detailed summary or "Retake Missed Terms" to practice incorrect answers.
6. **Switch Themes**:
   - Toggle between light and dark modes using the theme selector in the top-right corner.

## Setup/Deployment

The app is hosted on GitHub Pages. To deploy your own instance:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/kappter/kappquiz.git
   ```
2. **Navigate to the Project Directory**:
   ```bash
   cd kappquiz
   ```
3. **Update Vocabulary Sets** (Optional):
   - Add `.csv` files to the `vocab-sets` directory.
   - Update the `availableSets` array in `script.js` to include new files.
4. **Deploy to GitHub Pages**:
   - Push the repository to your GitHub account.
   - In repository settings, under "GitHub Pages," set the source to the `main` branch.
   - Access the app at `https://<your-username>.github.io/kappquiz/`.
5. **Test the App**:
   - Verify functionality of question modes, quiz navigation, answer locking, report generation, and theme switching.

## Credits

- **Developed by**: Ken Kapptie
- **Purpose**: For educational use only.
- **Links**:
  - [Detailed Info on App](https://github.com/kappter/kappquiz/)
  - [More Tools Like This](https://kappter.github.io/portfolio/#projects)
  - [Want Your Own?](https://kappter.github.io/portfolio/proposal.html)

## License

© 2025 Ken Kapptie. All rights reserved. This project is intended for educational use only.