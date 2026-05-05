'use client';
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  const contextValue = {
    toast: addToast,
    success: (m: string) => addToast(m, 'success'),
    error: (m: string) => addToast(m, 'error'),
    info: (m: string) => addToast(m, 'info'),
    warn: (m: string) => addToast(m, 'warning'),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed bottom-24 right-6 z-[200] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <div className={`glass-card p-4 flex items-center gap-3 border-l-4 ${
                t.type === 'success' ? 'border-l-[#00FF88] bg-[rgba(0,255,136,0.05)]' :
                t.type === 'error' ? 'border-l-[#FF3333] bg-[rgba(255,51,51,0.05)]' :
                t.type === 'warning' ? 'border-l-[#F59E0B] bg-[rgba(245,158,11,0.05)]' :
                'border-l-[#00CCFF] bg-[rgba(0,204,255,0.05)]'
              }`}>
                <div className={
                  t.type === 'success' ? 'text-[#00FF88]' :
                  t.type === 'error' ? 'text-[#FF3333]' :
                  t.type === 'warning' ? 'text-[#F59E0B]' :
                  'text-[#00CCFF]'
                }>
                  {t.type === 'success' && <CheckCircle size={18} />}
                  {t.type === 'error' && <AlertCircle size={18} />}
                  {t.type === 'warning' && <AlertTriangle size={18} />}
                  {t.type === 'info' && <Info size={18} />}
                </div>
                <p className="flex-1 text-sm font-semibold text-white">{t.message}</p>
                <button onClick={() => removeToast(t.id)} className="text-white/40 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
