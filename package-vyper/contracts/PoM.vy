# --------------------------------- Usable with Version 0.3.3 ---------------------------------

# @dev Implementation of a Proof Of Membership for access to a Forum 
# by minting an NFT ERC721 


# @dev Address of minter, who can mint a token 
minter: address

MembershipAddresses : public(address[10]) 
forumAddresses : public(address[10])
owner: public(address)
baseURI: public(String[56]) 
TokenId: immutable(uint256)

# --------------------------------- Mappings ---------------------------------------------------
# @dev Mapping from owner address to count of his tokens.
ownerToNFTokenCount: HashMap[address, uint256]


# @dev Mapping from NFT ID to the address that owns it.
idToOwner: HashMap[uint256, address]


# @dev Mapping from owner address to mapping of operator addresses.
ownerToOperators: HashMap[address, HashMap[address, bool]]

# @dev Mapping from NFT ID to approved address.
idToApprovals: HashMap[uint256, address]

# @dev This emits when the Forum is created
event ForumCreated:
    forum : indexed(address)

# @dev Emits when ownernishp of NFT changes by *mechanism. 
event Transfer:
    sender: indexed(address)
    receiver: indexed(address)
    tokenId: indexed(uint256)

#@ dev This emits when a Membership NFT is minted 


#Constructor
@external 
def __init__(_tokenId: uint256):
    TokenId = _tokenId 

@external 
def createForum(name: String[10], _moderators: address[5], forum: address):

    moderators: DynArray[address, 5] = []
    for i in range(5):
        moderators[i-1] = msg.sender
    moderators[0] = msg.sender
    log ForumCreated(forum)

@internal
def _addTokenTo(_to: address, _tokenId: uint256):
    """
    @dev Add a NFT to a given address
         Throws if `_tokenId` is owned by someone.
    """
    # Throws if `_tokenId` is owned by someone
    assert self.idToOwner[_tokenId] == ZERO_ADDRESS
    # Change the owner
    self.idToOwner[_tokenId] = _to
    # Change count tracking
    self.ownerToNFTokenCount[_to] += 1


@internal
def mint(_to: address, _tokenId: uint256) -> bool:
   
    assert msg.sender == self.minter
    assert _to != ZERO_ADDRESS
    self._addTokenTo(_to, _tokenId)
    log Transfer(ZERO_ADDRESS, _to, _tokenId)
    return True


@pure                                            
@internal                                                         
def _digitToString(digit: uint256) -> String[1]:
    assert digit < 10  # only works with digits 0-9                           
    digit_bytes32: bytes32 = convert(digit + 48, bytes32)  # ASCII `0` is 0x30 (48 in decimal)
    digit_bytes1: Bytes[1] = slice(digit_bytes32, 31, 1)  # Remove padding bytes
    return convert(digit_bytes1, String[1]) 


@view             
@internal                                     
def _tokenIdToString(tokenId: uint256) -> String[4]:
    # NOTE: Only handles up to 4 digits, e.g. tokenId in [0, 9999]
    digit1: uint256 = tokenId % 10                  
    digit2: uint256 = (tokenId % 100) / 10                        
    digit3: uint256 = (tokenId % 1000) / 100
    digit4: uint256 = tokenId / 1000               
                                                        
    return concat(                                              
        self._digitToString(digit1),
        self._digitToString(digit2),                   
        self._digitToString(digit3),
        self._digitToString(digit4),
    )     

@view                                    
@internal                                                                                    
def tokenURI(tokenId: uint256) -> String[66]:                                                       
    return concat(self.baseURI, "/", self._tokenIdToString(tokenId), ".json")  


@internal
@view
def adding(x: uint256, y: uint256) -> uint256:
    return unsafe_add(x, y)

# @dev Minting the NFT as proof of Membership 
@external
def provideMembership(users: address[10], tokenURIs: String[100], _tokenId: uint256):
    assert msg.sender == self.owner
    for i in range(11):
        self.mint(users[i], _tokenId)
        self.adding(_tokenId, 1)
    self.tokenURI(_tokenId)


@internal
def _removeTokenFrom(_from: address, _tokenId: uint256):
    """
    @dev Remove a NFT from a given address
         Throws if `_from` is not the current owner.
    """
    # Throws if `_from` is not the current owner
    assert self.idToOwner[_tokenId] == _from
    # Change the owner
    self.idToOwner[_tokenId] = ZERO_ADDRESS
    # Change count tracking
    self.ownerToNFTokenCount[_from] -= 1



@internal
def _clearApproval(_owner: address, _tokenId: uint256):
    """
    @dev Clear an approval of a given address
         Throws if `_owner` is not the current owner.
    """
    # Throws if `_owner` is not the current owner
    assert self.idToOwner[_tokenId] == _owner
    if self.idToApprovals[_tokenId] != ZERO_ADDRESS:
        # Reset approvals
        self.idToApprovals[_tokenId] = ZERO_ADDRESS

@view
@internal
def balanceOf(_owner: address) -> uint256:
    """
    @dev Returns the number of NFTs owned by `_owner`.
         Throws if `_owner` is the zero address. NFTs assigned to the zero address are considered invalid.
    @param _owner Address for whom to query the balance.
    """
    assert _owner != ZERO_ADDRESS
    return self.ownerToNFTokenCount[_owner]

@view
@internal
def _isApprovedOrOwner(_spender: address, _tokenId: uint256) -> bool:
    """
    @dev Returns whether the given spender can transfer a given token ID
    @param spender address of the spender to query
    @param tokenId uint256 ID of the token to be transferred
    @return bool whether the msg.sender is approved for the given token ID,
        is an operator of the owner, or is the owner of the token
    """
    owner: address = self.idToOwner[_tokenId]
    spenderIsOwner: bool = owner == _spender
    spenderIsApproved: bool = _spender == self.idToApprovals[_tokenId]
    spenderIsApprovedForAll: bool = (self.ownerToOperators[owner])[_spender]
    return (spenderIsOwner or spenderIsApproved) or spenderIsApprovedForAll

@internal
def burn(_tokenId: uint256):
    """
    @dev Burns a specific ERC721 token.
         Throws unless `msg.sender` is the current owner, an authorized operator, or the approved
         address for this NFT.
         Throws if `_tokenId` is not a valid NFT.
    @param _tokenId uint256 id of the ERC721 token to be burned.
    """
    # Check requirements
    assert self._isApprovedOrOwner(msg.sender, _tokenId)
    owner: address = self.idToOwner[_tokenId]
    # Throws if `_tokenId` is not a valid NFT
    assert owner != ZERO_ADDRESS
    self._clearApproval(owner, _tokenId)
    self._removeTokenFrom(owner, _tokenId)
    log Transfer(owner, ZERO_ADDRESS, _tokenId)


@external 
def revokeMembership(users: address[10], _tokenId: uint256):
    for i in range(11):
        assert self.balanceOf(users[i]) >= 1
        self.burn(_tokenId)


