import { useEffect, useState } from 'react';
import { IAccount } from '../components/shared/IAccount';
import TransactionForm from '../components/forms/DonationForm';
import ProgressBar from '../components/ProgressBar';
import { weiToEth } from '../utils/exchanges';
import { smartContract } from '../smartContract';

export default function MakeDonation({ userAccount }: { userAccount: IAccount }) {

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    setStateBalance();
  }, [])

  const setStateBalance = async () => {
    const balance = await smartContract.methods.getBalance().call();
    setBalance(balance);
  };

  return (
    <>
      <h1>PROJECT TITLE</h1>
      <ProgressBar balance={weiToEth(balance.toString())} goal={100}></ProgressBar>
      <TransactionForm userAccount={userAccount} balanceSetter={setStateBalance} />
    </>
  );
}
