const HDWalletProvider = require('@truffle/hdwallet-provider');
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
        new HDWalletProvider("impact amount garlic cliff surge resource they long illegal soul address scan", "https://goerli.infura.io/v3/2910e39eaa7e402a814dc2ef2022969c"),
        network_id: '5',
      }
    }
}