'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Cpu, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: '100dvh', 
      background: '#050505', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: 24,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Grid - Architectural feel */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }} />

      {/* Decorative Glitch Elements */}
      <div style={{ 
        position: 'absolute', 
        top: '20%', 
        left: '10%', 
        width: '300px', 
        height: '1px', 
        background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.2), transparent)',
        transform: 'rotate(-45deg)'
      }} />
      <div style={{ 
        position: 'absolute', 
        bottom: '20%', 
        right: '10%', 
        width: '300px', 
        height: '1px', 
        background: 'linear-gradient(90deg, transparent, rgba(0,204,255,0.2), transparent)',
        transform: 'rotate(45deg)'
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 500 }}>
        {/* Animated 404 Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 8, 
            padding: '6px 12px', 
            borderRadius: 100, 
            background: 'rgba(255,68,68,0.1)', 
            border: '1px solid rgba(255,68,68,0.2)',
            marginBottom: 24,
            fontSize: 10,
            fontWeight: 800,
            color: '#FF4444',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            <AlertCircle size={14} />
            <span>Signal Interrupted</span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(120px, 15vw, 200px)', 
            fontWeight: 900, 
            lineHeight: 0.8, 
            letterSpacing: '-0.08em',
            color: 'white',
            marginBottom: 20,
            position: 'relative'
          }}>
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 style={{ 
            fontSize: 24, 
            fontWeight: 800, 
            color: 'white', 
            marginBottom: 16,
            letterSpacing: '-0.02em'
          }}>
            Node Not Found
          </h2>
          <p style={{ 
            color: '#888', 
            fontSize: 16, 
            lineHeight: 1.6, 
            marginBottom: 40,
            fontWeight: 500
          }}>
            The architectural endpoint you are looking for has been decommissioned or moved to a different sector.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <button className="btn-premium" style={{ 
                height: 56, 
                padding: '0 32px', 
                background: 'white', 
                color: 'black', 
                borderRadius: 14, 
                fontWeight: 800, 
                fontSize: 15,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                border: 'none',
                cursor: 'pointer'
              }}>
                <Home size={18} />
                RETURN BASE
              </button>
            </Link>
            
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <button className="btn-ghost-premium" style={{ 
                height: 56, 
                padding: '0 32px', 
                borderRadius: 14, 
                fontWeight: 800, 
                fontSize: 15,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: 'white',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'transparent',
                cursor: 'pointer'
              }}>
                <Cpu size={18} />
                DASHBOARD
              </button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* System Status Footer */}
      <div style={{ 
        position: 'absolute', 
        bottom: 32, 
        fontSize: 10, 
        fontWeight: 800, 
        color: '#333', 
        textTransform: 'uppercase', 
        letterSpacing: '0.2em'
      }}>
        Error Code: <span style={{ color: '#555' }}>ERR_NULL_POINTER_REFS</span>
      </div>
    </div>
  );
}
