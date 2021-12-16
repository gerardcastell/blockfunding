import { useEffect, useState } from 'react';
import { IProjectInfo } from '../components/types/project';
import { smartContract } from '../smartContract';
import { secondsToMillis, weiToEth } from '../utils/exchanges';
import '../App.css';
import { changeState } from '../utils/fetchAccounts';
import { Link } from 'react-router-dom';

export default function ContractsList() {

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
        const id = 1;
        const balance = await smartContract.methods.balance().call();
        const ethGoal = await smartContract.methods.ethGoal().call();
        const deadline = await smartContract.methods.deadline().call();
        const progress = balance / ethGoal * 100;
        changeState(setState,"projectId", id);
        changeState(setState,"ethGoal", weiToEth(ethGoal) as number);
        changeState(setState,"balance", weiToEth(balance) as number);
        changeState(setState,"deadline", deadline);
        changeState(setState,"progress",  progress);
    };

    return (
        <>
            <h2>Contracts List</h2>
            <ul>
                <li>{`Id: ${state.projectId} Progress: ${state.balance} of ${state.ethGoal} ETH (${state.progress}%) Deadline: ${new Date(secondsToMillis(state.deadline))}`}</li>
                <Link to={`/${state.projectId}/donate`}>I want to contribute!</Link> 
            </ul>
        </>
    );
}