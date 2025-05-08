# Vocabulary Quiz System

A customizable vocabulary quiz application designed for computer science education, featuring separate teacher and student interfaces. Teachers can upload CSV files to create vocab sets, while students can take paginated multiple-choice quizzes with real-time scoring and generate printable reports. Hosted on GitHub Pages at [https://kappter.github.io/kappquiz/](https://kappter.github.io/kappquiz/).

## Features
- **Teacher Interface**: Upload CSV files with `term`, `definition`, and `strand` columns to create vocab sets (stored in browser `localStorage`).
- **Student Interface**: Select a vocab set, take a 10-question multiple-choice quiz with randomized options, and view a running percentage score.
- **Report Generation**: Enter a name after completing the quiz to generate a printable HTML report summarizing results.
- **Extensible**: Designed for future additions like new test types (e.g., matching, fill-in-the-blank).

## Getting Started

### Prerequisites
- A modern web browser (e.g., Chrome, Firefox, Edge).
- No terminal access required; all setup is done via the GitHub website.

### Installation
1. Visit the repository at [https://github.com/kappter/kappquiz](https://github.com/kappter/kappquiz).
2. Ensure the files (`index.html`, `styles.css`, `script.js`) are present in the `kappquiz` directory.
3. GitHub Pages is already enabled; access the live app at [https://kappter.github.io/kappquiz/](https://kappter.github.io/kappquiz/).

### Usage
- **Teacher Mode**: Navigate to [https://kappter.github.io/kappquiz/?mode=teacher](https://kappter.github.io/kappquiz/?mode=teacher), upload a CSV file (e.g., `term,definition,strand\nAlgorithm,A step-by-step procedure,01-01`), and the vocab set will be available for students.
- **Student Mode**: Go to [https://kappter.github.io/kappquiz/](https://kappter.github.io/kappquiz/), select a vocab set, answer the questions, and generate a report at the end.

## File Structure
```
kappquiz/
├── index.html        # Main HTML structure
├── styles.css        # CSS for styling
├── script.js         # JavaScript logic and PapaParse for CSV handling
└── README.md         # This file
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