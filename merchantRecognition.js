// Implements merchant name normalization and matching algorithms

function normalizeName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

// For demo, a static dictionary of normalized merchant names to display names
const knownMerchants = {
  'starbucks': 'Starbucks',
  'amazon': 'Amazon',
  'flipkart': 'Flipkart',
  'walmart': 'Walmart',
  'dominos': 'Domino\'s Pizza',
  'mcdonalds': 'McDonald\'s',
  'uber': 'Uber',
  'ola': 'Ola Cabs',
  'paytm': 'Paytm'
};

export function recognizeMerchantName(rawName) {
  if (!rawName) return 'Unknown Merchant';
  const normalized = normalizeName(rawName);

  for (const key in knownMerchants) {
    if (normalized.includes(key)) {
      return knownMerchants[key];
    }
  }

  // If no match, capitalize words and return
  return rawName
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
