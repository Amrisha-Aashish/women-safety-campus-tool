const adjectives = ['Amber', 'Brave', 'Calm', 'Kind', 'Quiet', 'Swift'];
const nouns = ['Comet', 'Lotus', 'Maple', 'River', 'Sparrow', 'Willow'];

export function createPseudonym() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${adjective}${noun}${suffix}`;
}
