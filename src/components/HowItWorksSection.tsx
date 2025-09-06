import React from 'react';
import { Upload, Network, Search } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Upload,
      title: "Ingest",
      description: "Upload your scroll (PDF/TXT)"
    },
    {
      icon: Network,
      title: "Replicate", 
      description: "Nodes light up cross the map"
    },
    {
      icon: Search,
      title: "Search",
      description: "Knowledge is preserved, even if one node burns"
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground font-cinzel">
          How It Works
        </h2>
        
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div 
              key={step.title}
              className="glass-card p-8 rounded-2xl text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors duration-300">
                <step.icon className="w-10 h-10 text-primary" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                {step.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;