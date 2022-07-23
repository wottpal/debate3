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

### Truflle via terminal : 

1. run ``` truffle migrate --network goerli ``` 

#### Contract addresses available here : [Goerli Etherscan](https://goerli.etherscan.io/address/0xae8Cf2241562dA2453CbC77e408cfb52BBa0897e)

#### ERC721 : [ERC721 Contract Address](https://goerli.etherscan.io/address/0xae8Cf2241562dA2453CbC77e408cfb52BBa0897e)
#### Utils : [Utils Contract Address](https://goerli.etherscan.io/address/0xAA5201479713a4bF4214B548a7bA7D9EAc2791Df)
#### Vault : [Vault Contract Address](https://goerli.etherscan.io/address/0x853fcAEDff1650F8FC2E9810BC22B055F167d921)


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

#### ERC721 : [ERC721 Contract Address](https://goerli.etherscan.io/address/0x5420Ad5a0D61312f9DC531810E7961ea2643A36C)
#### Utils : [Utils Contract Address](https://goerli.etherscan.io/address/0x882cb75E2f4391E835Ecb998e8c5901F70E89A0F)
#### Vault : [Vault Contract Address](https://goerli.etherscan.io/address/0x1fdB4294da88B9F9bAc1D7B109ACa8b1B89CF429)


