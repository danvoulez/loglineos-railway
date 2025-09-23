// Funções utilitárias do núcleo computável LogLine

export function isValidLogLineID(id: string): boolean {
  return /^logline-id:\/\/[a-zA-Z0-9\-.]+$/.test(id)
}

export function getOriginFromID(id: string): string | null {
  const match = id.match(/^logline-id:\/\/([^\.]+)\./)
  return match ? match[1] : null
}

export function isGhostID(id: string): boolean {
  return id.startsWith('logline-id://ghost.')
}

export function computeSpan(id: string, action: string): { timestamp: string, action: string, id: string } {
  return {
    timestamp: new Date().toISOString(),
    action,
    id,
  }
}

export function formatDNA(dna: { name: string; origin: string; reputation: number }): string {
  return `${dna.name} • ${dna.origin} • reputação: ${dna.reputation}`
}