import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

const VIVEKANANDA_QUOTES = [
  "Arise, awake, and stop not until the goal is reached.",
  "Everything is easy when you are busy. But nothing is easy when you are lazy.",
  "The world is the great gymnasium where we come to make ourselves strong.",
  "You cannot believe in God until you believe in yourself.",
  "Truth can be stated in a thousand different ways, yet each one can be true.",
  "Take up one idea. Make that one idea your life; dream of it; think of it; live on that idea.",
  "The more we come out and do good to others, the more our hearts will be purified.",
  "Be not afraid of anything. You will do Marvelous work. it is Fearlessness that brings Heaven even in a moment.",
  "Comfort is no test of truth. Truth is often far from being comfortable."
];

const QuoteSection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % VIVEKANANDA_QUOTES.length);
    }, 60000); // 1 minute

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full py-4 px-6 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-4 text-center">
        <Quote className="text-viva-saffron/40 shrink-0" size={20} />
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.5 }}
            className="text-sm italic font-medium text-slate-600 leading-relaxed"
          >
            "{VIVEKANANDA_QUOTES[index]}"
            <span className="block mt-1 text-[10px] font-bold uppercase tracking-widest text-viva-saffron/70 not-italic">
              — Swami Vivekananda
            </span>
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuoteSection;
