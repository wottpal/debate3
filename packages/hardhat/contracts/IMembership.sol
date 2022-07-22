pragma solidity ^0.8.9;

interface IMembership {
    function provideMembership(address [] memory users, string[] memory tokenURIs) external;
    function revokeMembership(address [] memory users) external;
}