pragma solidity ^0.8.9;
import './IMembership.sol';

contract Forum {

    uint256  public moderatorsCount;
    bool public initialized;
    address immutable membershipNFT;
    mapping (address => bool) isModerator;


    constructor (address[] memory _moderators, address _membershipNFT){
        require (initialized != true , "already initialized");
        uint256 len = _moderators.length;
        membershipNFT = _membershipNFT;
        for (uint256 i = 0 ; i < len ; i ++){
            isModerator[_moderators[i]] = true;
        }
        initialized = true;
    }

    function provideMembership(address[] memory users, string [] memory tokenURIs) external {
        require(isModerator[msg.sender],"Caller is not allowed to mint");
        IMembership(membershipNFT).provideMembership(users, tokenURIs);
    }  

}