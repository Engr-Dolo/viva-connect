import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';

const ToastContext = createContext(null);

const toneClasses = {
  success: 'border-viva-leaf/30 bg-white text-viva-ink',
  error: 'border-red-200 bg-white text-viva-ink',
  info: 'border-slate-200 bg-white text-viva-ink',
};

const iconClasses = {
  success: 'text-viva-leaf',
  error: 'text-red-600',
  info: 'text-slate-500',
};

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, tone = 'info') => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => dismissToast(id), 4000);
  }, [dismissToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[70] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => {
          const Icon = icons[toast.tone] || Info;

          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 rounded-md border p-3 shadow-soft ${toneClasses[toast.tone]}`}
              role="status"
            >
              <Icon className={`mt-0.5 shrink-0 ${iconClasses[toast.tone]}`} size={18} />
              <p className="flex-1 text-sm leading-5">{toast.message}</p>
              <button
                type="button"
                className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-viva-ink"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};
