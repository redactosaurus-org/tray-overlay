import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
    theme: 'light' | 'dark';
    onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
    const isDark = theme === 'dark';
    const nextLabel = isDark ? 'Switch to light theme' : 'Switch to dark theme';

    return (
        <button
            onClick={onToggle}
            aria-label={nextLabel}
            title={nextLabel}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
            {isDark ? (
                <Moon className="w-5 h-5" />
            ) : (
                <Sun className="w-5 h-5" />
            )}
        </button>
    );
};
