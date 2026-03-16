import { motion } from "framer-motion";
import { REVIEWS } from "../../data/books";

export default function ReviewWall() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
            Notes from the{" "}
            <span className="italic text-gradient-gold">Community</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            What our readers are feeling right now.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 p-8">
          {REVIEWS.map((review, idx) => {
            const rotation =
              (idx % 2 === 0 ? 1 : -1) * (Math.random() * 6 + 2);
            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                style={{ rotate: rotation }}
                className="w-72 glass bg-[#1a1514] p-6 pb-8 rounded-sm shadow-2xl relative cursor-pointer border-4 border-white/10"
              >
                {/* Tape strip */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/20 backdrop-blur-md rotate-[-2deg] border border-white/10 shadow-sm" />

                <div className="text-4xl mb-4 text-center">{review.emoji}</div>
                <p className="font-serif italic text-lg text-center mb-6 text-foreground/90 leading-snug">
                  "{review.text}"
                </p>
                <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                  <span className="text-sm font-medium text-muted-foreground">
                    @{review.user}
                  </span>
                  <div className="flex text-primary text-sm">
                    {Array(review.rating).fill("★").join("")}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}