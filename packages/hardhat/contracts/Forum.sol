pragma solidity ^0.8.9;
import './IMembership.sol';
import "hardhat/console.sol";
import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";



contract Forum is Ownable{

    using Counters for Counters.Counter;
    using SafeMath for uint256;
    uint256  public moderatorsCount;
    bool public initialized;
    address immutable membershipNFT;
    string public baseURI;
    mapping (address => bool) _isModerator;
    mapping (address => uint256) public contributionScore;
    mapping (uint256 => address) public _contributorByIndex;
    mapping (address => uint256) public lastInteractionUser;
    Counters.Counter public _contributorCounter;

    uint256 public TWODAY = 172800; // 2 days
    uint256 public DAY = 86400; // one day
    uint256 public MONTH = TWODAY * 15; //one month

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
        lastInteractionUser[user] = block.timestamp;
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
            scores[i] = getScore(_contributorByIndex[i]);
        }
        return(users,scores);
    }
    function getScore(address user) view public returns(uint256){
        uint256 unweightedScore = contributionScore[user];
        uint256 mulIndex;
        if(block.timestamp - lastInteractionUser[user] < TWODAY ){
            mulIndex = 10000;
        }else if(block.timestamp - lastInteractionUser[user] > MONTH){
            mulIndex = 0;
        }else {
            mulIndex = (block.timestamp - lastInteractionUser[user]).mul(10000);
            mulIndex = (mulIndex.div(TWODAY).sub(10)).div(15);
            mulIndex = 10000 - mulIndex;
        }
        // console.log('printing stamp',block.timestamp, mulIndex);
        uint256 weightedScore = unweightedScore.mul(mulIndex).div(10000);
        return weightedScore;
    }
    function dumyCall() external {
    }
    function allowedForCaller() external view returns(bool){
        uint256 curr_balance = IMembership(membershipNFT).balanceOf(msg.sender);
        return(curr_balance > 0);
    }

}