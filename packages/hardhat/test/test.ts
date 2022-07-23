import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { expect } from 'chai'
import { ethers, hardhatArguments } from 'hardhat'
import { formatUnits, parseEther, parseUnits } from 'ethers/lib/utils'

describe('Test', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.

  async function baseFixture() {
    const [sDeployer, mehdi, peter, ykc, carlos, user1, user2, user3, user4] =
      await ethers.getSigners()
    const units = parseUnits('100', 18)

    const cfVault = await ethers.getContractFactory('Vault')
    const cVault = await cfVault.deploy(units)

    const cfBadges = await ethers.getContractFactory('Badges')
    const cBadges = await cfBadges.deploy()

    await cVault['setBadgesAddr'](cBadges.address)
    await cBadges['transferOwnership'](cVault.address)

    return { cVault, sDeployer, cBadges, mehdi, peter, ykc, carlos, user1, user2, user3, user4 }
  }

  it('can create forums', async function () {
    const { cVault, carlos, peter } = await loadFixture(baseFixture)

    await cVault.connect(carlos)['createForum']('Cohort1', [peter.address], 'trial1')
    const numberOfForums = await cVault['forumCounter']()

    expect(numberOfForums).to.equal(BigInt('1'))
  })

  it('can mint nfts', async function () {
    const { cVault, carlos, ykc, peter } = await loadFixture(baseFixture)

    await cVault.connect(carlos)['createForum']('Cohort1', [peter.address], 'trial2')
    const cMyForum = await ethers.getContractAt('Forum', await cVault['forumAddresses'](0))
    const cMembership = await ethers.getContractAt(
      'Membership',
      await cVault['MembershipAddresses'](0)
    )
    const oldBalance = await cMembership['balanceOf'](ykc.address)
    await cMyForum.connect(carlos)['provideMembership']([ykc.address], ['normal'])
    const newBalance = await cMembership['balanceOf'](ykc.address)
    const tokenOfOwnerByIndex = await cMembership['tokenOfOwnerByIndex'](ykc.address, 0)
    const URI = await cMembership['tokenURI'](tokenOfOwnerByIndex)

    expect(newBalance - oldBalance).to.equal(1)
    expect(URI).to.equal('normal')
  })

  it('other moderators can mint', async function () {
    const { cVault, carlos, ykc, peter, user1, user2 } = await loadFixture(baseFixture)

    await cVault.connect(carlos)['createForum']('Cohort2', [peter.address, ykc.address], 'trial3')
    const cMyForum = await ethers.getContractAt('Forum', await cVault['forumAddresses'](0))
    const cMembership = await ethers.getContractAt(
      'Membership',
      await cVault['MembershipAddresses'](0)
    )
    const oldBalance = await cMembership['balanceOf'](user1.address)
    await cMyForum.connect(ykc)['provideMembership']([user1.address], ['normal'])
    const newBalance = await cMembership['balanceOf'](user1.address)
    const tokenOfOwnerByIndex = await cMembership['tokenOfOwnerByIndex'](user1.address, 0)
    const URI = await cMembership['tokenURI'](tokenOfOwnerByIndex)

    const oldBalance2 = await cMembership['balanceOf'](user2.address)
    await cMyForum.connect(peter)['provideMembership']([user2.address], ['normal2'])
    const newBalance2 = await cMembership['balanceOf'](user2.address)
    const tokenOfOwnerByIndex2 = await cMembership['tokenOfOwnerByIndex'](user2.address, 0)
    const URI2 = await cMembership['tokenURI'](tokenOfOwnerByIndex2)

    expect(newBalance2 - oldBalance2).to.equal(1)
    expect(URI2).to.equal('normal2')
    expect(newBalance - oldBalance).to.equal(1)
    expect(URI).to.equal('normal')
  })

  it('non moderator cannot mint', async function () {
    const { cVault, carlos, ykc, peter, mehdi } = await loadFixture(baseFixture)

    await cVault.connect(carlos)['createForum']('Cohort1', [peter.address], 'trial4')
    const cMyForum = await ethers.getContractAt('Forum', await cVault['forumAddresses'](0))
    const cMembership = await ethers.getContractAt(
      'Membership',
      await cVault['MembershipAddresses'](0)
    )
    await expect(
      cMyForum.connect(ykc)['provideMembership']([mehdi.address], ['normal'])
    ).to.be.revertedWith('Caller is not allowed to mint')
  })

  it('can revoke memberships', async function () {
    const { cVault, carlos, ykc, peter } = await loadFixture(baseFixture)

    await cVault.connect(carlos)['createForum']('Cohort1', [peter.address], 'trial5')
    const cMyForum = await ethers.getContractAt('Forum', await cVault['forumAddresses'](0))
    const cMembership = await ethers.getContractAt(
      'Membership',
      await cVault['MembershipAddresses'](0)
    )
    const oldBalance = await cMembership['balanceOf'](ykc.address)
    await cMyForum.connect(carlos)['provideMembership']([ykc.address], ['normal'])
    const newBalance = await cMembership['balanceOf'](ykc.address)
    const tokenOfOwnerByIndex = await cMembership['tokenOfOwnerByIndex'](ykc.address, 0)
    const URI = await cMembership['tokenURI'](tokenOfOwnerByIndex)

    expect(newBalance - oldBalance).to.equal(1)
    expect(URI).to.equal('normal')

    await cMyForum.connect(peter)['revokeMembership']([ykc.address])
    const newBalance2 = await cMembership['balanceOf'](ykc.address)
    expect(newBalance2).to.equal(0)
  })

  it('can deploy up to 3 forums', async function () {
    const { cVault, carlos, ykc, peter } = await loadFixture(baseFixture)

    await cVault.connect(carlos)['createForum']('Cohort1', [peter.address], 'trial5')
    const forumBalance = await cVault['getForumsForAddress'](peter.address)
    // console.log(forumBalance);
    await cVault.connect(carlos)['createForum']('Cohort1', [peter.address], 'trial5')
    const forumBalance2 = await cVault['getForumsForAddress'](peter.address)
    // console.log(forumBalance2);
    await cVault.connect(carlos)['createForum']('Cohort1', [peter.address], 'trial5')
    const forumBalance3 = await cVault['getForumsForAddress'](peter.address)
    // console.log(forumBalance3);
    await expect(
      cVault.connect(carlos)['createForum']('Cohort1', [peter.address], 'trial5')
    ).to.be.revertedWith('One of the addresses have reached the maximum limit of 3')
  })

  it('can give badges', async function () {
    const { cVault, cBadges, carlos, ykc, peter } = await loadFixture(baseFixture)

    await cVault.connect(carlos)['createForum']('Cohort1', [peter.address], 'trial6')
    await cVault
      .connect(carlos)
      ['giveBronze'](
        ykc.address,
        parseEther('10'),
        (
          await cVault['getForumsForAddress'](carlos.address)
        )[0]
      )

    const balanceBronze = await cBadges['balanceOf'](ykc.address, 0)
    expect(balanceBronze).to.equal(parseEther('10'))
  })

  it('cant give more badges than max', async function () {
    const { cVault, cBadges, carlos, ykc, peter } = await loadFixture(baseFixture)

    await cVault.connect(carlos)['createForum']('Cohort1', [peter.address], 'trial6')
    const initialBalance = await cVault['initialBalanceOfBadges']()
    await expect(
      cVault
        .connect(carlos)
        ['giveBronze'](
          ykc.address,
          parseUnits('102', 18),
          (
            await cVault['getForumsForAddress'](carlos.address)
          )[0]
        )
    ).to.be.revertedWith('this forum has no balance until next month')
  })

  it('cant give more badges than max', async function () {
    const { cVault, cBadges, carlos, ykc, peter } = await loadFixture(baseFixture)

    await cVault.connect(carlos)['createForum']('Cohort1', [peter.address], 'trial6')
    const initialBalance = await cVault['initialBalanceOfBadges']()
    await cVault
      .connect(carlos)
      ['giveBronze'](
        ykc.address,
        parseUnits('50', 18),
        (
          await cVault['getForumsForAddress'](carlos.address)
        )[0]
      )
    await cVault
      .connect(carlos)
      ['giveSilver'](
        ykc.address,
        parseUnits('10', 18),
        (
          await cVault['getForumsForAddress'](carlos.address)
        )[0]
      )
    await expect(
      cVault
        .connect(carlos)
        ['giveGold'](
          ykc.address,
          parseUnits('11', 18),
          (
            await cVault['getForumsForAddress'](carlos.address)
          )[0]
        )
    ).to.be.revertedWith('this forum has no balance until next month')
  })

  it('badges update user score', async function () {
    const { cVault, cBadges, carlos, ykc, peter } = await loadFixture(baseFixture)
    await cVault.connect(carlos)['createForum']('Cohort1', [peter.address], 'trial6')

    await cVault
      .connect(carlos)
      ['giveBronze'](
        ykc.address,
        parseUnits('10', 18),
        (
          await cVault['getForumsForAddress'](carlos.address)
        )[0]
      )
    await cVault
      .connect(carlos)
      ['giveSilver'](
        ykc.address,
        parseUnits('20', 18),
        (
          await cVault['getForumsForAddress'](carlos.address)
        )[0]
      )

    const cForum = await ethers.getContractAt(
      'Forum',
      (
        await cVault['getForumsForAddress'](carlos.address)
      )[0]
    )

    const balance = await cForum['contributionScore'](ykc.address)

    // console.log(balance.toString());
    expect(balance).to.equal(parseUnits('250', 18))
  })

  it('user can claim upgrade', async function () {
    const { cVault, cBadges, carlos, ykc, peter } = await loadFixture(baseFixture)
    await cVault.connect(carlos)['createForum']('Cohort1', [peter.address], 'trial6')

    await cVault
      .connect(carlos)
      ['giveBronze'](
        ykc.address,
        parseUnits('5', 18),
        (
          await cVault['getForumsForAddress'](carlos.address)
        )[0]
      )
    await cVault
      .connect(carlos)
      ['giveSilver'](
        ykc.address,
        parseUnits('5', 18),
        (
          await cVault['getForumsForAddress'](carlos.address)
        )[0]
      )
    await cVault.connect(ykc)['claimUpgrade'](0, 1)
    await cVault.connect(ykc)['claimUpgrade'](1, 2)

    const balance0 = await cBadges['balanceOf'](ykc.address, 0)
    const balance1 = await cBadges['balanceOf'](ykc.address, 1)
    const balance2 = await cBadges['balanceOf'](ykc.address, 2)

    expect(balance0).to.equal(parseUnits('0', 18))
    expect(balance1).to.equal(parseUnits('1', 18))
    expect(balance2).to.equal(parseUnits('1', 18))
  })

  it('can track contributors list and scores', async function () {
    const { cVault, cBadges, carlos, ykc, peter, mehdi, user1 } = await loadFixture(baseFixture)
    await cVault.connect(carlos)['createForum']('Cohort1', [peter.address], 'trial6')

    await cVault
      .connect(carlos)
      ['giveBronze'](
        ykc.address,
        parseUnits('1', 18),
        (
          await cVault['getForumsForAddress'](carlos.address)
        )[0]
      )
    await cVault
      .connect(carlos)
      ['giveBronze'](
        mehdi.address,
        parseUnits('2', 18),
        (
          await cVault['getForumsForAddress'](carlos.address)
        )[0]
      )
    await cVault
      .connect(carlos)
      ['giveBronze'](
        user1.address,
        parseUnits('3', 18),
        (
          await cVault['getForumsForAddress'](carlos.address)
        )[0]
      )

    const cForum = await ethers.getContractAt(
      'Forum',
      (
        await cVault['getForumsForAddress'](carlos.address)
      )[0]
    )

    const contributors = await cForum['getContributors']()
    expect(contributors[0][0]).to.equal(ykc.address)
    expect(contributors[0][1]).to.equal(mehdi.address)
    expect(contributors[0][2]).to.equal(user1.address)
  })

  it('score decreased as time goes by', async function () {
    const { cVault, cBadges, carlos, ykc, peter } = await loadFixture(baseFixture)
    await cVault.connect(carlos)['createForum']('Cohort1', [peter.address], 'trial6')

    await cVault
      .connect(carlos)
      ['giveBronze'](
        ykc.address,
        parseUnits('5', 18),
        (
          await cVault['getForumsForAddress'](carlos.address)
        )[0]
      )
    const cForum = await ethers.getContractAt(
      'Forum',
      (
        await cVault['getForumsForAddress'](carlos.address)
      )[0]
    )

    const balance0 = await cForum['getScore'](ykc.address)
    // console.log(balance0.toString())
    await ethers.provider.send('evm_increaseTime', [172800 * 13])
    await cForum['dumyCall']()
    const balance1 = await cForum['getScore'](ykc.address)
    // console.log(balance1.toString())
  })
  it('reads right uri', async function () {
    const { cVault, cBadges, carlos, ykc, peter, mehdi, user1 } = await loadFixture(baseFixture)
    await cVault.connect(carlos)['createForum']('Cohort1', [peter.address], 'trial6')

    await cVault
      .connect(carlos)
      ['giveBronze'](
        ykc.address,
        parseUnits('1', 18),
        (
          await cVault['getForumsForAddress'](carlos.address)
        )[0]
      )
    await cVault
      .connect(carlos)
      ['giveBronze'](
        mehdi.address,
        parseUnits('2', 18),
        (
          await cVault['getForumsForAddress'](carlos.address)
        )[0]
      )
    await cVault
      .connect(carlos)
      ['giveBronze'](
        user1.address,
        parseUnits('3', 18),
        (
          await cVault['getForumsForAddress'](carlos.address)
        )[0]
      )

    const cForum = await ethers.getContractAt(
      'Forum',
      (
        await cVault['getForumsForAddress'](carlos.address)
      )[0]
    )
    const token_uri = await cBadges['uri'](1)

    console.log(token_uri)

    // const contributors = await cForum['getContributors']()
    // expect(contributors[0][0]).to.equal(ykc.address)
    // expect(contributors[0][1]).to.equal(mehdi.address)
    // expect(contributors[0][2]).to.equal(user1.address)
  })

  it('can mint nfts with empty array', async function () {
    const { cVault, carlos, ykc, peter } = await loadFixture(baseFixture)

    await cVault.connect(carlos)['createForum']('Cohort1', [peter.address], 'trial2')
    const cMyForum = await ethers.getContractAt('Forum', await cVault['forumAddresses'](0))
    const cMembership = await ethers.getContractAt(
      'Membership',
      await cVault['MembershipAddresses'](0)
    )
    const oldBalance = await cMembership['balanceOf'](ykc.address)
    await cMyForum.connect(carlos)['provideMembership']([ykc.address], [])
    const newBalance = await cMembership['balanceOf'](ykc.address)
    const tokenOfOwnerByIndex = await cMembership['tokenOfOwnerByIndex'](ykc.address, 0)
    const URI = await cMembership['tokenURI'](tokenOfOwnerByIndex)

    expect(newBalance - oldBalance).to.equal(1)
    expect(URI).to.equal('trial2')
  })

  it('provide membership', async function () {
    const { cVault, carlos, ykc, peter } = await loadFixture(baseFixture)

    await cVault.connect(carlos)['createForum']('Cohort1', [], 'trial2')
    const cForum = await ethers.getContractAt(
      'Forum',
      (
        await cVault['getForumsForAddress'](carlos.address)
      )[0]
    )

    const isAllowed = await cForum.connect(ykc)['allowedForCaller']()
    expect(isAllowed).to.equal(false)
    await cForum.connect(carlos)['provideMembership']([ykc.address], [])
    const isAllowedNew = await cForum.connect(ykc)['allowedForCaller']()
    expect(isAllowedNew).to.equal(true)
    // const newBalance = await cMembership['balanceOf'](ykc.address)
    // const tokenOfOwnerByIndex = await cMembership['tokenOfOwnerByIndex'](ykc.address, 0)
    // const URI = await cMembership['tokenURI'](tokenOfOwnerByIndex)

    // expect(newBalance - oldBalance).to.equal(1)
    // expect(URI).to.equal('trial2')
  })
})
