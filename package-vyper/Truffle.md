## Truffle Setup 

1. Install Truffle globally.

`npm install -g truffle`

2. Box with necessary dependencies

`truffle unbox vyper-example`

3. Install dependencies 

``` npm install @truffle/hdwallet-provider ``` 

4. Truffle Console :

`truffle develop`

5. Compile your contracts, run :

`truffle compile / migrate`


## Truffle deployments :

1. In the ``` truffle-config.js ``` use this template : 

``` const HDWalletProvider = require('@truffle/hdwallet-provider');
require("dotenv").config();

module.exports = {
    //contracts_directory : "./contracts",
    networks: {
      development: {
        host: "127.0.0.1",
        port: 8545,
        network_id: "*" // Match any network id
        
      },
      NAME_OF_NETWORK: {
        provider: () =>
        new HDWalletProvider("YOUR_MEMONIAC", "YOUR_INFURA_URL"),
        network_id: 'NETWORD_ID',
      }
    }
}
``` 
## Deployed contracts on : 

1. run ``` truffle migrate --network NETWORK_NAME ``` 

- Mumbai Testnet : [Mumbai PolygonScan](https://mumbai.polygonscan.com/)

#### Badges : [Badges Contract Address]()
#### ERC721 : [ERC721 Contract Address]()
#### ERC1155 : [ERC1155 Contract Address]()
#### PoM : [PoM Contract Address]()
#### Utils : [Utils Contract Address]()

- Cronos Testnet : [Cronos Scan](https://testnet.cronoscan.com/)

#### Badges : [Badges Contract Address]()
#### ERC721 : [ERC721 Contract Address]()
#### ERC1155 : [ERC1155 Contract Address]()
#### PoM : [PoM Contract Address]()
#### Utils : [Utils Contract Address]()

- Alfajores (CeloTesnet)  : [Algajores](https://alfajores-blockscout.celo-testnet.org/) 

#### Badges : [Badges Contract Address]()
#### ERC721 : [ERC721 Contract Address]()
#### ERC1155 : [ERC1155 Contract Address]()
#### PoM : [PoM Contract Address]()
#### Utils : [Utils Contract Address]()


### Truffle via dashboard : 

1. run : ``` truffle dashboard ```
2. open on your browser : ``` http://localhost:24012/ ``` 
3. Add on the ``` truffle-config.js ``` : 

``` 
dashboard: {
        host: "localhost",
        port: 24012,
      }
```

4. run : ``` truffle migrate --network dashboard ``` 




