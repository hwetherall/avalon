# Avalon V2 — Step 1: Path Cartographer

**Version:** 0.1 (Draft)
**Last updated:** 2026-04-08
**Owner:** Harry
**Status:** Design — ready for review
**Depends on:** Avalon V1 (complete), specifically Step 1 tension analyses

---

## What The Path Cartographer Is

The Path Cartographer is a new agent that sits between Avalon's existing Step 1 (Pairwise Tension Analysis) and the adversarial debate. Its job is to read the three upstream chapters and three tension analyses, and produce **5–6 distinct, evidence-grounded strategic paths** the venture could take.

In V1, the pipeline went straight from tension analysis into a single Bull thesis. The Bull picked *one* direction and argued for it, the Bear attacked it, the Synthesizer judged it, and the Creative occasionally proposed an alternative. This produced one well-tested path, but it meant the pipeline's strategic aperture was set by whichever direction the Bull chose first. If the Bull picked "sovereign LEO constellation," the entire debate orbited that framing — even the Creative's alternative was shaped by what the Bull proposed.

The Path Cartographer fixes this by **separating path discovery from path evaluation**. It forces the pipeline to enumerate all credible directions *before* committing to evaluate any of them. To use Daniel's analogy: the war council identifies five possible expeditions before sending scouts to any of them.

### What The Path Cartographer Is NOT

- It is NOT a summarizer. It does not restate what the chapters said.
- It is NOT a verdict engine. It does not recommend a path. It enumerates them.
- It is NOT the Synthesizer. The Synthesizer resolves a debate. The Cartographer opens the map.
- It does NOT replace the tension analyses. Step 1 still runs as-is. The Cartographer reads the tension outputs as a primary input.

---

## Where It Sits In The Avalon V2 Pipeline

```
STEP 1: Pairwise Tension Analysis                     [3 parallel calls — UNCHANGED]
├── 1a. Demand Validation × Market Research            [Claude Opus 4.6]
├── 1b. Demand Validation × Competitor Analysis        [Claude Opus 4.6]
└── 1c. Market Research × Competitor Analysis          [Claude Opus 4.6]

STEP 1.5: Path Cartographer                            [1 call — NEW]
└── 1.5a. Enumerate 5–6 strategic paths                [Claude Opus 4.6]

STEP 2: Path Scouting (per path)                       [V2 Step 2 — future spec]
├── Scout for Path 1
├── Scout for Path 2
├── ...
└── Scout for Path N

STEP 3: War Table + Assembly                           [V2 Step 3 — future spec]
├── Comparative evaluation
├── Innovera Recommendation
└── Expanded Information Passport
```

The Path Cartographer is a single LLM call. Its output is the input to Step 2 (Scouts), which is a separate specification.

---

## Inputs

The Path Cartographer receives everything the V1 Bull used to receive, but its job is different.

| Input | Source | Purpose |
|-------|--------|---------|
| Demand Validation chapter | Upstream (raw markdown) | Evidence on customer pain, urgency, buying mechanics |
| Market Research chapter | Upstream (raw markdown) | Evidence on market size, structure, entry barriers |
| Competitor Analysis chapter | Upstream (raw markdown) | Evidence on competitive landscape, right to win |
| Tension 1a (DV × MR) | Step 1 output | Cross-chapter alignment and conflicts |
| Tension 1b (DV × CA) | Step 1 output | Cross-chapter alignment and conflicts |
| Tension 1c (MR × CA) | Step 1 output | Cross-chapter alignment and conflicts |
| Strategic Context | User input (optional) | Client's success criteria, blocking questions, constraints |

Total context: same as V1 Bull (~50K–100K tokens depending on chapter length). Well within frontier model context windows.

---

## Output Schema

The Cartographer produces a structured markdown document containing 5–6 strategic paths. Each path is a **thesis sketch**, not a full passport — just enough for a scout to know what to investigate.

### Output Structure

```markdown
# Path Cartographer — Strategic Path Enumeration

## Venture
[Name]

## Enumeration Method
[2–3 sentences explaining the logic used to discover these paths — what dimensions were varied, what the upstream evidence suggested as natural fork points]

---

## Path 1: [Short evocative name — e.g., "The Sovereignty Fortress"]

### Thesis (3–5 sentences)
What would the venture build, for whom, in what market, and how would it win? This is a complete strategic sketch in miniature.

### Core Bet
The single assumption this path depends on most. If this assumption is wrong, the path collapses. (One sentence.)

### Key Evidence For
The 2–3 strongest pieces of upstream evidence supporting this path. Reference specific chapter findings.

### Key Evidence Against
The 2–3 strongest pieces of upstream evidence challenging this path. Reference specific chapter findings or tension analysis conflicts.

### What A Scout Should Investigate
The 3–5 most important questions a lightweight research agent should answer to evaluate this path. These should be specific, searchable, and falsifiable — not vague ("is the market attractive?") but targeted ("what is the current ITU spectrum filing queue for LEO constellations in equatorial orbits?").

### Estimated Difficulty
[Low / Medium / High / Very High] — a rough sense of execution complexity relative to the other paths.

### Path Type
[Classify as one of: Full Commit / Phased Entry / Wedge-First / Pivot / Hedge / Grind]

---

## Path 2: [Name]
...

## Path N: [Name]
...

---

## Paths Considered But Excluded

[1–3 directions that were considered but excluded from the enumeration, with a one-sentence reason for each. This prevents the scout phase from re-discovering directions that were already ruled out, and makes the Cartographer's reasoning auditable.]
```

### Output Constraints

- **Exactly 5–6 paths.** Not 3, not 8. Five is the minimum for genuine diversity; six is the maximum before paths start overlapping or becoming speculative. If the evidence only supports 4 genuinely distinct paths, the Cartographer should produce 4 and explain why a 5th would be forced.
- **Each path must be genuinely different.** "Build LEO for Indonesia" and "Build LEO for Saudi Arabia" are not two paths — they are geography variants of one path. Different paths vary on at least one of: product type, customer segment, competitive positioning, business model, or value chain position.
- **Each path must be evidence-grounded.** No invention. Every path must be defensible from the upstream chapter evidence, even if the evidence is thin. The Cartographer must cite specific chapter findings.
- **Paths must span the risk/reward spectrum.** At least one path should be high-risk/high-reward (the "attack the castle dragon" option), at least one should be lower-risk/lower-reward (the "grind boars" option), and the rest should fill the space between. The Cartographer should not produce five variations of the same risk profile.
- **The "What A Scout Should Investigate" section is the most important output.** It directly becomes the scout's brief in Step 2. If the investigation questions are vague, the scouts will produce useless results. These must be specific, searchable, and oriented toward evidence that would either validate or kill the path.

---

## Diversity Enforcement

The biggest failure mode for the Cartographer is producing 5 versions of the same idea with slightly different labels. This happens when the model anchors on the most obvious interpretation of the evidence and generates "paths" that are really just variations on implementation detail.

The prompt enforces diversity through a **dimensional variation requirement**. The Cartographer must vary paths across at least 3 of these 5 strategic dimensions:

| Dimension | What It Means | Samsung LEO Example |
|-----------|--------------|---------------------|
| **Product** | What is built / what service is offered | Full constellation vs. terminal-only vs. gateway infrastructure vs. capacity wholesale |
| **Customer** | Who buys it | MNOs vs. governments vs. maritime vs. enterprise vs. defense |
| **Geography** | Where, and in what sequence | SEA-first vs. Middle East-first vs. Africa vs. global vs. single-country |
| **Value chain position** | Where in the stack the venture competes | Operator vs. infrastructure vendor vs. managed service vs. component supplier |
| **Competitive anchor** | Who you're fighting and how you differentiate | Sovereignty play vs. cost play vs. integration play vs. niche play vs. partnership play |

The Cartographer must explicitly state which dimensions each path varies on relative to Path 1 (the most "obvious" path). If three or more paths share the same position on 4 of 5 dimensions, the Cartographer has failed the diversity requirement.

---

## Model Assignment

**Claude Opus 4.6.** The Cartographer requires the same level of reasoning quality as the V1 Bull — it must read three full chapters, understand cross-chapter tensions, and produce strategically coherent path sketches. This is not a summarization task; it requires genuine strategic reasoning about what the evidence *could* support, not just what it most obviously supports.

Using a different model (e.g., Gemini) for diversity was considered, but the Cartographer's job is analytical completeness, not creative divergence. The diversity enforcement mechanism is structural (dimensional variation), not model-dependent.

---

## Prompt Template

```
SYSTEM:
You are the Path Cartographer — a strategic scenario planner for an investment analysis platform. You have access to three upstream analytical chapters about a venture opportunity and three cross-chapter tension analyses.

Your job is NOT to recommend a path. Your job is to ENUMERATE every credible strategic direction the evidence supports. You are the person who draws the map before the army moves. You must find 5–6 genuinely distinct paths — not 5 variations of the same idea with different labels.

Think of yourself as an experienced venture strategist who has seen hundreds of opportunities. For any given evidence base, there are always multiple ways to interpret it, multiple markets to enter, multiple products to build, multiple competitive positions to take. Your job is to find ALL of them, not just the most obvious one.

DIVERSITY RULES (critical):
- Paths must vary across at least 3 of 5 strategic dimensions: product, customer, geography, value chain position, competitive anchor.
- If three or more of your paths share the same position on 4 of 5 dimensions, you have failed. Start over and think harder.
- At least one path must be high-risk/high-reward. At least one must be lower-risk/lower-reward. At least one must be a genuine reframe — a direction that requires looking at the evidence from a non-obvious angle.
- "Build X for Indonesia" and "Build X for Saudi Arabia" are NOT two paths. They are geography variants. A real difference changes what you build, who you serve, or how you compete.
- Include at least one path that most analysts would dismiss as too conservative, and at least one that most would dismiss as too ambitious. The scout phase exists to test whether those dismissals are justified.

EVIDENCE RULES:
- Every path must be grounded in specific findings from the upstream chapters. No invention.
- Cite the chapter and finding when listing evidence for/against.
- A path supported by thin evidence is still valid — but label it as thin. The scout's job is to find more evidence, not yours.
- If a tension analysis reveals a genuine fork in the evidence (e.g., demand is real but the market is too small for the obvious approach), that fork is a path-generation signal. Follow it.

INVESTIGATION QUESTION RULES:
- The "What A Scout Should Investigate" questions are the single most important part of your output. They become the scout's research brief.
- Questions must be specific and searchable. "Is the market attractive?" fails. "What is the current pricing for wholesale MEO/GEO capacity from SES and Eutelsat, and at what $/Mbps/month does a resale model break even?" succeeds.
- Questions should be oriented toward validation or falsification. A good question has an answer that either strengthens or kills the path.
- 3–5 questions per path. Quality over quantity.

OUTPUT RULES:
- Produce exactly 5–6 paths. If the evidence genuinely only supports 4, produce 4 and explain why.
- Each path gets a short, evocative name (not generic labels like "Option A").
- Keep each path sketch concise: the full thesis in 3–5 sentences, not paragraphs.
- Include a "Paths Considered But Excluded" section to prevent scouts from re-discovering dead ends.
- Frame evidence strength as "evidence weight" (strong / moderate / thin / absent), not probability percentages.
- Keep total output under 3000 words.

USER:
## Demand Validation Chapter
{demand_validation_full_text}

## Market Research Chapter
{market_research_full_text}

## Competitor Analysis Chapter
{competitor_analysis_full_text}

## Cross-Chapter Tension Analyses

### Demand Validation × Market Research
{tension_1a_output}

### Demand Validation × Competitor Analysis
{tension_1b_output}

### Market Research × Competitor Analysis
{tension_1c_output}

{optional_user_context}

## Your Task

Enumerate 5–6 genuinely distinct strategic paths this venture could take. Use the output structure defined in your instructions. Remember: you are drawing the map, not choosing the route.
```

---

## Expected Output For Samsung LEO Test Case

Based on the Samsung LEO evidence in the existing passport and upstream chapters, the Cartographer should produce paths roughly like:

1. **"The Sovereignty Fortress"** — Full-commit sovereign LEO constellation for SEA/MENA. The V1 passport's primary path. High-risk, high-reward. Core bet: Samsung can solve the launch bottleneck.

2. **"The Ground Game"** — Skip the constellation. Build and sell the Gateway-in-a-Box as infrastructure-as-a-service to *existing* LEO operators (OneWeb, Kuiper) who need sovereign-compliant ground segments but don't want to build them country by country. Core bet: the gateway is the real bottleneck, not the constellation. Varies on: product (infrastructure, not service), value chain (vendor, not operator), competitive anchor (complementary, not rival).

3. **"Terminal Arms Dealer"** — Samsung Semiconductor builds and sells flat-panel ESA terminals and payload silicon to every non-U.S. LEO operator. Don't operate a constellation; own the hardware layer. Core bet: vertical integration in silicon gives Samsung a cost moat that's more defensible than a constellation. Varies on: product, value chain, customer.

4. **"The MNO Trojan Horse"** — Use Samsung Networks' existing MNO relationships to sell hybrid terrestrial-satellite backhaul as a managed service, using *wholesale capacity from existing LEO/MEO operators* rather than building Samsung's own constellation. Start generating revenue in 12–18 months, not 5–7 years. Core bet: the MNO pain is urgent enough that they'll buy a Samsung-branded service riding someone else's satellites. Varies on: product (managed service), competitive anchor (speed to market), risk profile (much lower).

5. **"The Maritime Corridor"** — Narrow the scope to maritime and offshore energy only (Malacca Strait, South China Sea, Arabian Gulf). Smaller constellation (~200 satellites), tighter geography, fewer regulatory regimes, simpler ground segment. Core bet: maritime is the most underserved segment and the fastest path to revenue per satellite. Varies on: customer, geography, product scope.

6. **"The Sovereign Cloud Stack"** — Reframe entirely. The real opportunity isn't satellite connectivity — it's sovereign digital infrastructure. Build the ground segment, network management, and compliance layer as a software platform that works with ANY satellite provider. Own the "sovereign orchestration" layer. Core bet: sovereignty compliance is a software and policy problem, not a space hardware problem. Varies on: product (software, not hardware), value chain (platform, not operator), competitive anchor (regulatory moat, not tech moat).

### Quality Checks For Samsung LEO

- [ ] At least 5 paths produced
- [ ] No two paths are geography variants of the same strategy
- [ ] At least one path is genuinely conservative (e.g., Path 4, revenue in 12–18 months)
- [ ] At least one path is a non-obvious reframe (e.g., Path 6, software platform)
- [ ] Every path cites specific upstream evidence
- [ ] Investigation questions are specific and searchable, not vague
- [ ] "Paths Considered But Excluded" section is present
- [ ] Dimensional variation requirement is met (3+ dimensions varied across the set)
- [ ] No evidence weight expressed as probability percentages
- [ ] Total output under 3000 words

---

## Integration With Existing Codebase

### New Files

| File | Purpose |
|------|---------|
| `src/pipeline/cartographer.js` | Cartographer agent — prompt construction and LLM call |
| `src/pipeline/prompts.js` | Add `CARTOGRAPHER_SYSTEM` prompt and `cartographer()` prompt builder (append to existing file) |
| `src/pipeline/agents.js` | Add `'1.5a'` agent metadata entry (append to existing file) |

### Modified Files

| File | Change |
|------|--------|
| `src/pipeline/orchestrator.js` | Insert Step 1.5 between Step 1 completion and Step 2 start. The Cartographer runs after all three tension analyses complete and before any downstream agent begins. |
| `src/components/PipelineProgress.jsx` (or equivalent) | Add UI state for the Cartographer step. Display path enumeration results when complete. |

### Agent Metadata Addition

```javascript
// Add to AGENT_META in agents.js
'1.5a': {
  name: 'Path Cartographer',
  role: 'Strategic scenario planner',
  model: 'Claude Opus 4.6',
  description: 'Enumerating 5–6 distinct strategic paths from the upstream evidence before evaluation begins.',
},
```

### Prompt Builder Addition

```javascript
// Add to prompts.js
cartographer: ({ demval, marketResearch, competitorAnalysis, tension1a, tension1b, tension1c, userContext }) => ({
  system: CARTOGRAPHER_SYSTEM,
  user: `## Demand Validation Chapter

${demval}

## Market Research Chapter

${marketResearch}

## Competitor Analysis Chapter

${competitorAnalysis}

## Cross-Chapter Tension Analyses

### Demand Validation × Market Research
${tension1a}

### Demand Validation × Competitor Analysis
${tension1b}

### Market Research × Competitor Analysis
${tension1c}

${optionalContext(userContext)}

## Your Task

Enumerate 5–6 genuinely distinct strategic paths this venture could take. Use the output structure defined in your instructions. Remember: you are drawing the map, not choosing the route.`,
}),
```

### Pipeline Execution Change

```
// Current V1 flow in orchestrator:
// Step 1 (parallel) → Step 2a (Bull) → Step 2b (Bear) → ...

// New V2 flow:
// Step 1 (parallel) → Step 1.5a (Cartographer) → Step 2 (Scouts — future spec) → ...
```

The Cartographer is a **blocking sequential call** — it must complete before scouts can begin, since its output defines the scout briefs. Estimated wall time: 30–60 seconds (single Opus call with ~80K input tokens).

---

## Estimated Cost

| Component | Tokens (approx) | Cost (approx) |
|-----------|-----------------|---------------|
| Input: 3 chapters + 3 tensions + context | ~80K input | ~$1.20 |
| Output: 5–6 path sketches (~3000 words) | ~4K output | ~$0.60 |
| **Total per run** | | **~$1.80** |

Added to V1's existing ~$8–12 per run, this is marginal. The real cost increase comes in Step 2 (Scouts), not here.

---

## What This Unblocks

| Downstream | Status |
|------------|--------|
| Avalon V2 Step 2 — Scout specification | Needs Cartographer output schema (defined above) |
| Avalon V2 Step 3 — War Table specification | Needs Cartographer + Scout output schemas |
| V2.5 — User path clarification (interactive questions before scouting) | Needs Cartographer output to know what to ask about |

### What This Does NOT Do

- Does not evaluate or rank paths (that's the War Table's job in Step 3)
- Does not conduct research on paths (that's the Scouts' job in Step 2)
- Does not interact with the user (that's V2.5)
- Does not replace the V1 passport output — the expanded passport is produced by the War Table in Step 3
- Does not modify Step 1 tension analyses in any way

---

## Open Questions For Review

1. **Should the Cartographer see the user's Strategic Context (success criteria, blocking questions)?** Current design says yes — it helps the Cartographer generate paths that address the client's actual constraints. But it could also anchor the Cartographer toward "safe" paths that fit the client's stated goals. The counterargument: the point of path diversity is to surface options the client hasn't considered, and the client's stated criteria might rule those out prematurely.

   **Current recommendation:** Include Strategic Context, but add a prompt instruction that says "Generate at least one path that challenges or reframes the client's stated success criteria."

2. **Should the Cartographer produce a confidence estimate per path?** Current design says no — confidence is the War Table's job after scouts return. The Cartographer only knows what the upstream evidence says, not what the scouts will find. But a rough prior ("this path looks well-supported" vs. "this is speculative") could help prioritize scout effort.

   **Current recommendation:** Use the existing "evidence weight" framing per path (via Key Evidence For/Against), not a separate confidence score. The scout prioritization logic can infer confidence from evidence density.

3. **What happens if the evidence only supports 2–3 genuinely distinct paths?** Some ventures are narrower than Samsung LEO. A niche B2B SaaS might not have 5 credible strategic directions.

   **Current recommendation:** Allow 4 as a minimum. If fewer than 4, the Cartographer must explain why and the pipeline should flag this to the user as a sign of either narrow opportunity or incomplete upstream evidence.

4. **Path naming convention.** The evocative names ("The Sovereignty Fortress") are useful for human readability and for the DnD framing that resonates with Daniel. But they could introduce bias in the scout and War Table phases if the name implies a judgment. "The Long Shot" is less likely to be selected than "The Dark Horse" even if the evidence is identical.

   **Current recommendation:** Keep evocative names (they make the output memorable and shareable) but add a neutral Path ID (P1, P2, ...) that downstream agents reference instead of the name. Scout and War Table prompts should reference paths by ID only.
