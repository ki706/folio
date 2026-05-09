'use client';
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

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
    }, 6000);
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
      <div style={{ 
        position: 'fixed', 
        top: 24, 
        right: 24, 
        zIndex: 9999, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 12, 
        pointerEvents: 'none', 
        maxWidth: 420, 
        width: 'calc(100% - 48px)' 
      }}>
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, x: 20, filter: 'blur(5px)' }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              style={{ pointerEvents: 'auto' }}
            >
              <div style={{ 
                background: '#0A0A0A', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderLeft: `4px solid ${
                  t.type === 'success' ? '#00FF88' : 
                  t.type === 'error' ? '#FF3333' : 
                  t.type === 'warning' ? '#F59E0B' : '#00CCFF'
                }`,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                position: 'relative',
                boxShadow: t.type === 'success' ? '0 10px 40px -10px rgba(0,255,136,0.2)' : 
                           t.type === 'error' ? '0 10px 40px -10px rgba(255,51,51,0.2)' : '0 10px 40px -10px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(20px)'
              }}>
                {/* Decorative scanning line animation */}
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 6, ease: 'linear' }}
                  style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    height: 1, 
                    background: t.type === 'success' ? '#00FF88' : 
                               t.type === 'error' ? '#FF3333' : '#FFF',
                    opacity: 0.3
                  }} 
                />

                <div style={{ 
                  color: t.type === 'success' ? '#00FF88' : 
                         t.type === 'error' ? '#FF3333' : 
                         t.type === 'warning' ? '#F59E0B' : '#00CCFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {t.type === 'success' && <ShieldCheck size={20} />}
                  {t.type === 'error' && <AlertCircle size={20} />}
                  {t.type === 'warning' && <AlertTriangle size={20} />}
                  {t.type === 'info' && <Zap size={20} />}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ 
                    fontSize: 10, 
                    fontWeight: 900, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.15em', 
                    color: '#444',
                    fontFamily: 'monospace'
                  }}>
                    {t.type === 'success' ? 'SIGNAL_STABLE' : 
                     t.type === 'error' ? 'SYSTEM_ALERT' : 'DATA_INPUT'}
                  </div>
                  <p style={{ 
                    fontSize: 14, 
                    fontWeight: 500, 
                    color: 'white', 
                    margin: 0, 
                    lineHeight: 1.4,
                    letterSpacing: '-0.01em'
                  }}>
                    {t.message}
                  </p>
                </div>

                <button 
                  onClick={() => removeToast(t.id)} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'rgba(255,255,255,0.2)', 
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'white'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
                >
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

