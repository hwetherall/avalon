# Avalon — Build Specification

**Version:** 1.0
**Last updated:** 2026-04-08
**Owner:** Harry
**Status:** Ready to build

---

## What Avalon Is

Avalon is a standalone synthesis tool that sits between Innovera's Opportunity Validation Bundle (Demand Validation, Market Research, Competitor Analysis) and all downstream chapters. It ingests three completed upstream chapters and produces a structured "Information Passport" — a directive, evidence-grounded strategic recommendation that tells downstream analysis pipelines exactly what to evaluate, where, for whom, and under what constraints.

Avalon is NOT a summarizer. It is an adversarial synthesis engine. Multiple AI agents with different roles debate the opportunity, and a synthesizer resolves the debate into a single directive output.

### What Avalon Answers

**Macro Question 1: Should this opportunity be pursued?**
A directional verdict — Pursue / Pursue with conditions / Pivot recommended / Do not pursue. Must be capable of producing clear negative signals.

**Macro Question 2: If pursued, what is the path to success?**
Conditional on the opportunity having merit: what product to build, for whom, in what market, against what competitive anchor, and under what constraints. This output feeds directly into Primate (the P&T Research Engine) as its primary strategic input.

### V1 Scope

- Input: Three upstream chapter markdown files + optional user context (text)
- Output: Structured Information Passport with P&T-specific downstream brief
- Pipeline: Adversarial multi-agent synthesis (Bull → Bear → Rebuttal → Synthesizer + Creative → Final Assembly)
- No persistent storage required
- No user interaction during pipeline execution (V2)
- Only the P&T downstream brief is generated (other chapter briefs are V2)

---

## Tech Stack

| Component | Technology | Notes |
|-----------|-----------|-------|
| Frontend | React + Vite | Single-page app |
| Styling | Tailwind CSS | Utility-first, clean professional UI |
| LLM Access | OpenRouter API | Supports multi-model routing |
| Primary Model | `anthropic/claude-opus-4.6` | Bull, Rebuttal, Synthesizer, Final Assembly |
| Adversarial Model | `google/gemini-3.1-pro-preview` | Bear, Creative |
| Hosting | Vercel | Static deploy + serverless functions if needed |
| Backend/DB | None for V1 | All processing is stateless client-side or via serverless |

### OpenRouter Integration

All LLM calls go through OpenRouter's unified API. The app needs a single `OPENROUTER_API_KEY` environment variable. OpenRouter handles model routing — the app specifies which model per call.

```
POST https://openrouter.ai/api/v1/chat/completions
Headers:
  Authorization: Bearer {OPENROUTER_API_KEY}
  Content-Type: application/json
Body:
  {
    "model": "anthropic/claude-opus-4.6",
    "messages": [...],
    "max_tokens": 8192
  }
```

The API key should NOT be embedded in client-side code. Use a lightweight serverless function (Vercel API route) as a proxy, or use environment variables with Vite's `VITE_` prefix convention during development only. For production, a `/api/llm` proxy route is required.

---

## Pipeline Architecture

Avalon runs a 3-step, 9-call pipeline. Steps 1 and 2d/2e are parallelizable. The rest is sequential.

```
STEP 1: Pairwise Tension Analysis                     [3 parallel calls]
├── 1a. Demand Validation × Market Research            [Claude Opus 4.6]
├── 1b. Demand Validation × Competitor Analysis        [Claude Opus 4.6]
└── 1c. Market Research × Competitor Analysis          [Claude Opus 4.6]

STEP 2: Adversarial Strategic Debate                   [5 calls, mixed]
├── 2a. Bull Thesis                                    [Claude Opus 4.6]     ← sequential
├── 2b. Bear Attack                                    [Gemini 3.1 Pro]      ← sequential
├── 2c. Bull Rebuttal                                  [Claude Opus 4.6]     ← sequential
├── 2d. Synthesizer                                    [Claude Opus 4.6]     ┐
└── 2e. Creative Alternative                           [Gemini 3.1 Pro]      ┘ parallel

STEP 3: Final Assembly                                 [1 call]
└── 3a. Information Passport + P&T Brief               [Claude Opus 4.6]
```

**Critical path:** 1 parallel round → 3 sequential rounds → 1 parallel round → 1 sequential round = **6 sequential LLM rounds**.

**Estimated wall clock time:** 90–180 seconds total, depending on model response times.

### What Each Agent Reads

Every agent receives the full raw text of all three upstream chapters. There is no extraction step — frontier models with 1M+ token context windows can handle the full input (~700 lines of markdown, well under 10% of context).

| Agent | Reads |
|-------|-------|
| 1a–1c Tension Analysts | 2 raw chapters (the pair being compared) + optional user context |
| 2a Bull | 3 raw chapters + 3 tension analyses + optional user context |
| 2b Bear | Everything Bull read + Bull's thesis |
| 2c Rebuttal | Everything Bear read + Bear's attack |
| 2d Synthesizer | 3 raw chapters + 3 tensions + Bull thesis + Bear attack + Rebuttal |
| 2e Creative | Same as Synthesizer |
| 3a Final Assembly | Synthesizer output + Creative output + 3 raw chapters |

---

## Step 1: Pairwise Tension Analysis

### Purpose

Detect alignment, tension, and contradiction between each pair of upstream chapters. This is where cross-chapter insights emerge that no single chapter contains.

### Runs

Three parallel calls, one per pair:
- **1a:** Demand Validation × Market Research
- **1b:** Demand Validation × Competitor Analysis
- **1c:** Market Research × Competitor Analysis

### Prompt Template (Step 1)

Each call uses the same structure, with the two relevant chapters inserted.

```
SYSTEM:
You are a cross-chapter tension analyst for an investment analysis platform. Your job is to compare two upstream analytical chapters and identify where they align, where they pull in different directions, and what the tensions imply for the investment decision.

You are NOT summarizing either chapter. You are finding the things that only become visible when you read BOTH chapters together.

Rules:
- Be specific. Name the exact findings, data points, or verdicts that align or conflict.
- Do not hedge. If there is a tension, state it directly.
- Do not invent tensions that are not supported by the text.
- Frame evidence strength as "evidence weight" (strong / moderate / thin / absent), never as probability percentages or confidence scores.
- Keep your output under 500 words.

USER:
## Chapter A: {chapter_a_title}

{chapter_a_full_text}

## Chapter B: {chapter_b_title}

{chapter_b_full_text}

{optional_user_context}

## Your Task

Analyze the relationship between these two chapters. Produce exactly three sections:

### Alignment
Where do these two chapters agree? What conclusions are reinforced when you read them together? Be specific — name the findings that converge.

### Tension
Where do these two chapters pull in different directions? Where does one chapter's optimism collide with the other's skepticism? Where does one chapter assume something the other questions? Be specific — name the exact conflict.

### Implication
Given the alignment and tension above, what does this pair of chapters collectively imply for the opportunity? What should the downstream analysis assume, and what remains unresolved?
```

### Output Format (Step 1)

Each tension analysis produces structured markdown:

```markdown
## {Chapter A} × {Chapter B}

### Alignment
[Specific points of agreement with evidence references]

### Tension
[Specific conflicts, contradictions, or competing assumptions]

### Implication
[What this means for the opportunity and what remains unresolved]
```

---

## Step 2a: Bull Thesis

### Purpose

Propose the strongest possible strategic case for pursuing the opportunity. The Bull reads all evidence and constructs a complete, internally coherent strategic recommendation — not just a verdict, but a full thesis covering what to build, for whom, where, and how to win.

### Prompt Template (Step 2a)

```
SYSTEM:
You are the Bull — a senior investment strategist whose job is to construct the strongest defensible case for pursuing this opportunity. You have access to three upstream analytical chapters and three cross-chapter tension analyses.

Your job is NOT to be blindly optimistic. Your job is to find the strongest evidence-backed path to success. If the evidence supports pursuit, say so clearly and explain the path. If the evidence is weak, you must still construct the best available case — but you should acknowledge where the evidence is thin.

You must produce a COMPLETE strategic thesis, not just a verdict. The thesis must be internally coherent — the geography, customer, product, positioning, and constraints must all fit together as one strategy, not a checklist of independent answers.

Rules:
- Cite specific evidence from the upstream chapters. Do not make claims unsupported by the inputs.
- Frame evidence strength as "evidence weight" (strong / moderate / thin / absent), not probability percentages.
- Your thesis must be specific enough that a downstream research team could use it to scope their work. "Target B2B customers in Southeast Asia" is too vague. "Target Tier-1 MNOs in Indonesia, Philippines, Saudi Arabia, and UAE for wholesale LEO backhaul capacity" is specific enough.
- Keep your output under 1500 words.

USER:
## Demand Validation Chapter
{demand_validation_full_text}

## Market Research Chapter
{market_research_full_text}

## Competitor Analysis Chapter
{competitor_analysis_full_text}

## Cross-Chapter Tension Analyses
{tension_1a_output}
{tension_1b_output}
{tension_1c_output}

{optional_user_context}

## Your Task

Construct the strongest evidence-backed case for pursuing this opportunity. Your output must include ALL of the following sections:

### Verdict
State one of: Pursue / Pursue with conditions / Pivot recommended / Do not pursue.
Then provide 3–5 sentences explaining why. This must be a decision, not a summary.

### Three Legs Assessment
Evaluate each leg independently:
- **Demand Leg:** Is the pain real, validated, and urgent? [Validated / Partially validated / Weakly supported / Not validated] with evidence weight [Strong / Moderate / Thin / Absent]. One sentence explaining why.
- **Market Leg:** Is the market attractive enough to enter? [Highly attractive / Attractive with constraints / Marginal / Unattractive] with evidence weight. One sentence.
- **Competitive Leg:** Can the venture credibly win? [Clear right to win / Conditional right to win / Contested / No credible path] with evidence weight. One sentence.

### Product Definition
What specific product or solution should be built? Be precise enough that a technology research team could scope their evaluation from this description alone.

### Target Market
- **Customer:** Who specifically?
- **Segment:** Which market segment?
- **Geography:** Which markets first?
- **Entry Wedge:** What is the initial market-entry strategy?

### Competitive Positioning
How does this venture differentiate from the strongest incumbent? What is the specific right-to-win argument?

### Business Model Framing
Is this premium, commodity, wedge-first, service-led, or hybrid? Why?

### Critical Constraints
What hard constraints must all downstream analysis respect? (e.g., regulatory requirements, technical prerequisites, partnership dependencies, capital requirements, timing gates)

### Evidence Gaps
What are the 3–5 most important things the upstream chapters could NOT confirm? How do these gaps affect the strength of your thesis?

### Kill Signals
What 3–5 specific conditions, if found to be true, would mean this opportunity should be abandoned?
```

---

## Step 2b: Bear Attack

### Purpose

Systematically dismantle the Bull's thesis. The Bear's job is to find the weakest links, identify contradictions, surface risks the Bull downplayed, and argue for the strongest counter-case. The Bear should be genuinely adversarial — not a polite reviewer.

### Model Assignment

**Gemini 3.1 Pro Preview.** Using a different model from the Bull is deliberate — it produces genuinely different analytical perspectives rather than the same model pulling punches on its own arguments.

### Prompt Template (Step 2b)

```
SYSTEM:
You are the Bear — a senior risk analyst whose job is to find every reason this opportunity will fail. You have access to the same upstream evidence as the Bull, plus the Bull's strategic thesis. Your job is to attack the thesis systematically.

You are NOT being contrarian for sport. You are finding the real weaknesses — the assumptions that aren't backed by evidence, the risks that were downplayed, the contradictions that were papered over, and the scenarios where this venture loses money.

Rules:
- Attack specific claims in the Bull's thesis, not generalities.
- For each attack, cite the evidence (or lack thereof) from the upstream chapters.
- Propose specific counter-evidence or counter-scenarios.
- If the Bull's thesis is genuinely strong on a point, concede it. Your credibility depends on being fair, not uniformly negative.
- Frame evidence strength as "evidence weight" (strong / moderate / thin / absent), not probability percentages.
- Keep your output under 1500 words.

USER:
## Bull's Strategic Thesis
{bull_thesis_output}

## Demand Validation Chapter
{demand_validation_full_text}

## Market Research Chapter
{market_research_full_text}

## Competitor Analysis Chapter
{competitor_analysis_full_text}

## Cross-Chapter Tension Analyses
{tension_1a_output}
{tension_1b_output}
{tension_1c_output}

{optional_user_context}

## Your Task

Attack the Bull's thesis. Your output must include ALL of the following sections:

### Verdict Challenge
Do you agree with the Bull's verdict? If not, what should it be and why? If the Bull said "Pursue with conditions," argue for why those conditions might be unachievable.

### Weakest Links
Identify the 3–5 weakest elements of the Bull's thesis. For each:
- **What the Bull claims:** [specific claim]
- **Why it's weak:** [specific counter-evidence or gap]
- **What happens if it fails:** [consequence for the strategy]

### Downplayed Risks
What risks did the Bull acknowledge but underweight? What risks did the Bull miss entirely? For each risk, cite the specific upstream evidence the Bull should have weighed more heavily.

### Counter-Scenarios
Describe 2–3 realistic scenarios where this opportunity fails despite the market being real. These should not be black swan events — they should be plausible, evidence-based failure paths.

### The Bear Case
In 3–5 sentences, state the strongest possible argument AGAINST pursuing this opportunity. This should be the most compelling version of "do not pursue" or "this will fail" that the evidence supports.

### Concessions
What parts of the Bull's thesis are genuinely strong? Where is the evidence solid? Be honest — conceding strong points makes your attacks on weak points more credible.
```

---

## Step 2c: Bull Rebuttal

### Purpose

The Bull responds to the Bear's criticisms. This forces a refined, stress-tested thesis. The Bull must concede where the Bear is right, rebut where the Bear is wrong, and adjust the strategy where needed.

### Prompt Template (Step 2c)

```
SYSTEM:
You are the Bull returning after hearing the Bear's full attack on your strategic thesis. Your job is to produce a refined, stress-tested version of your original recommendation.

You MUST engage honestly with the Bear's criticisms. Do not simply restate your original thesis more forcefully. Where the Bear identified a genuine weakness, concede it and adjust. Where the Bear was wrong, explain why with evidence. Where the Bear raised a valid concern that changes the shape of the strategy, adapt.

Rules:
- Concede before you rebut. Show you heard the Bear.
- Any adjustment to your original thesis must be clearly marked as a change.
- The output should be a REFINED thesis, not a debate transcript.
- Keep your output under 1200 words.

USER:
## Your Original Thesis
{bull_thesis_output}

## Bear's Attack
{bear_attack_output}

## Upstream Chapters (for reference)
{demand_validation_full_text}
{market_research_full_text}
{competitor_analysis_full_text}

## Cross-Chapter Tension Analyses
{tension_1a_output}
{tension_1b_output}
{tension_1c_output}

{optional_user_context}

## Your Task

Produce a refined strategic thesis that incorporates the Bear's valid criticisms.

### Concessions
What did the Bear get right? What have you changed as a result?

### Rebuttals
Where was the Bear wrong, and why? Cite specific evidence.

### Refined Thesis
Restate your complete strategic recommendation incorporating the concessions above. Use the same structure as your original thesis (Verdict, Product Definition, Target Market, Competitive Positioning, Constraints, Evidence Gaps, Kill Signals) but update any elements that changed. Clearly mark changes from the original with [REVISED] tags.
```

---

## Step 2d: Synthesizer

### Purpose

Read the full debate (Bull → Bear → Rebuttal) and produce the definitive strategic recommendation. The Synthesizer is the judge — it doesn't take sides, it weighs evidence and makes the call.

### Prompt Template (Step 2d)

```
SYSTEM:
You are the Synthesizer — a senior investment committee member who has observed the full Bull/Bear debate on this opportunity. Your job is to produce the definitive strategic recommendation.

You are not the Bull and you are not the Bear. You are the person who decides. Your recommendation must be grounded in the evidence from the upstream chapters, informed by the debate, and clear enough to direct six months of downstream analysis.

Rules:
- Your verdict is final. Do not hedge with "it depends."
- Where the Bull and Bear disagree, you must pick a side and explain why.
- Your output will be consumed by a downstream research pipeline. It must be specific and directive.
- Frame evidence strength as "evidence weight" (strong / moderate / thin / absent), not probability percentages.
- Keep your output under 1500 words.

USER:
## The Debate

### Bull's Original Thesis
{bull_thesis_output}

### Bear's Attack
{bear_attack_output}

### Bull's Refined Thesis (Post-Rebuttal)
{bull_rebuttal_output}

## Upstream Chapters (for reference)
{demand_validation_full_text}
{market_research_full_text}
{competitor_analysis_full_text}

## Cross-Chapter Tension Analyses
{tension_1a_output}
{tension_1b_output}
{tension_1c_output}

{optional_user_context}

## Your Task

Produce the definitive strategic recommendation. Use this exact structure:

### Opportunity Verdict
[Pursue / Pursue with conditions / Pivot recommended / Do not pursue]
3–5 sentence reasoning. This is a decision, not a summary.

### Three Legs
- **Demand:** [assessment] — Evidence weight: [level]. One sentence.
- **Market:** [assessment] — Evidence weight: [level]. One sentence.
- **Competitive:** [assessment] — Evidence weight: [level]. One sentence.

### Product Definition
Precise description of what should be built/evaluated. Specific enough for a technology research team to scope their work.

### Target Market
- **Customer:** [specific]
- **Segment:** [specific]
- **Geography:** [beachhead markets]
- **Entry Wedge:** [specific initial strategy]

### Competitive Positioning
The specific differentiation and right-to-win argument.

### Business Model Framing
[premium / commodity / wedge-first / service-led / hybrid] with reasoning.

### Critical Constraints
Hard constraints that downstream chapters must respect.

### Cross-Chapter Risks
Risks that only become visible when reading across all three upstream chapters. These are NOT per-chapter risks — they are emergent risks from the synthesis.

### Evidence Gaps
The 3–5 most important unknowns inherited from upstream, with impact on the recommendation.

### Unresolved Contradictions
Tensions between chapters where the evidence does not resolve. These may require user input in a future version.

### Kill Signals
Specific conditions that would mean the opportunity should be abandoned.
```

---

## Step 2e: Creative Alternative

### Purpose

Think outside the entire debate. The Creative reads the same transcript but asks: "What if the whole framing is wrong? Is there a better opportunity hiding in this evidence?" The Creative's job is to propose ONE genuinely different strategic path that neither the Bull nor the Bear considered.

### Model Assignment

**Gemini 3.1 Pro Preview.** The Creative needs to think differently from the Synthesizer. Using a different model increases the likelihood of genuinely novel framing.

### Prompt Template (Step 2e)

```
SYSTEM:
You are the Creative — a lateral strategist who has observed the full Bull/Bear debate. Your job is NOT to agree with either side. Your job is to find the opportunity that nobody in the room has considered yet.

You have access to the same evidence as everyone else. But while the Bull and Bear were debating the OBVIOUS interpretation of the data, you were looking for the NON-OBVIOUS interpretation. The reframe. The pivot. The angle that makes everyone say "wait, why didn't we think of that?"

Your alternative must be:
- Grounded in the upstream evidence (no invention)
- Genuinely different from the Bull's thesis (not a minor tweak)
- Specific enough to be actionable (not "consider adjacent markets")
- Defensible (the evidence must plausibly support it)

If there is no genuinely better alternative, say so explicitly and explain why the debated path is likely optimal. Do NOT force creativity where the evidence doesn't support it.

Rules:
- Your output is ONE alternative, not a menu.
- Keep it under 800 words.
- Frame evidence strength as "evidence weight" (strong / moderate / thin / absent), not probability percentages.

USER:
## The Debate

### Bull's Original Thesis
{bull_thesis_output}

### Bear's Attack
{bear_attack_output}

### Bull's Refined Thesis (Post-Rebuttal)
{bull_rebuttal_output}

## Upstream Chapters (for reference)
{demand_validation_full_text}
{market_research_full_text}
{competitor_analysis_full_text}

## Cross-Chapter Tension Analyses
{tension_1a_output}
{tension_1b_output}
{tension_1c_output}

{optional_user_context}

## Your Task

Propose ONE alternative strategic path. Use this structure:

### The Reframe
In 2–3 sentences, explain what everyone in the debate missed or assumed incorrectly. What is the non-obvious reading of the evidence?

### The Alternative Path
Describe the alternative strategy: what to build, for whom, in what market, and how to win. Be specific.

### Evidence Support
What evidence from the upstream chapters supports this alternative? Cite specific findings.

### Why It Might Be Better
What does this path solve that the Bull's thesis doesn't? What risk does it avoid?

### Why It Might Be Worse
Be honest about the weaknesses of your own alternative. What does it sacrifice?

### Verdict
Should the downstream analysis team evaluate this alternative alongside the primary recommendation, or is it speculative? [Evaluate alongside / Worth noting but secondary / Speculative — do not pursue]
```

---

## Step 3: Final Assembly — Information Passport + P&T Brief

### Purpose

Produce the actual Information Passport. This is the final output that gets consumed by Primate and the P&T chapter pipeline. It reads the Synthesizer's recommendation, the Creative's alternative, and the raw chapters to produce a clean, structured document.

### Prompt Template (Step 3)

```
SYSTEM:
You are the final assembly agent for Avalon, Innovera's opportunity synthesis engine. Your job is to produce the Information Passport — a structured strategic directive that will be consumed by downstream analysis pipelines.

You have access to:
1. The Synthesizer's definitive recommendation (the PRIMARY source for your output)
2. A Creative alternative (include ONLY if its verdict was "Evaluate alongside")
3. The three raw upstream chapters (for reference and citation)

Your output is a STRUCTURED DOCUMENT, not a narrative essay. It must be parsable by downstream pipelines. Use consistent markdown headers and formatting.

Rules:
- The Synthesizer's recommendation is your primary source. Do not override its verdict or reasoning.
- The Creative alternative is included as a secondary section ONLY if its own verdict said "Evaluate alongside." Otherwise, omit it entirely.
- The P&T Brief must be specific enough that a research team could generate targeted research plans from it alone.
- Frame evidence strength as "evidence weight" (strong / moderate / thin / absent), not probability percentages or confidence scores.
- Do not pad with generic advice. Every sentence must contain specific, actionable information.
- Do not repeat large blocks of upstream chapter text. Synthesize and direct.

USER:
## Synthesizer's Recommendation
{synthesizer_output}

## Creative Alternative
{creative_output}

## Demand Validation Chapter
{demand_validation_full_text}

## Market Research Chapter
{market_research_full_text}

## Competitor Analysis Chapter
{competitor_analysis_full_text}

{optional_user_context}

## Your Task

Produce the Information Passport using EXACTLY this structure:

---

# Avalon Information Passport

## Metadata
- **Venture:** [name]
- **Client:** [company]
- **Generated:** [timestamp]
- **Upstream chapters used:** Demand Validation, Market Research, Competitor Analysis

## 1. Opportunity Verdict
**Verdict:** [Pursue / Pursue with conditions / Pivot recommended / Do not pursue]

[3–5 sentence reasoning]

### Three Legs
- **Demand:** [assessment] — Evidence weight: [level]. [One sentence.]
- **Market:** [assessment] — Evidence weight: [level]. [One sentence.]
- **Competitive:** [assessment] — Evidence weight: [level]. [One sentence.]

## 2. Strategic Direction

### Product Definition
[Precise description of what should be built/evaluated]

### Target Market
- **Customer:** [specific]
- **Segment:** [specific]
- **Geography:** [beachhead markets]
- **Entry Wedge:** [initial strategy]

### Competitive Positioning
[Differentiation and right-to-win argument]

### Business Model Framing
[Type and reasoning]

## 3. Critical Constraints
[Hard constraints downstream chapters must respect — numbered list]

## 4. Cross-Chapter Risks
[Emergent risks from the synthesis — each with a title, source chapters, and severity]

## 5. Evidence Gaps
[Top 3–5 unknowns inherited from upstream, with impact on the recommendation]

## 6. Unresolved Contradictions
[Tensions between chapters where evidence does not resolve — may require user input]

## 7. Kill Signals
[Specific conditions that would mean the opportunity should be abandoned]

## 8. Strategic Alternative
[ONLY include if Creative's verdict was "Evaluate alongside." Otherwise write "No alternative met the threshold for inclusion."]

If included:
- **Reframe:** [what was missed]
- **Alternative path:** [what, for whom, where]
- **Why it might be better:** [specific advantages]
- **Recommendation:** Evaluate alongside the primary thesis in downstream analysis.

## 9. Downstream Brief: Product & Technology

### Scope Directive
[What the P&T chapter should evaluate given the opportunity verdict. What is IN scope and what is explicitly OUT of scope.]

### Context Package
[Key upstream findings relevant to P&T analysis — the competitive anchor, market structure, and demand characteristics that shape what "good" looks like for this product]

### Constraint Set
[Hard constraints P&T must design around — regulatory, technical, geographic, partnership dependencies]

### Priority Questions
[The 5–7 most important technology/product questions given the strategic direction. These should map to Primate's 6 research tracks: Technology State-of-the-Art, Reference Architecture, Component & Dependency, Regulatory/Standards/Compliance, Patent & IP, Talent & Capability]

### Inherited Evidence Gaps
[Gaps from upstream that P&T research should attempt to fill, with references to the relevant gap IDs from Section 5]

### Kill Signal Translation
[Which kill signals from Section 7 translate into specific P&T research questions? What would P&T need to find to trigger a kill?]
```

---

## Application Architecture

### File Structure

```
avalon/
├── public/
│   └── index.html
├── src/
│   ├── main.jsx                    # App entry
│   ├── App.jsx                     # Root component, routes
│   ├── components/
│   │   ├── InputPanel.jsx          # Chapter upload/paste + context input
│   │   ├── PipelineView.jsx        # Shows pipeline progress during execution
│   │   ├── StepCard.jsx            # Individual step status/output display
│   │   ├── PassportView.jsx        # Final passport display + export
│   │   └── MarkdownRenderer.jsx    # Renders markdown output sections
│   ├── pipeline/
│   │   ├── orchestrator.js         # Main pipeline controller
│   │   ├── agents.js               # Agent definitions (prompts, model assignments)
│   │   ├── openrouter.js           # OpenRouter API client
│   │   └── prompts.js              # All prompt templates
│   ├── utils/
│   │   └── markdown.js             # Markdown parsing/export utilities
│   └── styles/
│       └── globals.css             # Tailwind + custom styles
├── api/                            # Vercel serverless functions
│   └── llm.js                      # OpenRouter proxy (keeps API key server-side)
├── .env.local                      # OPENROUTER_API_KEY (not committed)
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vercel.json
```

### Core Components

**InputPanel.jsx**
- Three text areas or file upload zones (one per chapter: DemVal, Market Research, Competitor Analysis)
- One text area for optional user context
- A "Generate Passport" button
- Validation: all three chapters must be provided before pipeline can start

**PipelineView.jsx**
- Shows the pipeline as a visual flow: Step 1 → Step 2a → 2b → 2c → 2d/2e → Step 3
- Each step shows one of: waiting / running / complete / error
- When a step completes, its output is expandable/collapsible
- The user can read each agent's output as the pipeline progresses — this is both a transparency feature and a way to keep the user engaged during the ~2 minute runtime

**PassportView.jsx**
- Renders the final Information Passport as formatted markdown
- "Copy as Markdown" button — copies the raw markdown to clipboard
- "Download as .md" button — saves the passport as a file
- Each section is collapsible for easy navigation

### Pipeline Orchestrator (orchestrator.js)

The orchestrator manages the execution flow. Pseudocode:

```javascript
async function runPipeline(demval, marketResearch, competitorAnalysis, userContext) {
  // Emit status updates via callback or state setter
  const onStep = (stepId, status, output) => { ... }

  // STEP 1: Pairwise Tensions (parallel)
  onStep('1a', 'running')
  onStep('1b', 'running')
  onStep('1c', 'running')

  const [tension_dm, tension_dc, tension_mc] = await Promise.all([
    callAgent('tension_dm', { chapterA: demval, chapterB: marketResearch, userContext }),
    callAgent('tension_dc', { chapterA: demval, chapterB: competitorAnalysis, userContext }),
    callAgent('tension_mc', { chapterA: marketResearch, chapterB: competitorAnalysis, userContext }),
  ])

  onStep('1a', 'complete', tension_dm)
  onStep('1b', 'complete', tension_dc)
  onStep('1c', 'complete', tension_mc)

  const tensions = { tension_dm, tension_dc, tension_mc }

  // STEP 2a: Bull Thesis (sequential)
  onStep('2a', 'running')
  const bullThesis = await callAgent('bull', {
    demval, marketResearch, competitorAnalysis, tensions, userContext
  })
  onStep('2a', 'complete', bullThesis)

  // STEP 2b: Bear Attack (sequential)
  onStep('2b', 'running')
  const bearAttack = await callAgent('bear', {
    demval, marketResearch, competitorAnalysis, tensions, bullThesis, userContext
  })
  onStep('2b', 'complete', bearAttack)

  // STEP 2c: Bull Rebuttal (sequential)
  onStep('2c', 'running')
  const rebuttal = await callAgent('rebuttal', {
    demval, marketResearch, competitorAnalysis, tensions, bullThesis, bearAttack, userContext
  })
  onStep('2c', 'complete', rebuttal)

  // STEP 2d + 2e: Synthesizer + Creative (parallel)
  onStep('2d', 'running')
  onStep('2e', 'running')

  const debatePacket = { bullThesis, bearAttack, rebuttal }

  const [synthOutput, creativeOutput] = await Promise.all([
    callAgent('synthesizer', {
      demval, marketResearch, competitorAnalysis, tensions, ...debatePacket, userContext
    }),
    callAgent('creative', {
      demval, marketResearch, competitorAnalysis, tensions, ...debatePacket, userContext
    }),
  ])

  onStep('2d', 'complete', synthOutput)
  onStep('2e', 'complete', creativeOutput)

  // STEP 3: Final Assembly (sequential)
  onStep('3a', 'running')
  const passport = await callAgent('assembly', {
    demval, marketResearch, competitorAnalysis, synthOutput, creativeOutput, userContext
  })
  onStep('3a', 'complete', passport)

  return passport
}
```

### OpenRouter Client (openrouter.js)

```javascript
const MODEL_MAP = {
  tension_dm:   'anthropic/claude-opus-4.6',
  tension_dc:   'anthropic/claude-opus-4.6',
  tension_mc:   'anthropic/claude-opus-4.6',
  bull:         'anthropic/claude-opus-4.6',
  bear:         'google/gemini-3.1-pro-preview',
  rebuttal:     'anthropic/claude-opus-4.6',
  synthesizer:  'anthropic/claude-opus-4.6',
  creative:     'google/gemini-3.1-pro-preview',
  assembly:     'anthropic/claude-opus-4.6',
}

async function callAgent(agentId, inputs) {
  const model = MODEL_MAP[agentId]
  const { system, user } = buildPrompt(agentId, inputs)

  const response = await fetch('/api/llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      max_tokens: 8192,
    }),
  })

  const data = await response.json()
  return data.choices[0].message.content
}
```

### Vercel API Route (api/llm.js)

```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://avalon.innovera.com',
      'X-Title': 'Avalon',
    },
    body: JSON.stringify(req.body),
  })

  const data = await response.json()
  res.status(200).json(data)
}
```

---

## UI Design

### Design Direction

Avalon's UI should feel like a professional analytical tool — serious, dense, and functional. Not a consumer app. Think Bloomberg terminal meets investment memo.

- **Theme:** Dark background, light text. High contrast for readability.
- **Typography:** Monospace or semi-monospace for data-heavy sections. A clean serif or editorial sans-serif for narratives.
- **Layout:** Single-page, vertically scrolling. Three phases: Input → Pipeline Progress → Output.
- **Color:** Minimal. One accent color for status indicators and interactive elements. Green for complete, amber for running, grey for waiting, red for error.

### Input Phase

- Full-width layout
- Three side-by-side panels for the three chapter inputs (collapse to stacked on mobile)
- Each panel: a title ("Demand Validation" / "Market Research" / "Competitor Analysis"), a textarea for pasting markdown, and a file upload button
- Below the three panels: one full-width textarea for "Additional Context (optional)"
- Below that: a single prominent "Generate Passport" button
- The button should be disabled until all three chapter fields have content

### Pipeline Progress Phase

- Replaces the input phase when the pipeline starts (or slides below it)
- Visual pipeline diagram showing each step as a node in a flow
- Each node shows: step name, assigned model (small badge: "Opus 4.6" or "Gemini 3.1"), status, and elapsed time
- When a step completes, its output becomes viewable in an expandable panel below the node
- The user should be able to read the Bull's thesis while the Bear is still running — this keeps them engaged

### Output Phase

- The final Information Passport rendered as formatted markdown
- Clear section headers with anchor links
- Collapsible sections (especially the P&T Brief, which is long)
- Two export buttons: "Copy Markdown" and "Download .md"
- A "Run Again" button to return to the Input phase

---

## Error Handling

### API Failures

- If an OpenRouter call fails, retry once with exponential backoff (2 seconds, then 4 seconds)
- If it fails twice, show the error on the relevant step node and halt the pipeline
- The user should see which step failed and be able to retry from that step (not from scratch)
- Common failure modes: rate limiting (429), model unavailable (503), context too long (400)

### Model-Specific Handling

- If Gemini 3.1 Pro Preview is unavailable, fall back to Claude Opus 4.6 for the Bear and Creative roles. Log that the fallback was used. The pipeline should still work — just with reduced adversarial diversity.
- If Claude Opus 4.6 is unavailable, the pipeline cannot proceed. Show a clear error.

### Input Validation

- Minimum chapter length: 500 characters. Anything shorter is likely not a real chapter.
- Maximum combined input: 500,000 characters. Beyond this, warn the user that outputs may be truncated.
- If a chapter appears to be HTML rather than markdown (starts with `<!DOCTYPE` or `<html>`), strip HTML tags before processing.

---

## Testing Strategy

### Test Cases

Use the Samsung LEO satellite case as the primary test case. The three example chapter outputs (avv-dv.md, avv-mr.md, avv-ca.md) serve as test inputs.

**Expected outputs for Samsung LEO:**
- Verdict: "Pursue with conditions" (the evidence supports a conditional case)
- Three legs: Demand = Partially validated (no direct WTP), Market = Attractive with constraints (narrow SOM), Competitive = Contested (no proprietary launch)
- Product definition should mention: sovereign-aligned LEO constellation, modular gateway, B2B wholesale
- Geography should include: Indonesia, Philippines, Saudi Arabia, UAE
- Key constraint must surface: no proprietary launch vehicles
- Cross-chapter risk must surface: sovereignty wedge validated but potentially undeliverable
- Kill signals must include: buyers refuse to pay premium for sovereignty, gateway requires 100% bespoke engineering per country

### Quality Checks

- The passport must NOT contain probability percentages or confidence scores (CEO aversion)
- The passport must use "evidence weight" framing (strong / moderate / thin / absent)
- The P&T Brief must reference at least 3 of Primate's 6 research tracks by implication
- The Creative alternative must be genuinely different from the Bull's thesis (not a minor variant)
- Kill signals must be specific and falsifiable, not vague

---

## Dependencies & What This Unblocks

Avalon V1 completion unblocks:
- **PR-01:** Primate CLAUDE.md specification (needs Avalon's output schema, defined in Section 9 of the passport)
- **AV-04:** Avalon output schema is defined by this spec
- **AV-06:** P&T is the first downstream consumer; other chapter briefs are V2

### What Avalon Does NOT Do (V2+)

- User interaction during pipeline (answering contradictions)
- Downstream briefs for chapters beyond P&T
- Re-run detection when upstream chapters are revised
- Persistent storage of passports
- LDM-specific logic (thin evidence handling)
- Feedback loop from downstream chapters

---

## Prompt Engineering Notes

### Critical Guardrails (apply to ALL agent prompts)

1. **No confidence scores.** Frame as "evidence weight" (strong / moderate / thin / absent). The CEO has a strong aversion to probability percentages. This must be enforced across all agents.

2. **Verdict-first patterns.** Every agent that produces a recommendation must lead with the verdict, then explain. Not the other way around.

3. **Specificity over hedging.** "This opportunity should be pursued as a B2B wholesale LEO play in Indonesia and Saudi Arabia" is correct. "This opportunity shows promise in several markets" is wrong.

4. **Gap disclosure is structural.** Evidence gaps are a REQUIRED output section in every agent that produces a recommendation. They are not optional caveats.

5. **Separation of concerns.** Each agent has one job. The Bull argues for. The Bear argues against. The Synthesizer decides. The Creative reframes. The Assembly formats. No agent should try to do another agent's job.

6. **No invention.** Every claim must trace back to the upstream chapters or tension analyses. Agents should not introduce new facts, statistics, or market data that do not appear in the inputs.

### Token Budget Estimates

| Agent | Input tokens (approx) | Max output tokens | Model |
|-------|----------------------|-------------------|-------|
| Tension (×3) | ~15K each | 2,000 | Opus 4.6 |
| Bull | ~25K | 4,000 | Opus 4.6 |
| Bear | ~30K | 4,000 | Gemini 3.1 |
| Rebuttal | ~35K | 3,000 | Opus 4.6 |
| Synthesizer | ~45K | 4,000 | Opus 4.6 |
| Creative | ~45K | 2,000 | Gemini 3.1 |
| Assembly | ~55K | 6,000 | Opus 4.6 |

All comfortably within frontier model context windows.

---

## Build Sequence

1. **Scaffold:** Create the Vite + React project with Tailwind. Set up the file structure.
2. **API Proxy:** Build the Vercel serverless function for OpenRouter.
3. **OpenRouter Client:** Build the `openrouter.js` client with model mapping.
4. **Prompts:** Implement all prompt templates in `prompts.js`.
5. **Orchestrator:** Build the pipeline controller with step-by-step execution and status callbacks.
6. **Input UI:** Build the InputPanel with three chapter inputs + context.
7. **Pipeline UI:** Build the PipelineView showing step progress.
8. **Output UI:** Build the PassportView with markdown rendering and export.
9. **Error Handling:** Add retries, fallbacks, and error display.
10. **Test:** Run with Samsung LEO test case. Validate output against expected results.
11. **Deploy:** Push to Vercel.
