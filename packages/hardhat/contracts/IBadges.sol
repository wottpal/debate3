pragma solidity ^0.8.9;
interface IBadges {
    function mint(address receiver, uint256 id, uint256 amount) external;
    function balanceOf(address account, uint256 id) external returns (uint256);
    function upgrade(uint256 from_id, uint256 to_id, address _from) external;
}