import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import * as fs from 'fs';

export default class Deployer {
  private ganacheWeb3: Web3;
  private contractPath: string;
  private abiPath: string;
  public contract: Contract | undefined;

  constructor() {
    this.ganacheWeb3 = new Web3('http://localhost:8545');
    this.contractPath =
      './solc/smart-contract_SimplePayment_sol_SimplePayment.bin';
    this.abiPath = './solc/smart-contract_SimplePayment_sol_SimplePayment.abi';
  }

  public deploy() {
    const data = fs.readFileSync(this.contractPath).toString();
    try {
      console.log('Deploying smart contract');
      const contract = new this.ganacheWeb3.eth.Contract(
        JSON.parse(fs.readFileSync(this.abiPath).toString()),
        '0x1234567890123456789012345678901234567891', // Default from address (address of the smart contract to call)
        { data }
      );
      this.web3Deploy(contract, data);
    } catch (error) {
      throw console.error(
        `There was a problem deploying the smart contract: ${JSON.stringify(
          error
        )}`
      );
    }
  }

  private web3Deploy(contract: Contract, data: string) {
    contract
      .deploy({ data })
      .send({
        from: '0xe553eE64bbFF7B2D3012efB884e0887Aa364691C',
        gas: 1500000,
        gasPrice: '30000000000000',
      })
      .then( (newContractInstance) => {
        console.log(
          `Contract deployed with address: ${newContractInstance.options.address}`
        ); // instance with the new contract address
        this.contract = newContractInstance;
      })
      .catch(function (error) {
        throw new Error(error);
      });
  }
}
