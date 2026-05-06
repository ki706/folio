'use client';
import { useEffect } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Emitto System Error:', error);
  }, [error]);

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <div className="glass-card" style={{ padding: 48, maxWidth: 400, width: '100%', border: '1px solid rgba(255,68,68,0.2)' }}>
        <AlertTriangle size={48} className="text-[#FF4444] mb-6 mx-auto animate-pulse" />
        <h2 className="text-xl font-black text-white mb-2 tracking-tight">System Node Failure</h2>
        <p className="text-[#888] text-sm mb-8">A critical error occurred in the UI render tree. The problem has been logged.</p>
        <button 
          onClick={() => reset()}
          className="btn-premium w-full flex items-center justify-center gap-2 h-12"
          style={{ background: 'var(--accent-gradient)', color: '#000' }}
        >
          <RefreshCw size={16} /> REBOOT SYSTEM
        </button>
      </div>
    </div>
  );
}
