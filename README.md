
# ETHCC Hackathon 2022 -- Debate3

This is the official ETHCC Hackathon 2022 submission for our project Debate3 🌈. 

## Project Description 

Debate 3 is a Decentralized, gated forum generator , where owners/moderators of DAOs and protocols can come and open their forums. Each forum is nft-gated, when a moderator opens a forum, an NFT contract is deployed and where moderators can give Badges to members of a specific forum. The reputation score is relative to the ownership of these Badges that are are displayed in the UI to show the “trustworthy” level of each member. 
Similarly, this badges are used for claiming certain membership or having some privileges in our main protocol.


## Features 

We have used [Orbis SDK] as the backend provider for forums(https://orbis.club/developers) to build the scoped commentary sections / comments with a decentralized Forum Factory created as NFTs (for this time we also allow moderators to mint nfts using the baseURI instead of customized URIs) and that allow the members who have verified the Proof Of Membership (hold at least one type of NFT for this specific Forum) to get Badges (Bronze , Silver and Gold) stored in [IPFS](https://ipfs.io/) as 1155s minted as tokens. The Badges are upgreadble : 

- 5 Silver Badges can be upgreadable into 1 Bronze Badge (utility : In case someone opens a discussion or a forum for people who hold a silver badge or better, you would be able to access this). 

We have chosen to use privy to store the details of each forum. We also wanted to secure our batch mint for the ERC1155, we have used [Vyper](https://vyper.readthedocs.io/en/stable/) who provides contracts less prone to attacks. For deployment we decided to let an overall choice for the user to create his Forum in a multi-chain world of possibilities. We offer : 
- [PolygonMumbai](https://mumbai.polygonscan.com/) 
- [CronosTestnet](https://cronos.org/docs/getting-started/cronos-testnet.html) 
- [GnosisTesnet (sokol)](https://blockscout.com/xdai/testnet) 
- [CeloTesnet (Alfajores)](https://alfajores-blockscout.celo-testnet.org/) 
- [NeonTestnet](https://neon-labs.org/)

Those deployments were done using Hardhat and Truffle. A detailed SetUp for the deployment with Truffle is available in the [Truffle.md](https://github.com/wottpal/debate3/blob/main/package-vyper/Truffle.md) repository. 

## How it Works

1. Create a Forum minted as an NFT in IPFS and selecting up to 5 moderators. 
2. Moderators can provide membership or revoke membership to users, assert badges to users with a Proof of Contribution. 
3. Users will have their contribution score updated, this contribution score is stored only in the forum contract, so contribution score inside a forum is not related to the number of badges they have inside the protocol. 


## What's next for Debate3 ? 

We are planning to add many features such as : 
- Fund Distribution Support : random airdrops done by moderators based on reputation scores. 
- Proof Of Humanity using Kleros Technology : reality.eth


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

You can take a look at our [Proof of Equilibrium Proposal](Proposal_Kleros.pdf)


## Twitter :  [debate3](https://twitter.com/debate3_) 

- Twitter survey : https://twitter.com/debate3_/status/1551063166485921793


## Contact Information :

Preferred contact information : You can contact the team on the address : rhouzm@gmail.com 

## Video Link : 

[Debate3 Video](https://www.loom.com/share/eceff0a8233d4c47aa2cdbc4f5f8333d) 







