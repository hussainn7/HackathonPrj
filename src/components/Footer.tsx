import React from 'react';
import { Button } from '@/components/ui/button';
import { Scroll, LogIn } from 'lucide-react';

const Footer = () => {
  const links = [
    { name: 'Docs', href: '#' },
    { name: 'GitHub', href: '#' },
    { name: 'About', href: '#' }
  ];

  return (
    <footer className="relative py-20 px-6 overflow-hidden">
      {/* Elegant background */}
      <div className="absolute inset-0 bg-gradient-to-t from-muted/50 to-transparent"></div>
      <div className="absolute inset-0 papyrus-texture opacity-30"></div>
      
      <div className="relative max-w-6xl mx-auto">
        {/* Main footer content */}
        <div className="glass-card p-8 rounded-3xl mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Logo section */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Scroll className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground font-cinzel">
                  CodeExplore
                </h3>
                <p className="text-sm text-muted-foreground">
                  Preserving knowledge across the ages
                </p>
              </div>
            </div>
            
            {/* Navigation links */}
            <nav className="flex items-center gap-8">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-all duration-300 relative group font-medium"
                >
                  {link.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Librarian login section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-muted-foreground font-crimson text-center sm:text-left">
            One scroll at a time, we preserve the wisdom of ages past for generations yet to come.
          </p>
          
          <Button 
            variant="outline"
            className="glass-button bg-accent/20 border-accent/30 text-foreground hover:bg-accent/30 hover:border-accent/40 px-6 py-3"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Login for Librarian
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;