pragma solidity ^0.8.9;
//SPDX-License-Identifier: MIT

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

/**
 * The Tama Collectibles will be the game items players can buy to compose to their Tama Container and build unique experiences
 */
contract Badges is ERC1155, Ownable {
  uint256 public constant BRONZE = 0;
  uint256 public constant SILVER = 1;
  uint256 public constant GOLD = 2;
  bool private _isInit;

  constructor() ERC1155('bafybeicbfeebzs4ntwu5ktsefmig7nztyz5puxnbv4wdm6euivbqf4ihqa/metadata/') {}

//   function init() public onlyOwner {
//     require(!_isInit, 'Collective: init - already in initialized');
//     _isInit = true;
//     _mint(msg.sender, BRONZE, 10**18, '');
//     _mint(msg.sender, SILVER, 10**18, '');
//   }
  function mint(address receiver, uint256 id, uint256 amount) onlyOwner external {
    _mint(receiver, id, amount, '');
  }
}
