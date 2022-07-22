from vyper.interfaces import ERC721

BLUEPRINT: immutable(address)

@external
def __init__(blueprint_address: address):
    BLUEPRINT = blueprint_address

@external
def create_new_erc721Membership(name: String[32], symbol: String[32]) -> ERC721:
    membership: address = create_from_blueprint(BLUEPRINT, name, symbol, code_offset=3)
    return ERC271(membership)