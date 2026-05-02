import { useState } from 'react';
import { Phone, AlertCircle, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CONTACTS = [
  { name: 'Primary Contact', number: '+919313772190', label: '+91 93137 72190' },
  { name: 'Secondary Contact', number: '+918971892005', label: '+91 89718 92005' },
];

const EmergencyCall = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-viva-maroon">
                <AlertCircle size={18} />
                <h3 className="font-bold text-sm uppercase tracking-wider">Emergency Contacts</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-2">
              {CONTACTS.map((contact) => (
                <a
                  key={contact.number}
                  href={`tel:${contact.number}`}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 transition-all hover:border-viva-leaf/30 hover:bg-viva-mist group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-viva-maroon/10 text-viva-maroon group-hover:bg-viva-leaf/10 group-hover:text-viva-leaf transition-colors">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500">{contact.name}</p>
                      <p className="text-sm font-semibold text-viva-ink">{contact.label}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-viva-leaf transform group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </div>
            
            <p className="mt-3 text-[10px] text-center text-slate-400 font-medium">
              Click to call immediately
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex size-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? 'bg-viva-ink text-white rotate-90' : 'bg-viva-maroon text-white animate-bounce'
        }`}
        style={{ animationDuration: '3s' }}
        title="Emergency Contacts"
      >
        {isOpen ? <X size={24} /> : <Phone size={24} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-viva-saffron opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-viva-saffron"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default EmergencyCall;
