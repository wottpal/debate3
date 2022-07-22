pragma solidity ^0.8.9;
import './IMembership.sol';
import "hardhat/console.sol";

contract Forum {

    uint256  public moderatorsCount;
    bool public initialized;
    address immutable membershipNFT;
    string public baseURI;
    mapping (address => bool) isModerator;

    modifier onlyModerator(){
        require(isModerator[msg.sender],"Caller is not allowed to mint");
        _;
    }


    constructor (address[] memory _moderators, address _membershipNFT, string memory _baseURI){
        require (initialized != true , "already initialized");
        uint256 len = _moderators.length;
        membershipNFT = _membershipNFT;
        for (uint256 i = 0 ; i < len ; i ++){
            isModerator[_moderators[i]] = true;
        }
        initialized = true;    
        baseURI = _baseURI;
    }

    function provideMembership(address[] memory users, string [] memory tokenURIs) onlyModerator external {
        
        IMembership(membershipNFT).provideMembership(users, tokenURIs);
    }

    function revokeMembership(address[] memory users) onlyModerator external  {
        IMembership(membershipNFT).revokeMembership(users);
    }



}