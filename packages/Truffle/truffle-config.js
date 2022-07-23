const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
    networks: {
      development: {
        host: "127.0.0.1",
        port: 7545,
        network_id: "*" // Match any network id
      },
      rinkeby: {
        provider: () =>
        new HDWalletProvider(process.env.MNEMONIC, "https://rinkeby.infura.io/v3/2910e39eaa7e402a814dc2ef2022969c"),
        network_id: '4',
      }
    }
}