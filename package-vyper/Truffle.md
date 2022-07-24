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

#### Badges : [Badges Contract Address](https://mumbai.polygonscan.com/address/0xdE2C80f7B58d0D6Aec27c81c102894C893152A0D)
#### ERC721 : [ERC721 Contract Address](https://mumbai.polygonscan.com/address/0xdC66bc5350899e7Ffb2b4912f63e0F63FE9E2fc7)
#### ERC1155 : [ERC1155 Contract Address](https://mumbai.polygonscan.com/address/0x8806936B652e4A87127a7C7ac3efd320eb8D86A5)
#### PoM : [PoM Contract Address](https://mumbai.polygonscan.com/address/0x637F7E9dE41Cf4d3ccfd5E43792c68390047eF11)
#### Utils : [Utils Contract Address](https://mumbai.polygonscan.com/address/0x86FcDcB1D5819835b790dD7feC89Ae8c890E2fF2)

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




