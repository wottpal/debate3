import '@nomicfoundation/hardhat-toolbox'
// import '@nomiclabs/hardhat-vyper'
import * as dotenv from 'dotenv'
import { HardhatUserConfig } from 'hardhat/config'
import * as ethers from 'ethers'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import 'hardhat-gas-reporter'
import 'solidity-coverage'
import 'hardhat-deploy'
import 'hardhat-contract-sizer'
import 'hardhat-deploy-ethers'
import '@openzeppelin/hardhat-upgrades'

const mnemonic = 'replace hover unaware super where filter stone fine garlic address matrix basic'

const privateKeys = []

//creates the list of private keys from the mnemonic
const derivePath = "m/44'/60'/0'/0/"
for (let i = 0; i <= 10; i++) {
  const wallet = new (ethers.Wallet.fromMnemonic as any)(mnemonic, `${derivePath}${i}`)
  privateKeys.push(wallet.privateKey)
}

module.exports = {
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
      },
      chainId: 1337,
      initialBaseFeePerGas: 0,
    },
    localhost: {
      url: 'http://127.0.0.1:8545/',
      chainId: 1337,
      timeout: 6000000,
    },
    mainnet: {
      url: `${process.env.MAINNET_PROVIDER_URL}`,
      accounts: [
        process.env.DEPLOYER_PRIVATE_KEY || privateKeys[2],
        process.env.GOVERNOR_PRIVATE_KEY || privateKeys[1],
      ],
      chainId: 1,
    },
    cronosTestnet: {
      url: `${process.env.CRONOS_PROVIDER_URL}`,
      accounts: [
        process.env.DEPLOYER_PRIVATE_KEY || privateKeys[2],
        process.env.GOVERNOR_PRIVATE_KEY || privateKeys[1],
      ],
      chainId: 338,
    },
    celo: {
      url: `${process.env.CELO_PROVIDER_URL}`,
      accounts: [
        process.env.DEPLOYER_PRIVATE_KEY || privateKeys[2],
        process.env.GOVERNOR_PRIVATE_KEY || privateKeys[1],
      ],
      chainId: 42220,
    },
    gnosisChain: {
      url: `${process.env.gnosisChain_PROVIDER_URL}`,
      accounts: [
        process.env.DEPLOYER_PRIVATE_KEY || privateKeys[2],
        process.env.GOVERNOR_PRIVATE_KEY || privateKeys[1],
      ],
      chainId: 100,
    },

    polygonMumbai: {
      url: `${process.env.MUMBAI_PROVIDER_URL}`,
      accounts: [
        process.env.DEPLOYER_PRIVATE_KEY || privateKeys[2],
        process.env.GOVERNOR_PRIVATE_KEY || privateKeys[1],
      ],
      chainId: 80001,
    },
    polygon: {
      url: `${process.env.POLYGON_PROVIDER_URL}`,
      accounts: [
        process.env.DEPLOYER_PRIVATE_KEY || privateKeys[2],
        process.env.GOVERNOR_PRIVATE_KEY || privateKeys[1],
      ],
      chainId: 137,
    },
    Ceramic: {
      url: `${process.env.CERAMIC_PROVIDER_URL}`,
      accounts: [
        process.env.DEPLOYER_PRIVATE_KEY || privateKeys[2],
        process.env.GOVERNOR_PRIVATE_KEY || privateKeys[1],
      ],
      chainId: 0,
    },
    bsc: {
      url: `${process.env.BSC_PROVIDER_URL}`,
      accounts: [
        process.env.DEPLOYER_PRIVATE_KEY || privateKeys[2],
        process.env.GOVERNOR_PRIVATE_KEY || privateKeys[1],
      ],
      chainId: 56,
    },
  },
  namedAccounts: {
    deployerAddr: {
      default: 0,
      localhost: 0,
    },
    governorAddr: {
      default: 1,
      localhost: 1,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
      bscTestnet: process.env.BSCSCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY,
    },
  },
}
