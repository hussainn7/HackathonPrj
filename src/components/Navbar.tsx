import React from 'react';
import { Button } from '@/components/ui/button';
import { Scroll, BookOpen, Search } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass-card px-6 py-3 rounded-full backdrop-blur-lg bg-white/20 border border-white/30">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Scroll className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-foreground font-cinzel">Alexandria</span>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-foreground hover:bg-white/20 hover:text-primary transition-colors"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Library
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-foreground hover:bg-white/20 hover:text-primary transition-colors"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;