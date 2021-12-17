import { useForm, SubmitHandler } from 'react-hook-form';
import { smartContract } from '../../smartContract';

type Inputs = {
  title: string;
  deadline: string;
  goalAmount: number;
};


export default function ProjectForm({ userAccount }: { userAccount: string }) {

  const { register, handleSubmit, reset } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      // const millisDeadline = new Date(data.deadline).getTime();
      await smartContract.methods.createProject(data.title, data.goalAmount, data.deadline).send({ from: userAccount, gas: 3000000 });
      alert("Project created!");
      reset({title: "", goalAmount: 0, deadline: ""});
    } catch (error) {
      alert(error);
    }
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)} key='origin'>
      <br />
      <input
        {...register('title')}
        placeholder='Project title'
        autoComplete='off'
        key='title'
        required
      />
      <input
        {...register('goalAmount')}
        placeholder='Goal amount (ETH)'
        autoComplete='off'
        key='goalAmount'
        step={1}
        type="number"
        required
      />
        <input
        {...register('deadline')}
        placeholder='Project deadline'
        autoComplete='off'
        key='deadline'
        // type='date'
        required
      />
      <button type="submit">Create</button>
    </form>
  );
}
