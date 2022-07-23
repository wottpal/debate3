const HDWallet = require('truffle-hdwallet-provider');
//const infuraKey = "";

const mnemonic =""

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*",
        }
    }
}