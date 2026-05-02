import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ 
  description, 
  isOpen, 
  isProcessing = false, 
  onCancel, 
  onConfirm, 
  title,
  confirmText = 'Delete',
  confirmColor = 'bg-viva-maroon'
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-viva-ink/45 px-4 py-6">
      <section className="w-full max-w-md rounded-md border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex gap-3">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-600">
            <AlertTriangle size={20} />
          </span>
          <div>
            <h2 className="text-base font-semibold text-viva-ink">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            className="h-10 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`h-10 rounded-md ${confirmColor} px-4 text-sm font-semibold text-white hover:bg-viva-ink disabled:cursor-not-allowed disabled:opacity-70`}
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : confirmText}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ConfirmDialog;
