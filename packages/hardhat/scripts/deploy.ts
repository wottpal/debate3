import '@nomicfoundation/hardhat-toolbox'
import { parseUnits } from 'ethers/lib/utils'
import { ethers } from 'hardhat'
import { saveFrontendAddressFiles } from '../shared/saveFrontendAddressFiles'

async function main() {
  // const {deployerAddr, governorAddr} = await getNamedAccounts();
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

  // const sDeployer = await ethers.getSigner(deployerAddr);
  // const sGovernor = await ethers.getSigner(governorAddr);

  // await cVault.connect(sDeployer)['createForum']('Cohort1', [], 'trial2');
  // const cForum = await ethers.getContractAt('Forum', await cVault['forumAddresses'](0))

  // const isAllowed = await cForum.connect(sGovernor)['allowedForCaller']()
  // console.log(isAllowed);
  // await cForum.connect(sDeployer)['provideMembership']([sGovernor.address], [])
  // const isAllowedNew = await cForum.connect(sGovernor)['allowedForCaller']()
  // console.log(isAllowedNew);
  saveFrontendAddressFiles({
    Vault: cVault.address,
    cBadges: cBadges.address,
  })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
