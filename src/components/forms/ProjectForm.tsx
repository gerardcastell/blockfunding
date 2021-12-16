import { useForm, SubmitHandler } from 'react-hook-form';
import { smartContract } from '../../smartContract';
import { ethToWei, MILLIS_X_DAYS } from '../../utils/exchanges';
import { IAccount } from '../shared/IAccount';

type Inputs = {
  deadline: string;
  goalAmount: number;
};


export default function ProjectForm({ userAccount }: { userAccount: IAccount }) {

  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const millisDeadline = new Date(data.deadline);
      millisDeadline.setHours(0, 0, 0, 0);
      const daysDeadline = Math.floor(millisDeadline.getTime() / (MILLIS_X_DAYS));
      console.log(daysDeadline);
      // await smartContract.methods.createNewProject().send({ from: userAccount.address, value: data.goalAmount })
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
        required
      />
      <input
        {...register('deadline')}
        placeholder='Project deadline'
        autoComplete='false'
        key='deadline'
        type='date'
        required
      />
      <button type="submit">Create</button>
    </form>
  );
}
