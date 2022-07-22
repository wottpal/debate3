import '@nomicfoundation/hardhat-toolbox'
import { ethers } from 'hardhat'
import { saveFrontendAddressFiles } from '../shared/saveFrontendAddressFiles'

async function main() {
  const cfVault = await ethers.getContractFactory('Vault')
  const cVault = await cfVault.deploy()
  await cVault.deployed()

  saveFrontendAddressFiles({
    Vault: cVault.address,
  })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
