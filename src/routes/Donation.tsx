import { useEffect, useState } from 'react';
import DonationForm from '../components/forms/DonationForm';
import ProgressBar from '../components/ProgressBar';
import { secondsToMillis } from '../utils/exchanges';
import { smartContract } from '../smartContract';
import WithdrawButton from '../components/forms/WithdrawButton';
import { useParams } from 'react-router-dom';
import ClaimButton from '../components/forms/ClaimButton';

export default function Donation({ userAccount }: { userAccount: string }) {
  // const [currentAccount, setCurrentAccount] = useState<string>(userAccount);

  useEffect(() => {
    setProjectInfo();
  }, []);

  const { id } = useParams();

  const [state, setState] = useState<any>({
    projectId: '',
    title: '',
    balance: 0,
    ethGoal: 0,
    deadline: 0,
    progress: 0,
  });

  const setProjectInfo = async () => {
    const projectInfo = await smartContract.methods.getProject(id).call();
    setState(projectInfo);
  };

  return (
    <>
      <h1>{state.title}</h1>
      <h3>{`Closes on ${new Date(secondsToMillis(state.deadline))}`}</h3>
      <ProgressBar projectInfo={state}></ProgressBar>
      <DonationForm
        incomingAccount={userAccount}
        projectId={state.owner}
        stateSetter={setState}
      />
      <ClaimButton userAccount={userAccount} />
      <WithdrawButton userAccount={userAccount} />
    </>
  );
}
