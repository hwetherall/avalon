# Primate — Build Specification

**Version:** 1.0
**Last updated:** 2026-04-08
**Owner:** Harry
**Status:** Ready to build (Avalon V1 complete — dependency cleared)

---

## What Primate Is

Primate is a standalone Python CLI research engine that produces structured evidence packages for the Product & Technology chapter of an Innovera analysis memorandum. It runs **6 parallel research tracks** targeting the specific technical, architectural, regulatory, IP, and talent evidence that the P&T chapter's 42 analytical questions require.

Primate is NOT the Gorilla. The Gorilla produces a single monolithic 40–60 page report through free-roaming iterative research. Primate produces **6 independent, lightweight evidence packages** — each scoped to a specific research domain, each structured for direct consumption by the MAAP pipeline's Analyst layer.

### Why Primate Exists

The Product & Technology chapter has a fundamentally different evidence profile than Demand Validation or Market Research. DemVal/MR questions are outward-facing (market signals, customer pain, analyst coverage) — the public web is rich with this material. P&T questions are overwhelmingly inward-facing (architecture, maturity, validation evidence, IP). For ~80% of Innovera's clients (early-stage, pre-product), the venture itself has almost no internal artifacts to inspect. Primate's job is to **build the reference knowledge base that lets analysts reason about what building this product would require**, given the strategic direction established by Avalon.

### Where Primate Sits in the Pipeline

```
Opportunity Validation Bundle
├── Demand Validation      ─┐
├── Market Research         ├─→ AVALON ─→ Information Passport
└── Competitor Analysis    ─┘                    │
                                                 ▼
                                    PRIMATE (this tool)
                                    ├── Track 1: Tech State-of-the-Art
                                    ├── Track 2: Reference Architecture
                                    ├── Track 3: Component & Dependency
                                    ├── Track 4: Regulatory & Standards
                                    ├── Track 5: Patent & IP Landscape
                                    └── Track 6: Talent & Capability
                                                 │
                                                 ▼
                                    P&T Chapter MAAP Pipeline
                                    (Analyst → Associate → Partner)
```

---

## Inputs

Primate requires two inputs and accepts one optional input:

### 1. Avalon Information Passport (REQUIRED)

The full passport markdown, specifically:
- **Section 2 — Strategic Direction**: Product definition, target market, competitive positioning. Tells Primate *what product* to research.
- **Section 3 — Critical Constraints**: Hard boundaries (e.g., "no SpaceX launch providers"). Tells Primate what to *exclude*.
- **Section 9 — Downstream Brief: P&T**: Scope directive (in/out), context package, constraint set, priority questions (pre-mapped to tracks), inherited evidence gaps, kill signal translations. This is the primary steering input for the Smart Planner.

### 2. Venture Brief (REQUIRED)

The original venture description submitted by the client. Provides:
- Parent company identity and capabilities (critical for Track 6 and organizational capability questions)
- Technology domain description (even if vague — "AI-powered scent detection" is enough to seed research)
- Any technical claims or specifications mentioned by the client

### 3. Client Documents (OPTIONAL)

Any supplementary documents the client has provided — pitch decks, technical briefs, architecture sketches, patent filings. In Low Data Mode (~80% of clients), this will be empty or minimal. When present, these inform the Smart Planner's research targeting but do NOT replace web research.

---

## Tool Stack

| Tool | Purpose | API | Cost |
|------|---------|-----|------|
| GPT Researcher | Iterative deep research with multi-step planning | pip package (installed) | Uses LLM + Tavily costs |
| Tavily | Web search backend for GPT Researcher + standalone queries | REST API | ~$0.01/search |
| Semantic Scholar | Academic paper search (titles, abstracts, citations, metadata) | REST API (free, no key required for basic) | Free |
| Google Patents | Patent search by keywords, assignee, CPC codes, claim text | Public search (no API key) | Free |
| OpenRouter | LLM access for Smart Planner + per-track synthesis | REST API | Varies by model |

### Model Selection

| Role | Model | Rationale |
|------|-------|-----------|
| Smart Planner | `anthropic/claude-opus-4.6` | Highest reasoning quality for research plan generation |
| Per-Track Synthesis | `openai/gpt-4.1` | Strong summarization, lower cost than Opus for bulk synthesis |
| GPT Researcher internal | `openai/o3` or `openai/gpt-5.4` | Per existing Gorilla conventions for reasoning/synthesis tiers |
| GPT Researcher summarizer | `openai/gpt-4.1-mini` | Fast summarization tier |

### Environment Variables

```
OPENROUTER_API_KEY=...
TAVILY_API_KEY=...
# Semantic Scholar: no key needed for basic access (rate-limited to 100 req/5min)
# Google Patents: no key needed (web scraping via GPT Researcher)
```

---

## The 6 Research Tracks

Each track is an independent research session that can execute in parallel. Each has a distinct research domain, source profile, and set of P&T questions it feeds.

### Track 1 — Technology State-of-the-Art & Maturity

**Research mission:** How mature are the key underlying technologies? What's commercially available vs. research-stage vs. theoretical? What are the performance benchmarks and known limitations?

**Source profile:**
- Academic papers via Semantic Scholar (IEEE, arXiv, ACM, domain-specific journals)
- Technical review articles and survey papers
- Gartner/Forrester technology maturity assessments (via Tavily)
- Technology-specific trade publications and industry bodies
- Commercial product datasheets and technical specifications

**Search strategy:**
1. Semantic Scholar: search for survey/review papers on core technologies identified in Avalon passport
2. Tavily: search for commercial products, industry benchmarks, maturity assessments
3. GPT Researcher: deep dive on the 2–3 most critical technology areas identified by the Smart Planner

**Samsung LEO example queries:**
- Semantic Scholar: `"flat-panel electronically steerable array" satellite terminal`
- Semantic Scholar: `"inter-satellite laser link" LEO constellation performance`
- Tavily: `non-SpaceX heavy lift launch capacity 2027 2028 manifest`
- Tavily: `3GPP Release 18 NTN direct-to-device performance limitations`
- GPT Researcher deep dive: "Current state of non-SpaceX commercial launch capacity for LEO constellation deployment"

**Feeds questions:** KQ1, KQ2, KQ3, KQ4, DQ3, DQ5, DQ6, DQ12, IQ5, IQ6

---

### Track 2 — Reference Architecture & Build Precedent

**Research mission:** How have similar products been built? What are the known technical challenges, failure modes, and architectural patterns? What does "good" look like for a product at this stage?

**Source profile:**
- Engineering blogs and technical case studies (company engineering blogs, Medium, conference proceedings)
- Post-mortems and failure analyses
- Open-source projects and reference implementations
- Architecture documentation from comparable products/ventures
- Conference talks (IEEE, domain-specific conferences)

**Search strategy:**
1. Tavily: search for engineering case studies, architecture write-ups, and post-mortems for comparable products
2. Semantic Scholar: search for system architecture papers in the domain
3. GPT Researcher: deep dive on reference architectures and documented failure modes

**Samsung LEO example queries:**
- Tavily: `OneWeb satellite constellation architecture lessons learned`
- Tavily: `LEO satellite ground segment gateway modular architecture`
- Tavily: `Amazon Kuiper deployment delays root cause analysis`
- Semantic Scholar: `"LEO constellation" "ground segment" architecture design`
- GPT Researcher deep dive: "Reference architectures for sovereign-compliant satellite ground segments with lawful intercept"

**Feeds questions:** KQ1, KQ4, DQ1, DQ2, DQ6, DQ9, IQ1, IQ2, IQ4, IQ7

---

### Track 3 — Component & Dependency Ecosystem

**Research mission:** What external components, platforms, APIs, sensors, or services would a build require? Who are the vendors? What are typical terms, lead times, and lock-in risks?

**Source profile:**
- Vendor/supplier websites and product catalogs
- Trade directories and industry buyer guides
- Platform documentation and pricing pages
- Developer forums and integration guides
- Supply chain analysis reports

**Search strategy:**
1. Tavily: search for key component vendors, suppliers, and platform providers identified in the Avalon passport
2. Tavily: search for supply chain analyses and vendor comparison reports
3. GPT Researcher: deep dive on the most critical dependency (identified by Smart Planner from Avalon's kill signals)

**Samsung LEO example queries:**
- Tavily: `Ariane 6 commercial launch pricing 2027 manifest availability`
- Tavily: `SES O3b mPOWER wholesale capacity pricing enterprise`
- Tavily: `radiation-hardened GaN RF components satellite terminal suppliers`
- Tavily: `ISRO GSLV Mk III commercial rideshare LEO constellation`
- GPT Researcher deep dive: "Non-SpaceX, non-Chinese launch vehicle manifest capacity and commercial pricing for LEO constellation deployment 2027-2031"

**Feeds questions:** KQ5, KQ10, DQ7, DQ10, DQ16, DQ17, DQ18, DQ19, IQ8, IQ9

---

### Track 4 — Regulatory, Standards & Compliance

**Research mission:** What regulations, certifications, or standards apply? What timeline and cost do they impose? What approvals sit on the critical path?

**Source profile:**
- Government regulatory databases (domain-specific: FCC, ITU, FDA, CE, etc.)
- Standards body publications (ISO, IEC, ANSI, 3GPP, ETSI)
- Regulatory consulting firm blogs and compliance guides
- Country-specific regulatory frameworks for target geographies
- Trade association regulatory summaries

**Search strategy:**
1. Tavily: search for regulatory requirements specific to the product domain and target geographies from the Avalon passport
2. Tavily: search for relevant standards and certification timelines
3. GPT Researcher: deep dive on the regulatory critical path in the primary beachhead market

**Samsung LEO example queries:**
- Tavily: `ITU spectrum filing LEO constellation 2026 2027 timeline requirements`
- Tavily: `Indonesia satellite landing rights foreign ownership caps 2025 2026`
- Tavily: `Saudi Arabia satellite communication licensing data localization requirements`
- Tavily: `ETSI lawful intercept standards satellite ground segment compliance`
- GPT Researcher deep dive: "Regulatory pathway for LEO satellite constellation licensing in Indonesia: spectrum, landing rights, and lawful intercept requirements"

**Feeds questions:** KQ7, KQ8, DQ4, DQ14, DQ18, IQ3, IQ4, IQ10, IQ11

---

### Track 5 — Patent & IP Landscape (Level 1)

**Research mission:** What patent landscape exists in this technology domain? Who holds key patents? What are the broad FTO risk areas? What does the parent company already own that's relevant?

**Scope:** Level 1 — landscape scan only. Identifies patent clusters, major assignees, and potential risk areas. Does NOT perform claim-level analysis or formal FTO assessment (deferred to V2 or human-in-the-loop).

**Source profile:**
- Google Patents (primary — full-text search, assignee filtering, CPC classification)
- Patent analytics via Tavily (PatSnap summaries, patent landscape reports, IP news)
- Academic papers on patent landscapes in the domain (via Semantic Scholar)
- IP litigation databases and news (via Tavily)

**Search strategy:**
1. Google Patents (via GPT Researcher web search): search for patents by technology keywords + major assignees (competitors AND parent company)
2. Tavily: search for patent landscape analyses, IP litigation, and FTO commentary in the domain
3. Semantic Scholar: search for patent landscape survey papers if they exist for the domain
4. GPT Researcher: deep dive synthesizing the patent landscape with FTO risk areas

**Bidirectional search requirement:** Track 5 must search in TWO directions:
- **Inbound FTO risk:** What patents held by others could block this venture?
- **Parent company portfolio:** What relevant patents does the parent company already hold? (e.g., Samsung's satellite communications, RF, antenna, semiconductor patents)

**Samsung LEO example queries:**
- Google Patents: `assignee:SpaceX LEO constellation inter-satellite link`
- Google Patents: `assignee:Samsung Electronics satellite antenna phased array`
- Google Patents: `electronically steerable array flat panel satellite terminal`
- Tavily: `satellite constellation patent landscape FTO analysis 2024 2025`
- Tavily: `Samsung Electronics satellite communication patent portfolio`

**Feeds questions:** KQ6, KQ8, DQ13, DQ14, IQ3

**V1 limitation flag:** Every Track 5 output must include the following disclaimer:
> This is a Level 1 patent landscape scan. It identifies patent clusters and potential risk areas but does NOT constitute a formal freedom-to-operate analysis. Claim-level analysis against the proposed product design should be conducted by qualified patent counsel before significant capital commitment.

---

### Track 6 — Talent & Capability Landscape

**Research mission:** What specialized skills does this build require? How scarce are they? What does the parent company already have that's adjacent? What does the talent market signal about feasibility?

**Source profile:**
- Job postings (LinkedIn, Indeed — via Tavily)
- Talent market reports and salary benchmarking data
- University research group directories and lab websites
- Conference speaker/author profiles (cross-reference with Semantic Scholar)
- Parent company capability reports and organizational information (via Tavily)

**Search strategy:**
1. Tavily: search for job postings and talent reports for the specialized skills required
2. Tavily: search for the parent company's existing capabilities, divisions, and technical workforce
3. Semantic Scholar: identify top research groups and authors in the domain (signals where expertise concentrates)
4. GPT Researcher: deep dive on the most critical capability gap identified by the Smart Planner

**Samsung LEO example queries:**
- Tavily: `satellite constellation operations engineer job postings 2025 2026`
- Tavily: `Samsung Electronics satellite division space programs capabilities`
- Tavily: `orbital mechanics talent scarcity hiring LEO constellation`
- Semantic Scholar: `author:"Samsung" OR affiliation:"Samsung" satellite communication`
- GPT Researcher deep dive: "Critical talent gaps for a new LEO satellite constellation venture: orbital mechanics, space-grade manufacturing, and constellation operations"

**Feeds questions:** KQ5, DQ17, DQ19, DQ20, IQ11, IQ12

---

## Question-to-Track Wiring Diagram

This maps every P&T chapter question to the research tracks that feed it. Analysts receive evidence packages from the tracks marked with ●. Tracks marked with ○ provide secondary/contextual evidence.

### PT-1: Product Definition & Architecture (6 questions)

| Q ID | Question (abbreviated) | T1 | T2 | T3 | T4 | T5 | T6 |
|------|----------------------|----|----|----|----|----|----|
| KQ1 | What does the product do? | ● | ● | ○ | | | |
| KQ2 | 3 core features/capabilities? | ● | ○ | | | | |
| KQ4 | Genuine innovation/differentiation? | ● | ● | | | ○ | |
| DQ1 | Feature-to-job causality mapping | ● | ○ | | | | |
| DQ2 | Architecture components/layers | | ● | ● | | | |
| DQ9 | Customer need coverage gaps | ● | ○ | | | | |

### PT-2: Technology Maturity & Risk (7 questions)

| Q ID | Question (abbreviated) | T1 | T2 | T3 | T4 | T5 | T6 |
|------|----------------------|----|----|----|----|----|----|
| KQ3 | Maturity stage & scalability? | ● | ● | | | | |
| DQ3 | Evidence of maturity stage | ● | ● | | | | |
| DQ5 | Most critical technical risk | ● | ● | ● | | | |
| DQ6 | Scalability, modularity, reliability | | ● | ○ | | | |
| DQ12 | Obsolescence horizon (2-3 years) | ● | ○ | | | | |
| IQ1 | Security/audit vulnerabilities | | ● | | ○ | | |
| IQ2 | Engineering quality signals | | ● | | | | |

### PT-3: Organizational Capability (4 questions)

| Q ID | Question (abbreviated) | T1 | T2 | T3 | T4 | T5 | T6 |
|------|----------------------|----|----|----|----|----|----|
| KQ5 | Organization-controlled advantages | ○ | | ○ | | ○ | ● |
| DQ19 | Build internally vs. external partners | | ○ | ● | | | ● |
| DQ20 | Critical capability gaps + closure path | | | ○ | | | ● |
| IQ12 | Are claimed advantages real? | ○ | | ○ | | | ● |

### PT-4: Roadmap & Execution (7 questions)

| Q ID | Question (abbreviated) | T1 | T2 | T3 | T4 | T5 | T6 |
|------|----------------------|----|----|----|----|----|----|
| KQ7 | Phased build/scale requirements | ● | ● | ● | ● | | ○ |
| DQ4 | Critical milestones to commercialization | ● | | ○ | ● | | |
| DQ17 | Resource requirements per stage | | | ● | | | ● |
| DQ18 | Critical path dependencies | | | ● | ● | | ○ |
| IQ4 | Specs aligned with roadmap? | | ● | | ● | | |
| IQ10 | Stage-gate readiness criteria | ● | ● | | ● | | |
| IQ11 | Timeline/budget realism | ● | | ● | ● | | ● |

### PT-5: Validation & Evidence (7 questions)

| Q ID | Question (abbreviated) | T1 | T2 | T3 | T4 | T5 | T6 |
|------|----------------------|----|----|----|----|----|----|
| KQ9 | Unproven assumptions/claims | ● | ● | | | | |
| DQ8 | Existing validation evidence | ● | ● | | | | |
| DQ11 | Next validation experiments | ● | ● | | ○ | | |
| DQ15 | Pass/fail thresholds for validation | ● | ● | | | | |
| IQ5 | Performance vs. benchmarks | ● | ● | | | | |
| IQ6 | Feature gaps vs. competitors | ● | | ● | | | |
| IQ7 | Are test environments representative? | | ● | | | | |

### PT-6: Dependencies & Ecosystem (6 questions)

| Q ID | Question (abbreviated) | T1 | T2 | T3 | T4 | T5 | T6 |
|------|----------------------|----|----|----|----|----|----|
| KQ10 | Mission-critical external dependencies | | | ● | ○ | | |
| DQ7 | Integration complexity / tech debt | | ● | ● | | | |
| DQ10 | Dependency terms and constraints | | | ● | ● | | |
| DQ16 | Replaceability and switching costs | | | ● | | | |
| IQ8 | Lock-in, margin, continuity risk | | | ● | ● | | |
| IQ9 | Single points of failure + contingency | | | ● | | | |

### PT-7: Intellectual Property (5 questions)

| Q ID | Question (abbreviated) | T1 | T2 | T3 | T4 | T5 | T6 |
|------|----------------------|----|----|----|----|----|----|
| KQ6 | Proprietary tech centrality | ○ | | | | ● | |
| KQ8 | IP protection strength/enforceability | | | | ● | ● | |
| DQ13 | IP assignment chain of title | | | | | ● | |
| DQ14 | Joint ownership / co-development risk | | | | | ● | |
| IQ3 | FTO / infringement risk | | | | | ● | |

---

## Smart Planner

The Smart Planner is a single frontier-model call that reads all inputs and generates a custom research plan for each track. This is the most important call in the entire pipeline — it determines the quality and relevance of all downstream research.

### Why Smart Planner, Not Templates

Innovera's clients span wildly different technology domains (LEO satellites, AI scent detection, oxygen therapy, power distribution units). A template approach would produce generic research that misses domain-specific sources and terminology. The Smart Planner translates Avalon's strategic direction into precise, domain-aware search queries.

### Input to Smart Planner

The Smart Planner receives:
1. Full Avalon passport (all sections)
2. Venture brief
3. Client documents (if any)
4. The 6 track definitions from this spec (research mission + source profile, as written above)
5. Avalon's Priority Questions (from Section 9) — these are pre-mapped to tracks and pre-prioritized

### Smart Planner Prompt

```
SYSTEM:
You are a research planning engine for Innovera's Product & Technology analysis pipeline. You receive a strategic brief about a venture (the Avalon Information Passport) and must produce a targeted research plan for each of 6 research tracks.

Your research plans will be executed by GPT Researcher (an autonomous web research agent), Semantic Scholar (academic paper search), and Google Patents (patent search). Each plan must contain specific, executable search queries — not vague research directions.

Rules:
- Every search query must be informed by the venture's specific technology domain, target market, and constraints.
- Respect the constraint set from the Avalon passport. If a constraint says "no SpaceX launch providers," do not generate queries about SpaceX's internal capabilities.
- Prioritize the Avalon passport's Priority Questions — these represent the client's blocking questions and should drive the most intensive research.
- Prioritize the Avalon passport's Inherited Evidence Gaps — these are known unknowns that Primate must attempt to fill.
- For each track, generate 3–8 Tavily queries, 2–4 Semantic Scholar queries, and 1–2 GPT Researcher deep dive topics.
- For Track 5 (Patent & IP), generate both inbound FTO queries AND parent company portfolio queries.
- Flag any tracks where the venture domain makes the track less relevant (e.g., a pure software venture may have minimal Track 3 hardware dependencies).

USER:
## Avalon Information Passport

{avalon_passport_full_text}

## Venture Brief

{venture_brief_full_text}

## Client Documents

{client_documents_text_or_"None provided"}

## Track Definitions

{track_definitions_from_this_spec}

## Your Task

For each of the 6 tracks, produce a research plan with:

### Track {N}: {Track Name}

**Relevance to this venture:** [High / Medium / Low] — [1 sentence explaining why]

**Priority questions from Avalon this track addresses:**
- [List the specific Avalon Priority Questions this track will answer]

**Kill signals this track can evaluate:**
- [List any Kill Signals from Avalon that this track's research can test]

**Tavily queries:**
1. [Specific search query]
2. [...]

**Semantic Scholar queries:** (Tracks 1, 2, 5, 6 only)
1. [Specific search query]
2. [...]

**Google Patents queries:** (Track 5 only)
1. [Specific search query including assignee filters, CPC codes if known]
2. [...]

**GPT Researcher deep dive topics:** (1–2 per track)
1. [Topic description — 1-2 sentences defining the research question for an autonomous research agent]

**Key terms and domain vocabulary:**
- [List of domain-specific terms, acronyms, and jargon that search queries should use]
```

### Output Schema

The Smart Planner outputs a single markdown document with all 6 track plans. This document is saved alongside the evidence packages as `research-plan.md` for auditability.

### Cost Estimate

One Opus call, ~20K input tokens (passport + brief + track definitions), ~4K output tokens. Approximately $0.50–$1.00.

---

## Execution Flow

```
Step 0: Input Validation
├── Verify Avalon passport present and parsable
├── Verify venture brief present
└── Extract key identifiers (venture name, parent company, domain)

Step 1: Smart Planner                                    [1 LLM call]
└── Generate per-track research plans                    [~30 seconds]

Step 2: Track Execution                                  [6 parallel tracks]
├── Track 1: Tech State-of-the-Art                       [~15-25 min]
│   ├── Semantic Scholar queries (2-4)
│   ├── Tavily queries (3-8)
│   └── GPT Researcher deep dive (1-2)
├── Track 2: Reference Architecture                      [~15-25 min]
│   ├── Tavily queries (3-8)
│   ├── Semantic Scholar queries (2-4)
│   └── GPT Researcher deep dive (1-2)
├── Track 3: Component & Dependency                      [~10-20 min]
│   ├── Tavily queries (3-8)
│   └── GPT Researcher deep dive (1)
├── Track 4: Regulatory & Standards                      [~10-20 min]
│   ├── Tavily queries (3-8)
│   └── GPT Researcher deep dive (1)
├── Track 5: Patent & IP Landscape                       [~15-25 min]
│   ├── Google Patents queries via GPT Researcher (3-6)
│   ├── Tavily queries (2-4)
│   └── GPT Researcher deep dive (1)
└── Track 6: Talent & Capability                         [~10-15 min]
    ├── Tavily queries (3-6)
    ├── Semantic Scholar queries (1-2)
    └── GPT Researcher deep dive (1)

Step 3: Per-Track Synthesis                              [6 parallel LLM calls]
└── Each track's raw research → structured evidence package

Step 4: Cross-Track Kill Signal Check                    [1 LLM call]
└── Evaluate Avalon's kill signals against combined evidence
```

### Estimated Totals

| Metric | Estimate |
|--------|----------|
| Wall clock time | 25–35 minutes (tracks run in parallel) |
| Tavily API calls | 30–50 |
| Semantic Scholar calls | 10–18 |
| GPT Researcher sessions | 8–12 |
| LLM calls (Smart Planner + synthesis) | 8 |
| Estimated cost | $8–$15 per run |

---

## Output Format

Each track produces a single markdown file. All 6 files plus the research plan and kill signal assessment are saved to a single output directory.

### Output Directory Structure

```
primate-output-{venture-slug}-{date}/
├── research-plan.md                    # Smart Planner output (auditability)
├── T1-tech-state-of-the-art.md
├── T2-reference-architecture.md
├── T3-component-dependency.md
├── T4-regulatory-standards.md
├── T5-patent-ip-landscape.md
├── T6-talent-capability.md
└── kill-signal-assessment.md           # Cross-track kill signal evaluation
```

### Per-Track Evidence Package Format

Each track file follows this structure:

```markdown
---
track_id: T1
track_name: Technology State-of-the-Art & Maturity
venture: Samsung SkyBridge — Sovereign LEO Constellation
parent_company: Samsung Electronics
generated: 2026-04-08T14:32:00Z
queries_executed: 14
sources_consulted: 38
relevance: High
---

# T1: Technology State-of-the-Art & Maturity

## Key Findings

### F1: [Finding title]
**Feeds:** KQ3, DQ3, DQ5
**Evidence weight:** Strong | Moderate | Thin

[2-4 sentence finding with inline source citations. Specific numbers, dates, and named entities required. No vague claims.]

Source: [Author/Org — Title](URL) | [Journal, Year]

---

### F2: [Finding title]
...

---

## Avalon Priority Question Responses

For each Avalon Priority Question assigned to this track, provide a direct preliminary answer based on the evidence gathered.

### PQ-1: [Question text from Avalon passport]
**Assessment:** [Direct answer, 3-5 sentences]
**Evidence weight:** [Strong / Moderate / Thin / Insufficient]
**Key sources:** [List 2-3 most relevant sources]

---

## Evidence Gaps

Findings that could NOT be established from available sources.

### G1: [Gap description]
**Impact on P&T questions:** [Which questions are affected]
**Suggested resolution:** [What additional research or client input would fill this gap]

---

## Kill Signal Evidence

For each kill signal from Avalon that this track can evaluate:

### KS-[N]: [Kill signal from passport]
**Status:** Not triggered | Warning | Triggered | Insufficient evidence
**Evidence:** [2-3 sentences explaining the assessment]

---

## Sources

| # | Type | Source | Relevance |
|---|------|--------|-----------|
| 1 | Academic paper | [Author — Title](URL) | High |
| 2 | Industry report | [Org — Title](URL) | High |
| 3 | Vendor documentation | [Company — Page](URL) | Medium |
| ... | ... | ... | ... |
```

### Kill Signal Assessment Format

The cross-track kill signal assessment combines evidence from all 6 tracks:

```markdown
---
venture: Samsung SkyBridge — Sovereign LEO Constellation
generated: 2026-04-08T14:45:00Z
kill_signals_evaluated: 6
---

# Kill Signal Assessment

## Summary

| Kill Signal | Status | Primary Track | Evidence Weight |
|-------------|--------|---------------|-----------------|
| KS-1: Launch capacity | Warning | T3 | Moderate |
| KS-2: Sovereignty premium | Insufficient evidence | — | Thin |
| KS-3: Gateway customization | Not triggered | T2, T4 | Moderate |
| ... | ... | ... | ... |

## Detailed Assessments

### KS-1: [Kill signal text from Avalon]

**Status: Warning**

**Evidence from T3 (Component & Dependency):** [Assessment]
**Evidence from T1 (Tech State-of-the-Art):** [Corroboration or contradiction]
**Cross-track synthesis:** [What the combined evidence says]
**What would change this assessment:** [What additional evidence would resolve the ambiguity]
```

---

## CLI Interface

### Installation

Primate lives in the `innovera-primate/` directory at the repo root, alongside `innovera-research/`.

```bash
cd innovera-primate
pip install -r requirements.txt
```

### Usage

```bash
# Full run with all inputs
python -m primate \
  --passport path/to/avalon-passport.md \
  --brief path/to/venture-brief.md \
  --documents path/to/documents/ \
  --output path/to/output-dir/

# Minimal run (no client documents)
python -m primate \
  --passport path/to/avalon-passport.md \
  --brief path/to/venture-brief.md \
  --output path/to/output-dir/

# Run specific tracks only (for testing or re-running)
python -m primate \
  --passport path/to/avalon-passport.md \
  --brief path/to/venture-brief.md \
  --output path/to/output-dir/ \
  --tracks T1 T5

# Dry run (Smart Planner only — outputs research plan without executing)
python -m primate \
  --passport path/to/avalon-passport.md \
  --brief path/to/venture-brief.md \
  --output path/to/output-dir/ \
  --plan-only
```

### Project Structure

```
innovera-primate/
├── primate/
│   ├── __main__.py              # CLI entry point
│   ├── config.py                # Environment variables, model selection, API keys
│   ├── planner.py               # Smart Planner (research plan generation)
│   ├── orchestrator.py          # Track execution orchestrator (parallel dispatch)
│   ├── synthesizer.py           # Per-track synthesis + kill signal assessment
│   ├── tracks/
│   │   ├── base.py              # Base track class (shared execution logic)
│   │   ├── t1_tech_maturity.py
│   │   ├── t2_reference_arch.py
│   │   ├── t3_component_dep.py
│   │   ├── t4_regulatory.py
│   │   ├── t5_patent_ip.py
│   │   └── t6_talent.py
│   ├── tools/
│   │   ├── tavily_client.py     # Tavily search wrapper
│   │   ├── semantic_scholar.py  # Semantic Scholar API client
│   │   ├── gpt_researcher.py    # GPT Researcher integration
│   │   └── openrouter.py        # OpenRouter LLM client
│   └── output/
│       ├── formatter.py         # Markdown output formatter
│       └── templates/           # Output templates (track, kill signal)
├── requirements.txt
├── .env.example
└── README.md
```

---

## LDM-Specific Behavior

Since ~80% of clients are in Low Data Mode (early-stage, pre-product), Primate must handle thin evidence gracefully.

### What LDM Changes

1. **Client documents will usually be empty.** The Smart Planner must still produce useful research plans from just the Avalon passport + venture brief.
2. **Many questions are unanswerable from web research alone.** Tracks must flag these as evidence gaps with the framing: "For a [product type] at this stage, [what good looks like]. The client should provide [specific document/artifact] for a more detailed assessment."
3. **The evidence packages become prescriptive rather than evaluative.** Instead of "Samsung's architecture scores X on modularity," the output becomes "Comparable LEO constellation architectures achieve modularity through [pattern]. A Samsung architecture should be evaluated against this benchmark when design documentation is available."

### LDM System Instruction (injected into per-track synthesis prompts)

```
CONTEXT: This venture is in Low Data Mode — the client is at an early stage (pre-product or concept phase) with minimal internal documentation. Your evidence package should:

1. DESCRIBE what "good" looks like for this technology domain at this stage. Use reference architectures, industry benchmarks, and comparable ventures to establish the standard.

2. IDENTIFY the specific artifacts, decisions, and milestones the client should have before progressing. Frame as "Before advancing to [stage], the venture should have [artifact/decision]."

3. FLAG unanswerable questions honestly. State: "This question requires [specific internal artifact] which is not available in the current inputs. Based on comparable ventures, [what we would expect to see]."

4. NEVER pad with generalities. If the evidence doesn't exist, say so in one sentence and move on. Do not write 200 words around an absence.
```

---

## Error Handling

### API Failures
- All API calls (Tavily, Semantic Scholar, OpenRouter) retry once with 3-second backoff
- If a track's GPT Researcher session fails, the track continues with Tavily + Semantic Scholar results only (degraded but usable)
- If the Smart Planner call fails, the entire pipeline halts (cannot proceed without research plans)

### Empty Results
- If a Semantic Scholar query returns 0 results, log and continue (some domains have minimal academic coverage)
- If a Tavily query returns 0 results, the Smart Planner's query may be too specific — no auto-retry with broader terms in V1 (V2 improvement)
- If an entire track produces fewer than 3 sources, flag the track output as "Low confidence — insufficient source coverage"

### Rate Limiting
- Semantic Scholar: 100 requests per 5 minutes (free tier). Space queries with 3-second intervals.
- Tavily: Respect rate limits per plan tier. Log 429 responses and queue retries.

---

## V2 Roadmap (Deferred)

Items explicitly deferred from V1:

| Item | Why Deferred | Dependency |
|------|-------------|------------|
| MVNO/alternative architecture research tracks (T1b, T2b, T3b) | Doubles scope; primary thesis first | Avalon Section 8 integration |
| Track 5 Level 2 — claim-level patent analysis | Hard to automate; false confidence risk | Patent analytics API (PatSnap or Lens.org) |
| Auto-broadening of failed queries | Requires query quality feedback loop | Usage data from V1 runs |
| Domain-specific source lists per industry vertical | Need to accumulate vertical knowledge | Multiple V1 runs across verticals |
| Regulatory database direct API access (FDA, FCC, etc.) | Each agency has different API/format | Per-domain integration work |
| Macaco integration (per-analyst targeted search hints) | Depends on P&T snip files being written | PT-02 in Master TODO |
| Consultant Search retargeting for P&T (Gartner/Forrester) | Lower priority than core tracks | Consultant search refactor |
| Web frontend (like Avalon's React app) | CLI is sufficient for V1; team uses terminal | Demand from non-technical users |
| Cross-track evidence deduplication | Sources may appear in multiple tracks | Post-V1 quality analysis |
| Streaming progress output (WebSocket) | Nice-to-have for long runs | Web frontend |

---

## Testing Strategy

### Primary Test Case: Samsung SkyBridge

Use the Avalon passport already generated (`avalon-passport-2026-04-08.md`) as the primary test input. The Samsung LEO case is ideal because:
- It exercises all 6 tracks heavily (hardware, software, regulatory, IP, talent, dependencies)
- Avalon's Priority Questions are specific and verifiable
- Avalon's Kill Signals have clear pass/fail criteria
- The technology domain is well-covered in public sources

### Expected Outputs for Samsung LEO

**Track 1 should surface:** Ariane 6 launch cadence data, ISRO GSLV Mk III commercial manifest, 3GPP Release 17/18 NTN performance specs, flat-panel ESA commercial products (Kymeta, ThinKom)
**Track 2 should surface:** OneWeb constellation architecture, Kuiper deployment lessons, modular ground segment designs, multi-orbit SD-WAN precedents
**Track 3 should surface:** Launch vehicle pricing/availability, wholesale MEO/GEO capacity pricing (SES, Eutelsat), radiation-hardened component suppliers, ESA terminal BOM analysis
**Track 4 should surface:** ITU spectrum filing timelines, Indonesia/KSA satellite licensing requirements, ETSI lawful intercept standards, 3GPP NTN certification path
**Track 5 should surface:** SpaceX constellation patents, Samsung satellite-adjacent patent portfolio, phased array terminal patent landscape, inter-satellite link IP
**Track 6 should surface:** Satellite operations talent scarcity data, Samsung's existing space/RF capabilities, orbital mechanics expertise concentration (universities, companies)

### Quality Checks

- [ ] All 6 evidence packages are generated and non-empty
- [ ] Kill signal assessment addresses ALL kill signals from the Avalon passport
- [ ] No track output contains vague/generic claims without sources
- [ ] Patent landscape (T5) includes BOTH inbound FTO and parent company portfolio
- [ ] LDM framing is used where appropriate (prescriptive, not evaluative)
- [ ] Research plan is saved and auditable
- [ ] Total run time < 40 minutes
- [ ] Total cost < $20

---

## Build Sequence

1. **Scaffold:** Create `innovera-primate/` directory, `requirements.txt`, project structure
2. **Tool Clients:** Build `tavily_client.py`, `semantic_scholar.py`, `openrouter.py`, `gpt_researcher.py` wrappers
3. **Config:** Build `config.py` with env var loading, model selection, API key validation
4. **Smart Planner:** Build `planner.py` with the full prompt template and Avalon passport parsing
5. **Base Track:** Build `tracks/base.py` with shared execution logic (query dispatch, result collection, error handling)
6. **Track Implementations:** Build T1–T6, each extending base with track-specific query types and source profiles
7. **Orchestrator:** Build `orchestrator.py` with parallel track dispatch using `asyncio`
8. **Synthesizer:** Build `synthesizer.py` for per-track evidence packaging and kill signal assessment
9. **Output Formatter:** Build `output/formatter.py` with markdown template rendering
10. **CLI:** Build `__main__.py` with argument parsing and pipeline invocation
11. **Test:** Run with Samsung LEO test case. Validate outputs against expected results.
12. **Iterate:** Review evidence quality, adjust Smart Planner prompt, tune query generation.

---

## Dependencies on Other Work

| This spec depends on | Status |
|---------------------|--------|
| Avalon V1 (output schema — specifically Section 9) | ✅ Complete |
| GPT Researcher (pip package) | ✅ Installed |
| Tavily API key | ✅ Available |
| OpenRouter API key | ✅ Available |
| Semantic Scholar API | ✅ Free, no key needed |
| Google Patents | ✅ Free, no key needed |

| This spec unblocks | Status |
|-------------------|--------|
| PR-02 through PR-12 in Master TODO | ⬜ Ready to start |
| PT-01 through PT-09 (P&T Chapter scaffold) | ⬜ Can begin in parallel |
| UI-01 (parent company capability capture) | ⬜ Recommended but not blocking |
