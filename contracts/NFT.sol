// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    ERC721Royalty,
    Ownable
{
    using Strings for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    string public metadataURI;

    address public artist;
    uint96 public royaltyFee;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _metadataURI,
        address _artist,
        uint96 _royaltyFee
    ) ERC721(_name, _symbol) {
        metadataURI = _metadataURI;
        artist = _artist;
        royaltyFee = _royaltyFee;
    }

    function mint() public {
        uint256 tokenId = _tokenIds.current();

        _safeMint(msg.sender, tokenId);
        _setTokenURI(
            tokenId,
            string(abi.encodePacked(metadataURI, tokenId.toString(), ".json"))
        );
        _setTokenRoyalty(tokenId, artist, royaltyFee);

        _tokenIds.increment();
    }

    function setRoyaltyFee(uint96 _royaltyFee) public onlyOwner {
        // This just updates the royaltyFee state variable, you can alternatively pass in a
        // _tokenId parameter and call _setTokenRoyalty() to update an already minted token
        royaltyFee = _royaltyFee;
    }

    // The following functions are overrides required by Solidity.

    function _burn(
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721URIStorage, ERC721Royalty) {
        super._burn(tokenId);
        _resetTokenRoyalty(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721Royalty)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
