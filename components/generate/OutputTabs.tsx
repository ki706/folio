'use client';
import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import { MessageSquare, Send, Repeat, Heart } from 'lucide-react';

interface OutputTabsProps {
  linkedin: string;
  xThread: string[];
}

export default function OutputTabs({ linkedin, xThread }: OutputTabsProps) {
  const [activeTab, setActiveTab] = useState<'linkedin' | 'x'>('linkedin');

  return (
    <div className="glass-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-bright)' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        <button
          onClick={() => setActiveTab('linkedin')}
          className={`output-tab${activeTab === 'linkedin' ? ' active' : ''}`}
          style={{ flex: 1, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}
        >
          <MessageSquare size={16} /> LINKEDIN
        </button>
        <button
          onClick={() => setActiveTab('x')}
          className={`output-tab${activeTab === 'x' ? ' active' : ''}`}
          style={{ flex: 1, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}
        >
          <Send size={16} /> 𝕏 THREAD
        </button>
      </div>

      <div style={{ padding: 32, background: 'rgba(255,255,255,0.01)' }}>
        {activeTab === 'linkedin' && (
          <div className="animate-fade-in">
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
               <h4 style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.1em' }}>PLATFORM PREVIEW</h4>
               <CopyButton text={linkedin} />
             </div>
             
             {/* LinkedIn Mockup */}
             <div style={{ background: '#fff', borderRadius: 12, padding: '20px', color: '#1a1a1a', maxWidth: 500, margin: '0 auto', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                   <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--accent-gradient)' }} />
                   <div>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>Authorized User</p>
                      <p style={{ fontSize: 12, color: '#666' }}>Full Stack Developer • Just now</p>
                   </div>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap', color: '#333' }}>{linkedin}</p>
                <div style={{ marginTop: 20, borderTop: '1px solid #eee', paddingTop: 12, display: 'flex', justifyContent: 'space-around', color: '#666', fontSize: 13, fontWeight: 600 }}>
                   <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Heart size={16} /> Like</span>
                   <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MessageSquare size={16} /> Comment</span>
                   <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Repeat size={16} /> Repost</span>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'x' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <h4 style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.1em' }}>X THREAD PREVIEW</h4>
               <button className="btn-ghost-premium" style={{ height: 32, padding: '0 12px', fontSize: 11 }} onClick={() => navigator.clipboard.writeText(xThread.join('\n\n'))}>
                  COPY ENTIRE THREAD
               </button>
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
               {xThread.map((tweet, i) => (
                 <div key={i} style={{ display: 'flex', gap: 12, position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                       <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1d9bf0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 1 }}>
                          <Send size={20} fill="currentColor" />
                       </div>
                       {i < xThread.length - 1 && <div style={{ width: 2, flex: 1, background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />}
                    </div>
                    <div className="glass-card" style={{ flex: 1, marginBottom: 12, padding: 20, background: 'rgba(255,255,255,0.02)' }}>
                       <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--white)' }}>{tweet}</p>
                       <div style={{ marginTop: 16, display: 'flex', gap: 20, color: 'var(--muted)', fontSize: 12 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MessageSquare size={14} /> 12</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Repeat size={14} /> 4</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Heart size={14} /> 48</span>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
