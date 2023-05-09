const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Marketplace", () => {
  const NAME = "Famous Paintings"
  const SYMBOL = "PAINT"
  const METADATA_URL = "ipfs://CID/"
  const ROYALTY_FEE = 500 // 5%
  const COST = ethers.utils.parseUnits("1", "ether")

  let deployer, artist, minter, buyer
  let nft, marketplace

  beforeEach(async () => {
    [deployer, artist, minter, buyer] = await ethers.getSigners()

    const NFT = await ethers.getContractFactory("NFT")
    nft = await NFT.deploy(NAME, SYMBOL, METADATA_URL, artist.address, ROYALTY_FEE)

    const Marketplace = await ethers.getContractFactory("Marketplace")
    marketplace = await Marketplace.deploy(nft.address)

    let transaction = await nft.connect(minter).mint()
    await transaction.wait()

    transaction = await nft.connect(minter).approve(marketplace.address, 0)
    await transaction.wait()

    transaction = await marketplace.connect(minter).list(0, COST)
    await transaction.wait()
  })

  describe('Deployment', () => {
    it('Returns the NFT address', async () => {
      const result = await marketplace.nft()
      expect(result).to.equal(nft.address)
    })
  })

  describe('Buying & Royalty', () => {
    let minterBalanceBefore, buyerBalanceBefore, artistBalanceBefore

    beforeEach(async () => {
      minterBalanceBefore = await ethers.provider.getBalance(minter.address)
      buyerBalanceBefore = await ethers.provider.getBalance(buyer.address)
      artistBalanceBefore = await ethers.provider.getBalance(artist.address)

      const transaction = await marketplace.connect(buyer).buy(0, { value: COST })
      await transaction.wait()
    })

    it('Sends royalty fee to artist', async () => {
      const result = await ethers.provider.getBalance(artist.address)
      expect(result).to.be.equal("10000050000000000000000") // 0.05 ETH (5% of 1 ETH)
    })

    it('Updates the original minter\'s balance', async () => {
      const result = await ethers.provider.getBalance(minter.address)
      expect(result).to.be.greaterThan((minterBalanceBefore))
    })

    it('Updates the buyer\'s balance', async () => {
      const result = await ethers.provider.getBalance(buyer.address)
      expect(result).to.be.lessThan(buyerBalanceBefore)
    })

    it('Updates ownership', async () => {
      const result = await nft.ownerOf(0)
      expect(result).to.equal(buyer.address)
    })
  })
})