const HDWallet = require('truffle-hdwallet-provider');
//const infuraKey = "";

const mnemonic ="alone visit curtain bus wise pistol man guess give edit hood accident"

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*",
        }
    }
}