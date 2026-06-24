'use client';

import { useState } from 'react';

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="aspect-[4/5] bg-ink/5" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-[4/5] overflow-hidden bg-ink/5 rounded-lg relative group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={images[currentIndex]} 
          alt={`${alt} view ${currentIndex + 1}`} 
          className="h-full w-full object-cover transition-opacity duration-300" 
        />
        
        {images.length > 1 && (
          <>
            <button 
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-bone/80 text-ink rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-bone shadow-md"
            >
              ←
            </button>
            <button 
              onClick={() => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-bone/80 text-ink rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-bone shadow-md"
            >
              →
            </button>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-20 aspect-[4/5] shrink-0 rounded overflow-hidden border-2 transition-all ${
                currentIndex === idx ? 'border-clay' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
