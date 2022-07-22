/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const env = {
  url:
    process.env.NEXT_PUBLIC_VERCEL_URL && process.env.NEXT_PUBLIC_VERCEL_ENV! === 'preview'
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : process.env.NEXT_PUBLIC_URL,
  isProduction: process.env.NEXT_PUBLIC_PRODUCTION_MODE === 'true',

  defaultChain: parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN!),
  supportedChains: JSON.parse(process.env.NEXT_PUBLIC_SUPPORTED_CHAINS!),

  rpc: {
    hardhat: process.env.NEXT_PUBLIC_RPC_HARDHAT!,
    mumbai: process.env.NEXT_PUBLIC_RPC_MUMBAI!,
  },

  privy: {
    apiKey: process.env.NEXT_PUBLIC_PRIVY_API_KEY!,
    apiSecret: process.env.PRIVY_API_SECRET,
  },

  nftStorageApiKey: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY!,
}
