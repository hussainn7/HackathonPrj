import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 text-foreground tracking-tight font-cinzel">
          Knowledge That
          <br />
          <span className="text-primary">Never Burns Again</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto font-crimson">
          Replicate every scroll across ancient nodes.
          <br />
          Even if Alexandria falls, wisdom survives.
        </p>
        
        <div className="flex justify-center">
          <Button 
            size="lg" 
            variant="secondary"
            className="glass-button bg-secondary/20 border-secondary/30 text-secondary hover:bg-secondary/30 hover:border-secondary/40 px-12 py-6 text-xl font-semibold"
          >
            <BookOpen className="mr-3 h-6 w-6" />
            Explore the Library
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;