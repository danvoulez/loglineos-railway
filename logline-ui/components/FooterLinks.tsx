'use client'

import React from 'react'

/**
 * Rodapé com links computáveis para termos, consentimento e Fundação LogLine.
 */
export const FooterLinks: React.FC = () => (
  <footer className="flex justify-center gap-6 py-6 text-xs text-gray-400">
    <a
      href="/terms"
      className="hover:text-neonPink underline"
      aria-label="Termos de uso"
    >
      Termos
    </a>
    <a
      href="/consent"
      className="hover:text-neonGreen underline"
      aria-label="Consentimento computável"
    >
      Consentimento
    </a>
    <a
      href="https://logline.foundation"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-neonBlue underline"
      aria-label="LogLine Foundation"
    >
      Fundação
    </a>
  </footer>
)