import { createContext, useContext, useState } from 'react'

export interface LogLineIdentity {
  id: string
  spans: string[]
  ghost: boolean
}

const LogLineContext = createContext<{
  identity: LogLineIdentity | null
  setIdentity: (i: LogLineIdentity | null) => void
}>({
  identity: null,
  setIdentity: () => {},
})

export function LogLineProvider({ children }: { children: React.ReactNode }) {
  const [identity, setIdentity] = useState<LogLineIdentity | null>(null)
  return (
    <LogLineContext.Provider value={{ identity, setIdentity }}>
      {children}
    </LogLineContext.Provider>
  )
}

export const useLogLineContext = () => useContext(LogLineContext)