'use client';
import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagInput({ tags, onChange, placeholder = 'Type and press Enter' }: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) {
      onChange([...tags, val]);
    }
    setInput('');
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-2)',
        borderRadius: 8,
        padding: '8px 10px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        minHeight: 44,
        cursor: 'text',
      }}
      onClick={() => document.getElementById('tag-input-field')?.focus()}
    >
      {tags.map((tag) => (
        <span key={tag} className="tag-chip">
          {tag}
          <button onClick={() => removeTag(tag)} tabIndex={-1}>
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        id="tag-input-field"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={addTag}
        placeholder={tags.length === 0 ? placeholder : ''}
        style={{
          background: 'none',
          border: 'none',
          outline: 'none',
          color: 'var(--white)',
          fontSize: 14,
          fontFamily: 'Geist, sans-serif',
          flex: 1,
          minWidth: 80,
        }}
      />
    </div>
  );
}
