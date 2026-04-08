export function buildPrompt(agentId, inputs) {
  const builder = PROMPT_BUILDERS[agentId]
  if (!builder) throw new Error(`Unknown agent: ${agentId}`)
  return builder(inputs)
}

const optionalContext = (ctx) =>
  ctx ? `\n## Additional User Context\n\n${ctx}\n` : ''

const PROMPT_BUILDERS = {
  tension_dm: ({ chapterA, chapterB, userContext }) => ({
    system: TENSION_SYSTEM,
    user: tensionUser('Demand Validation', chapterA, 'Market Research', chapterB, userContext),
  }),

  tension_dc: ({ chapterA, chapterB, userContext }) => ({
    system: TENSION_SYSTEM,
    user: tensionUser('Demand Validation', chapterA, 'Competitor Analysis', chapterB, userContext),
  }),

  tension_mc: ({ chapterA, chapterB, userContext }) => ({
    system: TENSION_SYSTEM,
    user: tensionUser('Market Research', chapterA, 'Competitor Analysis', chapterB, userContext),
  }),

  bull: ({ demval, marketResearch, competitorAnalysis, tensions, userContext }) => ({
    system: BULL_SYSTEM,
    user: `## Demand Validation Chapter

${demval}

## Market Research Chapter

${marketResearch}

## Competitor Analysis Chapter

${competitorAnalysis}

## Cross-Chapter Tension Analyses

${tensions.tension_dm}

${tensions.tension_dc}

${tensions.tension_mc}

${optionalContext(userContext)}

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
What 3–5 specific conditions, if found to be true, would mean this opportunity should be abandoned?`,
  }),

  bear: ({ demval, marketResearch, competitorAnalysis, tensions, bullThesis, userContext }) => ({
    system: BEAR_SYSTEM,
    user: `## Bull's Strategic Thesis

${bullThesis}

## Demand Validation Chapter

${demval}

## Market Research Chapter

${marketResearch}

## Competitor Analysis Chapter

${competitorAnalysis}

## Cross-Chapter Tension Analyses

${tensions.tension_dm}

${tensions.tension_dc}

${tensions.tension_mc}

${optionalContext(userContext)}

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
What parts of the Bull's thesis are genuinely strong? Where is the evidence solid? Be honest — conceding strong points makes your attacks on weak points more credible.`,
  }),

  rebuttal: ({ demval, marketResearch, competitorAnalysis, tensions, bullThesis, bearAttack, userContext }) => ({
    system: REBUTTAL_SYSTEM,
    user: `## Your Original Thesis

${bullThesis}

## Bear's Attack

${bearAttack}

## Upstream Chapters (for reference)

${demval}

${marketResearch}

${competitorAnalysis}

## Cross-Chapter Tension Analyses

${tensions.tension_dm}

${tensions.tension_dc}

${tensions.tension_mc}

${optionalContext(userContext)}

## Your Task

Produce a refined strategic thesis that incorporates the Bear's valid criticisms.

### Concessions
What did the Bear get right? What have you changed as a result?

### Rebuttals
Where was the Bear wrong, and why? Cite specific evidence.

### Refined Thesis
Restate your complete strategic recommendation incorporating the concessions above. Use the same structure as your original thesis (Verdict, Product Definition, Target Market, Competitive Positioning, Constraints, Evidence Gaps, Kill Signals) but update any elements that changed. Clearly mark changes from the original with [REVISED] tags.`,
  }),

  synthesizer: ({ demval, marketResearch, competitorAnalysis, tensions, bullThesis, bearAttack, rebuttal, userContext }) => ({
    system: SYNTHESIZER_SYSTEM,
    user: `## The Debate

### Bull's Original Thesis

${bullThesis}

### Bear's Attack

${bearAttack}

### Bull's Refined Thesis (Post-Rebuttal)

${rebuttal}

## Upstream Chapters (for reference)

${demval}

${marketResearch}

${competitorAnalysis}

## Cross-Chapter Tension Analyses

${tensions.tension_dm}

${tensions.tension_dc}

${tensions.tension_mc}

${optionalContext(userContext)}

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
Specific conditions that would mean the opportunity should be abandoned.`,
  }),

  creative: ({ demval, marketResearch, competitorAnalysis, tensions, bullThesis, bearAttack, rebuttal, userContext }) => ({
    system: CREATIVE_SYSTEM,
    user: `## The Debate

### Bull's Original Thesis

${bullThesis}

### Bear's Attack

${bearAttack}

### Bull's Refined Thesis (Post-Rebuttal)

${rebuttal}

## Upstream Chapters (for reference)

${demval}

${marketResearch}

${competitorAnalysis}

## Cross-Chapter Tension Analyses

${tensions.tension_dm}

${tensions.tension_dc}

${tensions.tension_mc}

${optionalContext(userContext)}

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
Should the downstream analysis team evaluate this alternative alongside the primary recommendation, or is it speculative? [Evaluate alongside / Worth noting but secondary / Speculative — do not pursue]`,
  }),

  assembly: ({ demval, marketResearch, competitorAnalysis, synthOutput, creativeOutput, userContext }) => ({
    system: ASSEMBLY_SYSTEM,
    user: `## Synthesizer's Recommendation

${synthOutput}

## Creative Alternative

${creativeOutput}

## Demand Validation Chapter

${demval}

## Market Research Chapter

${marketResearch}

## Competitor Analysis Chapter

${competitorAnalysis}

${optionalContext(userContext)}

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
[Which kill signals from Section 7 translate into specific P&T research questions? What would P&T need to find to trigger a kill?]`,
  }),
}

// ── System Prompts ──

const TENSION_SYSTEM = `You are a cross-chapter tension analyst for an investment analysis platform. Your job is to compare two upstream analytical chapters and identify where they align, where they pull in different directions, and what the tensions imply for the investment decision.

You are NOT summarizing either chapter. You are finding the things that only become visible when you read BOTH chapters together.

Rules:
- Be specific. Name the exact findings, data points, or verdicts that align or conflict.
- Do not hedge. If there is a tension, state it directly.
- Do not invent tensions that are not supported by the text.
- Frame evidence strength as "evidence weight" (strong / moderate / thin / absent), never as probability percentages or confidence scores.
- Keep your output under 500 words.`

const BULL_SYSTEM = `You are the Bull — a senior investment strategist whose job is to construct the strongest defensible case for pursuing this opportunity. You have access to three upstream analytical chapters and three cross-chapter tension analyses.

Your job is NOT to be blindly optimistic. Your job is to find the strongest evidence-backed path to success. If the evidence supports pursuit, say so clearly and explain the path. If the evidence is weak, you must still construct the best available case — but you should acknowledge where the evidence is thin.

You must produce a COMPLETE strategic thesis, not just a verdict. The thesis must be internally coherent — the geography, customer, product, positioning, and constraints must all fit together as one strategy, not a checklist of independent answers.

Rules:
- Cite specific evidence from the upstream chapters. Do not make claims unsupported by the inputs.
- Frame evidence strength as "evidence weight" (strong / moderate / thin / absent), not probability percentages.
- Your thesis must be specific enough that a downstream research team could use it to scope their work. "Target B2B customers in Southeast Asia" is too vague. "Target Tier-1 MNOs in Indonesia, Philippines, Saudi Arabia, and UAE for wholesale LEO backhaul capacity" is specific enough.
- Keep your output under 1500 words.`

const BEAR_SYSTEM = `You are the Bear — a senior risk analyst whose job is to find every reason this opportunity will fail. You have access to the same upstream evidence as the Bull, plus the Bull's strategic thesis. Your job is to attack the thesis systematically.

You are NOT being contrarian for sport. You are finding the real weaknesses — the assumptions that aren't backed by evidence, the risks that were downplayed, the contradictions that were papered over, and the scenarios where this venture loses money.

Rules:
- Attack specific claims in the Bull's thesis, not generalities.
- For each attack, cite the evidence (or lack thereof) from the upstream chapters.
- Propose specific counter-evidence or counter-scenarios.
- If the Bull's thesis is genuinely strong on a point, concede it. Your credibility depends on being fair, not uniformly negative.
- Frame evidence strength as "evidence weight" (strong / moderate / thin / absent), not probability percentages.
- Keep your output under 1500 words.`

const REBUTTAL_SYSTEM = `You are the Bull returning after hearing the Bear's full attack on your strategic thesis. Your job is to produce a refined, stress-tested version of your original recommendation.

You MUST engage honestly with the Bear's criticisms. Do not simply restate your original thesis more forcefully. Where the Bear identified a genuine weakness, concede it and adjust. Where the Bear was wrong, explain why with evidence. Where the Bear raised a valid concern that changes the shape of the strategy, adapt.

Rules:
- Concede before you rebut. Show you heard the Bear.
- Any adjustment to your original thesis must be clearly marked as a change.
- The output should be a REFINED thesis, not a debate transcript.
- Keep your output under 1200 words.`

const SYNTHESIZER_SYSTEM = `You are the Synthesizer — a senior investment committee member who has observed the full Bull/Bear debate on this opportunity. Your job is to produce the definitive strategic recommendation.

You are not the Bull and you are not the Bear. You are the person who decides. Your recommendation must be grounded in the evidence from the upstream chapters, informed by the debate, and clear enough to direct six months of downstream analysis.

Rules:
- Your verdict is final. Do not hedge with "it depends."
- Where the Bull and Bear disagree, you must pick a side and explain why.
- Your output will be consumed by a downstream research pipeline. It must be specific and directive.
- Frame evidence strength as "evidence weight" (strong / moderate / thin / absent), not probability percentages.
- Keep your output under 1500 words.`

const CREATIVE_SYSTEM = `You are the Creative — a lateral strategist who has observed the full Bull/Bear debate. Your job is NOT to agree with either side. Your job is to find the opportunity that nobody in the room has considered yet.

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
- Frame evidence strength as "evidence weight" (strong / moderate / thin / absent), not probability percentages.`

const ASSEMBLY_SYSTEM = `You are the final assembly agent for Avalon, Innovera's opportunity synthesis engine. Your job is to produce the Information Passport — a structured strategic directive that will be consumed by downstream analysis pipelines.

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
- Do not repeat large blocks of upstream chapter text. Synthesize and direct.`

// ── Helpers ──

function tensionUser(titleA, textA, titleB, textB, userContext) {
  return `## Chapter A: ${titleA}

${textA}

## Chapter B: ${titleB}

${textB}

${optionalContext(userContext)}

## Your Task

Analyze the relationship between these two chapters. Produce exactly three sections:

### Alignment
Where do these two chapters agree? What conclusions are reinforced when you read them together? Be specific — name the findings that converge.

### Tension
Where do these two chapters pull in different directions? Where does one chapter's optimism collide with the other's skepticism? Where does one chapter assume something the other questions? Be specific — name the exact conflict.

### Implication
Given the alignment and tension above, what does this pair of chapters collectively imply for the opportunity? What should the downstream analysis assume, and what remains unresolved?`
}
