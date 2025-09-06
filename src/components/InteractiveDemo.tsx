import React from 'react';

const InteractiveDemo = () => {
  const locations = [
    { name: "ALEXANDRIA", x: "45%", y: "70%", active: true },
    { name: "PERGAMON", x: "50%", y: "55%", active: true },
    { name: "RHODES", x: "48%", y: "65%", active: true }
  ];

  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground font-cinzel">
          Ancient Library Network
        </h2>
        
        <div className="glass-card p-8 rounded-3xl">
          {/* Ancient Mediterranean Map */}
          <div className="relative rounded-2xl h-96 mb-8 overflow-hidden">
            {/* Background map image */}
            <img 
              src="/uploads/5aa7167c-8f3b-4f1a-b779-bbbd0cc16bca.png" 
              alt="Ancient Mediterranean map showing library locations"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
            
            {/* Library nodes */}
            {locations.map((location) => (
              <div
                key={location.name}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: location.x, top: location.y }}
              >
                <div 
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-500 ${
                    location.active 
                      ? 'bg-node-active border-node-active shadow-lg node-pulse' 
                      : 'bg-node-inactive border-node-inactive opacity-50'
                  }`}
                />
                <span className="absolute top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-foreground whitespace-nowrap">
                  {location.name}
                </span>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;