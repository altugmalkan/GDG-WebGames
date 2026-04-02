export const TECH_SETS = [
  [
    { name: 'C', year: 1972 },
    { name: 'Python', year: 1991 },
    { name: 'Java', year: 1995 },
    { name: 'C#', year: 2000 },
    { name: 'Go', year: 2009 },
  ],
  [
    { name: 'JavaScript', year: 1995 },
    { name: 'PHP', year: 1995 },
    { name: 'Ruby', year: 1995 },
    { name: 'Kotlin', year: 2011 },
    { name: 'Swift', year: 2014 },
  ],
  [
    { name: 'MySQL', year: 1995 },
    { name: 'PostgreSQL', year: 1996 },
    { name: 'MongoDB', year: 2009 },
    { name: 'Redis', year: 2009 },
    { name: 'Firebase', year: 2011 },
  ],
  [
    { name: 'jQuery', year: 2006 },
    { name: 'Angular', year: 2010 },
    { name: 'React', year: 2013 },
    { name: 'Vue.js', year: 2014 },
    { name: 'Svelte', year: 2016 },
  ],
  [
    { name: 'Linux', year: 1991 },
    { name: 'Git', year: 2005 },
    { name: 'Docker', year: 2013 },
    { name: 'Kubernetes', year: 2014 },
    { name: 'Flutter', year: 2017 },
  ],
  [
    { name: 'HTML', year: 1993 },
    { name: 'CSS', year: 1996 },
    { name: 'Node.js', year: 2009 },
    { name: 'TypeScript', year: 2012 },
    { name: 'Deno', year: 2018 },
  ],
  [
    { name: 'TensorFlow', year: 2015 },
    { name: 'PyTorch', year: 2016 },
    { name: 'GPT-1', year: 2018 },
    { name: 'DALL-E', year: 2021 },
    { name: 'ChatGPT', year: 2022 },
  ],
]

// Pick `count` random sets and shuffle each set's items
export function pickSets(count = 5) {
  const shuffled = [...TECH_SETS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map(set => {
    const items = [...set].sort(() => Math.random() - 0.5)
    return { items, correctOrder: [...set].sort((a, b) => a.year - b.year) }
  })
}
