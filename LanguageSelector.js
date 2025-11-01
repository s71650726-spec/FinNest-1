import React, { useContext, useEffect } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext.js';

function LanguageSelector() {
  const { language, setLanguage, supportedLanguages } = useContext(LanguageContext);

  useEffect(() => {
    // Auto detect device language once on mount if language not set
    if (!language) {
      const navigatorLang = navigator.language.slice(0, 2);
      if (supportedLanguages.includes(navigatorLang)) {
        setLanguage(navigatorLang);
      } else {
        setLanguage('en');
      }
    }
  }, [language, setLanguage, supportedLanguages]);

  return (
    <select
      aria-label="Select language"
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="rounded border border-gray-300 p-1 bg-white text-black focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {supportedLanguages.map((langCode) => (
        <option key={langCode} value={langCode}>
          {langCode.toUpperCase()}
        </option>
      ))}
    </select>
  );
}

export default LanguageSelector;
