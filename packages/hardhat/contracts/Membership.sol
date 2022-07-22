pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/token/ERC1155/IERC1155.sol';
import '@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract Membership is ERC721, ERC721Enumerable, ERC721URIStorage, IERC1155Receiver, Ownable {

    using Counters for Counters.Counter;
    bool private initialized;
    Counters.Counter private _tokenIds;

    constructor (string memory name , string memory symbol) ERC721 (name,symbol) {
    }

    function initialize() onlyOwner external {
        require (initialized == false, "already initialized");
        initialized = true;
    }
    function provideMembership(address[] memory users, string [] memory tokenURIs) external onlyOwner{
        uint256 len = users.length;
        
        for(uint256 i = 0; i<len; i++){
            _tokenIds.increment();
            uint256 id = _tokenIds.current();
            _mint(users[i], id);
            _setTokenURI(id,tokenURIs[i]);
        }
    }   
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable, IERC165) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external returns (bytes4) {
        // We can update our stock !!
        // IERC1155 collectiblesContract = new IERC1155(from);
        return bytes4(keccak256('onERC1155Received(address,address,uint256,uint256,bytes)'));
    }

    /**
    * @dev Handles the receipt of a multiple ERC1155 token types. This function
    * is called at the end of a `safeBatchTransferFrom` after the balances have
    * been updated.
    *
    * NOTE: To accept the transfer(s), this must return
    * `bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))`
    * (i.e. 0xbc197c81, or its own function selector).
    *
    * @param operator The address which initiated the batch transfer (i.e. msg.sender)
    * @param from The address which previously owned the token
    * @param ids An array containing ids of each token being transferred (order and length must match values array)
    * @param values An array containing amounts of each token being transferred (order and length must match ids array)
    * @param data Additional data with no specified format
    * @return `bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))` if transfer is allowed
    */
    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external returns (bytes4) {}  
  
}