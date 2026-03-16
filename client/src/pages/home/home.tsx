import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { Book, BOOKS, MOODS } from "../../data/books";
import { useStore } from "../../store/useStore";
import Navbar from "../../components/navigation/navbar";
import Hero from "./components/hero";
import BookCard from "../../components/other/bookcards";
import BookModal from "../../components/other/bookmodal";
import CartDrawer from "../../components/other/cartdrawer";
import ReviewWall from "../../components/other/reviews";

export default function Home() {
  const { filteredBooks, selectedGenre, setSelectedGenre } = useStore();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const trendingBooks = BOOKS.slice(0, 5);

  return (
    <div className="min-h-screen bg-grain">
      <Navbar />
      <CartDrawer />
      <BookModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />

      <main>
        {/* ── Hero ── */}
        <Hero />

        {/* ── Trending on BookTok ── */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
                Trending on{" "}
                <span className="text-gradient-rose italic">BookTok</span>
              </h2>
              <p className="text-muted-foreground mt-2 font-light">
                The ones everyone is crying over right now.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {trendingBooks.map((book, idx) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <BookCard book={book} onClick={() => setSelectedBook(book)} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Mood / Genre Pills ── */}
        <section className="py-12 bg-muted/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-center font-serif text-2xl mb-8 text-foreground/70">
              Pick your vibe
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedGenre(null)}
                className={clsx(
                  "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                  selectedGenre === null
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "bg-white border border-border text-foreground hover:border-primary/40 hover:text-primary shadow-sm"
                )}
              >
                All Vibes
              </button>
              {MOODS.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setSelectedGenre(mood)}
                  className={clsx(
                    "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border",
                    selectedGenre === mood
                      ? "bg-secondary text-secondary-foreground border-secondary shadow-md shadow-secondary/25"
                      : "bg-white border-border text-muted-foreground hover:text-foreground hover:border-secondary/40 shadow-sm"
                  )}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── All Books Grid ── */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[60vh]">
          <AnimatePresence mode="wait">
            {filteredBooks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <p className="text-2xl font-serif text-muted-foreground">
                  The shelves are empty here.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try a different vibe or search term.
                </p>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12"
              >
                <AnimatePresence>
                  {filteredBooks.map((book) => (
                    <motion.div
                      layout
                      key={book.id}
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.25 }}
                    >
                      <BookCard book={book} onClick={() => setSelectedBook(book)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── Review Wall ── */}
        <ReviewWall />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-muted/40 py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-3">
            foliocraft<span className="text-primary">.</span>
          </h2>
          <p className="text-muted-foreground mb-8 text-sm">
            Curating aesthetic heartbreak since 2024.
          </p>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Instagram</a>
            <a href="#" className="hover:text-primary transition-colors">TikTok</a>
            <a href="#" className="hover:text-primary transition-colors">Spotify</a>
          </div>
        </div>
      </footer>
    </div>
  );
}