import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Heart, Plus, Star } from "lucide-react";
import clsx from "clsx";
import { Book } from "../../data/books";
import { useStore } from "../../store/useStore";

type Props = { book: Book; onClick: () => void };

export default function BookCard({ book, onClick }: Props) {
  const { toggleWishlist, wishlist, addToCart } = useStore();
  const isWishlisted = wishlist.has(book.id);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useTransform(my, [-100, 100], [8, -8]);
  const rotateY = useTransform(mx, [-100, 100], [-8, 8]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(book);
    const rect = e.currentTarget.getBoundingClientRect();
    const np = Array.from({ length: 7 }).map((_, i) => ({
      id: Date.now() + i,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }));
    setParticles((prev) => [...prev, ...np]);
    setTimeout(
      () => setParticles((prev) => prev.filter((p) => !np.find((n) => n.id === p.id))),
      900
    );
  };

  return (
    <>
      <motion.div
        style={{ perspective: 1000 }}
        className="group relative h-full flex flex-col cursor-pointer"
        onClick={onClick}
      >
        <motion.div
          style={{ rotateX, rotateY }}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            mx.set(e.clientX - r.left - r.width / 2);
            my.set(e.clientY - r.top - r.height / 2);
          }}
          onMouseLeave={() => { mx.set(0); my.set(0); }}
          className="relative rounded-2xl overflow-hidden aspect-[2/3] mb-4 shadow-md shadow-foreground/10 group-hover:shadow-xl group-hover:shadow-primary/20 transition-all duration-500 border border-border/60"
        >
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Spine shadow */}
          <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-foreground/20 to-transparent" />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-primary/90 text-sm"
            >
              <Plus className="w-4 h-4" /> Add to Bag
            </button>
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleWishlist(book.id); }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center border border-border shadow-sm hover:bg-white transition-colors z-20"
          >
            <Heart
              className={clsx(
                "w-4 h-4 transition-colors",
                isWishlisted ? "fill-secondary text-secondary" : "text-muted-foreground"
              )}
            />
          </button>
        </motion.div>

        {/* Book info */}
        <div className="flex flex-col flex-1 px-0.5">
          <h3 className="font-serif font-bold text-[1.05rem] text-foreground line-clamp-1 group-hover:text-primary transition-colors leading-snug">
            {book.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-2">{book.author}</p>
          <div className="mt-auto flex items-center justify-between">
            <span className="font-semibold text-foreground text-sm">${book.price.toFixed(2)}</span>
            <div className="flex items-center gap-1 text-sm text-amber-500">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-medium">{book.rating}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Particle burst */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, x: p.x, y: p.y, scale: 0.5 }}
          animate={{
            opacity: 0,
            x: p.x + (Math.random() - 0.5) * 90,
            y: p.y - 90 - Math.random() * 40,
            scale: 1.4,
            rotate: Math.random() * 360,
          }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="fixed z-50 pointer-events-none"
        >
          <Heart className="w-4 h-4 text-secondary fill-secondary" />
        </motion.div>
      ))}
    </>
  );
}