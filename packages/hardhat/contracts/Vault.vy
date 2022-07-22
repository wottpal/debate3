# @version ^0.3.3

MembershipAddresses : public(address[10]) #immutable
forumAddresses : public(address[10])

event ForumCreated:
    forum : address

#Inheritance 

@external
def foo(blueprint: address) -> address:
    arg1: uint256 = 18
    arg2: String = "some string"
    return create_from_blueprint(blueprint, arg1, arg2, code_offset=1)


@external 
def createForum(name: String[10], _moderators: address[5]):

    moderators: DynArray[address, 5] = []
    for i in range(5):
        moderators[i-1] = msg.sender
    moderators[0] = msg.sender






