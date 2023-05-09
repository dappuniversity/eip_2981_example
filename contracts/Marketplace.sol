// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import "./NFT.sol";

contract Marketplace {
    NFT public nft;

    mapping(uint256 => bool) public isListed;
    mapping(uint256 => uint256) public cost;
    mapping(uint256 => address) public lister;

    constructor(address _nft) {
        nft = NFT(_nft);
    }

    function list(uint256 _tokenId, uint256 _cost) public {
        require(!isListed[_tokenId]);

        nft.transferFrom(msg.sender, address(this), _tokenId);

        lister[_tokenId] = msg.sender;
        isListed[_tokenId] = true;
        cost[_tokenId] = _cost;
    }

    function buy(uint256 _tokenId) public payable {
        require(isListed[_tokenId]);
        require(msg.value >= cost[_tokenId]);

        isListed[_tokenId] = false;

        (address artist, uint256 fee) = nft.royaltyInfo(
            _tokenId,
            cost[_tokenId]
        );

        // Pay the artist
        (bool sent, ) = artist.call{value: fee}("");
        require(sent);

        // Pay the lister
        (sent, ) = lister[_tokenId].call{value: msg.value - fee}("");
        require(sent);

        // Transfer NFT
        nft.transferFrom(address(this), msg.sender, _tokenId);
    }
}
