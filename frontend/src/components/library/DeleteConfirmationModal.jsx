import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useAudio } from '../../audio/AudioContext';

export default function DeleteConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmButtonText = "Remove"
}) {
  const { playClick, playBookmarkRemove } = useAudio();
  if (!isOpen) return null;

  const handleCancel = () => {
    playClick();
    onCancel();
  };

  const handleConfirm = () => {
    playBookmarkRemove();
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-sm p-6 rounded-3xl bg-[#15151F] border border-white/10 shadow-2xl relative text-left space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#9694A8] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertTriangle className="w-5 h-5" />
        </div>

        <div>
          <h3 className="text-base font-bold font-heading text-white">
            {title || "Confirm Removal"}
          </h3>
          <p className="text-xs text-[#9694A8] mt-1 leading-relaxed">
            {message || "Are you sure you want to remove this item? This action cannot be undone."}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.06]">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{confirmButtonText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

