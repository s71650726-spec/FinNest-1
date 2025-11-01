import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext.js';

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark/light theme"
      className="p-2 rounded-full bg-primary hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  );
}

export default ThemeToggle;
