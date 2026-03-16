import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Star, X } from "lucide-react";
import clsx from "clsx";
import { Book } from "../../data/books";
import { useStore } from "../../store/useStore";

type Props = { book: Book | null; isOpen: boolean; onClose: () => void };

export default function BookModal({ book, isOpen, onClose }: Props) {
  const { toggleWishlist, wishlist, addToCart } = useStore();
  if (!book) return null;
  const isWishlisted = wishlist.has(book.id);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="bg-background w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row pointer-events-auto relative border border-border"
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-muted hover:bg-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-border"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Cover */}
              <div className="w-full md:w-2/5 relative bg-muted overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent md:bg-gradient-to-r z-10" />
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col overflow-y-auto">
                <div className="flex items-center gap-2 mb-5">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide border border-primary/20">
                    {book.genre}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-amber-500 ml-auto">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold text-foreground">{book.rating}</span>
                  </div>
                </div>

                <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-2 leading-tight">
                  {book.title}
                </h2>
                <p className="text-lg text-muted-foreground font-serif italic mb-6 border-b border-border pb-6">
                  by {book.author}
                </p>

                <div className="flex-1">
                  <h4 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                    Synopsis
                  </h4>
                  <p className="text-foreground/80 leading-relaxed text-[0.95rem]">
                    {book.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-border flex items-center gap-4">
                  <div className="text-3xl font-serif font-bold text-foreground mr-auto">
                    ${book.price.toFixed(2)}
                  </div>
                  <button
                    onClick={() => toggleWishlist(book.id)}
                    className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Heart
                      className={clsx(
                        "w-5 h-5 transition-colors",
                        isWishlisted ? "fill-secondary text-secondary" : "text-muted-foreground"
                      )}
                    />
                  </button>
                  <button
                    onClick={() => { addToCart(book); onClose(); }}
                    className="px-7 h-12 bg-primary text-primary-foreground font-semibold rounded-full flex items-center gap-2 hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/25"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Bag
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}