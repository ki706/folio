'use client';
import { motion } from 'framer-motion';
import { GitMerge, MessageCircle, Briefcase, Terminal } from 'lucide-react';
import { useState, useEffect } from 'react';

// 1. Webhook Visualizer: Types out a JSON payload
export function WebhookMockup() {
  const payloadStr = `{\n  "event": "push",\n  "ref": "refs/heads/main",\n  "repository": {\n    "name": "folio-engine",\n    "owner": "engineer"\n  },\n  "commits": [\n    {\n      "message": "feat: release v2.0"\n    }\n  ]\n}`;
  
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(payloadStr.slice(0, i));
      i++;
      if (i > payloadStr.length) {
        clearInterval(interval);
        setTimeout(() => { i = 0; }, 3000); // Loop
      }
    }, 50);
    return () => clearInterval(interval);
  }, [payloadStr]);

  return (
    <div className="absolute inset-x-8 top-20 bottom-8 rounded-xl border border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.4)] backdrop-blur-md overflow-hidden font-mono text-xs flex flex-col">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <div className="ml-2 text-[#666] flex items-center gap-2">
          <Terminal size={12} /> webhook-receiver.log
        </div>
      </div>
      <div className="p-4 text-[#00FF88] flex-1 overflow-hidden whitespace-pre font-mono leading-relaxed opacity-80">
        {displayedText}
        <motion.span 
          animate={{ opacity: [1, 0] }} 
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-2 h-3 bg-[#00FF88] ml-1 align-middle"
        />
      </div>
    </div>
  );
}

// 2. Cross-Platform Visualizer: Glowing paths between icons
export function SocialMockup() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-full max-w-[200px] h-32 flex items-center justify-between">
        {/* Source */}
        <motion.div 
          animate={{ boxShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 20px rgba(255,255,255,0.2)', '0 0 0px rgba(255,255,255,0)'] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center z-10"
        >
          <GitMerge size={20} className="text-white" />
        </motion.div>

        {/* Lines */}
        <div className="absolute top-1/2 left-6 right-6 h-px bg-[rgba(255,255,255,0.1)] -translate-y-1/2" />
        <div className="absolute top-4 bottom-4 left-1/2 w-px bg-[rgba(255,255,255,0.1)] -translate-x-1/2" />
        
        {/* Animated Particles */}
        <motion.div
          animate={{ left: ['10%', '45%', '80%'], top: ['50%', '10%', '50%'], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute w-2 h-2 rounded-full bg-[#00CCFF] shadow-[0_0_10px_#00CCFF] z-20"
        />
        <motion.div
          animate={{ left: ['10%', '45%', '80%'], top: ['50%', '90%', '50%'], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.75 }}
          className="absolute w-2 h-2 rounded-full bg-[#00FF88] shadow-[0_0_10px_#00FF88] z-20"
        />

        {/* Destinations */}
        <div className="flex flex-col justify-between h-full z-10">
          <div className="w-10 h-10 rounded-lg bg-[rgba(0,204,255,0.1)] border border-[rgba(0,204,255,0.2)] flex items-center justify-center">
            <MessageCircle size={16} className="text-[#00CCFF]" />
          </div>
          <div className="w-10 h-10 rounded-lg bg-[rgba(0,119,181,0.1)] border border-[rgba(0,119,181,0.2)] flex items-center justify-center">
            <Briefcase size={16} className="text-[#0077b5]" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Voice Clone Visualizer: Animated bars
export function VoiceMockup() {
  const bars = Array.from({ length: 12 });
  
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-1.5">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: [10, ((i * 7) % 40) + 20, 10],
            backgroundColor: ['rgba(245,158,11,0.2)', 'rgba(245,158,11,1)', 'rgba(245,158,11,0.2)']
          }}
          transition={{
            duration: 1 + ((i * 3) % 10) * 0.1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1
          }}
          className="w-2 rounded-full"
        />
      ))}
    </div>
  );
}
