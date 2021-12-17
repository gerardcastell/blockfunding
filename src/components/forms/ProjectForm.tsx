import { useForm, SubmitHandler } from 'react-hook-form';
import { smartContract } from '../../smartContract';
import { IAccount } from '../shared/IAccount';

type Inputs = {
  deadline: string;
  goalAmount: number;
};


export default function ProjectForm({ userAccount }: { userAccount: IAccount }) {

  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const millisDeadline = new Date(data.deadline).getTime();
      await smartContract.methods.createNewProject(millisDeadline / 1000, data.goalAmount).send({ from: userAccount.address });
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
        autoComplete='off'
        key='goalAmount'
        required
        type="number"
      />
      <input
        {...register('deadline')}
        placeholder='Project deadline'
        autoComplete='off'
        key='deadline'
        required
        type='date'
      />
      <button type="submit">Create</button>
    </form>
  );
}
