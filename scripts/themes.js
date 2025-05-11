// Vocabulary Quiz System - themes.js (Version: 2025-05-31)
// Theme switching for themes.html with high contrast (7:1) for Random theme and fixed Dark mode

// Calculate relative luminance for a color (WCAG formula)
function getRelativeLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

// Calculate contrast ratio between two colors
function calculateContrastRatio(color1, color2) {
    const lum1 = getRelativeLuminance(...color1);
    const lum2 = getRelativeLuminance(...color2);
    return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

// Convert HSL to RGB for contrast calculation
function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else if (h < 360) { r = c; g = 0; b = x; }

    return [
        Math.round((r + m) * 255),
        Math.round((g + m) * 255),
        Math.round((b + m) * 255)
    ];
}

function generateAnalogousColors() {
    const baseHue = Math.floor(Math.random() * 360);
    const saturation = 70;
    let bgLightness = 55;
    let textLightness = 95;

    const bgColor = `hsl(${baseHue}, ${saturation}%, ${bgLightness}%)`;
    const bgRgb = hslToRgb(baseHue, saturation, bgLightness);

    let contrastRatio;
    do {
        const textRgb = hslToRgb(baseHue, saturation, textLightness);
        contrastRatio = calculateContrastRatio(bgRgb, textRgb);
        if (contrastRatio < 7) {
            textLightness = textLightness > 50 ? 5 : 95;
        } else {
            break;
        }
    } while (contrastRatio < 7 && textLightness >= 5 && textLightness <= 95);

    return [
        bgColor,
        `hsl(${(baseHue + 30) % 360}, ${saturation}%, 45%)`,
        `hsl(${(baseHue + 60) % 360}, ${saturation}%, 65%)`,
        `hsl(${baseHue}, ${saturation}%, ${textLightness}%)`
    ];
}

function applyTheme(theme) {
    console.log('Applying theme:', theme);
    
    // Remove existing theme classes
    document.body.className = '';
    
    // Remove any Random theme styles
    const randomStyle = document.getElementById('random-theme');
    if (randomStyle) {
        randomStyle.remove();
    }

    // Apply new theme
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);

    if (theme === 'random') {
        const [bgColor, buttonColor, correctColor, textColor] = generateAnalogousColors();
        let styleSheet = document.createElement('style');
        styleSheet.id = 'random-theme';
        document.head.appendChild(styleSheet);
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
        themeSelect.addEventListener('change', (e) => applyTheme(e.target.value));
    }
});