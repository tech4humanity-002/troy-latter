import { useState, useCallback } from "react";
import { generateContent, detectDomain } from "@/lib/ai-utils";
import { analyzeJobDescription, JobAnalysis } from "@/lib/job-analyzer";
import { calculateMatchScore, MatchScore } from "@/lib/match-scoring";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CVPreview } from "./CVPreview";
import { JobAnalysisDisplay } from "./JobAnalysis";
import { MatchScoreDisplay } from "./MatchScore";
import { ApplicationStrategy } from "./ApplicationStrategy";
import { InterviewPrep } from "./InterviewPrep";
import { CoverLetterGenerator } from "./CoverLetterGenerator";
import { ElevatorPitch } from "./ElevatorPitch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Briefcase, UserCheck, Zap, BarChart3, Download, Save, FileText } from "lucide-react";
import { toast } from "sonner";
import { SkillsAnalysis } from "./SkillsAnalysis";
import { supabase } from "@/integrations/supabase/client";

export function MCPBridgeAICVGenerator() {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null);
  const [matchScore, setMatchScore] = useState<MatchScore | null>(null);
  const [generatedCV, setGeneratedCV] = useState("");
  const [generatedHTML, setGeneratedHTML] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [interviewPrep, setInterviewPrep] = useState("");
  const [elevatorPitch, setElevatorPitch] = useState("");
  const [currentStep, setCurrentStep] = useState<'input' | 'analysis' | 'generation'>('input');
  const [selectedTrack, setSelectedTrack] = useState<'WORK' | 'JOB' | null>(null);
  
  // Fine-tuning controls
  const [tone, setTone] = useState<'professional' | 'technical' | 'executive'>('professional');
  const [length, setLength] = useState<'concise' | 'detailed' | 'comprehensive'>('detailed');
  const [focusArea, setFocusArea] = useState<'technical' | 'leadership' | 'transformation' | 'balanced'>('balanced');

  const handleAnalyze = useCallback(async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeJobDescription(jobDescription);
      const score = calculateMatchScore(analysis, jobDescription);
      
      setJobAnalysis(analysis);
      setMatchScore(score);
      setCurrentStep('analysis');
      toast.success('Job analyzed successfully!');
    } catch (error) {
      console.error('Job analysis failed:', error);
      toast.error('Failed to analyze job description');
    } finally {
      setIsAnalyzing(false);
    }
  }, [jobDescription]);

  const saveGeneration = async (
    cvMd: string, 
    cvHtml: string, 
    coverLetter: string, 
    interviewPrep: string, 
    pitches: string,
    track: string
  ) => {
    try {
      const { error } = await supabase.from('cv_generations').insert({
        job_description: jobDescription,
        match_score: matchScore?.overall || 0,
        generated_cv: cvMd,
        generated_html: cvHtml,
        cover_letter: coverLetter,
        interview_prep: interviewPrep,
        elevator_pitches: pitches,
        opportunity_track: track,
        tone_setting: tone,
        length_setting: length,
        focus_area: focusArea,
        template_name: 'professional',
        ai_model: 'gemini-2.0-flash-exp',
        skill_alignment_score: matchScore?.technical || 0,
      });

      if (error) throw error;
      toast.success("Application package saved to history");
    } catch (error) {
      console.error('Error saving generation:', error);
      // Don't fail the whole operation if save fails
      toast.error("Note: Failed to save to history");
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!jobAnalysis || !matchScore) return;
    
    // Use selected track or fall back to analysis recommendation
    const effectiveTrack = selectedTrack || jobAnalysis.opportunityType;
    
    // Build enhanced prompts with fine-tuning parameters
    const toneGuidance = tone === 'executive' 
      ? 'senior executive voice with strategic focus and board-level gravitas' 
      : tone === 'technical' 
      ? 'technical depth with architectural insights and precise terminology' 
      : 'balanced professional tone with clear communication';
    
    const lengthGuidance = length === 'concise' 
      ? '2 pages maximum, bullet points preferred, high-impact statements only'
      : length === 'comprehensive' 
      ? '3-4 pages with detailed examples, full STAR stories, comprehensive skill coverage'
      : '2-3 pages with STAR-format achievements, balanced detail';
    
    const focusGuidance = focusArea === 'technical' 
      ? 'emphasize technical architecture, cloud platforms, AI/ML implementation, and deep technical skills'
      : focusArea === 'leadership' 
      ? 'highlight strategic leadership, team development, executive decision-making, and organizational impact'
      : focusArea === 'transformation' 
      ? 'focus on change management, business transformation, innovation programs, and measurable organizational outcomes'
      : 'balanced coverage of technical expertise, leadership capability, and transformation execution';
    
    setIsGenerating(true);
    try {
      const detectedDomain = detectDomain(jobDescription);
      const trackContext = effectiveTrack === 'WORK' 
        ? 'Position for fractional CTO engagement (3-6 month, $5-10K/month). Emphasize Tech 4 Humanity as proof of execution.'
        : effectiveTrack === 'JOB'
        ? 'Position for full-time executive role ($250-350K + equity). Emphasize transformation leadership at scale.'
        : 'Position for flexible engagement. Emphasize both consulting capability and executive leadership.';

      const prioritiesContext = jobAnalysis.decisionMakerPriorities.length > 0
        ? `\nDecision-Maker Priorities:\n${jobAnalysis.decisionMakerPriorities.map((p: string) => `- ${p}`).join('\n')}`
        : '';

      // Generate all content in parallel for efficiency
      const [cvMarkdown, cvHTML, coverLetterContent, interviewPrepContent, pitchContent] = await Promise.all([
        // Generate markdown CV with fine-tuning
        generateContent({
          prompt: `Generate a highly tailored CV for Troy Latter based on this job opportunity analysis.\n
Troy Latter's Core Profile:
- Chief Technology Officer with 15+ years enterprise transformation experience
- Current: CEO of Tech 4 Humanity, Advisory Board Member at Queensland AI Hub
- Previous: CTO Alliances & Strategic Foresight at Unisys (2024-2025)
- Previous: Principal Solutions Architect at AWS (2019-2023)
- Expertise: AI/ML strategy and execution, government digital transformation, cloud architecture
- Security Clearance: AGSVA NV2
- Board Positions: Queensland AI Hub, Standards Australia BCI Committee
- Track Record: Led AI pilots achieving 30-40% efficiency gains, 100+ executive briefings

Job Analysis Results:
- Opportunity Type: ${effectiveTrack}
- Match Score: ${matchScore.overall}% overall
- Company Stage: ${jobAnalysis.companySignals.stage}
- Transformation Focus: ${jobAnalysis.companySignals.transformationType}${prioritiesContext}

Positioning Strategy:
${trackContext}

CUSTOMIZATION PARAMETERS:
- Tone: ${toneGuidance}
- Length: ${lengthGuidance}
- Focus: ${focusGuidance}

Job Description:
${jobDescription}

Generate a professional CV that:
1. Opens with executive summary directly addressing their top priority
2. Uses SFIA Level 7 framing for technical roles
3. Emphasizes relevant transformation outcomes (quantified where possible)
4. Highlights NV2 clearance prominently if government role
5. Positions Tech 4 Humanity as proof Troy executes (not just advises)
6. Uses their terminology and language from job description
7. Addresses any identified red flags proactively
8. ATS-friendly formatting
9. Adheres to the specified tone, length, and focus parameters

Format as clean markdown with clear sections.`,
          type: 'cv',
          maxTokens: 3000,
          domain: detectedDomain,
        }),

        // Generate HTML version
        generateContent({
          prompt: `Convert this CV to clean, professional HTML suitable for viewing in a browser.\n
Requirements:
- Clean, modern design
- Professional typography
- Print-friendly
- No external dependencies
- Semantic HTML5

Wrap in a complete HTML document with minimal inline CSS.`,
          type: 'cv',
          maxTokens: 3000,
          domain: detectedDomain,
        }),

        generateContent({
          prompt: `Write a cover letter for Troy Latter for this ${effectiveTrack} opportunity.\n
Key Context:
- Troy needs WORK (consulting/fractional) AND JOB (full-time) opportunities
- Currently building Tech 4 Humanity while seeking next major role
- Available immediately for right opportunity

Job Analysis:
- Match Score: ${matchScore.overall}% overall
- Company Stage: ${jobAnalysis.companySignals.stage}
- Key Requirements: ${jobAnalysis.keyRequirements.technical.slice(0, 3).join(', ')}
- Decision-Maker Priorities: ${jobAnalysis.decisionMakerPriorities.slice(0, 2).join(', ')}

Job Description:
${jobDescription}

Write a letter that:
- Opens with specific insight about their challenge (not generic)
- Positions Troy's unique combination: technical depth + strategic vision + execution track record
- Shows understanding of their business context
- Addresses any red flags proactively if present
- Closes with clear next step
- Max 300 words, no fluff
- Use Troy's authentic voice (direct, outcome-focused, no buzzwords)

Also provide an email subject line at the top in format:
Subject Line: [your subject]`,
          type: 'communication',
          maxTokens: 1500,
          domain: detectedDomain,
        }),

        generateContent({
          prompt: `Generate interview preparation for Troy Latter for this role.\n
Job Analysis:
- Opportunity Type: ${effectiveTrack}
- Match Score: ${matchScore.overall}% overall
- Key Requirements: ${JSON.stringify(jobAnalysis.keyRequirements)}
- Decision-Maker Priorities: ${jobAnalysis.decisionMakerPriorities.join(', ')}

Job Description:
${jobDescription}

Provide:

1. LIKELY INTERVIEW QUESTIONS (3-5 questions)
For each question include:
- The question itself
- Framework: Suggested answer approach (e.g., STAR method, Problem-Solution-Impact)
- Your story: Which specific Troy project/experience to reference
- Key message: The outcome they care about

2. QUESTIONS TO ASK THEM (3-5 questions)
Strategic questions that show Troy's depth and understanding of their business context.

Format clearly with sections.`,
          type: 'strategic',
          maxTokens: 2000,
          domain: detectedDomain,
        }),

        generateContent({
          prompt: `Generate 30-second elevator pitches for Troy Latter for this ${effectiveTrack} opportunity.\n
Track: ${effectiveTrack}
${effectiveTrack === 'WORK' ? 'Focus: Fractional CTO positioning, consulting engagements' : 'Focus: Full-time executive role positioning'}

Job Context:
${JSON.stringify(jobAnalysis, null, 2)}

Generate 4 variations for different scenarios:
1. NETWORKING PITCH: In-person introductions, conferences, meetups
2. COLD EMAIL PITCH: First contact via email
3. LINKEDIN PITCH: Professional networking, connection requests
4. PHONE SCREEN PITCH: Initial recruiter calls

Each pitch should:
- Be exactly 30 seconds when spoken (roughly 75-90 words)
- Open with value proposition relevant to ${effectiveTrack} track
- Include relevant credential that matters most for this opportunity
- Close with clear call to action
- Use Troy's authentic voice (direct, confident, outcome-focused)
- Reference specific expertise from job requirements

Format each pitch clearly with scenario headers.`,
          type: 'pitch',
          maxTokens: 1500,
          domain: detectedDomain,
        }),
      ]);

      setGeneratedCV(cvMarkdown);
      setGeneratedHTML(cvHTML);
      setCoverLetter(coverLetterContent);
      setInterviewPrep(interviewPrepContent);
      setElevatorPitch(pitchContent);
      
      // Save to database
      await saveGeneration(cvMarkdown, cvHTML, coverLetterContent, interviewPrepContent, pitchContent, effectiveTrack);
      
      setCurrentStep('generation');
      toast.success('Complete application package generated!');
    } catch (error) {
      console.error("Generation failed:", error);
      toast.error('Failed to generate application package');
    } finally {
      setIsGenerating(false);
    }
  }, [jobDescription, jobAnalysis, matchScore, selectedTrack, tone, length, focusArea]);

  const handleDownloadPDF = () => {
    if (!generatedCV) return;
    
    try {
      const pdf = generateProfessionalPDF(generatedCV);
      pdf.save(`Troy-Latter-CV-${Date.now()}.pdf`);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Input Job Description & Preferences */}
      {currentStep === 'input' && (
        <div className="space-y-4">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="font-semibold text-sm">Intelligent CV Generator</h3>
              <p className="text-sm text-muted-foreground">
                Analyzes job opportunities and creates tailored applications using Troy's full context. 
                Get match scores, strategic recommendations, and positioning for both WORK (consulting) and JOB (full-time) tracks.
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>Paste the complete job description to analyze</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="job-desc"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here..."
                className="min-h-[200px] font-mono text-sm"
                disabled={isAnalyzing}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customize Your Application</CardTitle>
              <CardDescription>Fine-tune the tone, length, and focus of your generated materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={tone} onValueChange={(v: any) => setTone(v)}>
                    <SelectTrigger id="tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {tone === 'professional' && 'Balanced, clear communication'}
                    {tone === 'technical' && 'Deep technical insights'}
                    {tone === 'executive' && 'Strategic, board-level voice'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="length">Length</Label>
                  <Select value={length} onValueChange={(v: any) => setLength(v)}>
                    <SelectTrigger id="length">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concise">Concise</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {length === 'concise' && '2 pages, high-impact only'}
                    {length === 'detailed' && '2-3 pages, balanced'}
                    {length === 'comprehensive' && '3-4 pages, full examples'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="focus">Focus Area</Label>
                  <Select value={focusArea} onValueChange={(v: any) => setFocusArea(v)}>
                    <SelectTrigger id="focus">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="leadership">Leadership</SelectItem>
                      <SelectItem value="transformation">Transformation</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {focusArea === 'balanced' && 'All competencies'}
                    {focusArea === 'technical' && 'Architecture & implementation'}
                    {focusArea === 'leadership' && 'Strategic & team impact'}
                    {focusArea === 'transformation' && 'Change & outcomes'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleAnalyze}
            disabled={!jobDescription.trim() || isAnalyzing}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Job Opportunity...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze Job & Calculate Match
              </>
            )}
          </Button>
        </div>
      )}

      {/* Step 2: Analysis Results */}
      {currentStep === 'analysis' && jobAnalysis && matchScore && (
        <div className="space-y-4">
          {/* Track Selection */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-base">Select Application Track</CardTitle>
              <CardDescription>
                Choose how to position this application. Default recommendation: {jobAnalysis.opportunityType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button
                  variant={selectedTrack === 'WORK' ? 'default' : 'outline'}
                  onClick={() => setSelectedTrack('WORK')}
                  className="flex-1 h-auto py-4"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    <div className="text-center">
                      <div className="font-semibold">WORK Track</div>
                      <div className="text-xs opacity-80">Fractional CTO / Consulting</div>
                    </div>
                  </div>
                </Button>
                <Button
                  variant={selectedTrack === 'JOB' ? 'default' : 'outline'}
                  onClick={() => setSelectedTrack('JOB')}
                  className="flex-1 h-auto py-4"
                >
                  <div className="flex flex-col items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    <div className="text-center">
                      <div className="font-semibold">JOB Track</div>
                      <div className="text-xs opacity-80">Full-time Executive</div>
                    </div>
                  </div>
                </Button>
              </div>
              {selectedTrack && selectedTrack !== jobAnalysis.opportunityType && (
                <div className="mt-3 text-sm text-muted-foreground text-center">
                  Note: AI recommended {jobAnalysis.opportunityType}, but you've selected {selectedTrack}
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="score" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="score">Match Score</TabsTrigger>
              <TabsTrigger value="analysis">Job Analysis</TabsTrigger>
              <TabsTrigger value="skills"><BarChart3 className="h-4 w-4 mr-1" />Skills</TabsTrigger>
              <TabsTrigger value="strategy">Strategy</TabsTrigger>
            </TabsList>
            
            <TabsContent value="score" className="space-y-4">
              <MatchScoreDisplay score={matchScore} />
            </TabsContent>
            
            <TabsContent value="analysis" className="space-y-4">
              <JobAnalysisDisplay analysis={jobAnalysis} />
            </TabsContent>
            
            <TabsContent value="skills" className="space-y-4">
              <SkillsAnalysis analysis={jobAnalysis} matchScore={matchScore} />
            </TabsContent>
            
            <TabsContent value="strategy" className="space-y-4">
              <ApplicationStrategy 
                jobDescription={jobDescription}
                analysis={jobAnalysis}
                matchScore={matchScore}
              />
            </TabsContent>
          </Tabs>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep('input');
                setJobAnalysis(null);
                setMatchScore(null);
                setSelectedTrack(null);
              }}
              className="flex-1"
            >
              Analyze Different Job
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Package...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Application Package
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Generated Application Package */}
      {currentStep === 'generation' && generatedCV && (
        <div className="space-y-4">
          {/* Track indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={selectedTrack === 'WORK' ? 'default' : 'secondary'} className="text-sm">
                {selectedTrack || jobAnalysis?.opportunityType} Track
              </Badge>
              <span className="text-sm text-muted-foreground">
                Application package tailored for {selectedTrack === 'WORK' ? 'consulting engagement' : 'full-time role'}
              </span>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleDownloadPDF} variant="default" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button onClick={() => {
                navigator.clipboard.writeText(generatedCV);
                toast.success("CV copied to clipboard");
              }} variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Copy CV
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="/tools/cv-generation-history">
                  <Save className="mr-2 h-4 w-4" />
                  View History
                </a>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="cv" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="cv">CV</TabsTrigger>
              <TabsTrigger value="cover">Cover Letter</TabsTrigger>
              <TabsTrigger value="strategy">Strategy</TabsTrigger>
              <TabsTrigger value="interview">Interview</TabsTrigger>
              <TabsTrigger value="pitch"><Zap className="h-4 w-4 mr-1" />Pitches</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cv" className="space-y-4">
              <CVPreview
                cv={generatedCV}
                cvHTML={generatedHTML}
                matchScore={matchScore?.overall || 0}
                template="mcp-bridge"
              />
            </TabsContent>
            
            <TabsContent value="cover" className="space-y-4">
              <CoverLetterGenerator 
                coverLetter={coverLetter} 
                jobAnalysis={jobAnalysis!}
              />
            </TabsContent>
            
            <TabsContent value="strategy" className="space-y-4">
              <ApplicationStrategy 
                jobDescription={jobDescription}
                analysis={jobAnalysis!}
                matchScore={matchScore!}
              />
            </TabsContent>
            
            <TabsContent value="interview" className="space-y-4">
              <InterviewPrep 
                jobDescription={jobDescription}
                analysis={jobAnalysis!}
                matchScore={matchScore!}
                prepContent={interviewPrep}
              />
            </TabsContent>

            <TabsContent value="pitch" className="space-y-4">
              <ElevatorPitch 
                content={elevatorPitch}
                trackType={(selectedTrack || jobAnalysis?.opportunityType) as "WORK" | "JOB"}
              />
            </TabsContent>
          </Tabs>

          <Button
            variant="outline"
            onClick={() => {
              setCurrentStep('input');
              setJobDescription("");
              setJobAnalysis(null);
              setMatchScore(null);
              setGeneratedCV("");
              setGeneratedHTML("");
              setCoverLetter("");
              setInterviewPrep("");
              setElevatorPitch("");
              setSelectedTrack(null);
            }}
            className="w-full"
          >
            Generate Another Application
          </Button>
        </div>
      )}
    </div>
  );
}
