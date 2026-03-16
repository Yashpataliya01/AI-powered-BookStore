import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingBag, Heart, Menu } from "lucide-react";
import clsx from "clsx";
import { useStore } from "../../store/useStore";

const PLACEHOLDERS = [
  "search for your next obsession...",
  "find books that get you...",
  "what are you feeling today...",
  "enter your soft girl era...",
];

export default function Navbar() {
  const { cartCount, setIsCartOpen, searchQuery, setSearchQuery } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [phIdx, setPhIdx] = useState(0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setPhIdx((p) => (p + 1) % PLACEHOLDERS.length),
      3000
    );
    return () => clearInterval(t);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={clsx(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled
          ? "py-3 bg-background/90 backdrop-blur-xl border-b border-border shadow-sm"
          : "py-5 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer group">
            <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tighter text-foreground group-hover:text-primary transition-colors">
              foliocraft
              <span className="text-primary text-3xl leading-none">.</span>
            </h1>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xl relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-2.5 rounded-full bg-white/80 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all shadow-sm"
            />
            {!searchQuery && (
              <div className="absolute inset-y-0 left-11 flex items-center pointer-events-none overflow-hidden text-sm text-muted-foreground/70">
                <motion.span
                  key={phIdx}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -16, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute"
                >
                  {PLACEHOLDERS[phIdx]}
                </motion.span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-secondary">
              <Heart className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white border border-border hover:border-primary/40 shadow-sm transition-all hover:scale-105 active:scale-95 text-foreground hover:text-primary"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground shadow-md"
                >
                  {cartCount}
                </motion.div>
              )}
            </button>
            <button className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-foreground">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}