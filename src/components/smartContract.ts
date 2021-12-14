import Web3 from 'web3';

const web3 = new Web3("http://localhost:8545");
const abi : any = [ //TODO: TYPE
  {
    inputs: [],
    name: 'balanceReceived',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'receiveMoney',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdrawMoney',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address payable', name: '_to', type: 'address' }],
    name: 'withdrawMoneyTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const address = '0x253839C34a88d160390F8B8054A0f99acC362865';

export const smartContract = new web3.eth.Contract(abi, address);

