# NFT Royalties w/ EIP 2981

## Technology Stack & Tools
- Solidity (Writing Smart Contracts & Tests)
- Javascript (React & Testing)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [OpenZeppelin](https://docs.openzeppelin.com/contracts/4.x/) (Smart Contract Library)

## Extra Resources
- [EIP-2981](https://eips.ethereum.org/EIPS/eip-2981)
- [OpenZeppelin's ERC721Royalty](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721Royalty)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/). Recommended to use the LTS version.

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
`$ npm install`

### 3. Run NFT Test
`$ npx hardhat test test/NFT.js`

### 4. Run Marketplace Test
`$ npx hardhat test test/Marketplace.js`

### 5. (Optional) Run Both Tests
`$ npx hardhat test`