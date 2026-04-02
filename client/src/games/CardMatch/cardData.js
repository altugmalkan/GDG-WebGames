export const CARD_PAIRS = [
  { id: "flutter", name: "Flutter", icon: "/flutter-svgrepo-com.svg" },
  { id: "firebase", name: "Firebase", icon: "/icons8-firebase.svg" },
  { id: "android", name: "Android", icon: "/android-svgrepo-com.svg" },
  { id: "kotlin", name: "Kotlin", icon: "/icons8-kotlin.svg" },
  { id: "tensorflow", name: "TensorFlow", icon: "/icons8-tensorflow.svg" },
  { id: "gcloud", name: "Google Cloud", icon: "/icons8-google-cloud.svg" },
  { id: "go", name: "Go", icon: "/golang-svgrepo-com.svg" },
  { id: "chrome", name: "Chrome", icon: "/icons8-chrome-48.png" },
];

export function createDeck() {
  const cards = CARD_PAIRS.flatMap((pair, i) => [
    { ...pair, uid: `${pair.id}-a`, pairIndex: i },
    { ...pair, uid: `${pair.id}-b`, pairIndex: i },
  ]);
  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}
