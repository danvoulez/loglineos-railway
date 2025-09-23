// Funções para consentimento computável

export function isConsentGiven(consents: Record<string, boolean>, key: string): boolean {
  return !!consents[key]
}

export function grantConsent(consents: Record<string, boolean>, key: string): Record<string, boolean> {
  return { ...consents, [key]: true }
}

export function revokeConsent(consents: Record<string, boolean>, key: string): Record<string, boolean> {
  return { ...consents, [key]: false }
}