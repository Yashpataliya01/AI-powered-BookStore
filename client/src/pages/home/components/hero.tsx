import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
      {/* Soft warm background blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[55%] h-[65%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[55%] rounded-full bg-secondary/10 blur-[90px]" />
        <div className="absolute top-[40%] left-[50%] w-[35%] h-[40%] rounded-full bg-accent/8 blur-[80px]" />
      </div>

      {/* Decorative book spines strip */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium tracking-wide mb-6">
            ✦ Welcome to the aesthetic
          </span>
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground leading-[1.1] mb-8"
        >
          Books for people who
          <br className="hidden md:block" />
          <span className="italic text-gradient-terracotta"> feel too much.</span>
        </motion.h1>

        <motion.p
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-light leading-relaxed"
        >
          Curated collections of dark academia, cozy fantasies, and poetry that
          will absolutely ruin your life (in a good way).
        </motion.p>

        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="group relative px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full overflow-hidden shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all duration-300 w-full sm:w-auto">
            <span className="relative z-10">Start Wandering</span>
            <div className="absolute inset-0 bg-foreground/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </button>
          <button className="px-8 py-4 bg-white border border-border text-foreground font-medium rounded-full hover:border-primary/40 hover:text-primary shadow-sm transition-all duration-300 w-full sm:w-auto">
            Explore Shelves
          </button>
        </motion.div>

        {/* Floating stat pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-16"
        >
          {[
            { label: "Books curated", value: "1,200+" },
            { label: "Happy readers", value: "48k" },
            { label: "Genres", value: "7 moods" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center px-6 py-3 rounded-2xl bg-white/70 border border-border shadow-sm"
            >
              <span className="text-xl font-serif font-bold text-primary">{s.value}</span>
              <span className="text-xs text-muted-foreground mt-0.5">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Floating gentle petals */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: ["-8vh", "108vh"], opacity: [0, 0.6, 0], rotate: [0, 180] }}
            transition={{
              duration: 14 + Math.random() * 18,
              repeat: Infinity,
              delay: Math.random() * 12,
              ease: "linear",
            }}
            className="absolute text-lg"
            style={{ left: `${Math.random() * 100}%`, top: `-8%` }}
          >
            {["🌸", "🍂", "✦", "❀", "·"][i % 5]}
          </motion.div>
        ))}
      </div>
    </div>
  );
}