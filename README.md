
# ETHCC Hackathon 2022 -- Debate3

This is the official ETHCC Hackathon 2022 submission for our project Debate3. 
- Debate 3 is a Decentralized, embeddable, commentary section token-gated discussion platform for DAOs 🌈



## Project Description 

Debate3 has a Proof of Membership for it Forum Factory, stating that for a user to access a forum they must hold at least one type of NFT for this specific Forum. Each user of a Forum receieves 1155s Badges (Bronze , Silver and Gold) minted as tokens, in batches summed up to a reputation score. 
Those badges are given by moderators of the forum that are selected by the creator of the Forum itself.  


## Features 

We have used [Orbis SDK](https://orbis.club/developers) to build the scoped commentary sections / comments with a decentralized Forum Factory created as NFTs and allow the members to get Badges stored in [IPFS](https://ipfs.io/) as 1155s minted as tokens. 
We have chosed to use privy to store the details of each forum. We also wanted to secure our batch mint for the ERC1155, we have used Vyper who provides contracts less prone to attacks. For deployment we decided to let an overall choice for the user to create his Forum in a multi-chain world of possibilities. We offer : 
- [PolygonMumbai](https://mumbai.polygonscan.com/) 
- [CronosTestnet](https://cronos.org/docs/getting-started/cronos-testnet.html) 
- [GnosisTesnet (sokol)](https://blockscout.com/xdai/testnet) 
- [CeloTesnet (Alfajores)](https://alfajores-blockscout.celo-testnet.org/) 
- [NeonTestnet](https://neon-labs.org/)



## TL;DR How it Works

1. Create a Forum minted as an NFT in IPFS and selecting up to 5 moderators. 
2. Moderators can provide membership or revoke membership to users, assert badges to users with a Proof of Contribution. 
3. Users will have their contribution score updated, this contribution score is stored only in the forum contract, so contribution score inside a forum is not related to the number of badges they have inside the protocol. 

--> Add contribution score here 





## Getting Started

```bash
# Install pnpm
npm i -g pnpm

# Install dependencies
pnpm install

# Copy & fill environments
cp packages/frontend/.env.local.example packages/frontend/.env.local
cp packages/hardhat/.env.example packages/hardhat/.env
```


## Development

```bash
# Generate contract-types & start frontend with turborepo
pnpm dev
```


## Kleros Proof of Equilibrium Proposal  (Kleros - PoH) : 

You can take a look at our [Proof of Equilibrium Proposal](https://skynetfree.net/HAFNnp5eudA2V_1Q1F_auQLgglw-ZoLBwM5Db0v-XO38IA)


## Twitter :  [debate3](https://twitter.com/debate3_) 

- Twitter survey : https://twitter.com/debate3_/status/1551063166485921793


## Contact Information :

- You can contact the team on the address : 

## Video link :








