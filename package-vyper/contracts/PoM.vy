# --------------------------------- Usable with Version 0.3.3 ---------------------------------

# @dev Implementation of a Proof Of Membership for access to a Forum 
# by menting an NFT : ERC721 


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

# Minting the NFT as proof of Membership 


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

@external
def provideMembership(users: address[10], tokenURIs: String[100], _tokenId: uint256):
    assert msg.sender == self.owner
    for i in range(11):
        self.mint(users[i], _tokenId)
        self.adding(_tokenId, 1)
    self.tokenURI(_tokenId)




