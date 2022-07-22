import { Orbis } from '@orbisclub/orbis-sdk'
import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react'

export type OrbisProviderContextType = {
  orbis?: any
}
export const OrbisContext = createContext<OrbisProviderContextType>({})

export const useOrbisContext = () => {
  return useContext(OrbisContext)
}

export const OrbisProvider: FC<PropsWithChildren> = ({ children }) => {
  const [orbis, setOrbis] = useState(null)

  useEffect(() => {
    setOrbis(new Orbis())
  }, [])

  return <OrbisContext.Provider value={{ orbis }}>{children}</OrbisContext.Provider>
}
