export const QUESTIONS = [
  {
    q: 'Google hangi yılda kuruldu?',
    options: ['1996', '1998', '2000', '2002'],
    correct: 1,
  },
  {
    q: 'Flutter hangi programlama dilini kullanır?',
    options: ['Java', 'Swift', 'Dart', 'Kotlin'],
    correct: 2,
  },
  {
    q: "Firebase'in ilk sahibi hangi şirketti?",
    options: ['Google', 'Facebook', 'Envolve', 'Amazon'],
    correct: 2,
  },
  {
    q: "Android'in ilk sürümü hangi yılda çıktı?",
    options: ['2005', '2007', '2008', '2010'],
    correct: 2,
  },
  {
    q: 'GDG açılımı nedir?',
    options: ['Google Dev Group', 'Global Dev Guild', 'Google Data Grid', 'General Dev Group'],
    correct: 0,
  },
  {
    q: 'Kubernetes hangi dilde yazılmıştır?',
    options: ['Java', 'Python', 'Go', 'Rust'],
    correct: 2,
  },
  {
    q: "TensorFlow'un ilk sürümü hangi yılda yayınlandı?",
    options: ['2013', '2015', '2017', '2019'],
    correct: 1,
  },
  {
    q: 'Chrome ilk hangi işletim sistemi için çıktı?',
    options: ['macOS', 'Linux', 'Windows', 'Android'],
    correct: 2,
  },
  {
    q: 'Python hangi yılda ortaya çıktı?',
    options: ['1989', '1991', '1995', '2000'],
    correct: 1,
  },
  {
    q: 'React hangi şirket tarafından geliştirildi?',
    options: ['Google', 'Meta', 'Microsoft', 'Apple'],
    correct: 1,
  },
  {
    q: "Docker'ın yazıldığı programlama dili nedir?",
    options: ['Python', 'Go', 'Rust', 'C++'],
    correct: 1,
  },
  {
    q: "GitHub hangi yılda Microsoft tarafından satın alındı?",
    options: ['2016', '2017', '2018', '2019'],
    correct: 2,
  },
  {
    q: 'Linux çekirdeğini kim geliştirdi?',
    options: ['Richard Stallman', 'Linus Torvalds', 'Dennis Ritchie', 'Ken Thompson'],
    correct: 1,
  },
  {
    q: "TypeScript hangi şirket tarafından geliştirildi?",
    options: ['Google', 'Meta', 'Microsoft', 'Oracle'],
    correct: 2,
  },
  {
    q: 'Hangisi bir NoSQL veritabanıdır?',
    options: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite'],
    correct: 2,
  },
  {
    q: "Git'i kim geliştirdi?",
    options: ['Linus Torvalds', 'Guido van Rossum', 'James Gosling', 'Brendan Eich'],
    correct: 0,
  },
  {
    q: "Kotlin hangi platform için resmi dil olarak kabul edildi?",
    options: ['iOS', 'Android', 'Windows', 'Web'],
    correct: 1,
  },
  {
    q: "Hangisi Google'ın bulut platformudur?",
    options: ['Azure', 'AWS', 'GCP', 'DigitalOcean'],
    correct: 2,
  },
  {
    q: 'JavaScript hangi yılda ortaya çıktı?',
    options: ['1993', '1995', '1997', '1999'],
    correct: 1,
  },
  {
    q: "Angular hangi şirket tarafından geliştirildi?",
    options: ['Meta', 'Google', 'Microsoft', 'Amazon'],
    correct: 1,
  },
  {
    q: 'NPM ne anlama gelir?',
    options: ['Node Project Manager', 'Node Package Manager', 'New Package Module', 'Network Protocol Manager'],
    correct: 1,
  },
  {
    q: "Rust dili hangi şirket tarafından başlatıldı?",
    options: ['Google', 'Microsoft', 'Mozilla', 'Apple'],
    correct: 2,
  },
  {
    q: 'Hangisi bir CSS framework değildir?',
    options: ['Tailwind', 'Bootstrap', 'Express', 'Bulma'],
    correct: 2,
  },
  {
    q: "Swift hangi şirket tarafından geliştirildi?",
    options: ['Google', 'Microsoft', 'Apple', 'Meta'],
    correct: 2,
  },
  {
    q: "Vue.js'i kim geliştirdi?",
    options: ['Dan Abramov', 'Evan You', 'Ryan Dahl', 'Rich Harris'],
    correct: 1,
  },
  {
    q: "Redis ne tür bir veritabanıdır?",
    options: ['İlişkisel', 'Belge tabanlı', 'Anahtar-değer', 'Graf'],
    correct: 2,
  },
  {
    q: 'Hangisi bir konteyner orkestrasyon aracıdır?',
    options: ['Docker', 'Kubernetes', 'Nginx', 'Jenkins'],
    correct: 1,
  },
  {
    q: "Node.js'in yaratıcısı kimdir?",
    options: ['Brendan Eich', 'Ryan Dahl', 'Linus Torvalds', 'Guido van Rossum'],
    correct: 1,
  },
  {
    q: 'Hangisi bir versiyon kontrol sistemidir?',
    options: ['Docker', 'Git', 'Nginx', 'Redis'],
    correct: 1,
  },
  {
    q: "ChatGPT hangi şirket tarafından geliştirildi?",
    options: ['Google', 'Meta', 'OpenAI', 'Microsoft'],
    correct: 2,
  },
]

export function pickQuestions(count = 10) {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
