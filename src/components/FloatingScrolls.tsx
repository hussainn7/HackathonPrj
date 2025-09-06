import React from 'react';

const FloatingScrolls = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Ancient Parchment Gradient + Texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f7f4e9] to-[#e9e4d0] parchment-texture" />

      {/* Subtle Papyrus Fibers Overlay */}
      <div className="absolute inset-0 papyrus-fibers opacity-25 mix-blend-multiply" />

      {/* Dust Particles (ambient specks) */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white opacity-20 dust-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${12 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      {/* Ancient Light Beams */}
      <div className="absolute inset-0">
        {['20%', '50%', '80%'].map((pos, i) => (
          <div
            key={i}
            className="ancient-light-beam"
            style={{
              left: pos,
              animationDelay: `${i * 2}s`
            }}
          />
        ))}
      </div>

      {/* Floating Knowledge Orbs */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-[#f8e6b8] to-[#cfa86a] opacity-70 blur-md animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + (i * 10)}%`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${10 + i * 2}s`
            }}
          />
        ))}
      </div>

      {/* Glowing Glyphs (faint scroll-like runes) */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-xs font-serif text-[#5c3b1e] opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              transform: `rotate(${Math.random() * 40 - 20}deg)`
            }}
          >
            𓏏𓐍𓂋
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloatingScrolls;
