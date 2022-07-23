# Variables 

owner : address 

# @dev Mapping address of the receiver to his token 
balanceOf : HashMap [address,HashMap[uint256,uint256]]

event TransferSingle:
    # Emits on transfer of a single token
    operator:   indexed(address)
    fromAddress: indexed(address)
    to: indexed(address)
    id: uint256
    value: uint256


## ERC1155 batchMint
@internal
def mint(receiver: address, id: uint256, amount:uint256, data:bytes32):
   
    assert self.owner == msg.sender, "Only the contract owner can mint"
    assert receiver != ZERO_ADDRESS, "Can not mint to ZERO ADDRESS"
    operator: address = msg.sender
    self.balanceOf[receiver][id] += amount
    log TransferSingle(operator, ZERO_ADDRESS, receiver, id, amount)

@internal
def burn(id: uint256, amount: uint256):
   
    assert self.balanceOf[msg.sender][id] > 0 , "caller does not own this ID"
    self.balanceOf[msg.sender][id] -= amount
    log TransferSingle(msg.sender, msg.sender, ZERO_ADDRESS, id, amount)


@external 
def upgrade(from_id: uint256, to_id: uint256, _from: address, _amount: uint256, data: bytes32):
    assert self.owner == msg.sender
    self.burn(from_id, 5 * 10 ** 18)
    self.mint(_from, from_id, 1 * 10 ** 18, data)



