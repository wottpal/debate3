import { PrivyClient, SiweSession } from '@privy-io/privy-browser'
import { env } from '@shared/environment'
import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react'

export type PrivyClientContextType = {
  // provider?: any
  session?: any
  client?: any
}
export const PrivyClientContext = createContext<PrivyClientContextType>({})

export const usePrivyClientContext = () => {
  return useContext(PrivyClientContext)
}

export const PrivyClientProvider: FC<PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<SiweSession | null>(null)
  // const [provider, setProvider] = useState(null)
  const [client, setClient] = useState<PrivyClient | null>(null)

  useEffect(() => {
    // Initialize the Privy client.
    // provider here refers to the browser's Ethereum wallet provider, in this case Metamask.
    const provider: any = typeof window !== 'undefined' ? window.ethereum : null
    if (!provider) return
    const session = new SiweSession(env.privy.apiKey, provider)
    const client = new PrivyClient({
      session: session,
    })

    setSession(session)
    setClient(client)
  }, [])

  return (
    <PrivyClientContext.Provider value={{ session, client }}>
      {children}
    </PrivyClientContext.Provider>
  )
}
