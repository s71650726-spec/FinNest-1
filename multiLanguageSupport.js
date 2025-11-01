import fs from 'fs';
import path from 'path';

// Supported languages
const supportedLanguages = ['en', 'hi', 'te', 'ta', 'ml', 'bn', 'mr'];

// Load language JSON files from frontend/src/i18n/locales
export function loadLanguageFile(langCode) {
  if (!supportedLanguages.includes(langCode)) {
    langCode = 'en';
  }
  const filePath = path.resolve('frontend/src/i18n/locales', `${langCode}.json`);
  if (!fs.existsSync(filePath)) {
    return {};
  }
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {};
  }
}

// Detect language from Accept-Language header or default to English
export function detectLanguage(req) {
  const acceptLang = req.headers['accept-language'];
  if (!acceptLang) return 'en';

  const langs = acceptLang.split(',').map((l) => l.split(';')[0].trim().toLowerCase());
  for (const lang of langs) {
    if (supportedLanguages.includes(lang)) {
      return lang;
    }
    if (lang.length > 2 && supportedLanguages.includes(lang.slice(0, 2))) {
      return lang.slice(0, 2);
    }
  }
  return 'en';
}
