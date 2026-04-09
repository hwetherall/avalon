# Avalon V2 — Step 3: The War Table + Assembly

**Version:** 0.1 (Draft)
**Last updated:** 2026-04-09
**Owner:** Harry
**Status:** Design — ready for review
**Depends on:** Avalon V2 Step 1 (Path Cartographer), Avalon V2 Step 2 (Scouts)

---

## What Step 3 Does

Step 3 is the final phase of the Avalon V2 pipeline. It takes the scouts' field reports, evaluates all paths comparatively, presents the results to the user with an Innovera recommendation, pauses for user selection, then stress-tests the chosen path through a full adversarial debate before producing the Information Passport.

Step 3 has two halves separated by a **user interaction gate**:

**Pre-Selection (automated):**
- War Table agent reads all field reports and produces a ranked comparison
- UI presents the ranked paths to the user with evidence summaries
- Innovera recommends a path but the user decides

**Post-Selection (triggered by user):**
- Focused Bull/Bear/Rebuttal debate on the chosen path
- Synthesizer resolves the debate
- Final Assembly produces the V2 Information Passport

### The DnD Analogy Completed

The scouts returned from their expeditions. The war council (War Table) spreads the reports across the table, compares them, and tells the king: "The castle has the best treasure but the dragon is fierce, the caves are dark and uncertain, and the forest is slow but safe. We recommend the caves — here's why." The king listens, considers, and says "No, we're going for the castle." The council then war-games the castle assault in detail (adversarial debate), identifies every risk and contingency, and produces the battle plan (Information Passport).

---

## Where Step 3 Sits In The Avalon V2 Pipeline

```
STEP 1:   Tension Analysis           [3 parallel calls — UNCHANGED]
STEP 1.5: Path Cartographer          [1 call]
STEP 2:   Scouts                     [5–6 parallel research loops]

          ┌──────────────────────────────────────────────────┐
STEP 3a:  │  War Table                [1 call]               │  PRE-SELECTION
          │  └── Comparative evaluation + ranking            │  (automated)
          └──────────────────────────────────────────────────┘
                              │
                              ▼
          ╔══════════════════════════════════════════════════╗
          ║  USER SELECTION GATE                             ║
          ║  UI presents ranked paths → User picks one       ║
          ╚══════════════════════════════════════════════════╝
                              │
                              ▼
          ┌──────────────────────────────────────────────────┐
STEP 3b:  │  Focused Adversarial Debate  [4 calls]          │
          │  ├── Bull (for chosen path)                      │  POST-SELECTION
          │  ├── Bear (against chosen path)                  │  (triggered by
          │  ├── Bull Rebuttal                               │   user choice)
          │  └── Synthesizer                                 │
          ├──────────────────────────────────────────────────┤
STEP 3c:  │  Final Assembly              [1 call]           │
          │  └── V2 Information Passport                     │
          └──────────────────────────────────────────────────┘
```

**Total LLM calls in Step 3:** 6 (1 War Table + 4 debate + 1 assembly)
**User-facing pause:** Between 3a and 3b

---

## Step 3a: The War Table

### Purpose

Read all scout field reports side by side and produce a structured comparative evaluation. The War Table is not picking a winner — it is organizing the evidence so the user can make an informed choice. It does, however, provide the Innovera recommendation (the house's best judgment), because users expect and value a clear steer.

### Model Assignment

**Claude Opus 4.6.** The War Table must reason across 5–6 field reports simultaneously, weigh evidence quality differences, identify cross-path patterns, and produce a coherent ranking. This requires frontier reasoning, not just synthesis.

### Inputs

| Input | Source | Purpose |
|-------|--------|---------|
| Cartographer output (full) | Step 1.5 | Path definitions, names, theses, types |
| All scout field reports (JSON) | Step 2 | Evidence per path |
| Strategic Context | User input (optional) | Client success criteria, blocking questions |
| Upstream chapter titles + executive summaries | Step 1 chapters | Light context without full chapter bulk |

**Why not full upstream chapters?** The War Table's job is to evaluate paths based on *scout evidence*, not re-read the upstream chapters. The Cartographer already distilled the chapters into path sketches. Including full chapters would bloat the context (~80K tokens) and risk the model re-synthesizing from chapters rather than evaluating field reports. Light upstream context (titles + the first paragraph of each chapter) gives enough background for framing.

**Handling missing field reports:** If a scout failed (null report), the War Table must note the path as "uninvestigated" in its comparison. Uninvestigated paths are neither ranked nor excluded — they're flagged as insufficient data.

### Prompt Template

```
SYSTEM:
You are the War Table — a strategic evaluation panel for an investment analysis platform. You have received field reports from scouts who investigated multiple strategic paths for a venture. Your job is to compare all paths side by side and produce a ranked evaluation that helps the decision-maker choose which path to pursue.

You are NOT picking the winner. The decision-maker picks. You are organizing the evidence, highlighting the key tradeoffs, and providing the Innovera recommendation — a clear, justified steer on which path the evidence best supports. The decision-maker may override your recommendation; that's expected and fine.

COMPARISON RULES:
- Evaluate each path on exactly five dimensions:
  1. **Evidence Strength** — How well-supported is this path by scout findings? Mostly strong/moderate evidence, or mostly thin/absent?
  2. **Core Bet Risk** — How likely is the core bet to hold? Did the scout find confirming or disconfirming evidence?
  3. **Execution Complexity** — How hard is this to actually do? Factor in the path type (Full Commit vs. Wedge-First vs. Hedge).
  4. **Reward Ceiling** — If everything goes right, how large is the prize?
  5. **Time to Value** — How long before this path generates meaningful revenue or strategic value?

- For each dimension, assign a rating: Strong / Moderate / Weak / Insufficient Data.
- Do not use probability percentages or confidence scores. Use evidence weight framing.
- Highlight **cross-path patterns** — evidence found by one scout that is relevant to another path (e.g., a regulatory finding that affects multiple paths).
- Highlight **the key tradeoff** — the single most important tension the decision-maker must resolve when choosing (e.g., "speed vs. scale" or "control vs. capital efficiency").

RANKING RULES:
- Rank all investigated paths from most to least recommended.
- Uninvestigated paths (failed scouts) are listed separately as "Not Ranked — Insufficient Data."
- The ranking must have a clear #1 — no ties at the top. If two paths are genuinely close, explain the tiebreaker.
- For each ranked path, provide a 1–2 sentence "elevator pitch" — why someone would choose this path.
- For each ranked path, provide a 1–2 sentence "biggest concern" — the single strongest reason NOT to choose it.

INNOVERA RECOMMENDATION:
- State which path Innovera recommends and why in 3–5 sentences.
- If Strategic Context includes success criteria (revenue targets, timelines), explicitly address whether the recommended path can meet them.
- If the recommended path CANNOT meet stated success criteria, say so honestly and explain the tradeoff (e.g., "Path 4 cannot reach $10B revenue, but it reaches profitability 4 years faster and with 80% less capital at risk").
- If none of the paths are strong, say so. "Proceed with caution" and "Do not pursue" are valid recommendations.

OUTPUT FORMAT:
You must output valid JSON matching the schema below. Do not include markdown formatting, code fences, or any text outside the JSON object.

{
  "venture": "...",
  "paths_evaluated": 6,
  "paths_investigated": 5,
  "key_tradeoff": "One sentence describing the central tension",
  "cross_path_insights": [
    "Insight that spans multiple paths (2–4 items)"
  ],
  "ranking": [
    {
      "rank": 1,
      "path_id": "P1",
      "path_name": "...",
      "elevator_pitch": "Why choose this path (1–2 sentences)",
      "biggest_concern": "Why NOT choose this path (1–2 sentences)",
      "dimensions": {
        "evidence_strength": "Strong | Moderate | Weak | Insufficient Data",
        "core_bet_risk": "Strong | Moderate | Weak | Insufficient Data",
        "execution_complexity": "Strong | Moderate | Weak | Insufficient Data",
        "reward_ceiling": "Strong | Moderate | Weak | Insufficient Data",
        "time_to_value": "Strong | Moderate | Weak | Insufficient Data"
      },
      "scout_highlights": [
        "The 2–3 most important findings from this path's scout report"
      ],
      "red_flags": [
        "Red flags identified by the scout (0–3)"
      ]
    }
  ],
  "uninvestigated_paths": [
    {
      "path_id": "P5",
      "path_name": "...",
      "reason": "Scout failed / timed out"
    }
  ],
  "innovera_recommendation": {
    "recommended_path_id": "P2",
    "recommended_path_name": "...",
    "rationale": "3–5 sentences explaining why this path is recommended",
    "meets_success_criteria": true | false | null,
    "success_criteria_note": "How the path relates to stated criteria (if any)"
  }
}

USER:
## Venture
{venture_name}

## Strategic Context
{strategic_context_or_"None provided"}

## Upstream Chapter Context
### Demand Validation (summary)
{demand_validation_first_paragraph}

### Market Research (summary)
{market_research_first_paragraph}

### Competitor Analysis (summary)
{competitor_analysis_first_paragraph}

## Cartographer's Path Enumeration
{cartographer_output_full}

## Scout Field Reports

### Path 1: {path_1_name}
{path_1_field_report_json}

### Path 2: {path_2_name}
{path_2_field_report_json}

### Path 3: {path_3_name}
{path_3_field_report_json}

### Path 4: {path_4_name}
{path_4_field_report_json}

### Path 5: {path_5_name}
{path_5_field_report_json}

### Path 6: {path_6_name} (if exists)
{path_6_field_report_json_or_"Scout failed — no field report available"}

Evaluate all paths and produce the ranked comparison.
```

### Output Token Estimate

War Table output is structured JSON with ~800–1200 words of content. Approximately 2,000–3,000 output tokens. Input is ~15K–25K tokens (Cartographer output + 6 field reports + context).

---

## User Selection Gate

### What Happens

After the War Table completes, the pipeline **pauses**. The UI presents the War Table's output to the user as an interactive selection interface. The user reviews the ranked paths and picks one. The pipeline resumes only when the user makes a selection.

This is the first interactive pause in Avalon's pipeline. V1 ran straight through with no user input between start and finish.

### UI Design

The selection interface should display:

**Summary bar:**
- Venture name
- Key tradeoff (from War Table)
- Innovera recommendation badge on the recommended path

**Path cards (one per ranked path):**
- Rank number + path name
- Elevator pitch
- Five-dimension rating (visual indicators — e.g., colored dots or small bar chart)
- Scout highlights (expandable)
- Red flags (expandable)
- Biggest concern
- **"Select This Path" button**

**Uninvestigated paths (if any):**
- Shown in a muted section below ranked paths
- "This path could not be investigated — scout failed"
- Option to re-run scout before selecting

**Innovera recommendation callout:**
- Prominent card or banner showing the recommended path with rationale
- Clearly labeled as "Innovera Recommendation" — not "The Answer"

**Override explanation (optional):**
- If the user selects a path other than the Innovera recommendation, a brief text input appears: "Tell us why you prefer this path (optional — helps the debate focus on what matters to you)"
- This override rationale is passed to the adversarial debate as additional context

### State Management

```javascript
// Pipeline state during selection gate
{
  step: '3a.selection',
  status: 'awaiting_user',
  warTableOutput: { ... },           // Full War Table JSON
  selectedPathId: null,               // Set when user clicks
  overrideRationale: null,            // Optional text if user overrides
}

// After user selects:
{
  step: '3b.debate',
  status: 'running',
  selectedPathId: 'P2',
  overrideRationale: 'We have existing relationships in maritime...',
}
```

### What Gets Passed Forward

When the user selects a path, the following is assembled for the adversarial debate:

| Data | Source | Purpose |
|------|--------|---------|
| Selected path's Cartographer sketch | Step 1.5 | Strategic thesis |
| Selected path's scout field report | Step 2 | Real-world evidence |
| War Table ranking + rationale | Step 3a | Comparative context |
| Full upstream chapters (3) | Original input | Evidence base for debate |
| Tension analyses (3) | Step 1 | Cross-chapter insights |
| Strategic Context | User input | Success criteria, constraints |
| Override rationale | User input (optional) | Why user chose this path |
| All other paths (summaries only) | Cartographer | So the debate knows what was rejected and why |

---

## Step 3b: Focused Adversarial Debate

### Purpose

The chosen path has been scouted but not stress-tested. The adversarial debate is the stress test. It adapts V1's Bull → Bear → Rebuttal → Synthesizer flow, but with two critical differences from V1:

1. **The Bull argues for a specific, pre-defined path** (chosen by user), not a path it invents from scratch. The Bull's job is to build the strongest case for THIS path using the upstream evidence AND the scout's field report.

2. **The Bear has scout evidence to use as ammunition.** In V1 the Bear could only attack with upstream chapter evidence. Now the Bear also has the scout's field report — including red flags, evidence gaps, and findings that challenge the path.

### Model Assignments

| Agent | Model | Rationale |
|-------|-------|-----------|
| Bull | Claude Opus 4.6 | Same as V1 — needs to construct a coherent strategic thesis |
| Bear | Gemini 3.1 Pro Preview | Same as V1 — different model for genuine adversarial perspective |
| Rebuttal (Bull) | Claude Opus 4.6 | Same as V1 — refines thesis after Bear attack |
| Synthesizer | Claude Opus 4.6 | Same as V1 — final judgment call |

### 3b-i: Focused Bull

```
SYSTEM:
You are the Bull — a senior investment strategist. You have been assigned a specific strategic path that was selected by the decision-maker after a multi-path evaluation process. Your job is to construct the strongest defensible case for THIS path.

You have access to:
1. The path definition (from the Cartographer)
2. A scout field report with real-world evidence for this path
3. Three upstream analytical chapters (Demand Validation, Market Research, Competitor Analysis)
4. Three cross-chapter tension analyses
5. A brief on what other paths were considered and why this one was selected

You are NOT inventing a strategy from scratch. The strategic direction is set. Your job is to build the strongest case for execution: what makes this path viable, what evidence supports it, what the realistic success scenario looks like, and what conditions must hold.

You may receive an "Override Rationale" explaining why the decision-maker chose this path over the Innovera recommendation. If present, incorporate it — the decision-maker may have information or priorities that the automated analysis missed.

Rules:
- Use BOTH upstream chapter evidence AND scout field report findings. The scout report contains real-world data points the upstream chapters didn't have.
- Cite specific sources from the scout report (URLs where available).
- Frame evidence strength as "evidence weight" (strong / moderate / thin / absent), not probability percentages.
- Your thesis must be internally coherent: product, customer, geography, positioning, and constraints must all fit together.
- Be honest about thin evidence. The scout may have found gaps — acknowledge them as risks to manage, not reasons to abandon.
- Keep your output under 1500 words.

USER:
## Selected Path
**ID:** {selected_path_id}
**Name:** {selected_path_name}
**Thesis:** {selected_path_thesis}
**Core Bet:** {selected_path_core_bet}
**Path Type:** {selected_path_type}

## Why This Path Was Selected
**Innovera recommended:** {recommended_path_name}
**Decision-maker selected:** {selected_path_name}
**Override rationale:** {override_rationale_or_"User selected the Innovera recommendation"}

## Scout Field Report for This Path
{selected_path_field_report_json}

## Other Paths Considered (summaries only)
{other_paths_summary_list}

## War Table Assessment of This Path
**Rank:** {rank}
**Elevator Pitch:** {elevator_pitch}
**Biggest Concern:** {biggest_concern}
**Dimensions:** {dimensions_summary}

## Upstream Chapters
### Demand Validation
{demand_validation_full_text}

### Market Research
{market_research_full_text}

### Competitor Analysis
{competitor_analysis_full_text}

## Cross-Chapter Tension Analyses
{tension_1a_output}
{tension_1b_output}
{tension_1c_output}

{optional_user_context}

## Your Task

Construct the strongest evidence-backed case for pursuing this specific path. Include ALL of the following:

### Verdict
[Pursue / Pursue with conditions / Pivot recommended / Do not pursue]
3–5 sentences. This must be a decision, not a summary.

### Three Legs Assessment
- **Demand Leg:** [assessment] — Evidence weight: [level]. One sentence.
- **Market Leg:** [assessment] — Evidence weight: [level]. One sentence.
- **Competitive Leg:** [assessment] — Evidence weight: [level]. One sentence.

### Product Definition
What specifically should be built for this path?

### Target Market
- **Customer:** [specific]
- **Segment:** [specific]
- **Geography:** [beachhead markets]
- **Entry Wedge:** [specific]

### Competitive Positioning
Differentiation and right-to-win for this specific path.

### Business Model Framing
[Type and reasoning]

### Critical Constraints
Hard constraints from upstream + any new constraints surfaced by the scout.

### Evidence Gaps
3–5 unknowns. Include BOTH upstream gaps AND gaps identified by the scout.

### Kill Signals
Specific conditions that would mean this path should be abandoned.
```

### 3b-ii: Focused Bear

```
SYSTEM:
You are the Bear — a senior risk analyst. The Bull has constructed a case for a specific strategic path that was selected by a decision-maker. Your job is to attack the thesis systematically.

You have a powerful advantage the Bear in V1 didn't have: a scout field report containing real-world evidence. Use it. If the scout found red flags, amplify them. If the scout found evidence gaps, explain what those gaps mean for the path's viability. If the scout found contradictory evidence, use it to undermine the Bull's narrative.

You also know what OTHER paths were considered. If a rejected path would have avoided a key risk in the chosen path, point that out — the decision-maker should understand the opportunity cost.

Rules:
- Attack specific claims, not generalities. Use both upstream evidence and scout evidence.
- If the decision-maker overrode the Innovera recommendation, test whether their rationale holds up. Do not be deferential to seniority — be deferential to evidence.
- If the Bull's thesis is genuinely strong on a point, concede it.
- Frame evidence strength as "evidence weight" (strong / moderate / thin / absent), not probability percentages.
- Keep your output under 1500 words.

USER:
## Bull's Thesis for Selected Path
{bull_output}

## Scout Field Report
{selected_path_field_report_json}

## Other Paths That Were Available
{other_paths_with_elevator_pitches}

## Upstream Chapters
{demand_validation_full_text}
{market_research_full_text}
{competitor_analysis_full_text}

## Cross-Chapter Tension Analyses
{tension_1a_output}
{tension_1b_output}
{tension_1c_output}

{optional_user_context}

## Your Task

Attack the Bull's thesis. Include ALL of the following:

### Verdict Challenge
Do you agree with the Bull's verdict for this path? If not, what should it be?

### Weakest Links
3–5 weakest elements. For each:
- **What the Bull claims**
- **Why it's weak** (cite scout evidence and upstream chapters)
- **What happens if it fails**

### Scout Red Flags Amplified
Take the scout's red flags and explain their full implications. What does each red flag mean for the path's viability if the worst case materializes?

### Opportunity Cost
What does the decision-maker sacrifice by choosing this path over the alternatives? Name at least one rejected path that avoids a key risk.

### Counter-Scenarios
2–3 realistic scenarios where this path fails.

### The Bear Case
3–5 sentences: the strongest argument against this path.

### Concessions
Where is the Bull genuinely right?
```

### 3b-iii: Focused Rebuttal

The Rebuttal prompt is adapted from V1 with minimal changes. The Bull returns after hearing the Bear's attack, concedes valid points, rebuts invalid ones, and produces a refined thesis. Same structure as V1 — see Avalon V1 CLAUDE.md Step 2c.

**Key addition:** The Rebuttal prompt includes the instruction:

> If the Bear raised a legitimate opportunity cost argument (a rejected path that avoids a key risk), you must address it directly. Either explain why the chosen path is still superior despite that risk, or acknowledge it as a condition to manage.

### 3b-iv: Focused Synthesizer

The Synthesizer prompt is adapted from V1. Same role: read the full debate and produce the definitive recommendation.

**Key differences from V1 Synthesizer:**

1. The Synthesizer knows this path was *chosen by a human*, not just argued by the Bull. This matters: the Synthesizer should not casually overturn the user's selection. If it disagrees, it must explain clearly and present the disagreement as a "proceed with extreme caution" advisory, not a veto.

2. The Synthesizer has scout evidence. Its verdict should reference specific scout findings, not just upstream chapter evidence.

3. The Synthesizer produces output in the same structure as V1's Synthesizer (Verdict, Three Legs, Product Definition, Target Market, etc.) — this keeps it compatible with the Final Assembly prompt.

**Additional prompt instruction:**

```
CONTEXT: This path was selected by the decision-maker from a set of {N} alternatives after reviewing scout field reports and the Innovera recommendation. The decision-maker's choice is not binding on your verdict — but overriding a human decision requires strong, specific evidence. If you agree with the path, say so clearly. If you disagree, explain exactly what evidence would need to change for you to agree, and frame your verdict as a caution, not a reversal.
```

---

## Step 3c: Final Assembly — V2 Information Passport

### Purpose

Produce the V2 Information Passport. This is the document that Primate and downstream pipelines consume. It must be **backward-compatible** with V1's passport schema (Primate expects the same 9-section structure) while adding new V2 content.

### Model Assignment

**Claude Opus 4.6.** Same as V1 — the Assembly agent must produce a polished, structured document from complex multi-source inputs.

### What's New in V2 Assembly

The V2 passport adds two new sections and enriches existing ones:

| Section | V1 | V2 Change |
|---------|-----|-----------|
| Metadata | Venture, client, date, chapters | + **Path selection method** (multi-path evaluation) |
| 1. Opportunity Verdict | Single verdict | Same structure, but informed by scout evidence |
| 2. Strategic Direction | Single direction | Same structure, for the chosen path |
| 3. Critical Constraints | From upstream chapters | + Constraints surfaced by scout |
| 4. Cross-Chapter Risks | From tension analyses | + Risks from scout red flags |
| 5. Evidence Gaps | From upstream | + Gaps from scout + gaps in rejected paths |
| 6. Unresolved Contradictions | From debate | Same |
| 7. Kill Signals | From debate | + Kill signals from scout evidence |
| **8. Path Context** (NEW) | N/A | **Why this path was chosen, what was rejected, and why** |
| 9. Strategic Alternative | Creative's alternative (V1) | **Replaced by the #2 ranked path from War Table** |
| 10. Downstream Brief: P&T | Scope, context, constraints, priority Qs | Enriched with scout findings relevant to P&T |

### Section 8: Path Context (NEW)

This section gives downstream consumers transparency into the multi-path evaluation. Primate, in particular, benefits from knowing what alternatives exist — if the chosen path hits a wall during deep research, understanding the runner-up helps Primate flag when a pivot might be warranted.

```markdown
## 8. Path Context

### Evaluation Method
Multi-path evaluation: {N} strategic paths identified by the Path Cartographer,
each investigated by an independent research scout, then ranked by the War Table.

### Chosen Path
**{path_name}** (Rank #{rank} of {N})
Selected by: [Decision-maker / Innovera recommendation aligned]
{Override rationale if user overrode recommendation}

### Paths Considered
| Rank | Path | Type | Verdict | Key Reason For | Key Reason Against |
|------|------|------|---------|----------------|-------------------|
| 1 | ... | ... | ... | ... | ... |
| 2 | ... | ... | ... | ... | ... |
| ... | ... | ... | ... | ... | ... |

### Runner-Up Path
**{runner_up_name}** — {elevator pitch}
If the chosen path encounters a kill signal during downstream analysis, this path
should be evaluated as the primary fallback. Key differences from chosen path: {differences}.

### Key Tradeoff
{War Table's key tradeoff statement — the central tension the decision-maker resolved}
```

### Section 9: Strategic Alternative (Modified)

In V1, this section contained the Creative agent's alternative. In V2, the Creative agent no longer runs (its role is absorbed by the Cartographer, which produces multiple paths). Instead, Section 9 contains the **#2 ranked path from the War Table** as the formal strategic alternative.

This is more useful than the V1 Creative because:
- The #2 path has been scouted (real evidence, not armchair speculation)
- It has been comparatively evaluated (the War Table ranked it)
- It provides a concrete fallback if the chosen path fails

### Assembly Prompt Template

```
SYSTEM:
You are the final assembly agent for Avalon V2, Innovera's opportunity synthesis engine. Your job is to produce the V2 Information Passport — a structured strategic directive consumed by downstream analysis pipelines (primarily Primate, the P&T research engine).

You have access to:
1. The Synthesizer's definitive recommendation for the chosen path (PRIMARY source)
2. The War Table's ranked comparison of all paths (for Section 8: Path Context and Section 9: Strategic Alternative)
3. The chosen path's scout field report (for enriching evidence gaps, risks, and the P&T brief)
4. The three raw upstream chapters (for reference and the P&T brief)
5. Strategic Context from the client intake (if provided)

V2 ASSEMBLY RULES:
- The passport must follow the V2 schema (Sections 1–10). Sections 1–7 and 10 are structurally identical to V1. Sections 8 and 9 are new/modified.
- Section 8 (Path Context) is YOUR unique contribution. The Synthesizer did not produce this. Build it from the War Table output and Cartographer data.
- Section 9 (Strategic Alternative) contains the #2 ranked path from the War Table, not a Creative agent's output.
- Section 10 (Downstream Brief: P&T) must incorporate specific scout findings that are relevant to P&T research scope. If the scout found concrete data points (pricing, technical specs, regulatory requirements, patent information), these should flow into the P&T brief as "preliminary evidence" with source URLs.
- Scout evidence with URLs should be cited in the passport. Downstream teams should be able to follow these sources.

CRITICAL V1 COMPATIBILITY:
- Primate consumes Sections 2, 3, and 10 (renamed from Section 9 in V1). The field names and structure of these sections MUST match V1's schema exactly: Scope Directive, Context Package, Constraint Set, Priority Questions, Inherited Evidence Gaps, Kill Signal Translation.
- Evidence weight framing: strong / moderate / thin / absent. No probability percentages.
- Verdict options: Pursue / Pursue with conditions / Pivot recommended / Do not pursue.

GENERAL RULES:
- Tighten language for an executive audience. Remove debate-stage reasoning.
- Do not pad with generic advice. Every sentence must contain specific information.
- Consolidate and deduplicate across the Synthesizer's output and scout findings.
- Assign IDs to constraints (CC-N), risks (CR-N), evidence gaps (EG-N), and kill signals (KS-N). Cross-reference between sections.

USER:
## Synthesizer's Recommendation
{synthesizer_output}

## War Table Ranking
{war_table_output_json}

## Scout Field Report (Chosen Path)
{chosen_path_field_report_json}

## Cartographer's Full Path Enumeration
{cartographer_output}

## Demand Validation Chapter
{demand_validation_full_text}

## Market Research Chapter
{market_research_full_text}

## Competitor Analysis Chapter
{competitor_analysis_full_text}

{optional_user_context}

## Your Task

Produce the V2 Information Passport using EXACTLY this structure:

---

# Avalon Information Passport (V2)

## Metadata
- **Venture:** [name]
- **Client:** [company]
- **Generated:** [timestamp]
- **Upstream chapters used:** Demand Validation, Market Research, Competitor Analysis
- **Path evaluation:** {N} paths identified, scouted, and ranked. Decision-maker selected: {path_name}.
- **Pipeline version:** Avalon V2 (multi-path)

## 1. Opportunity Verdict
**Verdict:** [Pursue / Pursue with conditions / Pivot recommended / Do not pursue]

[3–5 sentence reasoning, informed by both upstream chapters and scout evidence]

### Three Legs
- **Demand:** [assessment] — Evidence weight: [level]. [One sentence.]
- **Market:** [assessment] — Evidence weight: [level]. [One sentence.]
- **Competitive:** [assessment] — Evidence weight: [level]. [One sentence.]

## 2. Strategic Direction
[Same sub-structure as V1: Product Definition, Target Market, Competitive Positioning, Business Model Framing]

## 3. Critical Constraints
[Numbered list with IDs: CC-1, CC-2, ... Include any new constraints surfaced by scout evidence.]

## 4. Cross-Chapter Risks
[Each with ID, title, source, severity. Include risks from scout red flags.]

## 5. Evidence Gaps
[Table with IDs: EG-1, EG-2, ... Include gaps from both upstream AND scout evidence gaps.]

## 6. Unresolved Contradictions
[Same as V1]

## 7. Kill Signals
[Numbered with IDs: KS-1, KS-2, ... Include any kill conditions surfaced by scout evidence.]

## 8. Path Context
[NEW — see schema above. Built from War Table output.]

## 9. Strategic Alternative
[#2 ranked path from War Table with scout evidence summary. Replace V1's Creative section.]

## 10. Downstream Brief: Product & Technology
[Same sub-structure as V1 Section 9: Scope Directive, Context Package, Constraint Set, Priority Questions, Inherited Evidence Gaps, Kill Signal Translation. ENRICHED with scout findings.]
```

---

## Cost and Time Estimates

### Pre-Selection (Step 3a)

| Component | LLM Calls | Cost | Wall Time |
|-----------|-----------|------|-----------|
| War Table | 1 (Opus) | ~$1.50 | ~30s |
| **Subtotal** | **1** | **~$1.50** | **~30s** |

### User Selection Gate

| Component | Wall Time |
|-----------|-----------|
| User reviews and selects | **Variable** (seconds to hours) |

### Post-Selection (Steps 3b + 3c)

| Component | LLM Calls | Cost | Wall Time |
|-----------|-----------|------|-----------|
| Bull | 1 (Opus) | ~$1.20 | ~25s |
| Bear | 1 (Gemini) | ~$0.80 | ~20s |
| Rebuttal | 1 (Opus) | ~$1.00 | ~25s |
| Synthesizer | 1 (Opus) | ~$1.20 | ~25s |
| Assembly | 1 (Opus) | ~$1.50 | ~30s |
| **Subtotal** | **5** | **~$5.70** | **~125s** |

### Full Avalon V2 Pipeline

| Step | Cost | Wall Time (automated) |
|------|------|-----------------------|
| Step 1: Tension Analysis | ~$2.00 | ~20s |
| Step 1.5: Cartographer | ~$1.80 | ~40s |
| Step 2: Scouts (6 parallel) | ~$3.10 | ~45s |
| Step 3a: War Table | ~$1.50 | ~30s |
| *User selection gate* | — | *Variable* |
| Step 3b: Adversarial Debate | ~$4.20 | ~95s |
| Step 3c: Assembly | ~$1.50 | ~30s |
| **Total** | **~$14.10** | **~260s automated** |

Compare to V1: ~$8–12, ~90–180s. V2 adds ~$4–6 and ~80–120 seconds of automated compute, plus the user selection pause. The user gets dramatically more value: 5–6 evaluated paths with scout evidence, a ranked comparison, and the chosen path still gets the full adversarial treatment.

---

## Integration With Existing Codebase

### New Files

| File | Purpose |
|------|---------|
| `src/pipeline/warTable.js` | War Table agent — prompt construction, LLM call, JSON parse |
| `src/pipeline/debate.js` | Focused adversarial debate — Bull, Bear, Rebuttal, Synthesizer (adapted from V1's sequential calls in orchestrator) |
| `src/pipeline/assemblyV2.js` | V2 Assembly agent — extended passport production |
| `src/components/PathSelection.jsx` | User selection UI — path cards, ranking display, override input |
| `src/pipeline/prompts.js` | Add War Table, Focused Bull/Bear/Rebuttal/Synthesizer, and V2 Assembly prompt templates |
| `src/pipeline/agents.js` | Add agent metadata for 3a, 3b-i through 3b-iv, 3c |

### Modified Files

| File | Change |
|------|--------|
| `src/pipeline/orchestrator.js` | Major refactor. Pipeline now has two phases with a pause in between. Pre-selection phase runs Steps 1 → 1.5 → 2 → 3a automatically. Post-selection phase runs Steps 3b → 3c when triggered by user. |
| `src/components/PipelineView.jsx` | Add War Table step display. Add "awaiting selection" state that renders `PathSelection.jsx`. Add post-selection debate steps. |
| `src/components/PassportView.jsx` | Render V2 passport schema (new Sections 8, 9, 10). Handle Section 8 Path Context display with expandable path table. |
| `src/App.jsx` | Pipeline state management: handle the pre/post selection lifecycle. |

### Agent Metadata Additions

```javascript
// Add to AGENT_META in agents.js
'3a': {
  name: 'War Table',
  role: 'Strategic evaluation panel',
  model: 'Claude Opus 4.6',
  description: 'Comparing all scouted paths and producing a ranked recommendation.',
},
'3b-i': {
  name: 'Focused Bull',
  role: 'Senior investment strategist',
  model: 'Claude Opus 4.6',
  description: 'Building the strongest case for the chosen path using scout evidence.',
},
'3b-ii': {
  name: 'Focused Bear',
  role: 'Senior risk analyst',
  model: 'Gemini 3.1 Pro',
  description: 'Attacking the chosen path — using scout red flags and opportunity cost analysis.',
},
'3b-iii': {
  name: 'Focused Rebuttal',
  role: 'Senior investment strategist',
  model: 'Claude Opus 4.6',
  description: 'Refining the thesis after the Bear\'s attack on the chosen path.',
},
'3b-iv': {
  name: 'Focused Synthesizer',
  role: 'Investment committee judge',
  model: 'Claude Opus 4.6',
  description: 'Producing the definitive recommendation for the chosen path.',
},
'3c': {
  name: 'V2 Assembly',
  role: 'Document assembly',
  model: 'Claude Opus 4.6',
  description: 'Producing the V2 Information Passport with path context and scout evidence.',
},
```

### Orchestrator Refactor

The orchestrator changes from a single `runPipeline()` to a two-phase architecture:

```javascript
// Phase 1: Automated pre-selection
async function runPreSelection(chapters, userContext) {
  // Step 1: Tension analyses (unchanged)
  const tensions = await runTensionAnalyses(chapters, userContext)

  // Step 1.5: Cartographer
  const paths = await runCartographer(chapters, tensions, userContext)

  // Step 2: Scouts
  const fieldReports = await runAllScouts(paths)

  // Step 3a: War Table
  const warTableOutput = await runWarTable(paths, fieldReports, chapters, userContext)

  return {
    tensions,
    paths,
    fieldReports,
    warTableOutput,
    status: 'awaiting_selection',
  }
}

// Phase 2: Triggered by user selection
async function runPostSelection(preSelectionState, selectedPathId, overrideRationale) {
  const { tensions, paths, fieldReports, warTableOutput } = preSelectionState
  const chosenPath = paths.find(p => p.id === selectedPathId)
  const chosenReport = fieldReports.find(r => r.pathId === selectedPathId)

  // Step 3b: Focused adversarial debate
  const bull = await runFocusedBull(chosenPath, chosenReport, warTableOutput, ...)
  const bear = await runFocusedBear(bull, chosenReport, paths, ...)
  const rebuttal = await runFocusedRebuttal(bull, bear, ...)
  const synthesizer = await runFocusedSynthesizer(bull, bear, rebuttal, ...)

  // Step 3c: V2 Assembly
  const passport = await runV2Assembly(synthesizer, warTableOutput, chosenReport, ...)

  return { passport }
}
```

---

## Pipeline Guardrails (Apply to ALL V2 Agents)

These carry forward from V1 and apply to every agent in the V2 pipeline:

1. **No confidence scores.** Evidence weight only: strong / moderate / thin / absent. The CEO has a strong aversion to probability percentages.

2. **Verdict-first patterns.** Every agent that produces a recommendation leads with the verdict, then explains.

3. **Specificity over hedging.** "Target Tier-1 MNOs in Indonesia for wholesale LEO backhaul" is correct. "Explore opportunities in multiple markets" is wrong.

4. **Gap disclosure is structural.** Evidence gaps are a required output section in every agent that produces a recommendation.

5. **Separation of concerns.** Each agent has one job. The War Table compares. The Bull argues for. The Bear attacks. The Synthesizer decides. The Assembly documents.

6. **No invention.** Claims must trace to upstream chapters, tension analyses, or scout field reports. No new facts.

7. **Scout evidence must be cited with sources.** Unlike upstream chapters (which are internal), scout evidence comes from the web and should carry URLs so downstream teams can verify.

---

## What This Completes

With Steps 1, 2, and 3 specified, the full Avalon V2 pipeline is architecturally complete:

```
Input: 3 upstream chapters + optional context
  │
  ├── Step 1:   Tension Analysis (3 parallel) ────────── [V1, unchanged]
  ├── Step 1.5: Path Cartographer ─────────────────────── [V2 Step 1 spec]
  ├── Step 2:   Scouts (5–6 parallel research loops) ──── [V2 Step 2 spec]
  ├── Step 3a:  War Table + ranking ───────────────────── [V2 Step 3 spec]
  │
  ╠══ USER SELECTION GATE ══╣
  │
  ├── Step 3b:  Focused adversarial debate (4 calls) ──── [V2 Step 3 spec]
  ├── Step 3c:  V2 Assembly ───────────────────────────── [V2 Step 3 spec]
  │
Output: V2 Information Passport (backward-compatible with Primate)
```

### What V2 Does NOT Include (V2.5+)

- **Interactive path clarification before scouting** (V2.5 — Daniel's idea: prompt user with a few questions between Cartographer and Scouts to refine paths)
- **Re-running scouts with adjusted investigation questions** (V2.5 — let user modify scout briefs)
- **Multiple path selection** (V3 — user selects 2–3 paths for parallel deep evaluation)
- **Chapter-specific downstream briefs beyond P&T** (deferred, as in V1)
- **LDM-specific logic** (deferred, as in V1)
- **Persistent storage of War Table comparisons and field reports** (V2.5)
- **Feedback loop from Primate back to Avalon** (V3 — if Primate hits a kill signal, trigger re-evaluation)

---

## Test Case: Samsung LEO (Fenced)

This section exists solely for validation. It should not influence the design of any Step 3 component.

### Expected War Table Behavior

Given the 6 paths from the Samsung Cartographer output and assuming scouts return reasonable field reports:

- The War Table should rank paths differently depending on whether the Strategic Context includes the $10B revenue target (which eliminates lower-revenue paths) or not
- The key tradeoff should be something like "capital commitment vs. speed to revenue" or "vertical control vs. capital efficiency"
- At least one cross-path insight should note that multiple paths depend on Samsung Semiconductor's terminal manufacturing capability (a shared dependency)
- The Innovera recommendation should NOT automatically be Path 1 (the full constellation) — the War Table should genuinely evaluate based on evidence weight

### Expected Debate Behavior

If the user selects a path other than the Innovera recommendation:
- The Bear should specifically address the opportunity cost of rejecting the recommended path
- The Synthesizer should note the override and evaluate whether the user's rationale holds

### Quality Checks (apply to any venture)

- [ ] War Table produces a clear #1 ranking with no ties
- [ ] All five evaluation dimensions are rated for each investigated path
- [ ] Innovera recommendation includes explicit reference to success criteria (if provided)
- [ ] Uninvestigated paths (failed scouts) are listed but not ranked
- [ ] User selection gate pauses the pipeline and waits for input
- [ ] Post-selection debate references scout evidence (not just upstream chapters)
- [ ] Bear raises opportunity cost of rejected paths
- [ ] Synthesizer acknowledges user's selection and provides appropriate deference or pushback
- [ ] V2 passport contains all 10 sections
- [ ] Section 8 (Path Context) includes the paths considered table
- [ ] Section 9 (Strategic Alternative) contains the #2 ranked path, not a Creative output
- [ ] Section 10 (P&T Brief) includes scout findings with source URLs
- [ ] V2 passport's Sections 2, 3, and 10 are structurally compatible with Primate's input schema
- [ ] No agent output contains probability percentages or confidence scores
- [ ] Total post-selection wall time < 150 seconds
- [ ] Total post-selection cost < $7.00
