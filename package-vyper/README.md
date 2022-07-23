Before using our contracts, please verify the version of your vyper using : ``` vyper --version ``` (0.3.3 is recommanded) 

check --> ``` https://github.com/vyperlang/vyper/pull/2979 ``` for more details about using certain functions. 


### Setup APE-VYPER : 

1. Install Ape Vyper via pip : 

``` pip install ape-vyper ``` 


### Setup Truffle x Vyper :

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

------


### Vyper ABI & Bytecode :

1. Run :

`vyper -f json,bytecode FILENAME.vy`

Output : `ABI ; BYTECODE`

2. Create in the `dir` a file `X.json` and fill it with : ` {[ ABI, BYTECODE ]}`

------------------------------------------------------------------------------------------------------

### How to use the ERC721 & ERC1155 contracts on Vyper 
