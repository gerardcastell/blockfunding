import { useForm, SubmitHandler } from 'react-hook-form';
import { ethToWei } from '../../utils/exchanges';
import { IAccount } from '../shared/IAccount';
import { smartContract } from '../../smartContract';

type Inputs = {
  deadline: string;
  goalAmount: number;
};


export default function ProjectForm({ userAccount }: { userAccount: IAccount }) {

  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      console.log(data);
      console.log(new Date(data.deadline).getTime());
      // await smartContract.methods.receiveMoney().send({ from: userAccount.address, value: ethToWei(data.amount) })
    } catch (error) {
      alert(error);
    }
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)} key='origin'>
      <br />
      <input
        {...register('goalAmount')}
        placeholder='Goal amount (ETH)'
        autoComplete='false'
        key='goalAmount'
      />
      <input
        {...register('deadline')}
        placeholder='Project deadline'
        autoComplete='false'
        key='deadline'
        type='date'
      />
      <button type="submit">Create</button>
    </form>
  );
}
