#Implementation of IPFS baseURI stored on IPFS + TokenId with Vyper Syntax 

baseURI: public(String[56]) 

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
@external                                                                                      
def tokenURI(tokenId: uint256) -> String[66]:                                                       
    return concat(self.baseURI, "/", self._tokenIdToString(tokenId), ".json")  


