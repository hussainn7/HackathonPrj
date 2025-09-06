import React from 'react';
import floatingScrollImg from '@/assets/floating-scroll.png';
import waxSealImg from '@/assets/wax-seal.png';

const FloatingScrolls = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Floating Scrolls */}
      <img 
        src={floatingScrollImg} 
        alt="" 
        className="absolute top-20 left-10 w-16 h-16 opacity-20 floating-scroll"
        style={{ animationDelay: '0s' }}
      />
      <img 
        src={floatingScrollImg} 
        alt="" 
        className="absolute top-40 right-20 w-12 h-12 opacity-15 floating-scroll"
        style={{ animationDelay: '2s' }}
      />
      <img 
        src={floatingScrollImg} 
        alt="" 
        className="absolute bottom-32 left-1/4 w-14 h-14 opacity-10 floating-scroll"
        style={{ animationDelay: '4s' }}
      />
      
      {/* Floating Wax Seals */}
      <img 
        src={waxSealImg} 
        alt="" 
        className="absolute top-60 right-10 w-8 h-8 opacity-25 floating-scroll"
        style={{ animationDelay: '1s' }}
      />
      <img 
        src={waxSealImg} 
        alt="" 
        className="absolute bottom-20 right-1/3 w-6 h-6 opacity-20 floating-scroll"
        style={{ animationDelay: '3s' }}
      />
      <img 
        src={waxSealImg} 
        alt="" 
        className="absolute top-1/2 left-16 w-10 h-10 opacity-15 floating-scroll"
        style={{ animationDelay: '5s' }}
      />
    </div>
  );
};

export default FloatingScrolls;