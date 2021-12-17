import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

const web3 = new Web3('http://localhost:8545');
const abi: AbiItem[] = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_crowdFundingAddress',
        type: 'address',
      },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_segons', type: 'uint256' },
      { internalType: 'uint256', name: '_ethGoal', type: 'uint256' },
    ],
    name: 'createNewProject',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'crowdfundingList',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_crowdFundingAddress',
        type: 'address',
      },
    ],
    name: 'makeDonation',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'projects',
    outputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'uint256', name: 'balance', type: 'uint256' },
      { internalType: 'uint256', name: 'ethGoal', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdrawFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const address = '0x253839C34a88d160390F8B8054A0f99acC362865';

export const smartContract = new web3.eth.Contract(abi, address);
