pragma solidity ^0.8.9;

import "./Forum.sol";
import "./Membership.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import '@openzeppelin/contracts/access/Ownable.sol';

contract Vault is Ownable{

    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter public forumCounter;
    address[] public MembershipAddresses;
    address[] public forumAddresses;
    event ForumCreated ( address );

    function createForum (string memory name , address[] memory _moderators) external {
        // address[] memory moderators = _moderators;
        uint256 len = _moderators.length;
        address[] memory moderators = new address[](len + 1);
        for(uint256 i = 0 ;i < len - 1;i++){
            moderators[i] = _moderators[i];
        }
        moderators[len-1] = msg.sender;
        // contracts are created
        Membership _newMembership = new Membership(name, name);
        Forum _newForum = new Forum(moderators,address(_newMembership));
        MembershipAddresses.push(address(_newMembership));
        forumAddresses.push(address(_newForum));
        _newMembership.transferOwnership(address(_newForum));
        forumCounter.increment();
        emit ForumCreated(address(_newForum));
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
}