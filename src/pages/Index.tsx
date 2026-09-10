import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { ExecutiveSummarySection } from '@/components/home/ExecutiveSummarySection';
import { MetricsSection } from '@/components/home/MetricsSection';
import { AchievementsSection } from '@/components/home/AchievementsSection';
import { AIStrategySection } from '@/components/home/AIStrategySection';
import { CTASection } from '@/components/home/CTASection';
import { AIAccessGate } from '@/components/AIAccessGate';
import { Chatbot } from '@/components/Chatbot';
import { useAIAccess } from '@/hooks/useAIAccess';

export default function Index() {
  const { hasAccess, grantAccess } = useAIAccess();
  const isDisabled = import.meta.env.VITE_AI_ASSISTANT_DISABLED === 'true';

  return (
    <div className="min-h-screen">
      <HeroSection />
      <ExecutiveSummarySection />
      <MetricsSection />
      <AchievementsSection />
      <AIStrategySection />

      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Chat with Troy's AI Assistant</h2>
            <p className="text-muted-foreground text-lg">Get instant answers about Troy's experience, expertise, and approach to innovation</p>
          </div>
          {isDisabled ? (
            <div className="flex flex-col items-center space-y-6">
              <div className="text-center"><p className="text-muted-foreground">Troy's AI Assistant is currently being reconstructed.</p></div>
              <AIAccessGate onAccessGranted={grantAccess} waitlistOnly={true} />
            </div>
          ) : hasAccess ? (
            <Chatbot />
          ) : (
            <div className="flex justify-center">
              <AIAccessGate onAccessGranted={grantAccess} title="Try Troy's AI Assistant" description="Experience AI-powered insights about Troy's expertise and track record" />
            </div>
          )}
        </div>
      </section>

      <CTASection />

      <section className="py-12 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Selected applications</p>
            <h2 className="text-2xl font-bold text-foreground mt-2">Current application packages</h2>
            <p className="text-muted-foreground mt-2">These are application pages within this site, not separate websites.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="/LAB3/" className="block rounded-lg border border-border bg-background p-6 hover:shadow-md transition-shadow">
              <div className="text-sm font-semibold text-muted-foreground">LAB3</div>
              <div className="text-xl font-bold text-foreground mt-1">Principal Technologist</div>
              <div className="text-sm text-muted-foreground mt-2">View the tailored CV and cover letter.</div>
            </a>
            <a href="/Infosys/" className="block rounded-lg border border-border bg-background p-6 hover:shadow-md transition-shadow">
              <div className="text-sm font-semibold text-muted-foreground">Infosys</div>
              <div className="text-xl font-bold text-foreground mt-1">Senior / Principal Architect (AI)</div>
              <div className="text-sm text-muted-foreground mt-2">View the tailored CV and cover letter.</div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
