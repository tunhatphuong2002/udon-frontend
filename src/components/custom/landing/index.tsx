import Hero from '@/components/custom/landing/hero';
import React from 'react';
import { BackedBySection } from '@/components/custom/landing/backed-by';
import { UpcomingFeatures } from '@/components/custom/landing/upcoming-features';
import { Footer } from '@/components/custom/landing/footer';
import { Header } from '@/components/custom/landing/header';
import { InfrastructureSection } from '@/components/custom/landing/infrastructure';
export const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Content */}
      <div className="relative flex flex-col min-h-screen">
        <Header />
        <Hero />
        <InfrastructureSection />
        <BackedBySection />
        <UpcomingFeatures />
        <Footer />
      </div>
    </div>
  );
};
