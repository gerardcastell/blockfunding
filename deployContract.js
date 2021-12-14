import Web3 from 'web3';
import * as fs from 'fs';

function run() {
  const ganacheWeb3 = new Web3('http://localhost:8545');
  const contractPath =
    './solc/smart-contract_SimplePayment_sol_SimplePayment.bin';
  const abiPath = './solc/smart-contract_SimplePayment_sol_SimplePayment.abi';
  const data = fs.readFileSync(contractPath).toString();

  try {
    console.log('Deploying smart contract');
    const contract = new ganacheWeb3.eth.Contract(
      JSON.parse(fs.readFileSync(abiPath).toString()),
      '0x1234567890123456789012345678901234567891', // Default from address (address of the smart contract to call)
      { data }
    );
    deployContract(contract, data);
  } catch (error) {
    throw console.error(`There was a problem deploying the smart contract: ${JSON.stringify(error)}`);
  }
}

function deployContract(contract, data) {
  contract
    .deploy({data})
    .send({
      from: '0xe553eE64bbFF7B2D3012efB884e0887Aa364691C',
      gas: 1500000,
      gasPrice: '30000000000000',
    })
    .then(function (newContractInstance) {
      console.log(`Contract deployed with address: ${newContractInstance.options.address}`); // instance with the new contract address
    })
    .catch(function (error) {
      throw new Error(error);
    });
}

run();
