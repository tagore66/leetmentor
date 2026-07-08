export interface PlatformAdapter {
  getProblemTitle(): string;
  getProblemDescription(): string;
  getConstraints(): string;
  getLanguage(): string;
  getDifficulty(): string;
  getCurrentCode(): string;
}

export function detectPlatform(): PlatformAdapter | null {
  const hostname = window.location.hostname;
  if (hostname.includes("leetcode.com")) {
    return new LeetCodeAdapter();
  }
  return null;
}

export class LeetCodeAdapter implements PlatformAdapter {
  getProblemTitle(): string {
    const titleElement = document.querySelector('[data-cy="question-title"]');
    if (titleElement) return titleElement.textContent || "";
    
    // Fallback for new LeetCode UI
    const newTitleElement = document.querySelector('.text-title-large');
    return newTitleElement?.textContent || "Unknown LeetCode Problem";
  }

  getProblemDescription(): string {
    const descElement = document.querySelector('[data-track-load="description_content"]');
    if (descElement) return descElement.textContent || "";
    
    // Fallback for new LeetCode UI
    const newDescElement = document.querySelector('.elfjS');
    return newDescElement?.textContent || "";
  }

  getConstraints(): string {
    // Constraints are usually the last ul in the description
    return ""; // Simplified for now
  }

  getLanguage(): string {
    const langElement = document.querySelector('#editor .ant-select-selection-selected-value');
    if (langElement) return langElement.textContent || "";
    
    const newLangElement = document.querySelector('[data-mode-id]');
    return newLangElement?.getAttribute('data-mode-id') || "Unknown Language";
  }

  getDifficulty(): string {
    const easy = document.querySelector('.text-difficulty-easy');
    if (easy) return "Easy";
    const medium = document.querySelector('.text-difficulty-medium');
    if (medium) return "Medium";
    const hard = document.querySelector('.text-difficulty-hard');
    if (hard) return "Hard";
    return "Unknown";
  }

  getCurrentCode(): string {
    // Reading Monaco editor value directly is tricky due to isolation.
    // A reliable fallback is reading the hidden textarea Monaco uses, or grabbing all lines.
    const codeLines = document.querySelectorAll('.view-lines .view-line');
    if (codeLines.length > 0) {
      return Array.from(codeLines).map(line => line.textContent).join('\n');
    }
    return "";
  }
}
