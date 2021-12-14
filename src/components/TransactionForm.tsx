import { useForm, SubmitHandler } from 'react-hook-form';
import { ethToWei, weiToEth } from '../utils/exchanges';
import { IAccount } from './IAccount';
import { smartContract } from './smartContract';
import { useEffect, useState } from 'react';

type Inputs = {
  originAccount: string;
  smartContractAddress: string;
  amount: string;
};


export default function TransactionForm({
  metaMaskAccount,
}: {
  metaMaskAccount: IAccount;
}) {


  useEffect(() => {
    getBalance();
  }, []);

  const [balance, setBalance] = useState(0);

  async function getBalance(): Promise<void> {
    const balance = await smartContract.methods.getBalance().call();
    setBalance(balance);
  }

  const { register, handleSubmit, watch } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await smartContract.methods.receiveMoney().send({ from: metaMaskAccount.address, value: ethToWei(data.amount) })
      .then(function (receipt: any) {
        console.log(receipt)
      });
    } catch (error) {
      alert(error);
    }
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <>
      <div>SC balance: {weiToEth(balance.toString())} ETH</div>
      <div>{`${metaMaskAccount?.address} (${weiToEth(metaMaskAccount?.balance)} ETH)`}</div>
      <form onSubmit={handleSubmit(onSubmit)} key='origin'>
        <br />
        <input
          {...register('amount')}
          placeholder='Amount (ETH)'
          autoComplete='false'
          key='amount'
        />
        <button type="submit">Send to SC</button>
      </form>
    </>
  );
}
