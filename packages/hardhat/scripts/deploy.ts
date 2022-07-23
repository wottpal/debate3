import '@nomicfoundation/hardhat-toolbox'
import { ethers } from 'hardhat'
import { saveFrontendAddressFiles } from '../shared/saveFrontendAddressFiles'
import { formatUnits, parseEther, parseUnits } from 'ethers/lib/utils'

async function main() {
  const units = parseUnits('100', 18)
  const cfVault = await ethers.getContractFactory('Vault')
  const cVault = await cfVault.deploy(units)
  await cVault.deployed()
  console.log(cVault.address)
  const cfBadges = await ethers.getContractFactory('Badges')
  const cBadges = await cfBadges.deploy()
  await cBadges.deployed()
  console.log(cBadges.address)
  await cVault['setBadgesAddr'](cBadges.address)
  await cBadges['transferOwnership'](cVault.address)

  saveFrontendAddressFiles({
    Vault: cVault.address,
    cBadges: cBadges.address,
  })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
