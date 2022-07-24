const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

//CELO 


module.exports = {
    //contracts_directory : "./contracts",
    dashboard: {
        port: 24012
      },
    networks: {
      development: {
        host: "127.0.0.1",
        port: 8545,
        network_id: "*" // Match any network id
        
      },
      goerli: {
        provider: () =>
        new HDWalletProvider("impact amount garlic cliff surge resource they long illegal soul address scan", "https://goerli.infura.io/v3/2910e39eaa7e402a814dc2ef2022969c"),
        network_id: '5',
      },
      polygonMumbai: {
        provider: () =>
        new HDWalletProvider("impact amount garlic cliff surge resource they long illegal soul address scan", "https://polygon-mumbai.g.alchemy.com/v2/M6PhjPx1ho3V45E6ZyT7RV2iP19_w5Ev"),
        network_id: '80001',
      },
      cronosTestnet: {
        provider: () =>
        new HDWalletProvider("impact amount garlic cliff surge resource they long illegal soul address scan", "https://cronos-testnet-3.crypto.org:8545"),
        network_id: '338',
      },
      sokol: {
        provider: () =>
        new HDWalletProvider("impact amount garlic cliff surge resource they long illegal soul address scan", "https://goerli.infura.io/v3/2910e39eaa7e402a814dc2ef2022969c"),
        network_id: '5',
      },
      celoTesnet: {
        provider: () =>
        new HDWalletProvider("impact amount garlic cliff surge resource they long illegal soul address scan", "https://alfajores-forno.celo-testnet.org"),
        network_id: '44787',
        gas: 4000000, 
      },
      //https://solana-devnet.g.alchemy.com/v2/MYdIFMN5UIfnZzTbsoUNBwY2NS9xUdIW
      neonDevnet: {
        provider: () =>
        new HDWalletProvider("impact amount garlic cliff surge resource they long illegal soul address scan", "https://proxy.devnet.neonlabs.org/solana"),
        network_id: '245022926',
      },
      dashboard: {
        host: "localhost",
        port: 24012,
      },

    }
}