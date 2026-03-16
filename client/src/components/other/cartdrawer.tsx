import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus } from "lucide-react";
import { useStore } from "../../store/useStore";

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartTotal,
  } = useStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] glass-panel z-[70] flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.5)] border-l border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-primary" /> Your Bag
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <ShoppingBag className="w-16 h-16 mb-4 text-muted-foreground" />
                  <p className="text-lg font-serif">
                    Your bag is feeling a little empty.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={item.book.id}
                    className="flex gap-4 bg-white/5 p-3 rounded-2xl border border-white/5"
                  >
                    <img
                      src={item.book.cover}
                      alt={item.book.title}
                      className="w-20 h-28 object-cover rounded-lg shadow-md"
                    />
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif font-bold text-foreground line-clamp-2 leading-tight">
                          {item.book.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.book.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-auto">
                        {item.book.author}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-primary">
                          ${item.book.price.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-3 bg-black/40 rounded-full px-2 py-1 border border-white/10">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.book.id, -1)
                            }
                            className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                          >
                            <Minus className="w-3 h-3 text-foreground" />
                          </button>
                          <span className="text-sm font-medium w-4 text-center text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.book.id, 1)
                            }
                            className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                          >
                            <Plus className="w-3 h-3 text-foreground" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-md">
                <div className="flex items-center justify-between mb-6 text-lg">
                  <span className="font-serif text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="font-bold text-foreground text-2xl">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <button className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(224,168,46,0.2)]">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}