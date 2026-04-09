/**
 * Parses the Cartographer's markdown output into structured path objects
 * for the scout orchestrator.
 *
 * Handles multiple output formats the LLM might produce:
 *   - ## Path N: "Name" — Description  (markdown headers)
 *   - Path N: "Name" — Description     (no headers)
 *   - **Path N:** "Name"               (bold markers)
 */
export function parseCartographerPaths(markdownOutput) {
  // Try multiple split patterns in order of specificity
  let pathBlocks = splitOnPattern(markdownOutput, /(?=^## Path \d+[:.]\s)/m)
  if (pathBlocks.length === 0) {
    pathBlocks = splitOnPattern(markdownOutput, /(?=^#{1,3}\s*Path \d+[:.]\s)/m)
  }
  if (pathBlocks.length === 0) {
    pathBlocks = splitOnPattern(markdownOutput, /(?=^Path \d+[:.]\s)/m)
  }
  if (pathBlocks.length === 0) {
    pathBlocks = splitOnPattern(markdownOutput, /(?=^\*\*Path \d+[:.]\*?\*?\s)/m)
  }

  return pathBlocks.map(block => {
    // Extract path number from any format
    const numMatch = block.match(/(?:#{1,3}\s*)?(?:\*\*)?Path (\d+)[:.]/i)
    const id = numMatch ? `P${numMatch[1]}` : 'P?'

    // Extract name — try multiple patterns
    const name = extractName(block)

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

function splitOnPattern(text, pattern) {
  const blocks = text.split(pattern).filter(b => b.trim().length > 0)
  // Only keep blocks that actually start with a Path reference
  return blocks.filter(b => /(?:#{1,3}\s*)?(?:\*\*)?Path \d+/i.test(b.substring(0, 100)))
}

function extractName(block) {
  // Try: ## Path 1: "Name" — Description
  const m1 = block.match(/Path \d+[:.]\s*"([^"]+)"/i)
  if (m1) return m1[1].trim()

  // Try: ## Path 1: "Name"
  const m2 = block.match(/Path \d+[:.]\s*\u201c([^\u201d]+)\u201d/i)
  if (m2) return m2[1].trim()

  // Try: ## Path 1: Name — Description (unquoted, stop at em-dash or newline)
  const m3 = block.match(/Path \d+[:.]\s*(?:\*\*)?(.+?)(?:\*\*)?(?:\s*[\u2014\u2013—-]\s|\n)/i)
  if (m3) return m3[1].trim().replace(/^["']|["']$/g, '')

  // Fallback: everything after "Path N:" on the first line
  const m4 = block.match(/Path \d+[:.]\s*(.+)/i)
  if (m4) return m4[1].trim().substring(0, 80)

  return 'Unknown Path'
}

function extractSection(block, headerName) {
  // Escape special regex chars in header name
  const escaped = headerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // Try multiple header formats, ordered by specificity:
  const patterns = [
    // ### Header Name\ncontent  (markdown headers)
    new RegExp(`#{1,4}\\s*${escaped}\\s*\\n([\\s\\S]*?)(?=\\n#{1,4}\\s|\\n\\*\\*[A-Z]|\\nPath \\d|$)`, 'i'),
    // **Header Name:**\n or **Header Name**:\n or **Header Name**\n  (bold, colon inside or outside)
    new RegExp(`\\*\\*${escaped}:?\\*\\*\\s*:?\\s*\\n([\\s\\S]*?)(?=\\n\\*\\*[A-Z]|\\n#{1,4}\\s|\\nPath \\d|$)`, 'i'),
    // Header Name:\ncontent  (plain text at start of line, content on next lines)
    new RegExp(`^${escaped}\\s*:\\s*\\n([\\s\\S]*?)(?=\\n[A-Z][\\w\\s]{2,}:\\s*\\n|\\n#{1,4}\\s|\\n\\*\\*[A-Z]|\\nPath \\d|$)`, 'mi'),
    // Header Name: inline content  (content on same line, may continue with bullets/indented lines)
    new RegExp(`(?:#{1,4}\\s*)?(?:\\*\\*)?${escaped}:?(?:\\*\\*)?\\s*:\\s*(.+(?:\\n(?:[-*\\u2022]\\s|\\d+\\.\\s|\\s{2,}).+)*)`, 'i'),
    // Fallback: Header Name: single line of content
    new RegExp(`(?:\\*\\*)?${escaped}:?(?:\\*\\*)?\\s*:?\\s+(.+)`, 'i'),
  ]

  for (const pattern of patterns) {
    const match = block.match(pattern)
    if (match?.[1]?.trim()) {
      return match[1].trim()
    }
  }

  return ''
}
