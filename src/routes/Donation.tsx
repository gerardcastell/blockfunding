import { useEffect, useState } from 'react';
import { IAccount } from '../components/shared/IAccount';
import TransactionForm from '../components/forms/DonationForm';
import ProgressBar from '../components/ProgressBar';
import { weiToEth } from '../utils/exchanges';
import { smartContract } from '../smartContract';
import { IProjectInfo } from '../components/types/project';
import { changeState } from '../utils/fetchAccounts';

export default function MakeDonation({ userAccount }: { userAccount: IAccount }) {

  useEffect(() => {
    console.log("loquesea");
    setProjectInfo();
  }, [])

  const [state, setState] = useState<IProjectInfo>({
    projectId: "",
    balance: 0,
    ethGoal: 0,
    deadline: 0,
    progress: 0
  });

  const setProjectInfo = async () => {
    const balance = await smartContract.methods.balance().call();
    const ethGoal = await smartContract.methods.ethGoal().call();
    const deadline = await smartContract.methods.deadline().call();
    changeState(setState, "ethGoal", weiToEth(ethGoal) as number);
    changeState(setState, "balance", weiToEth(balance) as number);
    changeState(setState, "deadline", deadline);
    changeState(setState, "progress", state.balance / ethGoal);
  };

  return (
    <>
      <h1>PROJECT TITLE</h1>
      <ProgressBar projectInfo={state}></ProgressBar>
      <TransactionForm userAccount={userAccount} stateSetter={setState} />
    </>
  );
}
