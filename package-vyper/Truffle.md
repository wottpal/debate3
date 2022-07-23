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
      goerli: {
        provider: () =>
        new HDWalletProvider("YOUR_MEMONIAC", "YOUR_INFURA_URL"),
        network_id: '5',
      }
    }
}
``` 
## Deployed contracts on Goerli : 

------- USING ``` truffle migrate --network goerli ``` ---------- 

#### Contract addresses available here : [Goerli Etherscan](https://goerli.etherscan.io/address/0xae8Cf2241562dA2453CbC77e408cfb52BBa0897e)

#### ERC721 : [ERC721 Contract Address](https://goerli.etherscan.io/address/0xae8Cf2241562dA2453CbC77e408cfb52BBa0897e)
#### Utils : [Utils Contract Address](https://goerli.etherscan.io/address/0xAA5201479713a4bF4214B548a7bA7D9EAc2791Df)
#### Vault : [Vault Contract Address](https://goerli.etherscan.io/address/0x853fcAEDff1650F8FC2E9810BC22B055F167d921)




