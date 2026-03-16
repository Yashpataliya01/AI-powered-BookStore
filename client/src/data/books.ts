// ─── TYPES ───────────────────────────────────────────────────────────────────

export type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
  genre: string;
  rating: number;
  cover: string;
  description: string;
};

export type Review = {
  id: number;
  text: string;
  emoji: string;
  rating: number;
  user: string;
};

// ─── DATA ────────────────────────────────────────────────────────────────────

export const MOODS = [
  "Romance 🌹",
  "Fantasy & Dragons 🐉",
  "Sad Girl Hours 🖤",
  "Cozy Autumn Reads 🍂",
  "Queer & Trans Joy 🏳️‍🌈",
  "Sci-Fi Escapism 🚀",
  "Poetry That Hurts ✍️",
];

export const BOOKS: Book[] = [
  { id: "1", title: "A Court of Thorns and Roses", author: "Sarah J. Maas", price: 16.99, genre: "Fantasy & Dragons 🐉", rating: 4.8, cover: "https://picsum.photos/seed/court/400/600", description: "When nineteen-year-old huntress Feyre kills a wolf in the woods, a terrifying creature arrives to demand retribution. Dragged to a treacherous magical land, she discovers her captor is not truly a beast, but one of the lethal, immortal faeries who once ruled her world." },
  { id: "2", title: "Crying in H Mart", author: "Michelle Zauner", price: 15.99, genre: "Sad Girl Hours 🖤", rating: 4.9, cover: "https://picsum.photos/seed/hmart/400/600", description: "An unflinching, powerful, and profoundly moving memoir about growing up Korean American, losing her mother, and forging her own identity. A beautiful tribute to grief and food." },
  { id: "3", title: "The Atlas Six", author: "Olivie Blake", price: 17.99, genre: "Fantasy & Dragons 🐉", rating: 4.7, cover: "https://picsum.photos/seed/atlas/400/600", description: "The Alexandrian Society is the foremost secret society of magical academicians in the world. Each decade, only the six most uniquely talented magicians are selected for initiation." },
  { id: "4", title: "Heartstopper Vol 1", author: "Alice Oseman", price: 14.99, genre: "Queer & Trans Joy 🏳️‍🌈", rating: 4.9, cover: "https://picsum.photos/seed/heart/400/600", description: "Boy meets boy. Boys become friends. Boys fall in love. A sweet and charming coming-of-age story exploring friendship, love, and coming out." },
  { id: "5", title: "All the Light We Cannot See", author: "Anthony Doerr", price: 16.99, genre: "Sad Girl Hours 🖤", rating: 4.8, cover: "https://picsum.photos/seed/light/400/600", description: "A stunning novel about a blind French girl and a German boy whose paths collide in occupied France as both try to survive the devastation of World War II." },
  { id: "6", title: "Iron Flame", author: "Rebecca Yarros", price: 18.99, genre: "Romance 🌹", rating: 4.6, cover: "https://picsum.photos/seed/flame/400/600", description: "The highly anticipated sequel to Fourth Wing. Violet Sorrengail thought she'd found her place — but the real training is only just beginning." },
  { id: "7", title: "Milk and Honey", author: "Rupi Kaur", price: 12.99, genre: "Poetry That Hurts ✍️", rating: 4.7, cover: "https://picsum.photos/seed/milk/400/600", description: "A collection of poetry and prose about survival. About violence, abuse, love, loss, and femininity. Split into four chapters, each healing a different heartache." },
  { id: "8", title: "Tomorrow, and Tomorrow, and Tomorrow", author: "Gabrielle Zevin", price: 17.99, genre: "Cozy Autumn Reads 🍂", rating: 4.8, cover: "https://picsum.photos/seed/tomorrow/400/600", description: "Two childhood friends reunite in college and create a wildly successful video game together. Over thirty years, their lives entwine through success, failure, love, and tragedy." },
  { id: "9", title: "The Midnight Library", author: "Matt Haig", price: 15.99, genre: "Sad Girl Hours 🖤", rating: 4.6, cover: "https://picsum.photos/seed/midnight/400/600", description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived." },
  { id: "10", title: "A Memory Called Empire", author: "Arkady Martine", price: 16.99, genre: "Sci-Fi Escapism 🚀", rating: 4.7, cover: "https://picsum.photos/seed/empire/400/600", description: "Ambassador Mahit Dzmare arrives in the center of the Teixcalaanli Empire only to discover that her predecessor has died — but no one will admit it wasn't an accident." },
  { id: "11", title: "Piranesi", author: "Susanna Clarke", price: 14.99, genre: "Fantasy & Dragons 🐉", rating: 4.8, cover: "https://picsum.photos/seed/piranesi/400/600", description: "Piranesi's house is no ordinary building: its rooms are infinite, its corridors endless, its walls lined with thousands of statues. A dream-like exploration of a surreal world." },
  { id: "12", title: "Beautiful World, Where Are You", author: "Sally Rooney", price: 15.99, genre: "Romance 🌹", rating: 4.5, cover: "https://picsum.photos/seed/beautiful/400/600", description: "Alice meets Felix and asks him to travel to Rome with her. In Dublin, her best friend Eileen slips back into flirting with Simon, a man she's known since childhood." },
  { id: "13", title: "The House in the Cerulean Sea", author: "TJ Klune", price: 15.99, genre: "Cozy Autumn Reads 🍂", rating: 4.9, cover: "https://picsum.photos/seed/cerulean/400/600", description: "A magical island. A dangerous task. A burning secret. Linus Baker leads a quiet, solitary life — until an assignment takes him somewhere that will change everything." },
  { id: "14", title: "Babel", author: "R.F. Kuang", price: 18.99, genre: "Fantasy & Dragons 🐉", rating: 4.8, cover: "https://picsum.photos/seed/babel/400/600", description: "Oxford, 1828. At the center of all knowledge stands Babel, the Royal Institute of Translation — the tower from which all the empire's power flows. Traduttore, traditore." },
  { id: "15", title: "Elatsoe", author: "Darcie Little Badger", price: 14.99, genre: "Queer & Trans Joy 🏳️‍🌈", rating: 4.6, cover: "https://picsum.photos/seed/elatsoe/400/600", description: "Imagine an America shaped dramatically by the magic, monsters, knowledge, and legends of its peoples. A girl who can raise the ghosts of dead animals investigates a family mystery." },
];

export const REVIEWS: Review[] = [
  { id: 1, text: "I literally could not stop sobbing at 3 AM.", emoji: "😭", rating: 5, user: "bookworm99" },
  { id: 2, text: "The prose in this is just... devastatingly beautiful.", emoji: "✨", rating: 5, user: "aesthetic_reader" },
  { id: 3, text: "enemies to lovers but make it actually agonizing.", emoji: "🗡️", rating: 4, user: "trope_hunter" },
  { id: 4, text: "Healed something in me I didn't know was broken.", emoji: "🩹", rating: 5, user: "healing_era" },
  { id: 5, text: "If you want to be destroyed emotionally, read this.", emoji: "💀", rating: 5, user: "angst_lover" },
  { id: 6, text: "Cozy vibes only. Best enjoyed with a warm matcha.", emoji: "🍵", rating: 4, user: "cozy_corner" },
];