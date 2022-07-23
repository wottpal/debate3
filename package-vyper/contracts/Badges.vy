# Variables 

owner : address 

# @dev Mapping address of the receiver to his token 
balanceOf : HashMap [address,HashMap[uint256,uint256]]


## mint ##
@external
def mint(receiver: address, id: uint256, amount:uint256, data:bytes32):
   
    assert self.owner == msg.sender, "Only the contract owner can mint"
    assert receiver != ZERO_ADDRESS, "Can not mint to ZERO ADDRESS"
    operator: address = msg.sender
    self.balanceOf[receiver][id] += amount
    log TransferSingle(operator, ZERO_ADDRESS, receiver, id, amount)


