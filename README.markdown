# Vocabulary Quiz System

A customizable vocabulary quiz application designed for computer science and video production education, featuring separate teacher and student interfaces. The app is hosted on GitHub Pages at [https://kappter.github.io/kappquiz/](https://kappter.github.io/kappquiz/).

## Features
- **Teacher Interface**: Currently disabled; vocab sets are preloaded from the `vocab-sets` directory.
- **Student Interface**: Select a vocab set from a preloaded list, take a quiz with a dynamic number of questions (up to the total number of valid entries), and view a running percentage score updated after each answer.
- **Report Generation**: Enter a name after completing the quiz to generate a printable HTML report summarizing results.
- **Extensible**: Designed for future additions like new test types (e.g., matching, fill-in-the-blank).

![01](https://github.com/kappter/kappquiz/blob/main/images/kappquizz01.png?raw=true)

![02](https://github.com/kappter/kappquiz/blob/main/images/kappquizz02.png?raw=true)

## Getting Started

### Prerequisites
- A modern web browser (e.g., Chrome, Firefox, Edge).
- No terminal access required; all setup is done via the GitHub website.

### Installation
1. Visit the repository at [https://github.com/kappter/kappquiz](https://github.com/kappter/kappquiz).
2. Ensure the files (`index.html`, `styles.css`, `script.js`, `vocab-sets/`) are present in the root directory.
3. GitHub Pages is already enabled; access the live app at [https://kappter.github.io/kappquiz/](https://kappter.github.io/kappquiz/).

### Usage
- **Teacher Mode**: Navigate to [https://kappter.github.io/kappquiz/?mode=teacher](https://kappter.github.io/kappquiz/?mode=teacher). Note that vocab sets are preloaded, and the upload feature is disabled.
- **Student Mode**: Go to [https://kappter.github.io/kappquiz/](https://kappter.github.io/kappquiz/), select a vocab set (e.g., `utah_video_production_terms_Final`), answer the questions, and generate a report at the end.

## File Structure
```
/kappquiz
├── vocab-sets/           # Directory for CSV files containing vocab sets
│   ├── utah_video_production_terms_Final.csv
├── index.html            # Main HTML structure
├── script.js             # JavaScript logic with preloaded vocab sets
├── server.js             # Node.js server (used in local setup, not on GitHub Pages)
├── styles.css            # CSS for styling
└── README.markdown       # This file
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
