### Setup Truffle x Vyper :

1. Install Truffle globally.

`npm install -g truffle`

2. Box with necessary dependencies

`truffle unbox vyper-example`

3. Truffle Console :

`truffle develop`

4. Compile your contracts, run :

`truffle compile / migrate`

------


### Vyper ABI & Bytecode :

1. Run :

`vyper -f json,bytecode FILENAME.vy`

Output : `ABI ; BYTECODE`

2. Create in the `dir` a file `X.json` and fill it with : ` {[ ABI, BYTECODE ]}`

------------------------------------------------------------------------------------------------------

### How to use the ERC721 & ERC1155 contracts on Vyper 
