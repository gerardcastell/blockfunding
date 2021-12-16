import { useEffect, useState } from 'react';
import { IProjectInfo } from '../components/types/project';
import { smartContract } from '../smartContract';
import { weiToEth } from '../utils/exchanges';
import '../App.css';
import { changeState } from '../utils/fetchAccounts';
import { Link } from 'react-router-dom';

export default function ContractsList() {

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
        const id = Promise.resolve(1);
        const balance = await smartContract.methods.balance().call();
        const ethGoal = await smartContract.methods.ethGoal().call();
        const deadline = await smartContract.methods.deadline().call();
        changeState(setState,"projectId", id);
        changeState(setState,"ethGoal", weiToEth(ethGoal) as number);
        changeState(setState,"balance", weiToEth(balance) as number);
        changeState(setState,"deadline", deadline);
        changeState(setState,"progress",  state.balance / ethGoal);
    };

    return (
        <>
            <h2>Contracts List</h2>
            <ul>
                <li>{`Id: ${state.projectId} Progress: ${state.balance} of ${state.ethGoal} ETH (${state.progress}%) Deadline: ${state.deadline}`}</li>
                <Link to={`/${state.projectId}/donate`}>I want to contribute!</Link> 
            </ul>
        </>
    );
}