pragma solidity ^0.8.9;
interface IBadges {
    function mint(address receiver, uint256 id, uint256 amount) external;
}