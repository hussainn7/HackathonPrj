import React from 'react';
import Navbar from '@/components/Navbar';
import FloatingScrolls from '@/components/FloatingScrolls';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import InteractiveDemo from '@/components/InteractiveDemo';
import QASection from '@/components/QASection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background papyrus-texture">
      <Navbar />
      <FloatingScrolls />
      
      <main className="relative">
        <HeroSection />
        <HowItWorksSection />
        <InteractiveDemo />
        <QASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
