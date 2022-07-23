const ERC721 = artifacts.require("ERC721");

contract("ERC721", () => {
  it("..", async () => {
    erc721 = await ERC721.deployed();
    // mint
    const minted = erc721.mint("0x839B878873998F02cE2f5c6D78d1B0842e58F192", 1);

    assert.equal(minted, TRUE, "Item not minted");
  });
});
