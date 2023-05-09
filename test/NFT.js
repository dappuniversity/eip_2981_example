const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("NFT", () => {
  const NAME = "Famous Paintings"
  const SYMBOL = "PAINT"
  const METADATA_URL = "ipfs://CID/"
  const ROYALTY_FEE = 500 // 5%

  let deployer, artist, minter
  let nft

  beforeEach(async () => {
    [deployer, artist, minter] = await ethers.getSigners()

    const NFT = await ethers.getContractFactory("NFT")
    nft = await NFT.deploy(NAME, SYMBOL, METADATA_URL, artist.address, ROYALTY_FEE)
  })

  describe('Deployment', () => {
    it('Returns the name', async () => {
      const result = await nft.name()
      expect(result).to.equal(NAME)
    })

    it('Returns the symbol', async () => {
      const result = await nft.symbol()
      expect(result).to.equal(SYMBOL)
    })

    it('Returns the royalty fee', async () => {
      const result = await nft.royaltyFee()
      expect(result).to.equal(ROYALTY_FEE)
    })

    it('Returns the artist', async () => {
      const result = await nft.artist()
      expect(result).to.equal(artist.address)
    })
  })

  describe('Minting & Royalty Info', () => {
    beforeEach(async () => {
      const transaction = await nft.connect(minter).mint()
      await transaction.wait()
    })

    it('Sets royalty info', async () => {
      const COST = ethers.utils.parseUnits("1", "ether") // Let's assume we sell NFT for 1 ETH

      const result = await nft.royaltyInfo(0, COST)
      expect(result[0]).to.equal(artist.address)
      expect(result[1]).to.equal("50000000000000000") // We expect the royalty to be 0.05 ETH (5%)
    })

    it('Updates totalSupply', async () => {
      const result = await nft.totalSupply()
      expect(result).to.equal(1)
    })

    it('Updates ownership', async () => {
      const result = await nft.ownerOf(0)
      expect(result).to.equal(minter.address)
    })
  })
})