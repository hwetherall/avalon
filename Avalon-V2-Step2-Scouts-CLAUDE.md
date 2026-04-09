# Avalon V2 — Step 2: The Scouts

**Version:** 0.1 (Draft)
**Last updated:** 2026-04-09
**Owner:** Harry
**Status:** Design — ready for review
**Depends on:** Avalon V2 Step 1 (Path Cartographer) — output schema defined

---

## What The Scouts Are

The Scouts are lightweight, parallel research agents that take the Path Cartographer's strategic path sketches and go find real-world evidence for or against each one. Each path gets its own scout. Each scout runs an independent research loop: plan targeted queries, execute web searches, read the results, optionally dig deeper, then synthesize everything into a structured "field report."

The DnD analogy: the war council has identified 5–6 possible expeditions (the Cartographer's job). Now we send one scout down each road. The scout doesn't fight the dragon or clear the caves — they come back and tell you what they saw: "The castle has 40-foot walls, there are three guards at the gate, and the treasure room is on the second floor" or "The forest path is overgrown but I found tracks from a previous expedition that got halfway through."

### What The Scouts Are NOT

- **Not Primate.** Primate runs 6 deep research tracks (30–50 Tavily queries, 8–12 GPT Researcher sessions, 25–35 minutes, $8–$15). A scout runs 4–7 searches and 2–3 LLM calls per path in 2–4 minutes for $0.50–$1.50. Primate is the full army; scouts are reconnaissance.
- **Not evaluators.** Scouts gather evidence. They do not judge whether a path is good or bad — that's the War Table's job (Step 3). A scout's field report says "here's what I found" not "here's what I recommend."
- **Not exhaustive.** A scout will miss things. The field report is a first pass, not a complete evidence package. The user (and the War Table) should understand that choosing a path based on scout reports means committing to deeper research (Primate) afterward.
- **Not domain-specific.** Unlike Primate's 6 tracks (Tech, Architecture, Regulatory, etc.), each scout is a generalist. It researches whatever the Cartographer's investigation questions require — market data, regulatory info, pricing, competitive moves, technical feasibility — whatever is most relevant to *that specific path*.

---

## Where Scouts Sit In The Avalon V2 Pipeline

```
STEP 1: Pairwise Tension Analysis                     [3 parallel calls — UNCHANGED]
├── 1a. Demand Validation × Market Research            [Claude Opus 4.6]
├── 1b. Demand Validation × Competitor Analysis        [Claude Opus 4.6]
└── 1c. Market Research × Competitor Analysis          [Claude Opus 4.6]

STEP 1.5: Path Cartographer                            [1 call]
└── Enumerate 5–6 strategic paths                      [Claude Opus 4.6]

STEP 2: Scouts                                         [5–6 parallel research loops — THIS SPEC]
├── Scout for Path 1                                   [Research loop]
├── Scout for Path 2                                   [Research loop]
├── Scout for Path 3                                   [Research loop]
├── Scout for Path 4                                   [Research loop]
├── Scout for Path 5                                   [Research loop]
└── Scout for Path 6 (if exists)                       [Research loop]

STEP 3: War Table + Assembly                           [Future spec]
├── Comparative evaluation of all field reports
├── Innovera Recommendation
└── Expanded Information Passport with path menu
```

All scouts run in parallel. Each scout is independent — no scout reads another scout's results. This maximizes parallelism and eliminates cross-scout contamination (one path's evidence shouldn't bias another path's investigation).

---

## Architecture Decision: GPT Researcher Lite (Node.js)

### The Problem

Avalon V1 is a React + Vite app deployed on Vercel with a single `/api/llm` serverless route that proxies OpenRouter calls. It has no Python backend. Primate (the full research engine) uses GPT Researcher as a Python pip package, but Primate is a separate CLI tool that runs independently.

Scouts need research capability (web search, iterative query refinement, result synthesis) but must live inside Avalon's existing deployment architecture. Adding a Python runtime to Vercel or standing up a separate backend service for scout execution creates operational complexity disproportionate to the task.

### The Solution: Research Loop in Node.js

Instead of importing GPT Researcher, implement the same core research loop using Tavily's REST API (for search) and OpenRouter (for LLM planning + synthesis), all callable from Vercel serverless functions.

GPT Researcher's core loop is:
1. LLM reads a research question → generates search queries
2. Web search executes queries → returns results
3. LLM reads results → decides if more research is needed → generates follow-up queries
4. Repeat until sufficient → LLM synthesizes findings

The Scout Research Loop replicates this in 3 phases with a fixed iteration budget (no open-ended loops):

```
Phase A: Query Planning          [1 LLM call]
  └── Read path brief + investigation questions
  └── Generate 4–6 targeted Tavily search queries

Phase B: Search Execution        [4–6 Tavily calls, parallel]
  └── Execute all queries simultaneously
  └── Collect top 3 results per query (titles, snippets, URLs)

Phase C: Deep Dive (conditional) [0–1 LLM call + 0–2 Tavily calls]
  └── LLM reads Phase B results
  └── Identifies the #1 evidence gap that initial searches didn't cover
  └── Generates 1–2 follow-up queries targeting that gap
  └── Executes follow-up queries

Phase D: Synthesis               [1 LLM call]
  └── Read ALL search results (Phase B + C)
  └── Read the original path brief
  └── Produce structured field report
```

**Total per scout: 2–3 LLM calls + 4–8 Tavily searches.**
**Total across 6 parallel scouts: 12–18 LLM calls + 24–48 Tavily searches.**

### Why Not Full GPT Researcher

| Dimension | GPT Researcher (Primate) | Scout Research Loop |
|-----------|--------------------------|---------------------|
| Runtime | Python (asyncio) | Node.js (Vercel serverless) |
| Search iterations | 3–5 per topic | 1–2 (fixed budget) |
| LLM calls per session | 5–8 | 2–3 |
| Time per session | 15–25 min | 2–4 min |
| Depth | Full evidence package | Field report (reconnaissance) |
| Deployment | Standalone CLI | Inside existing Vercel app |

The scout's job is "is there evidence worth investigating further?" not "build me a complete evidence package." Two rounds of search is enough for reconnaissance. If the path is selected, Primate does the deep dive later.

---

## New API Routes

Scouts require two new Vercel serverless functions alongside the existing `/api/llm` proxy.

### `/api/search` — Tavily Search Proxy

Proxies calls to Tavily's REST API, keeping the API key server-side.

```javascript
// api/search.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { query, max_results = 3, search_depth = 'basic' } = req.body

  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      max_results,
      search_depth,
      include_answer: false,
      include_raw_content: false,
    }),
  })

  const data = await response.json()
  res.status(200).json(data)
}
```

### `/api/search-batch` — Parallel Multi-Query Search

Executes multiple Tavily queries in parallel and returns combined results. This avoids client-side fan-out, reducing round trips.

```javascript
// api/search-batch.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { queries, max_results = 3, search_depth = 'basic' } = req.body
  // queries: string[] — array of search query strings

  const results = await Promise.allSettled(
    queries.map(query =>
      fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.TAVILY_API_KEY,
          query,
          max_results,
          search_depth,
          include_answer: false,
          include_raw_content: false,
        }),
      }).then(r => r.json())
    )
  )

  const output = results.map((r, i) => ({
    query: queries[i],
    status: r.status,
    results: r.status === 'fulfilled' ? r.value.results || [] : [],
    error: r.status === 'rejected' ? r.reason?.message : null,
  }))

  res.status(200).json({ searches: output })
}
```

### Environment Variables (additions)

```
TAVILY_API_KEY=tvly-...
```

Added to the existing `.env.local` alongside `OPENROUTER_API_KEY`.

---

## Inputs

Each scout receives one path from the Cartographer's output. The scout does NOT receive the full upstream chapters — it only sees the path sketch. This is deliberate: scouts should research the real world, not re-read the evidence the Cartographer already synthesized.

| Input | Source | Purpose |
|-------|--------|---------|
| Path ID | Cartographer output | Identifier (P1, P2, ...) |
| Path Name | Cartographer output | For field report metadata |
| Path Thesis | Cartographer output | 3–5 sentence strategic sketch |
| Core Bet | Cartographer output | The single critical assumption |
| Key Evidence For | Cartographer output | What the upstream chapters support |
| Key Evidence Against | Cartographer output | What the upstream chapters challenge |
| Investigation Questions | Cartographer output | The 3–5 specific research questions |
| Path Type | Cartographer output | Full Commit / Wedge-First / etc. |
| Venture Name | User input (passed through) | For query context |
| Venture Domain | Inferred from chapters | For search query terminology |

**What scouts do NOT receive:**
- Raw upstream chapters (prevents scouts from being summaries of summaries)
- Other paths (prevents cross-contamination)
- Other scouts' results (prevents anchoring)
- Strategic Context / success criteria (prevents scouts from pre-filtering evidence to match client expectations — the War Table handles that)

---

## Scout Research Loop — Detailed Flow

### Phase A: Query Planning

**Purpose:** Convert the Cartographer's investigation questions into executable search queries. The investigation questions are human-readable research questions; Tavily needs short, keyword-dense queries.

**Model:** `openai/gpt-4.1-mini` via OpenRouter. This is a translation task, not a reasoning task. A smaller, faster model is appropriate.

**Prompt Template:**

```
SYSTEM:
You are a search query planner. You receive a strategic thesis about a venture and a set of investigation questions. Your job is to produce 4–6 targeted web search queries that will find evidence to answer those questions.

Rules:
- Each query should be short (3–8 words) and keyword-dense. Search engines work best with specific nouns and terms, not full sentences.
- Include the venture's industry/domain terminology — use the jargon that sources would use.
- At least one query should target the most critical assumption (the "Core Bet").
- At least one query should look for disconfirming evidence — data that would challenge or kill this path.
- Vary query specificity: include both broad landscape queries and narrow data-point queries.
- Include date terms (2024, 2025, 2026) where recency matters.
- Do not use search operators (site:, -, "quotes") unless the question specifically requires a named source.
- Output ONLY a JSON array of query strings. No explanation.

USER:
## Venture
{venture_name}

## Path Thesis
{path_thesis}

## Core Bet
{core_bet}

## Investigation Questions
{investigation_questions}

Generate 4–6 search queries as a JSON array.
```

**Expected output:**
```json
[
  "satellite wholesale capacity pricing SES O3b 2025",
  "sovereign data routing satellite ground segment",
  "white-label satellite MVNO wholesale agreements",
  "flat panel ESA terminal BOM cost manufacturing",
  "government managed satellite service contracts Southeast Asia"
]
```

**Cost:** ~$0.01 per scout (small input, tiny output, mini model). Negligible.

### Phase B: Search Execution

**Purpose:** Execute all planned queries in parallel via the `/api/search-batch` route.

**Execution:**

```javascript
async function executeSearches(queries) {
  const response = await fetch('/api/search-batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      queries,
      max_results: 3,
      search_depth: 'basic',
    }),
  })
  return response.json()
}
```

**Returns:** For each query, the top 3 results with title, URL, and snippet. Total: 12–18 search result snippets per scout.

**Cost:** 4–6 Tavily calls × ~$0.01 = $0.04–$0.06 per scout.

### Phase C: Deep Dive (Conditional)

**Purpose:** After the initial search results come back, an LLM reads them and identifies the biggest remaining evidence gap. If the initial searches answered the investigation questions reasonably well, Phase C is skipped. If there's a critical gap, 1–2 follow-up queries are generated and executed.

**Decision logic:** Phase C runs if and only if the Phase D synthesis model (see below) is given Phase B results and determines that fewer than half the investigation questions have any relevant evidence. This check is built into the Phase D prompt — if the model finds the evidence base too thin, it outputs a `DEEP_DIVE_NEEDED` flag with suggested follow-up queries before producing the field report. The orchestrator then runs those queries and re-calls Phase D with the expanded result set.

**Implementation:**

```javascript
async function runScout(pathBrief) {
  // Phase A: Plan queries
  const queries = await planQueries(pathBrief)

  // Phase B: Execute initial searches
  const initialResults = await executeSearches(queries)

  // Phase D (attempt 1): Synthesize — may request deep dive
  const firstPass = await synthesize(pathBrief, initialResults)

  if (firstPass.deepDiveNeeded && firstPass.followUpQueries?.length > 0) {
    // Phase C: Deep dive
    const followUpResults = await executeSearches(firstPass.followUpQueries)

    // Phase D (attempt 2): Synthesize with expanded results
    const finalReport = await synthesize(pathBrief, [...initialResults, ...followUpResults])
    return finalReport
  }

  return firstPass
}
```

**Cost:** 0–2 additional Tavily calls + 1 additional LLM call (only when triggered). On average, ~50% of scouts should need a deep dive, adding ~$0.30 per scout when triggered.

### Phase D: Synthesis

**Purpose:** Read all search results and produce the structured field report. This is the most important LLM call per scout — it converts raw search snippets into an evidence assessment against the path's thesis.

**Model:** `openai/gpt-4.1` via OpenRouter. Needs to be good at reading messy web snippets and extracting relevant signal, but doesn't need frontier-level reasoning. The synthesis task is: "given these search results and this strategic thesis, what evidence did you find?"

**Prompt Template:**

```
SYSTEM:
You are a strategic research scout. You were sent to investigate a specific strategic path for a venture. You have conducted web searches and now have a set of search results. Your job is to produce a structured field report that tells the war council what you found.

You are NOT evaluating whether this path is good or bad. You are reporting what you found. Let the evidence speak for itself. The war council will make the judgment call.

EVIDENCE QUALITY RULES:
- Cite specific sources for every finding. Include the source name and URL.
- Distinguish between hard evidence (specific data points, named deals, published financials) and soft evidence (analyst opinions, unnamed sources, general trends).
- If you found contradictory evidence, report both sides. Do not resolve contradictions — flag them.
- If a search returned nothing relevant for an investigation question, say so explicitly. "No relevant evidence found" is a valid and important finding.
- Frame evidence strength as "evidence weight" (strong / moderate / thin / absent), not probability percentages.

DEEP DIVE PROTOCOL:
Before producing your field report, assess whether the search results provide relevant evidence for at least half of the investigation questions. If fewer than half have any relevant results:
- Set deep_dive_needed to true
- Generate 1–2 follow-up search queries targeting the biggest gap
- Output the follow-up queries instead of a full field report
- You will be called again with expanded results

If the evidence base is sufficient (even if thin), proceed with the full field report.

OUTPUT FORMAT:
You must output valid JSON matching this schema. Do not include markdown formatting, code fences, or any text outside the JSON object.

{
  "deep_dive_needed": false,
  "follow_up_queries": [],
  "field_report": {
    "path_id": "P1",
    "path_name": "...",
    "executive_summary": "3–4 sentences: what did the scout find overall?",
    "core_bet_assessment": {
      "finding": "What evidence did you find about the core bet?",
      "evidence_weight": "strong | moderate | thin | absent",
      "sources": ["source name — URL", ...]
    },
    "investigation_findings": [
      {
        "question": "The original investigation question",
        "finding": "What the scout found (2–4 sentences)",
        "evidence_weight": "strong | moderate | thin | absent",
        "supports_path": true | false | null,
        "key_data_points": ["Specific numbers, names, dates found"],
        "sources": ["source name — URL", ...]
      }
    ],
    "surprises": [
      "Evidence found that wasn't asked about but is relevant to this path (0–3 items)"
    ],
    "red_flags": [
      "Evidence that specifically threatens this path's viability (0–3 items)"
    ],
    "evidence_gaps": [
      "Investigation questions that could not be answered from web search (0–3 items)"
    ]
  }
}

USER:
## Venture
{venture_name}

## Path Being Investigated
**ID:** {path_id}
**Name:** {path_name}
**Thesis:** {path_thesis}
**Core Bet:** {core_bet}
**Path Type:** {path_type}

## Investigation Questions
{investigation_questions_numbered}

## Key Evidence From Upstream Chapters (for context, not for citation)
**For:** {key_evidence_for}
**Against:** {key_evidence_against}

## Search Results
{formatted_search_results}

Produce the field report as specified. Remember: report what you found, do not evaluate the path.
```

**Cost:** ~$0.30–$0.60 per scout (moderate input from search results, structured output).

---

## Output Schema: Field Report

Each scout produces one JSON field report. The JSON schema is defined inline in the Phase D prompt above. Here is the complete structure with field descriptions:

```
FieldReport {
  path_id:              string       // "P1", "P2", etc.
  path_name:            string       // Cartographer's evocative name
  executive_summary:    string       // 3–4 sentence overview of findings

  core_bet_assessment: {
    finding:            string       // What evidence was found about the core bet
    evidence_weight:    enum         // strong | moderate | thin | absent
    sources:            string[]     // ["Source — URL", ...]
  }

  investigation_findings: [{         // One per investigation question
    question:           string       // Original question from Cartographer
    finding:            string       // What the scout found (2–4 sentences)
    evidence_weight:    enum         // strong | moderate | thin | absent
    supports_path:      bool | null  // true = supports, false = challenges, null = ambiguous
    key_data_points:    string[]     // Specific numbers, names, dates
    sources:            string[]     // ["Source — URL", ...]
  }]

  surprises:            string[]     // 0–3 unexpected findings relevant to path
  red_flags:            string[]     // 0–3 findings that specifically threaten path viability
  evidence_gaps:        string[]     // 0–3 questions that web search couldn't answer
}
```

### Why JSON Instead of Markdown

Primate outputs markdown because its evidence packages are consumed by human analysts and the MAAP pipeline's prompt layer. Scout field reports are consumed by the War Table agent (Step 3) which needs to compare 5–6 reports side by side. Structured JSON makes cross-path comparison programmatic — the War Table can index into `investigation_findings[2].evidence_weight` across all paths rather than parsing free text. The UI can also render the field reports as interactive cards with evidence weight indicators.

---

## Parallel Execution Strategy

All scouts run simultaneously. The orchestrator dispatches them after the Cartographer completes and waits for all to finish before proceeding to Step 3.

```javascript
async function runAllScouts(cartographerOutput) {
  const paths = parseCartographerPaths(cartographerOutput)

  const scoutPromises = paths.map(path => runScout({
    pathId: path.id,
    pathName: path.name,
    pathThesis: path.thesis,
    coreBet: path.coreBet,
    keyEvidenceFor: path.evidenceFor,
    keyEvidenceAgainst: path.evidenceAgainst,
    investigationQuestions: path.investigationQuestions,
    pathType: path.pathType,
    ventureName: cartographerOutput.venture,
  }))

  const results = await Promise.allSettled(scoutPromises)

  return results.map((result, i) => ({
    pathId: paths[i].id,
    status: result.status,
    fieldReport: result.status === 'fulfilled' ? result.value.field_report : null,
    error: result.status === 'rejected' ? result.reason?.message : null,
  }))
}
```

### Concurrency Limits

Vercel serverless functions have concurrency limits per plan. Running 6 scouts simultaneously means up to 6 concurrent `/api/llm` calls + 6 concurrent `/api/search-batch` calls. On the Vercel Pro plan this is fine. On the free tier, limit concurrent scouts to 3 (two batches of 3).

**Configurable concurrency:**

```javascript
const SCOUT_CONCURRENCY = process.env.SCOUT_CONCURRENCY
  ? parseInt(process.env.SCOUT_CONCURRENCY)
  : 6

async function runAllScouts(cartographerOutput) {
  const paths = parseCartographerPaths(cartographerOutput)
  const results = []

  // Process in batches if concurrency limit is below path count
  for (let i = 0; i < paths.length; i += SCOUT_CONCURRENCY) {
    const batch = paths.slice(i, i + SCOUT_CONCURRENCY)
    const batchResults = await Promise.allSettled(
      batch.map(path => runScout(path))
    )
    results.push(...batchResults)
  }

  return results
}
```

### Timeout Handling

Each scout should complete within 120 seconds. If a scout exceeds this, it is terminated and its field report is marked as timed out. A timed-out scout does NOT block the War Table — the War Table proceeds with whatever field reports it has.

```javascript
async function runScoutWithTimeout(pathBrief, timeoutMs = 120_000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const result = await runScout(pathBrief, controller.signal)
    clearTimeout(timer)
    return result
  } catch (err) {
    clearTimeout(timer)
    if (err.name === 'AbortError') {
      return {
        field_report: null,
        error: 'Scout timed out after 120 seconds',
        timed_out: true,
      }
    }
    throw err
  }
}
```

---

## Model Selection

| Role | Model | Via | Rationale |
|------|-------|-----|-----------|
| Phase A: Query Planning | `openai/gpt-4.1-mini` | OpenRouter | Translation task. Speed and cost matter more than reasoning depth. |
| Phase C: Deep Dive Decision | (bundled into Phase D) | — | Not a separate call — the synthesis model handles this. |
| Phase D: Synthesis | `openai/gpt-4.1` | OpenRouter | Good at extracting signal from noisy web content. Strong JSON output. Lower cost than Opus for a task that's synthesis, not strategic reasoning. |

### Why Not Opus for Scouts

The scouts' LLM tasks are: (1) convert research questions to search queries, and (2) read search results and extract relevant evidence. These are comprehension and synthesis tasks, not strategic reasoning. GPT-4.1 handles this well at ~4x lower cost than Opus. The Cartographer already did the strategic thinking; the scouts are executing a defined research brief.

### Why Not Gemini for Diversity

Scout diversity comes from *different paths investigating different domains*, not from model variation. All scouts use the same model to keep evidence assessment calibrated. If Scout 1 uses Opus and Scout 4 uses Gemini, differences in evidence weight assignment could be model artifacts rather than evidence differences. The War Table needs to compare field reports on an apples-to-apples basis.

---

## Cartographer → Scout Parsing

The Cartographer outputs markdown. The scout orchestrator must parse it into structured path objects. This parsing is deterministic (regex/string matching), not LLM-based.

### Parsing Strategy

The Cartographer's output follows a strict structure (defined in the Step 1 spec). Each path has consistent headers:

```
## Path N: "[Name]"
### Thesis
### Core Bet
### Key Evidence For
### Key Evidence Against
### What A Scout Should Investigate
### Estimated Difficulty
### Path Type
```

**Parser implementation:**

```javascript
function parseCartographerPaths(markdownOutput) {
  // Split on ## Path N: pattern
  const pathBlocks = markdownOutput.split(/(?=## Path \d+:)/).filter(Boolean)

  return pathBlocks
    .filter(block => block.startsWith('## Path'))
    .map(block => {
      const id = `P${block.match(/## Path (\d+)/)?.[1]}`
      const name = block.match(/## Path \d+: "?(.+?)"?\n/)?.[1]?.trim()

      return {
        id,
        name,
        thesis: extractSection(block, 'Thesis'),
        coreBet: extractSection(block, 'Core Bet'),
        evidenceFor: extractSection(block, 'Key Evidence For'),
        evidenceAgainst: extractSection(block, 'Key Evidence Against'),
        investigationQuestions: extractSection(block, 'What A Scout Should Investigate'),
        difficulty: extractSection(block, 'Estimated Difficulty'),
        pathType: extractSection(block, 'Path Type'),
      }
    })
}

function extractSection(block, headerName) {
  const regex = new RegExp(
    `### ${headerName}\\n([\\s\\S]*?)(?=###|## Path|$)`
  )
  return block.match(regex)?.[1]?.trim() || ''
}
```

This is brittle to format variations. A fallback: if regex parsing fails, run one fast LLM call to extract the structured data. But design the Cartographer's output format to be parse-friendly first.

---

## Error Handling

### Per-Scout Failures

A single scout failing must not crash the pipeline. The orchestrator uses `Promise.allSettled`, not `Promise.all`. Failed scouts produce a null field report with an error message. The War Table (Step 3) must handle missing field reports gracefully.

| Failure Mode | Handling |
|-------------|----------|
| Phase A LLM call fails | Retry once. If retry fails, scout produces null report with error. |
| Tavily returns 0 results for all queries | Phase D runs with empty results; field report will show all evidence as "absent." This is valid — it tells the War Table there's no public evidence for this path. |
| Tavily returns 0 results for some queries | Phase D runs with partial results. Normal operation. |
| Tavily rate limit (429) | Retry with 2-second backoff, up to 2 retries. If still failing, proceed with whatever results succeeded. |
| Phase D LLM call fails | Retry once with same input. If retry fails, scout produces null report. |
| Phase D returns malformed JSON | Retry once with a "repair" instruction appended. If still malformed, attempt to extract partial data. If extraction fails, null report. |
| Scout times out (>120s) | Abort and produce null report. |
| Tavily API key missing/invalid | All scouts fail simultaneously. Halt pipeline and show API key configuration error. |

### Degraded Mode

If 1–2 scouts fail out of 6, the War Table proceeds with 4–5 field reports. The War Table prompt explicitly handles missing reports:

> "You have field reports for {N} of {M} paths. Paths without field reports should be flagged as 'uninvestigated' — they are neither recommended nor excluded, but the evidence base is too thin for assessment."

If 3+ scouts fail, the pipeline halts and shows an error suggesting the user retry. This threshold is configurable.

```javascript
const MIN_SUCCESSFUL_SCOUTS = Math.ceil(totalPaths * 0.5) // At least half must succeed
```

---

## Cost and Time Estimates

### Per Scout

| Phase | LLM Calls | Tavily Calls | LLM Cost | Tavily Cost | Wall Time |
|-------|-----------|-------------|----------|-------------|-----------|
| A: Query Planning | 1 (mini) | 0 | ~$0.01 | $0 | ~3s |
| B: Search Execution | 0 | 4–6 | $0 | ~$0.05 | ~5s |
| C: Deep Dive (50% chance) | 0–1 | 0–2 | ~$0.15 | ~$0.02 | ~8s |
| D: Synthesis | 1 | 0 | ~$0.30 | $0 | ~15s |
| **Total per scout** | **2–3** | **4–8** | **~$0.45** | **~$0.07** | **~30s** |

### All Scouts (6 paths, parallel)

| Metric | Estimate |
|--------|----------|
| Wall clock time | 30–60 seconds (all parallel, bottleneck is slowest scout) |
| Total LLM calls | 12–18 |
| Total Tavily calls | 24–48 |
| Total LLM cost | ~$2.70 |
| Total Tavily cost | ~$0.40 |
| **Total scout phase cost** | **~$3.10** |

### Cumulative Avalon V2 Cost (Steps 1 through 2)

| Step | Cost | Wall Time |
|------|------|-----------|
| Step 1: Tension Analysis (3 calls) | ~$2.00 | ~20s |
| Step 1.5: Cartographer (1 call) | ~$1.80 | ~40s |
| Step 2: Scouts (6 parallel loops) | ~$3.10 | ~45s |
| **Total through Step 2** | **~$6.90** | **~105s** |

Compare to V1's full pipeline (Steps 1–3, including Assembly): ~$8–12, ~90–180s. The V2 scout phase adds roughly $3 and 45 seconds to the total pipeline. The big cost increase will come in Step 3 (War Table + expanded Assembly), estimated to add another $2–4.

---

## Integration With Existing Codebase

### New Files

| File | Purpose |
|------|---------|
| `api/search.js` | Vercel serverless: single Tavily search proxy |
| `api/search-batch.js` | Vercel serverless: parallel multi-query Tavily proxy |
| `src/pipeline/scout.js` | Scout research loop (Phase A → B → C → D) |
| `src/pipeline/scoutOrchestrator.js` | Parallel scout dispatcher + timeout + error handling |
| `src/pipeline/cartographerParser.js` | Markdown → structured path objects |
| `src/pipeline/prompts.js` | Add `SCOUT_PLANNER_SYSTEM` and `SCOUT_SYNTHESIS_SYSTEM` prompts |
| `src/pipeline/agents.js` | Add `'2.scout'` agent metadata entry |

### Modified Files

| File | Change |
|------|--------|
| `src/pipeline/orchestrator.js` | Insert Step 2 (scouts) after Cartographer. Pass Cartographer output through parser, then dispatch scouts, then collect field reports for Step 3. |
| `src/components/PipelineProgress.jsx` | Add scout progress UI: show each path's scout status (queued → searching → synthesizing → complete / failed). |
| `.env.local` | Add `TAVILY_API_KEY` |
| `vite.config.js` | Add `/api/search` and `/api/search-batch` dev middleware (same pattern as existing `/api/llm` proxy) |

### Agent Metadata Addition

```javascript
// Add to AGENT_META in agents.js
'2.scout': {
  name: 'Scouts',
  role: 'Strategic reconnaissance',
  model: 'GPT-4.1 + Tavily',
  description: 'Investigating each strategic path with targeted web research.',
  // Individual scout status tracked separately in pipeline state
},
```

### Pipeline State

The scout phase introduces sub-agent state that doesn't exist in V1 (where each step is a single LLM call). The orchestrator needs to track per-scout status:

```javascript
// Pipeline state shape for scout phase
{
  step: '2.scouts',
  status: 'running',
  scouts: {
    P1: { status: 'synthesizing', phase: 'D', queriesRun: 5 },
    P2: { status: 'complete', fieldReport: { ... } },
    P3: { status: 'searching', phase: 'B', queriesRun: 4 },
    P4: { status: 'complete', fieldReport: { ... } },
    P5: { status: 'error', error: 'Tavily rate limit exceeded' },
    P6: { status: 'queued' },
  }
}
```

---

## UI Considerations

### Scout Progress Display

During the scout phase, the UI should show all scouts in parallel. Each scout card displays:

- **Path name and ID** (from Cartographer)
- **Current phase** (Planning → Searching → Deep Dive → Synthesizing → Complete)
- **Queries executed** (e.g., "5 of 6 searches complete")
- **Status indicator** (spinner → checkmark / error icon)

When a scout completes, its card expands to show a preview of the field report (executive summary + core bet assessment). Full field report is viewable on click/tap.

### Failed Scout Display

Failed scouts show the error message and a "Retry" button that re-runs just that one scout without restarting the full pipeline.

---

## Search Result Formatting

Tavily returns results as:
```json
{
  "results": [
    {
      "title": "...",
      "url": "...",
      "content": "...",  // snippet, ~200-500 chars
      "score": 0.95
    }
  ]
}
```

Before passing to the Phase D synthesis model, search results are formatted as a readable text block:

```javascript
function formatSearchResults(allSearches) {
  return allSearches.map(search => {
    const resultBlock = search.results
      .map((r, i) => `  [${i + 1}] ${r.title}\n      URL: ${r.url}\n      ${r.content}`)
      .join('\n\n')

    return `### Query: "${search.query}"\n${resultBlock || '  No results found.'}`
  }).join('\n\n---\n\n')
}
```

This gives the synthesis model clear query-to-result mapping so it can assess which investigation questions each result is relevant to.

### Token Budget for Search Results

Each search result snippet is ~100–150 tokens. With 3 results per query and 4–6 queries, that's ~1,200–2,700 tokens of search content. Adding the path brief (~500 tokens) and system prompt (~800 tokens), total Phase D input is ~2,500–4,000 tokens. Well within GPT-4.1's context window and economical.

If Phase C deep dive runs, add ~600–900 tokens of follow-up results. Still modest.

---

## Venture-Agnostic Design Principles

The scout system makes zero assumptions about the venture's domain, industry, or technology. The entire domain-awareness pipeline is:

1. **The upstream chapters** contain all domain knowledge (written by the MAAP pipeline).
2. **The Cartographer** reads those chapters and produces domain-specific path sketches with domain-specific investigation questions.
3. **The scouts** use those investigation questions to generate domain-specific search queries.

At no point does the scout code contain hardcoded industry terms, market segments, or technology references. The domain intelligence flows through the pipeline via the Cartographer's output, not via the scout's implementation.

This means the same scout code works for:
- A Samsung LEO satellite constellation (hardware, geopolitics, regulatory)
- A B2B SaaS for dental practices (software, GTM, unit economics)
- An AI-powered scent detection platform (deep tech, IP, talent)
- A fintech payments infrastructure play (regulatory, partnerships, integration)

The only thing that changes is the Cartographer's output, which changes because the upstream chapters are different.

### What If Search Results Are Thin?

Some venture domains produce sparse web search results (e.g., highly niche industrial equipment, pre-market deep tech). This is handled at two levels:

1. **Phase D synthesis:** The scout reports evidence weight as "thin" or "absent" and flags the investigation question as an evidence gap. This is a valid finding — it tells the War Table that this path can't be validated from public sources alone.

2. **War Table interpretation:** A path with mostly "absent" evidence isn't automatically bad — it may just need Primate-depth research or client-provided internal documents. The War Table should flag this distinction: "insufficient public evidence" ≠ "evidence against."

---

## Test Case: Samsung LEO (Fenced)

This section exists solely for validation. It should not influence the design of any scout component.

### Test Input

Use the Cartographer output from the Samsung SkyBridge case (6 paths: Sovereignty-in-a-Box, Capacity Broker, Galaxy Shield, GCC Anchor Sovereign, Silicon Kingmaker, Maritime Beachhead).

### Expected Behavior

| Path | Expected Search Domain | Phase C Likely? |
|------|----------------------|-----------------|
| P1: Sovereignty-in-a-Box | Satellite launch pricing, MNO agreements, constellation sizing | Yes — niche data |
| P2: Capacity Broker | SES O3b pricing, satellite MVNO models, managed service contracts | Maybe — some data exists |
| P3: Galaxy Shield | D2D revenue sharing, NTN modem specs, spectrum agreements | No — well-covered topic |
| P4: GCC Anchor Sovereign | PIF/Mubadala satellite investments, Saudi CITC requirements | Yes — specialized data |
| P5: Silicon Kingmaker | Satellite semiconductor suppliers, Qualcomm modem licensing | No — covered by tech press |
| P6: Maritime Beachhead | Vessel traffic data, maritime satcom pricing, OneWeb coverage gaps | Maybe — some niche |

### Quality Checks (apply to any venture, not Samsung-specific)

- [ ] All paths that the Cartographer produced have a corresponding scout dispatched
- [ ] Each field report contains findings for every investigation question (even if "absent")
- [ ] Evidence weight labels are used consistently (strong / moderate / thin / absent)
- [ ] Sources are cited with URLs for every finding
- [ ] `supports_path` is set to `true`, `false`, or `null` for each finding — not always `true`
- [ ] At least one scout across all paths finds a "red flag"
- [ ] At least one scout across all paths finds a "surprise"
- [ ] No scout's field report references another path (cross-contamination check)
- [ ] No scout's field report contains evidence weight expressed as percentages
- [ ] Failed scouts (if any) produce clean error messages, not crashes
- [ ] Total wall clock time for all scouts < 90 seconds
- [ ] Total cost for all scouts < $5.00

---

## Open Questions For Review

1. **Should scouts use `search_depth: 'advanced'` for any queries?** Tavily's advanced search costs more (~$0.05 vs ~$0.01) but returns better results for complex queries. Option: use basic for Phase B, advanced for Phase C deep dives only. This keeps cost down while improving quality where it matters most.

   **Current recommendation:** Basic for Phase B, advanced for Phase C.

2. **Should the Phase D synthesis model receive the upstream "Key Evidence For/Against" from the Cartographer?** Including it gives the model context about what's already known, helping it focus on *new* information. Excluding it prevents the model from being anchored by the Cartographer's framing. Current design includes it under a "for context, not for citation" header.

   **Current recommendation:** Include it. The risk of anchoring is lower than the risk of the scout re-discovering things the Cartographer already flagged and calling them "new findings."

3. **Should there be a "Scout Planner" (like Primate's Smart Planner) that generates all scout research plans in one call before dispatching?** This would let a frontier model reason about all paths simultaneously and ensure query diversity across scouts. The tradeoff: it adds one sequential LLM call (~30s) before the parallel scout phase begins, and creates a single point of failure.

   **Current recommendation:** No. Each scout plans its own queries independently. The paths are already diverse (Cartographer's job), so independent query planning is unlikely to produce duplicate searches. A centralized planner adds latency without clear quality gain. Revisit if testing shows significant query overlap between scouts.

4. **Should scouts fetch full page content (web scrape) for the most relevant result?** Tavily snippets are 200–500 chars — often enough for a data point but not enough for nuanced evidence. Fetching the full page for the top result per investigation question would improve evidence quality but adds 3–5 web fetches per scout (latency + potential for blocked pages).

   **Current recommendation:** Not in V1. Snippets are sufficient for reconnaissance. If the War Table finds that scout evidence is consistently too thin to differentiate paths, add selective page fetching in V2. Tavily's `include_raw_content: true` option can be enabled per-query without code changes — it's a parameter flip.

5. **What happens if the Cartographer produces fewer than 5 paths?** The Cartographer spec allows a minimum of 4. The scout system should handle any number of paths (1–6) without code changes.

   **Current recommendation:** Already handled. `parseCartographerPaths` returns whatever paths exist; `runAllScouts` maps over them. No hardcoded path count.

6. **Vercel function duration limits.** Vercel Pro allows 60-second function execution. The scout's Phase D synthesis call (15–20s) plus Phase B search (5s) fits within this. But if Phase C triggers, the total per-scout execution may approach 40–50s in a single function invocation. Consider splitting the scout into multiple function calls (one per phase) if timeout becomes an issue.

   **Current recommendation:** Keep as single function for simplicity in V1. If Vercel timeouts occur during testing, refactor into chained calls.
