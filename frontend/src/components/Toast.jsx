import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast, hideToast } = useAuth();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short max-w-md">
      <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border backdrop-blur-xl shadow-2xl transition-all ${
        isSuccess 
          ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-950/50' 
          : isError
          ? 'bg-rose-950/90 border-rose-500/40 text-rose-200 shadow-rose-950/50'
          : 'bg-slate-900/90 border-teal-500/40 text-teal-200 shadow-teal-950/50'
      }`}>
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-teal-400 shrink-0" />}
        
        <p className="text-sm font-medium pr-2">{toast.message}</p>
        
        <button 
          onClick={hideToast}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors ml-auto text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
