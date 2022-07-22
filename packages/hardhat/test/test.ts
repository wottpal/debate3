import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { expect } from 'chai'
import { ethers } from 'hardhat'
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

  // describe('Deployment', function () {
  //   it('Should set the right unlockTime', async function () {
  //     const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture)

  //     expect(await lock.unlockTime()).to.equal(unlockTime)
  //   })

  //   it('Should set the right owner', async function () {
  //     const { lock, owner } = await loadFixture(deployOneYearLockFixture)

  //     expect(await lock.owner()).to.equal(owner.address)
  //   })

  //   it('Should receive and store the funds to lock', async function () {
  //     const { lock, lockedAmount } = await loadFixture(deployOneYearLockFixture)

  //     expect(await ethers.provider.getBalance(lock.address)).to.equal(lockedAmount)
  //   })

  //   it('Should fail if the unlockTime is not in the future', async function () {
  //     // We don't use the fixture here because we want a different deployment
  //     const latestTime = await time.latest()
  //     const Lock = await ethers.getContractFactory('Lock')
  //     await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
  //       'Unlock time should be in the future'
  //     )
  //   })
  // })

  // describe('Withdrawals', function () {
  //   describe('Validations', function () {
  //     it('Should revert with the right error if called too soon', async function () {
  //       const { lock } = await loadFixture(deployOneYearLockFixture)

  //       await expect(lock.withdraw()).to.be.revertedWith("You can't withdraw yet")
  //     })

  //     it('Should revert with the right error if called from another account', async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(deployOneYearLockFixture)

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime)

  //       // We use lock.connect() to send a transaction from another account
  //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       )
  //     })

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture)

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime)

  //       await expect(lock.withdraw()).not.to.be.reverted
  //     })
  //   })

  //   describe('Events', function () {
  //     it('Should emit an event on withdrawals', async function () {
  //       const { lock, unlockTime, lockedAmount } = await loadFixture(deployOneYearLockFixture)

  //       await time.increaseTo(unlockTime)

  //       await expect(lock.withdraw()).to.emit(lock, 'Withdrawal').withArgs(lockedAmount, anyValue) // We accept any value as `when` arg
  //     })
  //   })

  //   describe('Transfers', function () {
  //     it('Should transfer the funds to the owner', async function () {
  //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //         deployOneYearLockFixture
  //       )

  //       await time.increaseTo(unlockTime)

  //       await expect(lock.withdraw()).to.changeEtherBalances(
  //         [owner, lock],
  //         [lockedAmount, -lockedAmount]
  //       )
  //     })
  //   })
  // })
})
