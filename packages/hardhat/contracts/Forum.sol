pragma solidity ^0.8.9;
import './IMembership.sol';
import "hardhat/console.sol";
import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/utils/Counters.sol";



contract Forum is Ownable{

    using Counters for Counters.Counter;

    uint256  public moderatorsCount;
    bool public initialized;
    address immutable membershipNFT;
    string public baseURI;
    mapping (address => bool) _isModerator;
    mapping (address => uint256) public contributionScore;
    mapping (uint256 => address) public _contributorByIndex;
    Counters.Counter public _contributorCounter;

    modifier onlyModerator(){
        require(_isModerator[msg.sender],"Caller is not allowed to mint");
        _;
    }
    constructor (address[] memory _moderators, address _membershipNFT, string memory _baseURI){
        require (initialized != true , "already initialized");
        uint256 len = _moderators.length;
        membershipNFT = _membershipNFT;
        for (uint256 i = 0 ; i < len ; i ++){
            _isModerator[_moderators[i]] = true;
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
    function addContribution(address user, uint256 score) onlyOwner external {
        if(contributionScore[user]==0){
            uint256 currIdx = _contributorCounter.current();
            _contributorCounter.increment();
            _contributorByIndex[currIdx] = user;
        }
        contributionScore[user] = contributionScore[user]+score;
    }
    function isModerator(address _moderator) external view returns(bool){
        return(_isModerator[_moderator]);
    }
    function getContributors() external view returns(address[]memory, uint256[] memory){
        uint256 currIdx = _contributorCounter.current();
        address[] memory users = new address[](currIdx);
        uint256[] memory scores = new uint256[](currIdx);

        for(uint256 i = 0; i < currIdx ; i++){
            users[i] = _contributorByIndex[i];
            scores[i] = contributionScore[_contributorByIndex[i]];
        }
        return(users,scores);
    }

}