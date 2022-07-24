var ERC721 = artifacts.require("ERC721");
var Utils = artifacts.require("Utils");
var Badges = artifacts.require("Badges");
var PoM = artifacts.require("PoM");
var ERC1155 = artifacts.require("ERC1155");


module.exports = function(deployer) {
  deployer.deploy(ERC721);
  deployer.deploy(Utils);
  deployer.deploy(Badges);
  deployer.deploy(ERC1155, "GLD", "BadgeGold", "10", "20");
  deployer.deploy(PoM, 3);
};
