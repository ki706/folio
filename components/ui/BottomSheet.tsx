'use client';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="sheet-overlay" onClick={onClose} />
      <div className="sheet-panel" ref={panelRef} style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #050505 100%)' }}>
        <div className="sheet-handle" style={{ background: 'rgba(255,255,255,0.05)', height: 4, width: 32 }} />
        <div style={{ padding: 'clamp(20px, 4vw, 32px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <div className="section-title-premium" style={{ marginBottom: 0 }}>{title}</div>
            <button
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 12, width: 36, height: 36, cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              className="hover-glow"
            >
              <X size={18} />
            </button>
          </div>
          {children}
        </div>
        <div style={{ height: 'env(safe-area-inset-bottom)' }} />
      </div>
    </>
  );
}
