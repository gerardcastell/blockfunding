import { TransactionConfig, PromiEvent, TransactionReceipt } from 'web3-core';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ethToWei, weiToEth } from '../shared/exchanges';
import { IAccount } from './IAccount';

type Inputs = {
  origin: string;
  destination: string;
  amount: string;
};

export default function TransactionForm({
  sendTransaction,
  accounts,
}: {
  sendTransaction(transactionConfig: TransactionConfig): PromiEvent<TransactionReceipt>;
  accounts: IAccount[];
}) {
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const receipt = await sendTransaction({
        from: data.origin,
        to: data.destination,
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
      receipt?.status && alert('Transfer done');
    } catch (error) {
      alert(error);
    }
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)} key='origin'>
      <select {...register('origin')}>
        <option value=''></option>
        {accounts
          .filter((account) => account.address)
          .map((account) => {
            return (
              <option value={account.address}>{`${account.address} (${weiToEth(
                account.balance
              )} ETH)`}</option>
            );
          })}
      </select>
      <br />
      <select {...register('destination')} key='destination'>
        <option value=''></option>
        {accounts
          .filter((account) => account.address !== origin)
          .map((account) => {
            return (
              <option value={account.address}>{`${account.address} (${weiToEth(
                account.balance
              )} ETH)`}</option>
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
