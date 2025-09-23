import { useState } from 'react'

// Hook para spans computáveis (auditorias de eventos)
export function useSpans(initialSpans: Array<{timestamp: string, action: string, id: string}> = []) {
  const [spans, setSpans] = useState(initialSpans)

  function addSpan(span: {timestamp: string, action: string, id: string}) {
    setSpans((prev) => [...prev, span])
  }

  return { spans, addSpan }
}