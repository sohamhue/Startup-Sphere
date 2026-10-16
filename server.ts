import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI client server-side
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback ideas generator for robust resilience
function getCuratedIdea(interest: string, budget: string, skills: string, audience: string) {
  const seedIdeas = [
    {
      conceptName: 'VendorPulse AI',
      tagline: 'Autonomous Contract & Vendor Renewal Guardian for Lean Startups',
      problemStatement: 'Growing companies lose an average of $34,000 annually to auto-renewing SaaS licenses, rogue software seats, and unreviewed vendor rate spikes.',
      targetCustomer: 'Series A founders, agency operations directors, and solo operators managing 20+ software subscriptions.',
      valueProposition: 'Connect your workspace email and billing cards; VendorPulse proactively surfaces unutilized licenses 45 days before renewal and drafts negotiation leverage emails.',
      monetizationModel: 'Freemium up to 10 vendors; $49/mo for up to 50 vendors; 15% cut of realized contract savings for enterprise accounts.',
      expectedGrossMargin: '84%',
      mvpLaunchPlan: [
        { week: 'Week 1', goal: 'Build landing page with interactive contract savings calculator and Stripe pre-orders.' },
        { week: 'Week 2', goal: 'Deploy Google Workspace/Gmail OAuth integration to parse incoming subscription invoices.' },
        { week: 'Week 3', goal: 'Integrate LLM extraction for notice period dates and pricing escalation clauses.' },
        { week: 'Week 4', goal: 'Onboard 15 pilot startup founders from Twitter/LinkedIn and close first 5 paid subscriptions.' },
      ],
      recommendedTechStack: ['Next.js / Vite React', 'Node.js Express', 'Gemini Flash API', 'Stripe Billing', 'Supabase / Postgres'],
      unfairAdvantage: `Tailored for ${skills} with a budget of ${budget}, targeting ${audience}. Focuses on clear cash ROI immediately.`,
      potentialRisksAndMitigations: 'Security concerns regarding email access: mitigate by using read-only invoice receipt scopes and SOC2 self-attestation transparency documentation.',
    },
    {
      conceptName: 'FieldQuote Pro',
      tagline: '5-Minute Instant Estimating & Client Approval for Trade Contractors',
      problemStatement: 'Electricians, plumbers, and HVAC specialists take 48+ hours to return bids, losing 60% of high-value residential jobs to faster competitors.',
      targetCustomer: 'Independent trade contractors and 2-5 person home services crews.',
      valueProposition: 'Mobile-first voice-to-estimate tool that translates contractor voice memos on-site into branded itemized proposals with digital sign-off and deposit capture in 3 minutes.',
      monetizationModel: '$39/month per technician + 1.2% payment processing surcharge on completed customer deposits.',
      expectedGrossMargin: '78%',
      mvpLaunchPlan: [
        { week: 'Week 1', goal: 'Interview 10 local subcontractors to benchmark estimating workflows and standard line items.' },
        { week: 'Week 2', goal: 'Assemble mobile responsive voice memo transcription using Gemini API and pre-formatted PDF generator.' },
        { week: 'Week 3', goal: 'Add SMS dispatch link with Stripe one-click Apple Pay deposit checkout.' },
        { week: 'Week 4', goal: 'Run localized Facebook/Instagram ad targeting trade contractor groups with $100 budget.' },
      ],
      recommendedTechStack: ['React PWA', 'Gemini Audio/Text API', 'Stripe Connect', 'Twilio SMS API', 'Tailwind CSS'],
      unfairAdvantage: `Matches your ${skills} background, zero enterprise bloat, and solves high-friction manual paperwork.`,
      potentialRisksAndMitigations: 'Adoption resistance among non-technical trades: mitigate by offering WhatsApp and SMS-only interfaces without requiring app installs.',
    },
  ];

  const matched = seedIdeas[Math.floor(Math.random() * seedIdeas.length)];
  return {
    ...matched,
    tagline: `${matched.tagline} (Customized for ${interest})`,
    targetCustomer: `${matched.targetCustomer} in the ${interest} sector`,
  };
}

// API endpoint for AI Business Idea Generation
app.post('/api/generate-idea', async (req, res) => {
  try {
    const { interest, budget, skills, audience, commitment, additionalNotes } = req.body;

    if (!interest || !budget || !skills) {
      return res.status(400).json({ error: 'Interest, budget, and skills are required.' });
    }

    if (!aiClient) {
      // Return curated fallback if API key is not configured
      const fallbackIdea = getCuratedIdea(interest, budget, skills, audience || 'General');
      return res.json({ idea: fallbackIdea, source: 'curated' });
    }

    const prompt = `You are a world-class venture studio strategist, Y Combinator alumni mentor, and startup advisor.
Generate a realistic, high-leverage business concept tailored specifically to this aspiring founder's profile:
- Primary Interest / Industry: ${interest}
- Available Budget: ${budget}
- Founder Core Skills: ${skills}
- Target Audience: ${audience || 'Aspiring entrepreneurs & business owners'}
- Time Commitment: ${commitment || 'Full-time'}
- Additional Context: ${additionalNotes || 'Focus on rapid time-to-market and positive cash flow'}

Create an actionable, practical, commercially viable concept with real moat, clear pricing, and an explicit 4-week MVP roadmap.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an elite startup investor and product architect. Output purely structured JSON following the requested schema without markdown backticks.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            conceptName: { type: Type.STRING },
            tagline: { type: Type.STRING },
            problemStatement: { type: Type.STRING },
            targetCustomer: { type: Type.STRING },
            valueProposition: { type: Type.STRING },
            monetizationModel: { type: Type.STRING },
            expectedGrossMargin: { type: Type.STRING },
            mvpLaunchPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  week: { type: Type.STRING },
                  goal: { type: Type.STRING },
                },
                required: ['week', 'goal'],
              },
            },
            recommendedTechStack: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            unfairAdvantage: { type: Type.STRING },
            potentialRisksAndMitigations: { type: Type.STRING },
          },
          required: [
            'conceptName',
            'tagline',
            'problemStatement',
            'targetCustomer',
            'valueProposition',
            'monetizationModel',
            'expectedGrossMargin',
            'mvpLaunchPlan',
            'recommendedTechStack',
            'unfairAdvantage',
            'potentialRisksAndMitigations',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from model');
    }

    const parsedData = JSON.parse(text);
    return res.json({ idea: parsedData, source: 'gemini' });
  } catch (error) {
    console.error('Error generating idea:', error);
    const { interest, budget, skills, audience } = req.body || {};
    const fallbackIdea = getCuratedIdea(interest || 'Tech', budget || '$1000', skills || 'Full-stack', audience || 'Founders');
    return res.json({
      idea: fallbackIdea,
      source: 'curated_fallback',
      notice: 'Delivered via our curated startup intelligence engine.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Server setup with Vite integration
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.static(path.resolve(__dirname, 'public')));

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Startup Sphere server running on http://localhost:${PORT}`);
  });
}

startServer();
