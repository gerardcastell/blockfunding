import { useForm, SubmitHandler } from 'react-hook-form';
import { ethToWei, weiToEth } from '../../utils/exchanges';
import { IAccount } from '../shared/IAccount';
import { smartContract } from '../../smartContract';
import { useEffect, useState } from 'react';
import ProgressBar from '../ProgressBar';

type Inputs = {
  originAccount: string;
  smartContractAddress: string;
  amount: string;
};


export default function TransactionForm({userAccount, balanceSetter}: {userAccount: IAccount, balanceSetter: () => Promise<void>}) {

  const { register, handleSubmit, reset } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await smartContract.methods.receiveMoney().send({ from: userAccount.address, value: ethToWei(data.amount) })
      .then(function (receipt: any) {
        console.log(receipt)
      });
      balanceSetter();
      reset({amount: ""});
    } catch (error) {
      alert(error);
    }
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
      <form onSubmit={handleSubmit(onSubmit)} key='origin'>
        <br />
        <input
          {...register('amount')}
          placeholder='Amount (ETH)'
          autoComplete='false'
          key='amount'
        />
        <button type="submit">Donate</button>
      </form>
  );
}
