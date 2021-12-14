import { useForm, SubmitHandler } from 'react-hook-form';
import { ethToWei, weiToEth } from '../utils/exchanges';
import { IAccount } from './IAccount';
import { Eth } from 'web3-eth';
import { Contract } from 'web3-eth-contract';


type Inputs = {
  originAccount: string;
  smartContractAddress: string;
  amount: string;
};

export default function TransactionForm({
  eth,
  accounts,
  userAccounts,
  contract
}: {
  eth: Eth,
  accounts: IAccount[];
  userAccounts: IAccount[];
  contract: Contract | undefined
}) {
  const { register, handleSubmit, watch } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      console.log(contract!.options.address)
    } catch (error) {
      alert(error);
    }
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)} key='origin'>
      <select {...register('originAccount')}>
        <option value=''></option>
        {userAccounts
          .filter((account) => account.address)
          .map((account) => {
            return (
              <option key={account.address} value={account.address}>{`${account.address
                } (${weiToEth(account.balance)} ETH)`}</option>
            );
          })}
      </select>
      <br />
      <input
        {...register('smartContractAddress')}
        placeholder='Smart contract address'
        autoComplete='false'
        key='smartContractAddress'
      />
      <br />
      <input
        {...register('amount')}
        placeholder='Amount'
        autoComplete='false'
        key='amount'
      />
      <input type='submit' />
    </form>
  );
}
