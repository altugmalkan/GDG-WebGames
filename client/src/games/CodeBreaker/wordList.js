export const WORDS = [
  'REACT',
  'FLASK',
  'REDIS',
  'NGINX',
  'SWIFT',
  'LINUX',
  'MYSQL',
  'NUMPY',
  'SCALA',
  'UNITY',
  'XCODE',
  'CLOUD',
  'KERAS',
  'RAILS',
  'RUST',
  'BASH',
  'JAVA',
  'RUBY',
  'MONGO',
  'DOCKER',
  'KOTLIN',
  'PYTHON',
  'GITHUB',
  'CHROME',
  'UBUNTU',
  'DJANGO',
  'NODEJS',
  'FLUTTER',
  'ANGULAR',
  'FIREBASE',
]

// Pick n random words from the list
export function pickWords(count = 5) {
  const shuffled = [...WORDS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// Generate hidden letter mask: true = visible, false = hidden
// Hides ~40-50% of letters, minimum 2 hidden
export function generateMask(word) {
  const len = word.length
  const hideCount = Math.max(2, Math.round(len * 0.45))
  const indices = Array.from({ length: len }, (_, i) => i)

  // Shuffle indices and pick hideCount to hide
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  const hiddenSet = new Set(indices.slice(0, hideCount))

  return Array.from({ length: len }, (_, i) => !hiddenSet.has(i))
}
