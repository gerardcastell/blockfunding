import { useForm, SubmitHandler } from 'react-hook-form';
import { ethToWei, weiToEth } from '../../utils/exchanges';
import { IAccount } from '../shared/IAccount';
import { smartContract } from '../../smartContract';
import { changeState } from '../../utils/fetchAccounts';

type Inputs = {
  originAccount: string;
  smartContractAddress: string;
  amount: string;
};

export default function DonationForm({ userAccount, stateSetter, ethGoal }: {
  userAccount: IAccount,
  ethGoal: number,
  stateSetter: React.Dispatch<React.SetStateAction<any>>
}) {

  const { register, handleSubmit, reset } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await smartContract.methods.makeDonation().send({ from: userAccount.address, value: ethToWei(data.amount) })
      alert("Donation processed!")
      const balance = await smartContract.methods.balance().call();
      changeState(stateSetter, "balance", weiToEth(balance));
      changeState(stateSetter, "progress", weiToEth(balance) as number / ethGoal);
    } catch (error) {
      alert(error);
    } finally {
      reset({ amount: "" });
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
      <button type="submit">Donate</button>
    </form>
  );
}
