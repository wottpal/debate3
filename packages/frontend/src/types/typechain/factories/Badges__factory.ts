/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { Badges, BadgesInterface } from "../Badges";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [],
    name: "BRONZE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "GOLD",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SILVER",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "from_id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "to_id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
    ],
    name: "upgrade",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "uri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040518060800160405280604a815260200162001ae5604a9139620000378162000049565b50620000433362000062565b62000197565b80516200005e906002906020840190620000b4565b5050565b600380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b828054620000c2906200015a565b90600052602060002090601f016020900481019282620000e6576000855562000131565b82601f106200010157805160ff191683800117855562000131565b8280016001018555821562000131579182015b828111156200013157825182559160200191906001019062000114565b506200013f92915062000143565b5090565b5b808211156200013f576000815560010162000144565b600181811c908216806200016f57607f821691505b602082108114156200019157634e487b7160e01b600052602260045260246000fd5b50919050565b61193e80620001a76000396000f3fe608060405234801561001057600080fd5b50600436106100ff5760003560e01c8063715018a611610097578063e3e55f0811610066578063e3e55f081461020e578063e985e9c514610216578063f242432a14610252578063f2fde38b1461026557600080fd5b8063715018a6146101d05780638da5cb5b146101d8578063a22cb465146101f3578063e00fd5431461020657600080fd5b80632eb2c2d6116100d35780632eb2c2d6146101825780633e4bee38146101955780634e1273f41461019d5780634fe1ac14146101bd57600080fd5b8062fdd58e1461010457806301ffc9a71461012a5780630e89341c1461014d578063156e29f61461016d575b600080fd5b610117610112366004611071565b610278565b6040519081526020015b60405180910390f35b61013d6101383660046110b1565b61030e565b6040519015158152602001610121565b61016061015b3660046110d5565b610360565b604051610121919061113b565b61018061017b36600461114e565b6103f4565b005b6101806101903660046112cd565b61041c565b610117600281565b6101b06101ab366004611377565b610468565b604051610121919061147d565b6101806101cb366004611490565b610592565b6101806105d0565b6003546040516001600160a01b039091168152602001610121565b6101806102013660046114c5565b6105e4565b610117600081565b610117600181565b61013d610224366004611501565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205460ff1690565b610180610260366004611534565b6105f3565b610180610273366004611599565b610638565b60006001600160a01b0383166102e85760405162461bcd60e51b815260206004820152602a60248201527f455243313135353a2061646472657373207a65726f206973206e6f742061207660448201526930b634b21037bbb732b960b11b60648201526084015b60405180910390fd5b506000908152602081815260408083206001600160a01b03949094168352929052205490565b60006001600160e01b03198216636cdb3d1360e11b148061033f57506001600160e01b031982166303a24d0760e21b145b8061035a57506301ffc9a760e01b6001600160e01b03198316145b92915050565b60606002805461036f906115b4565b80601f016020809104026020016040519081016040528092919081815260200182805461039b906115b4565b80156103e85780601f106103bd576101008083540402835291602001916103e8565b820191906000526020600020905b8154815290600101906020018083116103cb57829003601f168201915b50505050509050919050565b6103fc6106b1565b6104178383836040518060200160405280600081525061070b565b505050565b6001600160a01b03851633148061043857506104388533610224565b6104545760405162461bcd60e51b81526004016102df906115ef565b610461858585858561081f565b5050505050565b606081518351146104cd5760405162461bcd60e51b815260206004820152602960248201527f455243313135353a206163636f756e747320616e6420696473206c656e677468604482015268040dad2e6dac2e8c6d60bb1b60648201526084016102df565b6000835167ffffffffffffffff8111156104e9576104e9611181565b604051908082528060200260200182016040528015610512578160200160208202803683370190505b50905060005b845181101561058a5761055d8582815181106105365761053661163e565b60200260200101518583815181106105505761055061163e565b6020026020010151610278565b82828151811061056f5761056f61163e565b60209081029190910101526105838161166a565b9050610518565b509392505050565b61059a6106b1565b6105ad8184674563918244f400006109fc565b6104178183670de0b6b3a76400006040518060200160405280600081525061070b565b6105d86106b1565b6105e26000610b78565b565b6105ef338383610bca565b5050565b6001600160a01b03851633148061060f575061060f8533610224565b61062b5760405162461bcd60e51b81526004016102df906115ef565b6104618585858585610cab565b6106406106b1565b6001600160a01b0381166106a55760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016102df565b6106ae81610b78565b50565b6003546001600160a01b031633146105e25760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016102df565b6001600160a01b03841661076b5760405162461bcd60e51b815260206004820152602160248201527f455243313135353a206d696e7420746f20746865207a65726f206164647265736044820152607360f81b60648201526084016102df565b33600061077785610dd5565b9050600061078485610dd5565b90506000868152602081815260408083206001600160a01b038b168452909152812080548792906107b6908490611685565b909155505060408051878152602081018790526001600160a01b03808a1692600092918716917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a461081683600089898989610e20565b50505050505050565b81518351146108815760405162461bcd60e51b815260206004820152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e677468206044820152670dad2e6dac2e8c6d60c31b60648201526084016102df565b6001600160a01b0384166108a75760405162461bcd60e51b81526004016102df9061169d565b3360005b845181101561098e5760008582815181106108c8576108c861163e565b6020026020010151905060008583815181106108e6576108e661163e565b602090810291909101810151600084815280835260408082206001600160a01b038e1683529093529190912054909150818110156109365760405162461bcd60e51b81526004016102df906116e2565b6000838152602081815260408083206001600160a01b038e8116855292528083208585039055908b16825281208054849290610973908490611685565b92505081905550505050806109879061166a565b90506108ab565b50846001600160a01b0316866001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb87876040516109de92919061172c565b60405180910390a46109f4818787878787610f8b565b505050505050565b6001600160a01b038316610a5e5760405162461bcd60e51b815260206004820152602360248201527f455243313135353a206275726e2066726f6d20746865207a65726f206164647260448201526265737360e81b60648201526084016102df565b336000610a6a84610dd5565b90506000610a7784610dd5565b60408051602080820183526000918290528882528181528282206001600160a01b038b1683529052205490915084811015610b005760405162461bcd60e51b8152602060048201526024808201527f455243313135353a206275726e20616d6f756e7420657863656564732062616c604482015263616e636560e01b60648201526084016102df565b6000868152602081815260408083206001600160a01b038b81168086529184528285208a8703905582518b81529384018a90529092908816917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a4604080516020810190915260009052610816565b600380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b816001600160a01b0316836001600160a01b03161415610c3e5760405162461bcd60e51b815260206004820152602960248201527f455243313135353a2073657474696e6720617070726f76616c20737461747573604482015268103337b91039b2b63360b91b60648201526084016102df565b6001600160a01b03838116600081815260016020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6001600160a01b038416610cd15760405162461bcd60e51b81526004016102df9061169d565b336000610cdd85610dd5565b90506000610cea85610dd5565b90506000868152602081815260408083206001600160a01b038c16845290915290205485811015610d2d5760405162461bcd60e51b81526004016102df906116e2565b6000878152602081815260408083206001600160a01b038d8116855292528083208985039055908a16825281208054889290610d6a908490611685565b909155505060408051888152602081018890526001600160a01b03808b16928c821692918816917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a4610dca848a8a8a8a8a610e20565b505050505050505050565b60408051600180825281830190925260609160009190602080830190803683370190505090508281600081518110610e0f57610e0f61163e565b602090810291909101015292915050565b6001600160a01b0384163b156109f45760405163f23a6e6160e01b81526001600160a01b0385169063f23a6e6190610e64908990899088908890889060040161175a565b602060405180830381600087803b158015610e7e57600080fd5b505af1925050508015610eae575060408051601f3d908101601f19168201909252610eab9181019061179f565b60015b610f5b57610eba6117bc565b806308c379a01415610ef45750610ecf6117d8565b80610eda5750610ef6565b8060405162461bcd60e51b81526004016102df919061113b565b505b60405162461bcd60e51b815260206004820152603460248201527f455243313135353a207472616e7366657220746f206e6f6e20455243313135356044820152732932b1b2b4bb32b91034b6b83632b6b2b73a32b960611b60648201526084016102df565b6001600160e01b0319811663f23a6e6160e01b146108165760405162461bcd60e51b81526004016102df90611862565b6001600160a01b0384163b156109f45760405163bc197c8160e01b81526001600160a01b0385169063bc197c8190610fcf90899089908890889088906004016118aa565b602060405180830381600087803b158015610fe957600080fd5b505af1925050508015611019575060408051601f3d908101601f191682019092526110169181019061179f565b60015b61102557610eba6117bc565b6001600160e01b0319811663bc197c8160e01b146108165760405162461bcd60e51b81526004016102df90611862565b80356001600160a01b038116811461106c57600080fd5b919050565b6000806040838503121561108457600080fd5b61108d83611055565b946020939093013593505050565b6001600160e01b0319811681146106ae57600080fd5b6000602082840312156110c357600080fd5b81356110ce8161109b565b9392505050565b6000602082840312156110e757600080fd5b5035919050565b6000815180845260005b81811015611114576020818501810151868301820152016110f8565b81811115611126576000602083870101525b50601f01601f19169290920160200192915050565b6020815260006110ce60208301846110ee565b60008060006060848603121561116357600080fd5b61116c84611055565b95602085013595506040909401359392505050565b634e487b7160e01b600052604160045260246000fd5b601f8201601f1916810167ffffffffffffffff811182821017156111bd576111bd611181565b6040525050565b600067ffffffffffffffff8211156111de576111de611181565b5060051b60200190565b600082601f8301126111f957600080fd5b81356020611206826111c4565b6040516112138282611197565b83815260059390931b850182019282810191508684111561123357600080fd5b8286015b8481101561124e5780358352918301918301611237565b509695505050505050565b600082601f83011261126a57600080fd5b813567ffffffffffffffff81111561128457611284611181565b60405161129b601f8301601f191660200182611197565b8181528460208386010111156112b057600080fd5b816020850160208301376000918101602001919091529392505050565b600080600080600060a086880312156112e557600080fd5b6112ee86611055565b94506112fc60208701611055565b9350604086013567ffffffffffffffff8082111561131957600080fd5b61132589838a016111e8565b9450606088013591508082111561133b57600080fd5b61134789838a016111e8565b9350608088013591508082111561135d57600080fd5b5061136a88828901611259565b9150509295509295909350565b6000806040838503121561138a57600080fd5b823567ffffffffffffffff808211156113a257600080fd5b818501915085601f8301126113b657600080fd5b813560206113c3826111c4565b6040516113d08282611197565b83815260059390931b85018201928281019150898411156113f057600080fd5b948201945b838610156114155761140686611055565b825294820194908201906113f5565b9650508601359250508082111561142b57600080fd5b50611438858286016111e8565b9150509250929050565b600081518084526020808501945080840160005b8381101561147257815187529582019590820190600101611456565b509495945050505050565b6020815260006110ce6020830184611442565b6000806000606084860312156114a557600080fd5b83359250602084013591506114bc60408501611055565b90509250925092565b600080604083850312156114d857600080fd5b6114e183611055565b9150602083013580151581146114f657600080fd5b809150509250929050565b6000806040838503121561151457600080fd5b61151d83611055565b915061152b60208401611055565b90509250929050565b600080600080600060a0868803121561154c57600080fd5b61155586611055565b945061156360208701611055565b93506040860135925060608601359150608086013567ffffffffffffffff81111561158d57600080fd5b61136a88828901611259565b6000602082840312156115ab57600080fd5b6110ce82611055565b600181811c908216806115c857607f821691505b602082108114156115e957634e487b7160e01b600052602260045260246000fd5b50919050565b6020808252602f908201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60408201526e195c881b9bdc88185c1c1c9bdd9959608a1b606082015260800190565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600060001982141561167e5761167e611654565b5060010190565b6000821982111561169857611698611654565b500190565b60208082526025908201527f455243313135353a207472616e7366657220746f20746865207a65726f206164604082015264647265737360d81b606082015260800190565b6020808252602a908201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60408201526939103a3930b739b332b960b11b606082015260800190565b60408152600061173f6040830185611442565b82810360208401526117518185611442565b95945050505050565b6001600160a01b03868116825285166020820152604081018490526060810183905260a060808201819052600090611794908301846110ee565b979650505050505050565b6000602082840312156117b157600080fd5b81516110ce8161109b565b600060033d11156117d55760046000803e5060005160e01c5b90565b600060443d10156117e65790565b6040516003193d81016004833e81513d67ffffffffffffffff816024840111818411171561181657505050505090565b828501915081518181111561182e5750505050505090565b843d87010160208285010111156118485750505050505090565b61185760208286010187611197565b509095945050505050565b60208082526028908201527f455243313135353a204552433131353552656365697665722072656a656374656040820152676420746f6b656e7360c01b606082015260800190565b6001600160a01b0386811682528516602082015260a0604082018190526000906118d690830186611442565b82810360608401526118e88186611442565b905082810360808401526118fc81856110ee565b9897505050505050505056fea2646970667358221220b1a17ebd4d7b650de5159bb1b27014a5eaee9a7e3001fb18c726e389bdc117b064736f6c6343000809003368747470733a2f2f697066732e696e667572612e696f2f697066732f516d536d3247697553734d4d7865396b36785139637156596e54717a504739637a65484173557070576952314564";

type BadgesConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: BadgesConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Badges__factory extends ContractFactory {
  constructor(...args: BadgesConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Badges> {
    return super.deploy(overrides || {}) as Promise<Badges>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Badges {
    return super.attach(address) as Badges;
  }
  override connect(signer: Signer): Badges__factory {
    return super.connect(signer) as Badges__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BadgesInterface {
    return new utils.Interface(_abi) as BadgesInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Badges {
    return new Contract(address, _abi, signerOrProvider) as Badges;
  }
}
