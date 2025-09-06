import React from 'react';
import { Check } from 'lucide-react';

const QASection = () => {
  const reasons = [
    "Fires and wars destroy archives",
    "Replication ensures survival", 
    "History is too valuable to lose again"
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-12 rounded-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
            Q: Why would I even use Alexandria Cloud?
          </h2>
          
          <div className="space-y-6">
            {reasons.map((reason, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-node-active/20 flex items-center justify-center mt-1 flex-shrink-0">
                  <Check className="w-4 h-4 text-node-active" />
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QASection;