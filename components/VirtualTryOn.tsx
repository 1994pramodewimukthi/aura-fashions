'use client';

import { useState, useRef, useEffect } from 'react';
import type { Product } from '@/lib/types';

export function VirtualTryOn({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Clothing image position and scale
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  async function startCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      setIsOpen(true);
      // Reset positioning
      setPosition({ x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 - 150 });
      setScale(1);
    } catch (err) {
      alert("Could not access the camera. Please ensure permissions are granted.");
      console.error(err);
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsOpen(false);
  }

  useEffect(() => {
    if (isOpen && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, stream]);

  // Dragging logic
  function handlePointerDown(e: React.PointerEvent) {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  }

  function handlePointerUp(e: React.PointerEvent) {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  return (
    <>
      <button 
        onClick={startCamera}
        className="w-full mt-4 font-display uppercase tracking-widest2 text-sm border-2 border-ink text-ink rounded-full py-4 hover:bg-ink hover:text-bone transition-colors flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
        Virtual Try-On
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
            <h3 className="font-display text-white text-xl uppercase tracking-wider">Virtual Mirror</h3>
            <button 
              onClick={stopCamera}
              className="bg-white/20 hover:bg-white/40 text-white rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-md transition-colors"
            >
              ×
            </button>
          </div>

          <div className="relative flex-1 w-full h-full">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="absolute inset-0 w-full h-full object-cover -scale-x-100" // Mirror effect
            />
            
            {/* The draggable clothing item */}
            <div 
              className="absolute cursor-move touch-none"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: 'top left',
                width: '200px', // Base width
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={product.images[0]} 
                alt="Try on item" 
                className="w-full h-auto drop-shadow-2xl opacity-90 mix-blend-multiply pointer-events-none" 
              />
              {/* Outline helper to show it's draggable */}
              <div className="absolute inset-0 border-2 border-dashed border-white/50 pointer-events-none" />
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/50 backdrop-blur-md p-4 rounded-full">
            <button 
              onClick={() => setScale(s => Math.max(0.3, s - 0.1))}
              className="w-12 h-12 rounded-full bg-white text-black font-bold text-xl hover:bg-gray-200"
            >
              -
            </button>
            <span className="text-white font-display uppercase tracking-widest2 text-xs text-center w-20">
              Drag & Resize
            </span>
            <button 
              onClick={() => setScale(s => Math.min(3, s + 0.1))}
              className="w-12 h-12 rounded-full bg-white text-black font-bold text-xl hover:bg-gray-200"
            >
              +
            </button>
          </div>
        </div>
      )}
    </>
  );
}
