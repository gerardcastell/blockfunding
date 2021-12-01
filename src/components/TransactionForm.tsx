import { TransactionConfig, PromiEvent, TransactionReceipt } from 'web3-core';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ethToWei, weiToEth } from '../utils/exchanges';
import { IAccount } from './IAccount';

type Inputs = {
  originAccount: string;
  destinationAccount: string;
  amount: string;
};

export default function TransactionForm({
  sendTransaction,
  accounts,
  userAccounts,
}: {
  sendTransaction(
    transactionConfig: TransactionConfig
  ): PromiEvent<TransactionReceipt>;
  accounts: IAccount[];
  userAccounts: IAccount[];
}) {
  const { register, handleSubmit, watch } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const receipt = await sendTransaction({
        from: data.originAccount,
        to: data.destinationAccount,
        value: ethToWei(data.amount),
        // gas?: number | string;
        // gasPrice?: number | string | BN;
        // data?: string;
        // nonce?: number;
        // chainId?: number;
        // common?: Common;
        // chain?: string;
        // hardfork?: string;
      });
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
              <option key={account.address} value={account.address}>{`${
                account.address
              } (${weiToEth(account.balance)} ETH)`}</option>
            );
          })}
      </select>
      <br />
      <select {...register('destinationAccount')} key='destination'>
        <option value=''></option>
        {accounts
          .filter((account) => account.address !== watch('originAccount'))
          .map((account) => {
            return (
              <option key={account.address} value={account.address}>{`${
                account.address
              } (${weiToEth(account.balance)} ETH)`}</option>
            );
          })}
      </select>
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
