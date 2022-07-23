pragma solidity ^0.8.9;

import "./Forum.sol";
import "./Membership.sol";
import "./IBadges.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import '@openzeppelin/contracts/access/Ownable.sol';
import "hardhat/console.sol";

interface IForum {
    function addContribution(address user, uint256 score) external;
    function isModerator(address user) external view returns (bool);
    function updateScores() external;
}


contract Vault is Ownable{

    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter public forumCounter;
    address public BadgesAddr;
    address[] public MembershipAddresses;
    address[] public forumAddresses;
    string[] public nftURIs;
    //moderators can have up to 3 forums
    uint256 private maxNumberOfForums = 3;
    uint256 public initialBalanceOfBadges;
    mapping (address => uint256) public balanceOfForum;
    mapping (address => uint256) public lastUpdatedBalance;
    mapping (address => uint256) public lastUpdatedScores;
    mapping(address => mapping(uint256 => address)) public forumsOfAddress;
    mapping(address => Counters.Counter) public addressForumCounter;
    mapping(address => bool) public isForum;
    uint256 updateBalanceThreshold = 2592000; // one month
    uint256 updateScoresThreshold = 86400; // one day

    event ForumCreated ( address );

    modifier isModerator(){
        require(addressForumCounter[msg.sender].current() > 0 , "is not moderator");
        _;
    }

    modifier hasBalance(address forum, uint256 amount){
        if(block.timestamp - lastUpdatedBalance[forum] > updateBalanceThreshold){
            lastUpdatedBalance[forum] = block.timestamp;
            balanceOfForum[forum] = initialBalanceOfBadges;
        }
        require(isForum[forum],"this is not a forum");
        require(balanceOfForum[forum]>=amount,"this forum has no balance until next month");
        _;
    }
    
    constructor(uint256 _initialBalanceOfBadges){
        initialBalanceOfBadges = _initialBalanceOfBadges;
    }

    function createForum(string memory name , address[] memory _moderators, string memory tokenURI) external {
        // address[] memory moderators = _moderators;
        uint256 len = _moderators.length;
        address[] memory moderators = new address[](len+1);
        for(uint256 i = 1 ;i < len + 1;i++){
            moderators[i] = _moderators[i-1];
        }
        moderators[0] = msg.sender;
        // contracts are created
        Membership _newMembership = new Membership(name, name);
        Forum _newForum = new Forum(moderators,address(_newMembership),tokenURI);
        MembershipAddresses.push(address(_newMembership));
        forumAddresses.push(address(_newForum));
        nftURIs.push(tokenURI);
        _newMembership.transferOwnership(address(_newForum));
        forumCounter.increment();

        //add forum to forumsOfAddress
        for(uint256 i = 0 ;i < len + 1;i++){
            _connectForumToAddress(moderators[i],address(_newForum));
        }
        balanceOfForum[address(_newForum)] = initialBalanceOfBadges; 
        isForum[address(_newForum)] = true;
        emit ForumCreated(address(_newForum));
    }

    function _connectForumToAddress(address user, address forumAddr) internal {
        require(addressForumCounter[user].current() < maxNumberOfForums , "One of the addresses have reached the maximum limit of 3");
        bool spotTaken = false;
        for(uint256 i=0 ; i<maxNumberOfForums;i++){
            if(forumsOfAddress[user][i] == address(0) && !spotTaken){
                forumsOfAddress[user][i] = forumAddr;
                spotTaken = true;
            }
        }
        addressForumCounter[user].increment();
        return;
    }

    function _needsUpdateScore(address _forum) view internal returns (bool){

        if(lastUpdatedScores[_forum]==0) return false;
        else{
            if(block.timestamp - lastUpdatedScores[_forum] >= updateScoresThreshold){
                return true;
            }else{
                return false;
            }
            
        }
    }

    function giveBronze (address user, uint256 qty, address forum) isModerator hasBalance(forum, qty) external {
        IBadges(BadgesAddr).mint(user, 0, qty);
        // require(balanceOfForum[forum] > qty * 1);
        balanceOfForum[forum] = balanceOfForum[forum]-(qty * 1);
        require(IForum(forum).isModerator(msg.sender),"caller is not a moderator of this forum");
        IForum(forum).addContribution(user, 5*qty);
        // bool flagsUpdate = _needsUpdateScore(forum);
        // if(flagsUpdate){
        //     IForum(forum).updateScores();
        //     lastUpdatedScores[forum] = block.timestamp;
        // }

    }
    function giveSilver (address user,uint256 qty, address forum) isModerator hasBalance(forum, qty*2) external {
        IBadges(BadgesAddr).mint(user, 1, qty);
        // require(balanceOfForum[forum] > qty * 2);
        balanceOfForum[forum] = balanceOfForum[forum]-(qty * 2);
        IForum(forum).addContribution(user, 10*qty);

    }
    function giveGold (address user,uint256 qty, address forum ) isModerator hasBalance(forum, qty*3)  external{
        IBadges(BadgesAddr).mint(user, 2, qty);
        // require(balanceOfForum[forum] > qty * 3);
        balanceOfForum[forum] = balanceOfForum[forum]-(qty * 3);
        IForum(forum).addContribution(user, 15*qty);

    }
    function claimUpgrade(uint256 from_id, uint256 to_id) external {
        require(to_id == from_id + 1, "can only upgrade one level up");
        require(IBadges(BadgesAddr).balanceOf(msg.sender,from_id) > 5,"User doesnt have enough badges to upgrade");
        IBadges(BadgesAddr).upgrade(from_id, to_id, msg.sender);
    }

    function _createClone(address target) internal returns (address result) {
        bytes20 targetBytes = bytes20(target);
        assembly {
            let clone := mload(0x40)
            mstore(clone, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
            mstore(add(clone, 0x14), targetBytes)
            mstore(add(clone, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
            result := create(0, clone, 0x37)
        }
    }

    function getForumsForAddress(address user) view public returns(address,address,address){

        return(forumsOfAddress[user][0],forumsOfAddress[user][1],forumsOfAddress[user][2]);

    }


    function setBadgesAddr(address _addr) onlyOwner external{
        BadgesAddr  = _addr;
    }
    // function getForums()
}