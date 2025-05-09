# Vocabulary Quiz System

The Vocabulary Quiz System is a web-based application designed to help students practice and master vocabulary terms for educational purposes. It allows users to take quizzes from preloaded vocabulary sets, track their progress, and generate reports to assess their readiness for state tests.

## Features

- **Preloaded Vocabulary Sets**: Includes two preloaded sets (`utah_video_production_terms_Final.csv` and `Exploring_Computer_Science_Vocabulary.csv`) for immediate use.
- **Question Mode Selection**:
  - Choose between three question modes: "Term to Definition," "Definition to Term," or "Mixed (Both)."
  - Users must select a question mode before the vocabulary set dropdown is enabled, ensuring the mode impacts the quiz.
- **Interactive Quiz**:
  - Multiple-choice questions with four options per question.
  - The "Next" button is disabled until an option is selected, preventing accidental skips.
  - Visual feedback for correct/incorrect answers with color-coded options (teal for correct, red for incorrect).
  - Navigation between questions using "Previous" and "Next" buttons.
  - Progress tracking with a running score percentage displayed during the quiz.
- **Missed Terms Retake**:
  - Tracks missed terms during the quiz.
  - Offers a "Retake Missed Terms" option to practice only the terms answered incorrectly.
- **Report Generation**:
  - Generates a detailed HTML report with the student's name, score, and state test readiness (based on a score above 80%).
  - Includes a table of all answers, showing the term, question type, user's answer, correct answer, result, and strand.
  - Option to print the report directly from the browser.
- **Theme Switching**:
  - Supports light and dark themes, with the selected theme persisted across sessions using `localStorage`.
  - Custom color swatch (`#389377`, `#38938D`, `#388293`, `#386B93`, `#385493`) applied to buttons, options, and correct answers for a cohesive look.
- **Responsive Design**:
  - Optimized for both desktop and mobile devices.
  - Buttons stack vertically on smaller screens for better usability.
  - Footer links adjust to a vertical layout on mobile devices.
- **Teacher Dashboard** (Placeholder):
  - A placeholder teacher dashboard is included (accessible via `?mode=teacher` URL parameter).
  - Currently displays a message that vocab sets are preloaded, with upload functionality disabled.

## Usage Instructions

1. **Access the App**:
   - Visit [https://kappter.github.io/kappquiz/](https://kappter.github.io/kappquiz/) to use the app.

2. **Select a Question Mode**:
   - Choose a question mode from the dropdown ("Term to Definition," "Definition to Term," or "Mixed (Both)") to enable the vocabulary set dropdown.

3. **Select a Vocabulary Set**:
   - Once a question mode is selected, choose a vocabulary set from the dropdown to start the quiz.

4. **Take the Quiz**:
   - Answer each question by selecting one of the four options.
   - The "Next" button will be disabled until you make a selection.
   - Use the "Previous" and "Next" buttons to navigate between questions.
   - Track your progress with the score percentage displayed at the top.

5. **View Results**:
   - After completing the quiz, see your final score and percentage.
   - Enter your name to personalize the report.
   - Click "Generate Report" to view a detailed report of your answers.
   - Click "Retake Missed Terms" to practice terms you answered incorrectly (if any).

6. **Switch Themes**:
   - Use the theme selector in the top-right corner to toggle between light and dark modes.

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
   - Add your own `.csv` files to the `vocab-sets` directory.
   - Update the `availableSets` array in `script.js` to include your new files.
4. **Deploy to GitHub Pages**:
   - Push the repository to your GitHub account.
   - Go to the repository settings on GitHub, scroll to the "GitHub Pages" section, and set the source to the `main` branch.
   - Access your app at `https://<your-username>.github.io/kappquiz/`.
5. **Test the App**:
   - Ensure all features (question modes, quiz navigation, report generation, theme switching) work as expected.

## Credits

- **Developed by**: Ken Kapptie
- **Purpose**: For educational use only.
- **Links**:
  - [Detailed Info on App](https://github.com/kappter/kappquiz/)
  - [More Tools Like This](https://kappter.github.io/portfolio/#projects)
  - [Want Your Own?](https://kappter.github.io/portfolio/proposal.html)

## License

© 2025 Ken Kapptie. All rights reserved. This project is intended for educational use only.