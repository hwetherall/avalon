/**
 * Sanitize markdown content — strip any accidental HTML if present
 */
export function sanitizeMarkdown(text) {
  if (!text) return ''
  const trimmed = text.trim()
  if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html')) {
    return trimmed.replace(/<[^>]*>/g, '').trim()
  }
  return trimmed
}

/**
 * Generate a filename for passport download
 */
export function passportFilename() {
  const date = new Date().toISOString().slice(0, 10)
  return `avalon-passport-${date}.md`
}
