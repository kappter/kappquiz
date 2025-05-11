// Vocabulary Quiz System - themes.js (Version: 2025-05-28)
// Theme switching for themes.html

function generateAnalogousColors() {
    const baseHue = Math.floor(Math.random() * 360);
    const saturation = 70;
    const lightness = 50;
    return [
        `hsl(${baseHue}, ${saturation}%, ${lightness}%)`,
        `hsl(${(baseHue + 30) % 360}, ${saturation}%, ${lightness}%)`,
        `hsl(${(baseHue + 60) % 360}, ${saturation}%, ${lightness - 10}%)`,
        `hsl(${(baseHue - 30 + 360) % 360}, ${saturation}%, ${lightness + 10}%)`
    ];
}

function applyTheme(theme) {
    console.log('Applying theme:', theme);
    document.body.className = theme;
    localStorage.setItem('theme', theme);

    if (theme === 'random') {
        const [bgColor, buttonColor, correctColor, textColor] = generateAnalogousColors();
        let styleSheet = document.getElementById('random-theme');
        if (!styleSheet) {
            styleSheet = document.createElement('style');
            styleSheet.id = 'random-theme';
            document.head.appendChild(styleSheet);
        }
        styleSheet.textContent = `
            body.random {
                --background-color: ${bgColor};
                --container-bg: ${bgColor};
                --text-color: ${textColor};
                --option-bg: ${buttonColor};
                --option-border: ${textColor};
                --option-hover-bg: hsl(${(parseInt(buttonColor.match(/\d+/)[0]) + 30) % 360}, 70%, 40%);
                --correct-bg: ${correctColor};
                --correct-border: ${textColor};
                --incorrect-bg: hsl(${(parseInt(bgColor.match(/\d+/)[0]) + 60) % 360}, 70%, 60%);
                --incorrect-border: ${textColor};
                --button-bg: ${buttonColor};
                --button-hover-bg: hsl(${(parseInt(buttonColor.match(/\d+/)[0]) + 30) % 360}, 70%, 40%);
                --link-color: ${textColor};
                --timer-bg: ${bgColor};
                --timer-border: ${textColor};
            }
            body.random select {
                color: ${textColor};
            }
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.value = savedTheme;
    }
});
