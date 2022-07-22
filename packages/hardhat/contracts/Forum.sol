pragma solidity ^0.8.9;

contract Forum {

    uint256  public moderatorsCount;
    mapping (address => bool) isModerator;

    constructor ( address[] memory moderators ) {
        uint256 len = moderators.length;

        for (uint256 i = 0 ; i < len ; i ++){
            isModerator[moderators[i]] = true;
        }
    }


}