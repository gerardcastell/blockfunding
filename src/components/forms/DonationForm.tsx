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
  const { ethereum } = window;
  const [currentAccount, setCurrentAccount] = useState<string>(incomingAccount);
  const { register, handleSubmit, reset } = useForm<Inputs>();

  useEffect(() => {
    ethereum.on('accountsChanged', function (accounts: any) {
      setCurrentAccount(accounts[0]);
    });
  }, []);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await smartContract.methods
        .makeDonation(projectId)
        .send({ from: currentAccount, value: ethToWei(data.amount) });
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
