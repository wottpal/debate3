var ERC721 = artifacts.require("ERC721");
var Utils = artifacts.require("Utils");
var Vault = artifacts.require("Vault");


module.exports = function(deployer) {
  deployer.deploy(ERC721);
  deployer.deploy(Utils);
  deployer.deploy(Vault);

};
