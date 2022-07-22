pragma solidity ^0.8.9;

import "./Forum.sol";

contract Vault {

    address public immutable owner;
    address internal immutable forumTemplate;

    event ForumCreated ( address );

    constructor(address _forumTemplate){
        owner = msg.sender;
        forumTemplate = _forumTemplate;
    }

    function createForum (string memory _ForumDetails , address[] memory _moderators, string memory _NFTMetadata) external {
        // address[] memory moderators = _moderators;
        uint256 len = _moderators.length;
        address[] memory moderators = new address[](len + 1);
        for(uint256 i = 0 ;i < len - 1;i++){
            moderators[i] = _moderators[i];
        }
        moderators[len-1] = msg.sender;
        Forum _newForum = Forum(_createClone(forumTemplate));
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