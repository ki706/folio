'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  size?: 'sm' | 'md';
}

export default function CopyButton({ text, size = 'md' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const iconSize = size === 'sm' ? 14 : 16;

  return (
    <button
      onClick={handleCopy}
      className="btn btn-ghost btn-sm"
      style={{
        height: size === 'sm' ? 32 : 36,
        padding: '0 10px',
        gap: 6,
        color: copied ? 'var(--green)' : 'var(--muted)',
        borderColor: copied ? 'var(--green)' : undefined,
        transition: 'all 0.2s ease',
      }}
      title="Copy to clipboard"
    >
      {copied ? (
        <Check size={iconSize} strokeWidth={2.5} />
      ) : (
        <Copy size={iconSize} />
      )}
      <span style={{ fontSize: 12 }}>{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
}
