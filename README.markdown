# Vocabulary Quiz System

A customizable vocabulary quiz application designed for computer science and video production education, featuring separate teacher and student interfaces. Teachers can upload CSV files to create vocab sets, while students can take paginated multiple-choice quizzes with real-time scoring and generate printable reports. Hosted on GitHub Pages at [https://kappter.github.io/](https://kappter.github.io/).

## Features
- **Teacher Interface**: Upload CSV files with `term`, `definition`, and `strand` columns (stored in browser `localStorage`).
- **Student Interface**: Select a vocab set, take a quiz with a dynamic number of questions (up to 20, based on CSV entries), and view a running percentage score updated after each answer.
- **Report Generation**: Enter a name after completing the quiz to generate a printable HTML report summarizing results.
- **Extensible**: Designed for future additions like new test types (e.g., matching, fill-in-the-blank).

## Getting Started

### Prerequisites
- A modern web browser (e.g., Chrome, Firefox, Edge).
- No terminal access required; all setup is done via the GitHub website.

### Installation
1. Visit the repository at [https://github.com/kappter/kappquiz](https://github.com/kappter/kappquiz).
2. Ensure the files (`index.html`, `styles.css`, `script.js`) are present in the root directory.
3. GitHub Pages is already enabled; access the live app at [https://kappter.github.io/](https://kappter.github.io/).

### Usage
- **Teacher Mode**: Navigate to [https://kappter.github.io/?mode=teacher](https://kappter.github.io/?mode=teacher), upload a CSV file (e.g., `term,definition,strand\nCamera,A device used to capture video,02-01`), and the vocab set will be available for students.
- **Student Mode**: Go to [https://kappter.github.io/](https://kappter.github.io/), select a vocab set, answer the questions, and generate a report at the end.

## File Structure
```
/kappquiz
├── uploads/           # Directory for sample CSV files (used in local server setup, not on GitHub Pages)
│   ├── sample_vocab.csv
│   ├── utah_video_production_terms.csv
├── index.html         # Main HTML structure
├── script.js          # JavaScript logic and PapaParse for CSV handling
├── server.js          # Node.js server (used in local setup, not on GitHub Pages)
├── styles.css         # CSS for styling
└── README.markdown    # This file
```

## Contributing
Feel free to suggest enhancements or report issues:
- Fork the repository.
- Create a new branch for your feature or fix.
- Submit a pull request via the GitHub website.

## License
This project is open-source. Feel free to use and modify it as needed.

## Acknowledgments
- Built with assistance from xAI's Grok 3.
- Uses PapaParse for CSV parsing (https://www.papaparse.com/).