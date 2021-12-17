import { useForm, SubmitHandler } from 'react-hook-form';
import { ethToWei, weiToEth } from '../../utils/exchanges';
import { smartContract } from '../../smartContract';
import { changeState } from '../../utils/fetchAccounts';
import { useEffect, useState } from 'react';

type Inputs = {
  originAccount: string;
  smartContractAddress: string;
  amount: string;
};

export default function DonationForm({
  incomingAccount,
  projectId,
  stateSetter,
}: {
  incomingAccount: string;
  projectId: string;
  stateSetter: React.Dispatch<React.SetStateAction<any>>;
}) {
  const { register, handleSubmit, reset } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await smartContract.methods
        .makeDonation(projectId)
        .send({ from: incomingAccount, value: ethToWei(data.amount) });
      alert('Donation processed!');
      const projectInfo = await smartContract.methods
        .getProject(projectId)
        .call();
      stateSetter(projectInfo);
    } catch (error) {
      alert(error);
    } finally {
      reset({ amount: '' });
    }
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)} key='origin'>
      <br />
      <input
        {...register('amount')}
        placeholder='Amount (ETH)'
        autoComplete='off'
        key='amount'
      />
      <button type='submit'>Donate</button>
    </form>
  );
}
