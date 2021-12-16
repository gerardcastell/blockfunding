import { useEffect, useState } from 'react';
import { IAccount } from '../components/shared/IAccount';
import DonationForm from '../components/forms/DonationForm';
import ProgressBar from '../components/ProgressBar';
import { secondsToMillis, weiToEth } from '../utils/exchanges';
import { smartContract } from '../smartContract';
import { IProjectInfo } from '../components/types/project';
import { changeState } from '../utils/fetchAccounts';
import WithdrawButton from '../components/forms/WithdrawButton';

export default function Donation({ userAccount }: { userAccount: IAccount }) {

  useEffect(() => {
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
    const progress = balance / ethGoal * 100;
    changeState(setState, "ethGoal", parseFloat(weiToEth(ethGoal) as string));
    changeState(setState, "balance", parseFloat(weiToEth(balance) as string));
    changeState(setState, "deadline", parseInt(deadline));
    changeState(setState, "progress", progress);
  };

  return (
    <>
      <h1>PROJECT TITLE</h1>
      <h3>{`Closes on ${new Date(secondsToMillis(state.deadline))}`}</h3>
      <ProgressBar projectInfo={state}></ProgressBar>
      <DonationForm userAccount={userAccount} ethGoal={state.ethGoal} stateSetter={setState} />
      <WithdrawButton userAccount={userAccount}/>
    </>
  );
}
