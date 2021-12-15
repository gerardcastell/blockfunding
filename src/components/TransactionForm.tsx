import { useForm, SubmitHandler } from 'react-hook-form';
import { ethToWei, weiToEth } from '../utils/exchanges';
import { IAccount } from './IAccount';
import { smartContract } from './smartContract';
import { useEffect, useState } from 'react';
import ProgressBar from './ProgressBar';

type Inputs = {
  originAccount: string;
  smartContractAddress: string;
  amount: string;
};


export default function TransactionForm({metaMaskAccount}: {metaMaskAccount: IAccount}) {
  useEffect(() => {
    setStateBalance();
  }, []);

  const [balance, setBalance] = useState(0);

  async function setStateBalance(): Promise<void> {
    const balance = await smartContract.methods.getBalance().call();
    setBalance(balance);
  }

  const { register, handleSubmit, reset } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await smartContract.methods.receiveMoney().send({ from: metaMaskAccount.address, value: ethToWei(data.amount) })
      .then(function (receipt: any) {
        console.log(receipt)
      });
      setStateBalance();
      reset({amount: ""});
    } catch (error) {
      alert(error);
    }
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <>
      <h1>Crowdfunding project</h1>
      <ProgressBar balance={weiToEth(balance.toString())} goal={100}></ProgressBar>
      {/* <div>{`${metaMaskAccount?.address} (${weiToEth(metaMaskAccount?.balance)} ETH)`}</div> */}
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
    </>
  );
}
