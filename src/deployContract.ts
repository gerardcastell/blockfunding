import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import * as fs from 'fs';

function run(): void {
  const ganacheWeb3 = new Web3('http://localhost:8545');
  const contractPath =
    './solc/smart-contract_SimplePayment_sol_SimplePayment.bin';
  const abiPath = './solc/smart-contract_SimplePayment_sol_SimplePayment.abi';

  const data = fs.readFileSync(contractPath).toString();
  try {
    console.log('Deploying smart contract');
    const contract = new ganacheWeb3.eth.Contract(
      JSON.parse(fs.readFileSync(abiPath).toString()),
      '0x1234567890123456789012345678901234567891',
      { data }
    );
    deployContract(contract, data);
  } catch (error) {
    throw console.error(error);
  }
}

function deployContract(contract: Contract, data: string) {
  contract
    .deploy({data})
    .send({
      from: '0x1234567890123456789012345678901234567891',
      gas: 1500000,
      gasPrice: '30000000000000',
    })
    .then(function (newContractInstance) {
      console.log(newContractInstance.options.address); // instance with the new contract address
    })
    .catch(function (error) {
      throw new Error(error);
    });
}

run();
