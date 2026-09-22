import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Layout } from "./components/Layout";
import { RouteNormalizer } from "./components/RouteNormalizer";
import { MicrositeLayout } from "./components/microsites/MicrositeLayout";
import { MicrositeGuard } from "./components/MicrositeGuard";

const Index = lazy(() => import("./pages/Index"));
const ExecutiveProfile = lazy(() => import("./pages/ExecutiveProfile"));
const CoreCompetencies = lazy(() => import("./pages/CoreCompetencies"));
const IndustryExpertise = lazy(() => import("./pages/IndustryExpertise"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQs = lazy(() => import("./pages/FAQs"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Whitepapers = lazy(() => import("./pages/Whitepapers"));
const Projects = lazy(() => import("./pages/Projects"));
const ExperienceAndImpact = lazy(() => import("./pages/ExperienceAndImpact"));
const AIEthics = lazy(() => import("./pages/AIEthics"));
const CVGenerator = lazy(() => import("./pages/tools/CVGenerator"));
const CVGenerationHistory = lazy(() => import("./pages/tools/CVGenerationHistory"));
const CVIngestionDashboard = lazy(() => import("./pages/tools/CVIngestionDashboard"));
const SkillsVisualizations = lazy(() => import("./pages/tools/SkillsVisualizations"));

// Microsite pages
const MicrositeIndex = lazy(() => import("./pages/microsites/MicrositeIndex"));
const InterviewPrepIndex = lazy(() => import("./pages/microsites/interview-prep/Index"));
const AgentforceIndex = lazy(() => import("./pages/microsites/agentforce/Index"));
const Lab3Index = lazy(() => import("./pages/microsites/lab3/Index"));
const PegaIndex = lazy(() => import("./pages/microsites/pega/Index"));
const EnvatoIndex = lazy(() => import("./pages/microsites/envato/Index"));
const OrchestratePage = lazy(() => import("./pages/microsites/envato/Orchestrator"));
const EnvatoSummary = lazy(() => import("./pages/microsites/envato/Summary"));
const EnvatoAssets = lazy(() => import("./pages/microsites/envato/Assets"));
const LenovoIndex = lazy(() => import("./pages/microsites/lenovo/Index"));
const LenovoFocusImages = lazy(() => import("./pages/microsites/lenovo/FocusImages"));
const LenovoTechnicalStack = lazy(() => import("./pages/microsites/lenovo/TechnicalStack"));
const LenovoDemoChoices = lazy(() => import("./pages/microsites/lenovo/DemoChoices"));
const LenovoTruScaleScenarios = lazy(() => import("./pages/microsites/lenovo/TruScaleScenarios"));
const WnsIndex = lazy(() => import("./pages/microsites/wns/Index"));
const AtlassianIndex = lazy(() => import("./pages/microsites/atlassian/Index"));
const AdobeIndex = lazy(() => import("./pages/microsites/adobe/Index"));

// Application Kit pages
const HashiCorpKit = lazy(() => import("./pages/kits/HashiCorpKit"));
const ActGovKit = lazy(() => import("./pages/kits/ActGovKit"));
const AnthropicKit = lazy(() => import("./pages/kits/AnthropicKit"));
const KitsIndex = lazy(() => import("./pages/kits/KitsIndex"));

// Legacy pages that are still accessible but redirected
const InnovationDefinition = lazy(() => import("./pages/InnovationDefinition"));
const InnovationJourney = lazy(() => import("./pages/InnovationJourney"));
const InnovationFrameworks = lazy(() => import("./pages/InnovationFrameworks"));
const LeadershipStyle = lazy(() => import("./pages/LeadershipStyle"));
const PeopleInvolved = lazy(() => import("./pages/PeopleInvolved"));
const UpcomingProjects = lazy(() => import("./pages/UpcomingProjects"));
const StrategicProjects = lazy(() => import("./pages/StrategicProjects"));
const CustomerAsksStars = lazy(() => import("./pages/CustomerAsksStars"));
const OpportunityStars = lazy(() => import("./pages/OpportunityStars"));
const Responsibilities = lazy(() => import("./pages/Responsibilities"));
const You = lazy(() => import("./pages/You"));
const YourProfileStars = lazy(() => import("./pages/YourProfileStars"));
const TheOpportunity = lazy(() => import("./pages/TheOpportunity"));
const YourPitch = lazy(() => import("./pages/YourPitch"));
const WhatIsInnovation = lazy(() => import("./pages/WhatIsInnovation"));
const SmokeTest = lazy(() => import("./pages/dev/SmokeTest").then(m => ({ default: m.SmokeTest })));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteNormalizer />
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
          <Routes>
          {/* Main site routes with main layout */}
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/executive-profile" element={<Layout><ExecutiveProfile /></Layout>} />
          <Route path="/experience-and-impact" element={<Layout><ExperienceAndImpact /></Layout>} />
          <Route path="/core-competencies" element={<Layout><CoreCompetencies /></Layout>} />
          <Route path="/industry-expertise" element={<Layout><IndustryExpertise /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/faqs" element={<Layout><FAQs /></Layout>} />
          
          {/* Resources */}
            <Route path="/resources/whitepapers" element={<Layout><Whitepapers /></Layout>} />
            <Route path="/resources/projects" element={<Layout><Projects /></Layout>} />
            <Route path="/tools/cv-generator" element={<Layout><CVGenerator /></Layout>} />
            <Route path="/tools/cv-generation-history" element={<Layout><CVGenerationHistory /></Layout>} />
            <Route path="/tools/cv-ingestion-dashboard" element={<Layout><CVIngestionDashboard /></Layout>} />
            <Route path="/tools/skills" element={<Layout><SkillsVisualizations /></Layout>} />
            <Route path="/tools/skills-visualizations" element={<Navigate to="/tools/skills" replace />} />
            <Route path="/tools/skills-matrix" element={<Navigate to="/tools/skills" replace />} />
            <Route path="/tools/skills-analytics" element={<Navigate to="/tools/skills" replace />} />
            <Route path="/tools/cv-ingestion" element={<Navigate to="/tools/cv-ingestion-dashboard" replace />} />
            <Route path="/cv-ingestion" element={<Navigate to="/tools/cv-ingestion-dashboard" replace />} />
          {/* <Route path="/resources/lean-canvas" element={<Layout><LeanCanvas /></Layout>} /> */}
          <Route path="/ai-ethics" element={<Layout><AIEthics /></Layout>} />
          
          {/* Microsite routes with separate layout */}
          <Route path="/microsites" element={<MicrositeGuard><MicrositeLayout><MicrositeIndex /></MicrositeLayout></MicrositeGuard>} />
          <Route path="/microsites/atlassian" element={<MicrositeGuard><MicrositeLayout><AtlassianIndex /></MicrositeLayout></MicrositeGuard>} />
          <Route path="/microsites/interview-prep" element={<MicrositeGuard><MicrositeLayout><InterviewPrepIndex /></MicrositeLayout></MicrositeGuard>} />
          <Route path="/microsites/agentforce" element={<MicrositeGuard><MicrositeLayout><AgentforceIndex /></MicrositeLayout></MicrositeGuard>} />
          <Route path="/microsites/lab3" element={<MicrositeGuard><MicrositeLayout><Lab3Index /></MicrositeLayout></MicrositeGuard>} />
          <Route path="/microsites/pega" element={<MicrositeGuard><MicrositeLayout><PegaIndex /></MicrositeLayout></MicrositeGuard>} />
          <Route path="/microsites/envato" element={<MicrositeGuard><EnvatoIndex /></MicrositeGuard>} />
          <Route path="/microsites/envato/orchestrator" element={<MicrositeGuard><OrchestratePage /></MicrositeGuard>} />
          <Route path="/microsites/envato/summary" element={<MicrositeGuard><EnvatoSummary /></MicrositeGuard>} />
          <Route path="/microsites/envato/assets" element={<MicrositeGuard><EnvatoAssets /></MicrositeGuard>} />
          <Route path="/microsites/lenovo" element={<MicrositeGuard><MicrositeLayout><LenovoIndex /></MicrositeLayout></MicrositeGuard>} />
          <Route path="/microsites/lenovo/focus-images" element={<MicrositeGuard><LenovoFocusImages /></MicrositeGuard>} />
          <Route path="/microsites/lenovo/technical-stack" element={<MicrositeGuard><MicrositeLayout><LenovoTechnicalStack /></MicrositeLayout></MicrositeGuard>} />
          <Route path="/microsites/lenovo/demo-choices" element={<MicrositeGuard><LenovoDemoChoices /></MicrositeGuard>} />
          <Route path="/microsites/lenovo/truscale-scenarios" element={<MicrositeGuard><LenovoTruScaleScenarios /></MicrositeGuard>} />
          <Route path="/microsites/wns" element={<MicrositeGuard><MicrositeLayout><WnsIndex /></MicrositeLayout></MicrositeGuard>} />
          <Route path="/microsites/adobe" element={<MicrositeGuard><AdobeIndex /></MicrositeGuard>} />

          {/* Application Kit routes — standalone pages (no main Layout) */}
          <Route path="/kits" element={<KitsIndex />} />
          <Route path="/kits/hashicorp" element={<HashiCorpKit />} />
          <Route path="/kits/act-gov" element={<ActGovKit />} />
          <Route path="/kits/anthropic" element={<AnthropicKit />} />

          {/* Navigation redirects - consolidate similar content */}
          <Route path="/current-roles" element={<Navigate to="/executive-profile" replace />} />
          
          {/* Legacy content that still exists */}
          <Route path="/innovation-definition" element={<Layout><InnovationDefinition /></Layout>} />
          <Route path="/innovation-journey" element={<Layout><InnovationJourney /></Layout>} />
          <Route path="/innovation-frameworks" element={<Layout><InnovationFrameworks /></Layout>} />
          <Route path="/leadership-style" element={<Layout><LeadershipStyle /></Layout>} />
          <Route path="/people-involved" element={<Layout><PeopleInvolved /></Layout>} />
          <Route path="/upcoming-projects" element={<Layout><UpcomingProjects /></Layout>} />
          <Route path="/strategic-projects" element={<Layout><StrategicProjects /></Layout>} />
          <Route path="/customer-asks-stars" element={<Layout><CustomerAsksStars /></Layout>} />
          <Route path="/opportunity-stars" element={<Layout><OpportunityStars /></Layout>} />
          <Route path="/responsibilities" element={<Layout><Responsibilities /></Layout>} />
          <Route path="/you" element={<Layout><You /></Layout>} />
          <Route path="/your-profile-stars" element={<Layout><YourProfileStars /></Layout>} />
          <Route path="/the-opportunity" element={<Layout><TheOpportunity /></Layout>} />
          <Route path="/your-pitch" element={<Layout><YourPitch /></Layout>} />
          <Route path="/what-is-innovation" element={<Layout><WhatIsInnovation /></Layout>} />
          
          {/* Legacy redirects - maintain old URLs for bookmarks */}
          <Route path="/about-troy" element={<Navigate to="/executive-profile" replace />} />
          <Route path="/whitepapers" element={<Navigate to="/resources/whitepapers" replace />} />
          <Route path="/projects" element={<Navigate to="/resources/projects" replace />} />
          <Route path="/inspiration" element={<Layout><CustomerAsksStars /></Layout>} />
          <Route path="/customer-asks" element={<Navigate to="/customer-asks-stars" replace />} />
          <Route path="/vision" element={<Navigate to="/customer-asks-stars" replace />} />
           <Route path="/head-of-innovation" element={<Navigate to="/" replace />} />
           
           {/* Dev-only smoke test */}
           {import.meta.env.DEV && (
             <Route path="/__smoke" element={<SmokeTest />} />
           )}
           
           <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
