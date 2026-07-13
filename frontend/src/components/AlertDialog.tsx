import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
}

export function AlertDialog({ isOpen, title, description, onClose }: AlertDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-600" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">{title}</h2>
            <p className="text-sm text-slate-500">{description}</p>
          </div>

          <Button
            type="button"
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white mt-2"
          >
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}