import React from 'react';

const FloatingScrolls = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Ancient Parchment Texture Background */}
      <div className="absolute inset-0 parchment-texture"></div>
      
      {/* Subtle Dust Particles */}
      <div className="absolute inset-0 dust-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="dust-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      
      {/* Ancient Library Atmosphere */}
      <div className="absolute inset-0 library-atmosphere">
        <div className="ancient-light-beam" style={{ left: '20%', animationDelay: '0s' }}></div>
        <div className="ancient-light-beam" style={{ left: '60%', animationDelay: '3s' }}></div>
        <div className="ancient-light-beam" style={{ left: '80%', animationDelay: '6s' }}></div>
      </div>
      
      {/* Floating Knowledge Orbs */}
      <div className="absolute inset-0 knowledge-orbs">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="knowledge-orb"
            style={{
              left: `${20 + (i * 10)}%`,
              top: `${10 + (i * 12)}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${8 + (i % 3) * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FloatingScrolls;