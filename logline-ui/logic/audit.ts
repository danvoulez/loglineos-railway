// Funções de auditoria computável de spans

export type Span = { timestamp: string; action: string; id: string }

export function createSpan(action: string, id: string): Span {
  return {
    timestamp: new Date().toISOString(),
    action,
    id,
  }
}

export function filterSpansByID(spans: Span[], id: string): Span[] {
  return spans.filter((span) => span.id === id)
}

export function filterGhostSpans(spans: Span[]): Span[] {
  return spans.filter((span) => span.id.startsWith('logline-id://ghost.'))
}