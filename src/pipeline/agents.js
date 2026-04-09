// Agent metadata for UI display
export const AGENT_META = {
  '1a': {
    name: 'Tension: DV × MR',
    role: 'Cross-chapter tension analyst',
    model: 'gpt-5.4 mini',
    description: 'Comparing Demand Validation and Market Research for alignment, tension, and implications.',
  },
  '1b': {
    name: 'Tension: DV × CA',
    role: 'Cross-chapter tension analyst',
    model: 'gpt-5.4 mini',
    description: 'Comparing Demand Validation and Competitor Analysis for alignment, tension, and implications.',
  },
  '1c': {
    name: 'Tension: MR × CA',
    role: 'Cross-chapter tension analyst',
    model: 'gpt-5.4 mini',
    description: 'Comparing Market Research and Competitor Analysis for alignment, tension, and implications.',
  },
  '1.5a': {
    name: 'Path Cartographer',
    role: 'Strategic scenario planner',
    model: 'Claude Opus 4.6',
    description: 'Enumerating 5–6 distinct strategic paths from the upstream evidence before evaluation begins.',
  },
  '2.scout': {
    name: 'Scouts',
    role: 'Strategic reconnaissance',
    model: 'gpt-5.4 + Tavily',
    description: 'Investigating each strategic path with targeted web research.',
  },
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

  // ── Primate (P&T Deep Research) ──
  'pr-plan': {
    name: 'Smart Planner',
    role: 'Research planning engine',
    model: 'Claude Opus 4.6',
    description: 'Generating per-track research plans from the Avalon passport.',
  },
  'pr-t1': {
    name: 'T1: Tech State-of-the-Art',
    role: 'Technology maturity researcher',
    model: 'gpt-5.4 + Tavily + S2',
    description: 'Researching technology maturity, benchmarks, and commercial availability.',
  },
  'pr-t2': {
    name: 'T2: Reference Architecture',
    role: 'Architecture precedent researcher',
    model: 'gpt-5.4 + Tavily + S2',
    description: 'Researching build precedents, failure modes, and architectural patterns.',
  },
  'pr-t3': {
    name: 'T3: Component & Dependency',
    role: 'Ecosystem researcher',
    model: 'gpt-5.4 + Tavily',
    description: 'Researching vendors, components, lead times, and lock-in risks.',
  },
  'pr-t4': {
    name: 'T4: Regulatory & Standards',
    role: 'Compliance researcher',
    model: 'gpt-5.4 + Tavily',
    description: 'Researching regulations, certifications, and critical-path approvals.',
  },
  'pr-t5': {
    name: 'T5: Patent & IP Landscape',
    role: 'IP landscape researcher',
    model: 'gpt-5.4 + Tavily + S2',
    description: 'Scanning patent clusters, FTO risk areas, and parent company portfolio.',
  },
  'pr-t6': {
    name: 'T6: Talent & Capability',
    role: 'Talent market researcher',
    model: 'gpt-5.4 + Tavily + S2',
    description: 'Researching talent scarcity, parent company capabilities, and expertise hubs.',
  },
  'pr-synth': {
    name: 'Evidence Synthesis',
    role: 'Per-track evidence packager',
    model: 'gpt-5.4',
    description: 'Synthesizing raw research into structured evidence packages.',
  },
  'pr-kill': {
    name: 'Kill Signal Assessment',
    role: 'Cross-track evaluator',
    model: 'Claude Opus 4.6',
    description: 'Evaluating kill signals against combined evidence from all tracks.',
  },
}
